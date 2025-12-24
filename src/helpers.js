const DOMHelpers = {
    getElement(selector) {
        return document.querySelector(selector);
    },

    getElements(selector) {
        return document.querySelectorAll(selector);
    },

    getElementById(id) {
        return document.getElementById(id);
    },

    setProgress(percentage) {
        const bar = this.getElementById("depthBarFill");
        const value = this.getElementById("currentDepthValue");
        
        if (bar) bar.style.width = `${percentage}%`;
        if (value) value.textContent = `${Math.round(percentage)}%`;
    },

    getBoard() {
        return this.getElement(CONSTANTS.SELECTORS.BOARD);
    },

    isPlayerTurn(board) {
        return board?.game && 
               board.game.getTurn() === board.game.getPlayingAs();
    },

    getCurrentFEN(board) {
        return board?.game?.getFEN() || null;
    }
};

window.DOMHelpers = DOMHelpers;
