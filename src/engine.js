function setupEngine(myVars, myFunctions) {
    const engine = {
        engine: null
    };
    myFunctions.loadChessEngine = function() {
        if (!engine.stockfishObjectURL) {
            engine.stockfishObjectURL = URL.createObjectURL(new Blob([GM_getResourceText("stockfish.js")], { type: "application/javascript" }));
        }
        console.log(engine.stockfishObjectURL);
        if (engine.stockfishObjectURL) {
            engine.engine = new Worker(engine.stockfishObjectURL);
            engine.engine.onmessage = (e) => {
                myFunctions.parser(e);
            };
            engine.engine.onerror = (e) => {
                console.log("Worker Error: " + e);
            };
            engine.engine.postMessage("ucinewgame");
        }
        console.log("loaded chess engine");
    };
    myFunctions.reloadChessEngine = function() {
        console.log(`Reloading the chess engine!`);
        engine.engine.terminate();
        window.isThinking = false;
        myFunctions.loadChessEngine();
    };
    myFunctions.runChessEngine = function(depth) {
        var adjustedDepth = myFunctions.getAdjustedDepth();
        var fen = window.board.game.getFEN();
        var positionType = myFunctions.analyzePositionType(fen);
        console.log(`Original depth: ${depth}, Adjusted for time/position: ${adjustedDepth}`);
        engine.engine.postMessage(`position fen ${fen}`);
        console.log(`updated: position fen ${fen}`);
        window.isThinking = true;
        myFunctions.spinner();
        if (depth >= 15) {
            engine.engine.postMessage(`setoption name MultiPV value 5`);
        } else {
            engine.engine.postMessage(`setoption name MultiPV value 1`);
        }
        engine.engine.postMessage(`go depth ${adjustedDepth}`);
        myVars.lastValue = depth;
    };
    myFunctions.autoRun = function(lstValue) {
        if (window.board.game.getTurn() == window.board.game.getPlayingAs()) {
            myFunctions.runChessEngine(lstValue);
        }
    };
    return engine;
}
