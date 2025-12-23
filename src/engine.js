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
    myFunctions.getSkillLevel = function() {
        var depth = myVars.lastValue || 3;
        var blunderRate = myVars.blunderRate !== undefined ? myVars.blunderRate : 0.7;
        var skillLevel = Math.floor((depth / 21) * 20);
        skillLevel = Math.max(0, skillLevel - Math.floor(blunderRate * 10));
        return Math.max(0, Math.min(20, skillLevel));
    };
    myFunctions.runChessEngine = function(depth) {
        var fen = window.board.game.getFEN();
        var skillLevel = myFunctions.getSkillLevel();
        engine.engine.postMessage(`setoption name Skill Level value ${skillLevel}`);
        engine.engine.postMessage(`position fen ${fen}`);
        window.isThinking = true;
        myFunctions.spinner();
        engine.engine.postMessage(`setoption name MultiPV value 1`);
        var searchDepth = Math.min(depth, 15);
        engine.engine.postMessage(`go depth ${searchDepth}`);
        myVars.lastValue = depth;
    };
    myFunctions.autoRun = function(lstValue) {
        if (window.board.game.getTurn() == window.board.game.getPlayingAs()) {
            myFunctions.runChessEngine(lstValue);
        }
    };
    return engine;
}
