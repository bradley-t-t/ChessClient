function setupEngine(myVars, myFunctions) {
    const engine = {
        engine: null,
        useCloud: true
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
            console.log("Local Stockfish 10 loaded as fallback");
            engine.engine.postMessage("uci");
            engine.engine.postMessage("ucinewgame");
        }
    };
    
    myFunctions.reloadChessEngine = function() {
        console.log("Reloading the chess engine!");
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
        var elo = Math.round(400 + (skillFactor * 2400));
        return Math.max(400, Math.min(2800, elo));
    };
    
    myFunctions.runChessEngine = function(depth) {
        var fen = window.board.game.getFEN();
        var estimatedElo = myFunctions.getEstimatedElo();
        
        window.isThinking = true;
        myFunctions.spinner();
        myVars.lastValue = depth;
        
        if (engine.useCloud) {
            myFunctions.runCloudEngine(fen, depth, estimatedElo);
        } else {
            myFunctions.runLocalEngine(fen, depth, estimatedElo);
        }
    };
    
    myFunctions.runCloudEngine = function(fen, depth, estimatedElo) {
        var payload = {
            fen: fen,
            depth: Math.min(depth, 18),
            maxThinkingTime: 2000
        };
        
        console.log("Running Stockfish 17.1 Cloud with ELO: " + estimatedElo + ", Depth: " + depth);
        
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://chess-api.com/v1",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(payload),
            timeout: 15000,
            onload: function(response) {
                myFunctions.handleCloudResponse(response, fen, depth, estimatedElo);
            },
            onerror: function(err) {
                console.log("Cloud API error, falling back to local engine");
                engine.useCloud = false;
                myFunctions.runLocalEngine(fen, depth, estimatedElo);
            },
            ontimeout: function() {
                console.log("Cloud API timeout, falling back to local engine");
                engine.useCloud = false;
                myFunctions.runLocalEngine(fen, depth, estimatedElo);
            }
        });
    };
    
    myFunctions.handleCloudResponse = function(response, fen, depth, estimatedElo) {
        try {
            if (response.status !== 200) {
                throw new Error("HTTP " + response.status);
            }
            
            var data = JSON.parse(response.responseText);
            if (Array.isArray(data)) data = data[0];
            
            if (data.error || data.status === "error") {
                var errText = data.error || data.message || "Unknown error";
                if (errText.includes("HIGH_USAGE")) {
                    console.log("API cooldown, falling back to local");
                    engine.useCloud = false;
                    myFunctions.runLocalEngine(fen, depth, estimatedElo);
                    return;
                }
                throw new Error(errText);
            }
            
            var bestMove = data.move || data.bestmove;
            if (bestMove) {
                var selectedMove = myFunctions.adjustMoveForElo(bestMove, data.continuationArr, estimatedElo);
                console.log("Cloud bestmove: " + bestMove + ", Selected for ELO " + estimatedElo + ": " + selectedMove);
                myFunctions.displayRecommendedMove(selectedMove);
                window.isThinking = false;
                myFunctions.spinner();
            } else {
                throw new Error("No move returned");
            }
        } catch (e) {
            console.log("Cloud response error: " + e.message + ", falling back to local");
            engine.useCloud = false;
            myFunctions.runLocalEngine(fen, depth, estimatedElo);
        }
    };
    
    myFunctions.adjustMoveForElo = function(bestMove, continuation, estimatedElo) {
        if (estimatedElo >= 2000 || !continuation || continuation.length < 2) {
            return bestMove;
        }
        
        var blunderChance = (2000 - estimatedElo) / 4000;
        
        if (Math.random() < blunderChance && continuation.length > 1) {
            var alternateIndex = Math.min(continuation.length - 1, 1 + Math.floor(Math.random() * 2));
            console.log("ELO adjustment: selecting alternate move at index " + alternateIndex);
            return continuation[alternateIndex] || bestMove;
        }
        
        return bestMove;
    };
    
    myFunctions.runLocalEngine = function(fen, depth, estimatedElo) {
        if (!engine.engine) {
            myFunctions.loadChessEngine();
        }
        
        var skillLevel = Math.floor((estimatedElo - 400) / 120);
        skillLevel = Math.max(0, Math.min(20, skillLevel));
        
        console.log("Running Local Stockfish 10 with Skill Level: " + skillLevel + " (ELO: " + estimatedElo + "), Depth: " + depth);
        
        engine.engine.postMessage("setoption name Skill Level value " + skillLevel);
        engine.engine.postMessage("position fen " + fen);
        engine.engine.postMessage("setoption name MultiPV value 3");
        engine.engine.postMessage("go depth " + depth);
    };
    
    myFunctions.autoRun = function(lstValue) {
        if (window.board.game.getTurn() == window.board.game.getPlayingAs()) {
            myFunctions.runChessEngine(lstValue);
        }
    };
    
    return engine;
}