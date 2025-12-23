function setupEngine(myVars, myFunctions) {
    const engine = {
        engine: null
    };
    myFunctions.loadChessEngine = function() {
        if (!engine.stockfishObjectURL) {
            engine.stockfishObjectURL = URL.createObjectURL(new Blob([GM_getResourceText("stockfish.js")], { type: "application/javascript" }));
        }
        if (engine.stockfishObjectURL) {
            engine.engine = new Worker(engine.stockfishObjectURL);
            engine.engine.onmessage = (e) => {
                myFunctions.parser(e);
            };
            engine.engine.onerror = (e) => {
            };
            engine.engine.postMessage("ucinewgame");
        }
    };
    myFunctions.reloadChessEngine = function() {
        engine.engine.terminate();
        window.isThinking = false;
        myFunctions.loadChessEngine();
    };
    myFunctions.runChessEngine = function(depth) {
        var fen = window.board.game.getFEN();
        engine.engine.postMessage(`position fen ${fen}`);
        window.isThinking = true;
        myFunctions.spinner();
        engine.engine.postMessage(`setoption name MultiPV value 5`);
        engine.engine.postMessage(`go depth ${depth}`);
        myVars.lastValue = depth;
    };
    myFunctions.autoRun = function(lstValue) {
        if (window.board.game.getTurn() == window.board.game.getPlayingAs()) {
            myFunctions.runChessEngine(lstValue);
        }
    };
    return engine;
}
