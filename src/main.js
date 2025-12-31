window.board = null;
window.lastAnalyzedFen = null;
window.wasOurTurn = false;

function main() {
    const myVars = initializeVariables();
    const myFunctions = setupUtilities(myVars);
    myFunctions.loadSettings();
    document.myVars = myVars;
    document.myFunctions = myFunctions;
    setupUI(myVars, myFunctions);
    setupEventHandlers(myVars, myFunctions);
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
        
        const board = window.board;
        if (board && board.game) {
            const currentTurn = board.game.getTurn();
            const playingAs = board.game.getPlayingAs();
            const isOurTurn = currentTurn === playingAs;
            
            if (isOurTurn && !window.wasOurTurn) {
                const currentFen = board.game.getFEN();
                console.log("Main Loop: Opponent moved, our turn now - analyzing tactics");
                window.lastAnalyzedFen = currentFen;
                window.wasOurTurn = true;
                myFunctions.analyzeTactics();
            } else if (!isOurTurn && window.wasOurTurn) {
                console.log("Main Loop: We moved, clearing highlights");
                myFunctions.clearHighlights();
                window.lastAnalyzedFen = null;
                window.wasOurTurn = false;
            }
        }
    } else {
        myFunctions.loadEx();
    }
}, 500);
