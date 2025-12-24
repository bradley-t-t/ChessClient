function setupEngine(myVars, myFunctions) {
    const engine = {
        engine: null,
        thinkingTimeout: null,
        reloadTimeout: null
    };
    
    myFunctions.loadChessEngine = function() {
        if (!engine.stockfishObjectURL) {
            engine.stockfishObjectURL = URL.createObjectURL(new Blob([GM_getResourceText("stockfish.js")], { type: "application/javascript" }));
        }
        if (engine.stockfishObjectURL) {
            console.log(engine.stockfishObjectURL);
            engine.engine = new Worker(engine.stockfishObjectURL);
            engine.engine.onmessage = (e) => {
                myFunctions.parser(e);
            };
            engine.engine.onerror = (e) => {
                console.log("Engine error: " + e.message);
            };
            console.log("Stockfish 10 loaded");
            engine.engine.postMessage("uci");
            engine.engine.postMessage("ucinewgame");
        }
    };
    
    myFunctions.reloadChessEngine = function() {
        console.log("Reloading the chess engine!");
        
        // Add reloading visual effect
        $("#thinking-indicator").addClass("reloading");
        
        // Remove reloading class after animation completes (4.5 seconds)
        setTimeout(function() {
            $("#thinking-indicator").removeClass("reloading");
        }, 4500);
        
        if (engine.engine) {
            engine.engine.terminate();
        }
        window.isThinking = false;
        myFunctions.loadChessEngine();
    };
    
    myFunctions.getEstimatedElo = function() {
        var depth = myVars.lastValue || 3;
        var blunderRate = myVars.blunderRate !== undefined ? myVars.blunderRate : 0.7;
        var skillFactor = (depth / 21) * (1 - blunderRate);
        var elo = Math.round(400 + (skillFactor * 3000));
        return Math.max(400, Math.min(3400, elo));
    };
    
    myFunctions.runChessEngine = function(depth) {
        var fen = window.board.game.getFEN();
        var estimatedElo = myFunctions.getEstimatedElo();
        var skillLevel = Math.floor((estimatedElo - 400) / 120);
        skillLevel = Math.max(0, Math.min(20, skillLevel));

        if (!engine.engine) {
            myFunctions.loadChessEngine();
        }

        console.log("Running Stockfish 10 with Skill Level: " + skillLevel + " (ELO: " + estimatedElo + "), Depth: " + depth);

        engine.engine.postMessage("setoption name Skill Level value " + skillLevel);
        engine.engine.postMessage("position fen " + fen);
        window.isThinking = true;
        myFunctions.spinner();
        engine.engine.postMessage("setoption name MultiPV value 3");
        engine.engine.postMessage("go depth " + depth);
        myVars.lastValue = depth;

        // Clear any existing timeouts
        if (engine.thinkingTimeout) clearTimeout(engine.thinkingTimeout);
        if (engine.reloadTimeout) clearTimeout(engine.reloadTimeout);

        // Set timeout to reload engine after 90 seconds
        engine.thinkingTimeout = setTimeout(function() {
            console.log("Engine thinking for too long (90s), reloading...");
            myFunctions.reloadChessEngine();
            
            // Set another timeout to stop thinking if it continues for another 90 seconds
            engine.reloadTimeout = setTimeout(function() {
                console.log("Engine still thinking after reload (180s total), stopping...");
                window.isThinking = false;
                myFunctions.spinner();
            }, 90000);
        }, 90000);
    };
    
    myFunctions.autoRun = function(lstValue) {
        if (window.board.game.getTurn() == window.board.game.getPlayingAs()) {
            myFunctions.runChessEngine(lstValue);
        }
    };
    
    return engine;
}