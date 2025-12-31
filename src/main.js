window.board = null;
window.lastAnalyzedFen = null;

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
            
            if (currentTurn === playingAs) {
                const currentFen = board.game.getFEN();
                if (currentFen !== window.lastAnalyzedFen) {
                    console.log("Main Loop: FEN changed, triggering analysis");
                    window.lastAnalyzedFen = currentFen;
                    myFunctions.analyzeTactics();
                }
            } else {
                if (window.lastAnalyzedFen !== null) {
                    console.log("Main Loop: Not our turn, clearing highlights");
                    myFunctions.clearHighlights();
                    window.lastAnalyzedFen = null;
                }
            }
        }
    } else {
        myFunctions.loadEx();
    }
}, 500);
