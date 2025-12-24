function setupEngine(myVars, myFunctions) {
    const engine = {
        engine: null,
        thinkingTimeout: null,
        reloadTimeout: null
    };

    myFunctions.loadChessEngine = function () {
        if (!engine.stockfishObjectURL) {
            engine.stockfishObjectURL = URL.createObjectURL(new Blob([GM_getResourceText("stockfish.js")], {type: "application/javascript"}));
        }
        if (engine.stockfishObjectURL) {
            engine.engine = new Worker(engine.stockfishObjectURL);
            engine.engine.onmessage = (e) => {
                myFunctions.parser(e);
            };
            engine.engine.onerror = (e) => {
            };
            engine.engine.postMessage("uci");
            engine.engine.postMessage("ucinewgame");
        }
    };

    myFunctions.reloadChessEngine = function () {
        if (engine.analysisComplete) {
            return;
        }

        var reloadBtn = document.getElementById("relEngBut");
        if (reloadBtn) {
            reloadBtn.classList.add("reloading");
            setTimeout(function () {
                reloadBtn.classList.remove("reloading");
            }, 600);
        }

        $("#thinking-indicator").addClass("reloading");

        setTimeout(function () {
            $("#thinking-indicator").removeClass("reloading");
        }, 4500);

        if (engine.engine) {
            engine.engine.terminate();
        }
        window.isThinking = false;
        myFunctions.loadChessEngine();
    };

    myFunctions.getEstimatedElo = function () {
        var depth = myVars.lastValue || 3;
        var blunderRate = myVars.blunderRate !== undefined ? myVars.blunderRate : 0.7;
        var skillFactor = depth / 21 * (1 - blunderRate);
        var elo = Math.round(400 + skillFactor * 3000);
        return Math.max(400, Math.min(3400, elo));
    };

    myFunctions.runChessEngine = function (depth) {
        var fen = window.board.game.getFEN();
        var estimatedElo = myFunctions.getEstimatedElo();
        var skillLevel = Math.floor((estimatedElo - 400) / 120);
        skillLevel = Math.max(0, Math.min(20, skillLevel));

        if (!engine.engine) {
            myFunctions.loadChessEngine();
        }

        var parts = fen.split(" ");
        var moveNumber = parseInt(parts[5]) || 1;
        var userDepth = myVars.lastValue || 11;
        var adjustedDepth = userDepth;

        if (moveNumber <= 10) {
            adjustedDepth = Math.min(adjustedDepth, 15);
        } else if (moveNumber <= 15) {
            var progress = (moveNumber - 10) / 5;
            var targetDepth = 15 + Math.floor((userDepth - 15) * progress);
            adjustedDepth = Math.min(adjustedDepth, targetDepth);
        }

        myFunctions.targetDepth = adjustedDepth;

        engine.analysisComplete = false;

        engine.engine.postMessage("position fen " + fen);
        window.isThinking = true;
        myFunctions.spinner();
        engine.engine.postMessage("setoption name MultiPV value 1");
        engine.engine.postMessage("go depth " + adjustedDepth);
        myVars.lastValue = depth;

        var depthEl = document.getElementById("currentDepthValue");
        if (depthEl) {
            depthEl.textContent = "-";
        }

        if (engine.thinkingTimeout) clearTimeout(engine.thinkingTimeout);
        if (engine.reloadTimeout) clearTimeout(engine.reloadTimeout);

        var timeout = myVars.lastValue > 10 ? 600000 : 180000;

        engine.thinkingTimeout = setTimeout(function () {
            if (engine.analysisComplete) return;
            myFunctions.reloadChessEngine();

            engine.reloadTimeout = setTimeout(function () {
                window.isThinking = false;
                myFunctions.spinner();
            }, 180000);
        }, timeout);
    };

    myFunctions.autoRun = function (lstValue) {
        if (window.moveInProgress) return;
        if (window.board.game.getTurn() == window.board.game.getPlayingAs()) {
            myFunctions.runChessEngine(lstValue);
        }
    };

    return engine;
}