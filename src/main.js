window.isThinking = false;
window.canGo = true;
window.myTurn = false;
window.board = null;
window.lastAnalyzedFen = null;
window.lastAnalysisStartTime = null;
window.watchdogChecks = 0;
window.moveInProgress = false;

function main() {
    const myVars = initializeVariables();
    const myFunctions = setupUtilities(myVars);
    myFunctions.loadSettings();
    const engine = setupCore(myVars, myFunctions);
    document.engine = engine;
    document.myVars = myVars;
    document.myFunctions = myFunctions;
    setupUI(myVars, myFunctions, engine);
    setupEventHandlers(myVars, myFunctions, engine);
}

window.addEventListener("load", () => {
    main();
});

setInterval(() => {
    if (!document.myVars || !document.myFunctions) return;
    const myVars = document.myVars;
    const myFunctions = document.myFunctions;

    if (myVars.loaded) {
        window.board = $("chess-board")[0] || $("wc-chess-board")[0];
        myFunctions.checkPageStatus();

        if (!myVars.onGamePage) return;

        myVars.autoMove = $("#autoMove")[0]?.checked || false;

        const wasMyTurn = window.myTurn;
        if (window.board && window.board.game && window.board.game.getTurn() === window.board.game.getPlayingAs()) {
            window.myTurn = true;
        } else {
            window.myTurn = false;
            if (window.isThinking) {
                myFunctions.stopEngine();
            }
            window.canGo = true;
            window.isThinking = false;
        }

        if (wasMyTurn && !window.myTurn) {
            myFunctions.clearHighlights(true);
            window.lastAnalyzedFen = null;
            if (window.isThinking) {
                myFunctions.stopEngine();
            }
            window.isThinking = false;
            window.canGo = true;

            const barEl = document.getElementById("depthBarFill");
            if (barEl) barEl.style.width = "0%";

            const depthEl = document.getElementById("currentDepthValue");
            if (depthEl) depthEl.textContent = "0%";
        }

        if (!wasMyTurn && window.myTurn) {
            window.canGo = true;
            window.lastAnalyzedFen = null;
            window.isThinking = false;
        }
    } else {
        myFunctions.loadEx();
    }

    if (!document.engine.engine) {
        if (!myVars.viewModeEnabled) {
            myFunctions.loadChessEngine();
        }
    }

    if (!myVars.viewModeEnabled && myVars.onGamePage && window.canGo === true && window.isThinking === false && window.myTurn) {
        const currentFen = window.board.game.getFEN();
        if (currentFen !== window.lastAnalyzedFen) {
            window.canGo = false;
            window.lastAnalyzedFen = currentFen;
            window.lastAnalysisStartTime = Date.now();
            window.watchdogChecks = 0;
            myFunctions.autoRun(myVars.lastValue);
        }
    }

    if (myVars.viewModeEnabled && myVars.onGamePage && window.board && window.board.game) {
        const viewModeHighlights = document.querySelectorAll(".chess-client-view-mode-highlight");
        if (viewModeHighlights.length === 0) {
            myFunctions.displayViewMode && myFunctions.displayViewMode();
        }
    }

    if (myVars.onGamePage && window.myTurn && !window.canGo) {
        window.watchdogChecks++;
        if (window.watchdogChecks > 100 && window.lastAnalysisStartTime) {
            const timeSinceStart = Date.now() - window.lastAnalysisStartTime;
            if (timeSinceStart > 10000 && !window.isThinking) {
                myFunctions.stopEngine();
                window.canGo = true;
                window.lastAnalyzedFen = null;
                window.watchdogChecks = 0;
            }
        }
    } else {
        window.watchdogChecks = 0;
    }
}, 100);

setInterval(() => {
    if (!document.myVars || !document.myFunctions || !window.board) return;

    const myVars = document.myVars;
    const myFunctions = document.myFunctions;

    if (!myVars.onGamePage || !window.board.game) return;

    const actuallyMyTurn = window.board.game.getTurn() === window.board.game.getPlayingAs();

    if (actuallyMyTurn !== window.myTurn) {
        window.myTurn = actuallyMyTurn;

        if (!actuallyMyTurn) {
            if (window.isThinking) {
                myFunctions.stopEngine();
            }
            window.canGo = true;
            window.isThinking = false;
            window.lastAnalyzedFen = null;
            myFunctions.clearHighlights(true);

            const barEl = document.getElementById("depthBarFill");
            if (barEl) barEl.style.width = "0%";
            const depthEl = document.getElementById("currentDepthValue");
            if (depthEl) depthEl.textContent = "0%";
        } else {
            window.canGo = true;
            window.lastAnalyzedFen = null;
            window.isThinking = false;
        }
    }

    if (actuallyMyTurn && !window.canGo && !window.isThinking) {
        const timeSinceStart = window.lastAnalysisStartTime ? Date.now() - window.lastAnalysisStartTime : 0;
        if (timeSinceStart > 500) {
            myFunctions.stopEngine();
            window.canGo = true;
            window.lastAnalyzedFen = null;
        }
    }
}, 100);
