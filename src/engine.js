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
    
    myFunctions.getAdjustedDepth = function() {
        var baseDepth = myVars.lastValue || 3;
        var gamePhase = window.board.game.getPhase(); // Assume this function exists
        var timeRemaining = window.board.game.getTimeRemaining(); // Assume this function exists
        
        // Adjust depth based on game phase
        if (gamePhase === "opening") {
            baseDepth = Math.min(5, baseDepth + 1);
        } else if (gamePhase === "middlegame") {
            baseDepth = Math.max(3, baseDepth);
        } else if (gamePhase === "endgame") {
            baseDepth = Math.max(2, baseDepth - 1);
        }
        
        // Further adjust depth based on time remaining
        if (timeRemaining < 30000) { // Less than 30 seconds
            baseDepth = Math.max(1, baseDepth - 1);
        } else if (timeRemaining > 60000) { // More than 60 seconds
            baseDepth += 1;
        }
        
        return baseDepth;
    };
    
    myFunctions.runChessEngine = function(depth) {
        var fen = window.board.game.getFEN();
        var estimatedElo = myFunctions.getEstimatedElo();
        var skillLevel = Math.floor((estimatedElo - 400) / 120);
        skillLevel = Math.max(0, Math.min(20, skillLevel));

        if (!engine.engine) {
            myFunctions.loadChessEngine();
        }

        // Adjust depth based on game phase and time constraints
        var adjustedDepth = myFunctions.getAdjustedDepth();
        console.log("Running Stockfish 10 with Skill Level: " + skillLevel + " (ELO: " + estimatedElo + "), Requested Depth: " + depth + ", Adjusted Depth: " + adjustedDepth);

        engine.engine.postMessage("setoption name Skill Level value " + skillLevel);
        engine.engine.postMessage("position fen " + fen);
        window.isThinking = true;
        myFunctions.spinner();
        engine.engine.postMessage("setoption name MultiPV value 3");
        engine.engine.postMessage("go depth " + adjustedDepth);
        myVars.lastValue = depth;

        // Reset current depth display
        var depthEl = document.getElementById("currentDepthValue");
        if (depthEl) {
            depthEl.textContent = "-";
        }

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