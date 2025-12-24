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
        // Don't reload if analysis has completed
        if (engine.analysisComplete) {
            console.log("Analysis completed, skipping reload.");
            return;
        }

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

        // Calculate game phase from FEN move number
        var parts = fen.split(" ");
        var moveNumber = parseInt(parts[5]) || 1;
        var userDepth = myVars.lastValue || 11;
        var adjustedDepth = userDepth;

        // Adjust depth based on game phase
        if (moveNumber <= 10) {
            adjustedDepth = Math.min(adjustedDepth, 15);
        } else if (moveNumber <= 15) {
            var progress = (moveNumber - 10) / 5;
            var targetDepth = 15 + Math.floor((userDepth - 15) * progress);
            adjustedDepth = Math.min(adjustedDepth, targetDepth);
        }
        // After move 15, use full depth

        console.log("Running Stockfish 10 with Skill Level: " + skillLevel + " (ELO: " + estimatedElo + "), Move: " + moveNumber + ", Requested Depth: " + depth + ", Adjusted Depth: " + adjustedDepth);

        // Set target depth for progress bar
        myFunctions.targetDepth = adjustedDepth;

        // Reset analysis complete flag
        engine.analysisComplete = false;

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

        // Set timeout to reload engine after 180 seconds
        engine.thinkingTimeout = setTimeout(function() {
            console.log("Engine thinking for too long (180s), reloading...");
            myFunctions.reloadChessEngine();
            
            // Set another timeout to stop thinking if it continues for another 180 seconds
            engine.reloadTimeout = setTimeout(function() {
                console.log("Engine still thinking after reload (360s total), stopping...");
                window.isThinking = false;
                myFunctions.spinner();
            }, 180000);
        }, 180000);
    };
    
    myFunctions.autoRun = function(lstValue) {
        if (window.board.game.getTurn() == window.board.game.getPlayingAs()) {
            myFunctions.runChessEngine(lstValue);
        }
    };
    
    return engine;
}