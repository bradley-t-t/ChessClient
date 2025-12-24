function setupEngine(myVars, myFunctions) {
    const engine = {
        engine: null
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
            };
            console.log("loaded chess engine");
            engine.engine.postMessage("uci");
            engine.engine.postMessage("ucinewgame");
        }
    };
    myFunctions.reloadChessEngine = function() {
        console.log("Reloading the chess engine!");
        engine.engine.terminate();
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
        
        engine.engine.postMessage("setoption name UCI_LimitStrength value true");
        engine.engine.postMessage("setoption name UCI_Elo value " + estimatedElo);
        engine.engine.postMessage("setoption name Skill Level value " + Math.floor((estimatedElo - 400) / 120));
        
        console.log("Running engine with UCI_Elo: " + estimatedElo + ", Depth: " + depth);
        
        engine.engine.postMessage("position fen " + fen);
        window.isThinking = true;
        myFunctions.spinner();
        engine.engine.postMessage("setoption name MultiPV value 1");
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
