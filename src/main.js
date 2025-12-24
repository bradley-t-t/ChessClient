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
    const engine = setupEngine(myVars, myFunctions);
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

        $("#depthText")[0].innerHTML = "Current Depth: <strong>" + myVars.lastValue + "</strong>";
    } else {
        myFunctions.loadEx();
    }
    
    if (!document.engine.engine) {
        myFunctions.loadChessEngine();
    }
    
    if (myVars.onGamePage && window.canGo === true && window.isThinking === false && window.myTurn) {
        const currentFen = window.board.game.getFEN();
        if (currentFen !== window.lastAnalyzedFen) {
            window.canGo = false;
            window.lastAnalyzedFen = currentFen;
            window.lastAnalysisStartTime = Date.now();
            window.watchdogChecks = 0;
            myFunctions.autoRun(myVars.lastValue);
        }
    }
    
    if (myVars.onGamePage && window.myTurn && !window.canGo) {
        window.watchdogChecks++;
        if (window.watchdogChecks > 100 && window.lastAnalysisStartTime) {
            const timeSinceStart = Date.now() - window.lastAnalysisStartTime;
            if (timeSinceStart > 10000 && !window.isThinking) {
                console.log("Watchdog: Detected hung state, resetting...");
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
        console.log("Turn verification: Correcting turn state mismatch");
        window.myTurn = actuallyMyTurn;
        
        if (!actuallyMyTurn) {
            console.log("Turn verification: Stopping engine - not our turn");
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
            console.log("Turn verification: It's our turn - resetting for fresh analysis");
            window.canGo = true;
            window.lastAnalyzedFen = null;
            window.isThinking = false;
        }
    }
    
    if (actuallyMyTurn && !window.canGo && !window.isThinking) {
        const timeSinceStart = window.lastAnalysisStartTime ? Date.now() - window.lastAnalysisStartTime : 0;
        if (timeSinceStart > 5000) {
            console.log("Turn verification: Stuck waiting, forcing reset");
            myFunctions.stopEngine();
            window.canGo = true;
            window.lastAnalyzedFen = null;
        }
    }
}, 1000);
