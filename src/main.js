window.isThinking = false;
window.canGo = true;
window.myTurn = false;
window.wasPreviouslyMyTurn = false;
window.board = null;

function main() {
    console.log("Chess Client v" + currentVersion);
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

window.addEventListener("load", (event) => {
    main();
});

var waitForChessBoard = setInterval(() => {
    if (!document.myVars || !document.myFunctions) return;
    const myVars = document.myVars;
    const myFunctions = document.myFunctions;
    if (myVars.loaded) {
        window.board = $("chess-board")[0] || $("wc-chess-board")[0];
        myFunctions.checkPageStatus();

        if (!myVars.onGamePage) return;

        myVars.autoMove = $("#autoMove")[0].checked;
        let minDel = parseFloat($("#timeDelayMin")[0].value);
        let maxDel = parseFloat($("#timeDelayMax")[0].value);
        myVars.delay = Math.random() * (maxDel - minDel) + minDel;
        myVars.isThinking = window.isThinking;
        myFunctions.spinner();

        var wasMyTurn = window.myTurn;
        if (window.board && window.board.game && window.board.game.getTurn() == window.board.game.getPlayingAs()) {
            window.myTurn = true;
        } else {
            window.myTurn = false;
        }

        if (wasMyTurn && !window.myTurn) {
            myFunctions.clearHighlights(true);
        }

        $("#depthText")[0].innerHTML = "Current Depth: <strong>" + myVars.lastValue + "</strong>";
    } else {
        myFunctions.loadEx();
    }
    if (!document.engine.engine) {
        myFunctions.loadChessEngine();
    }
    if (myVars.onGamePage && window.canGo == true && window.isThinking == false && window.myTurn) {
        window.canGo = false;
        var currentDelay = myVars.delay != void 0 ? myVars.delay * 1e3 : 10;
        myFunctions.other(currentDelay);
    }
}, 100);
