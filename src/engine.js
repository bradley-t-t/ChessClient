function setupEngine(myVars, myFunctions) {
    const engine = {
        engine: null,
        ready: false,
        pendingCommand: null
    };
    myFunctions.loadChessEngine = function() {
        if (!engine.stockfishObjectURL) {
            engine.stockfishObjectURL = URL.createObjectURL(new Blob([GM_getResourceText("stockfish.js")], { type: "application/javascript" }));
        }
        if (engine.stockfishObjectURL) {
            console.log(engine.stockfishObjectURL);
            engine.ready = false;
            engine.engine = new Worker(engine.stockfishObjectURL);
            engine.engine.onmessage = (e) => {
                if (e.data === "uciok") {
                    console.log("Engine is ready");
                    engine.ready = true;
                    engine.engine.postMessage("ucinewgame");
                    engine.engine.postMessage("isready");
                } else if (e.data === "readyok") {
                    console.log("Engine ready for commands");
                    if (engine.pendingCommand) {
                        engine.pendingCommand();
                        engine.pendingCommand = null;
                    }
                } else {
                    myFunctions.parser(e);
                }
            };
            engine.engine.onerror = (e) => {
                console.log("Engine error: " + e.message);
            };
            console.log("loaded chess engine");
            engine.engine.postMessage("uci");
        }
    };
    myFunctions.reloadChessEngine = function() {
        console.log("Reloading the chess engine!");
        engine.engine.terminate();
        engine.ready = false;
        window.isThinking = false;
        myFunctions.loadChessEngine();
    };
    myFunctions.getEstimatedElo = function() {
        var depth = myVars.lastValue || 3;
        var blunderRate = myVars.blunderRate !== undefined ? myVars.blunderRate : 0.7;
        var skillFactor = (depth / 21) * (1 - blunderRate);
        var elo = Math.round(400 + (skillFactor * 2400));
        return Math.max(1320, Math.min(3190, elo));
    };
    myFunctions.runChessEngine = function(depth) {
        if (!engine.ready) {
            console.log("Engine not ready, queuing command");
            engine.pendingCommand = function() { myFunctions.runChessEngine(depth); };
            return;
        }
        var fen = window.board.game.getFEN();
        var estimatedElo = myFunctions.getEstimatedElo();
        
        engine.engine.postMessage("setoption name UCI_LimitStrength value true");
        engine.engine.postMessage("setoption name UCI_Elo value " + estimatedElo);
        
        console.log("Running engine with UCI_Elo: " + estimatedElo + ", Depth: " + depth);
        
        engine.engine.postMessage("position fen " + fen);
        window.isThinking = true;
        myFunctions.spinner();
        engine.engine.postMessage("go depth " + depth);
        myVars.lastValue = depth;
    };
    myFunctions.autoRun = function(lstValue) {
        if (window.board.game.getTurn() == window.board.game.getPlayingAs()) {
            myFunctions.runChessEngine(lstValue);
        }
    };
    return engine;
}
