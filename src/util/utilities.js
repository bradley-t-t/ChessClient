function setupUtilities(myVars) {
    const myFunctions = {};
    
    myFunctions.getPieceAt = function(square) {
        try {
            const board = window.board;
            if (!board || !board.game) return null;
            
            const fen = board.game.getFEN();
            const fenParts = fen.split(' ');
            const boardState = fenParts[0];
            
            const file = square.charCodeAt(0) - 97;
            const rank = parseInt(square[1]) - 1;
            
            const rows = boardState.split('/').reverse();
            let currentFile = 0;
            
            for (let char of rows[rank]) {
                if (char >= '1' && char <= '8') {
                    currentFile += parseInt(char);
                } else {
                    if (currentFile === file) {
                        return char;
                    }
                    currentFile++;
                }
            }
        } catch (e) {
        }
        return null;
    };
    
    myFunctions.highlightSquare = function(square, color, opacity) {
        const board = $("chess-board")[0] || $("wc-chess-board")[0];
        if (!board) return;

        const squareNum = square.replace(/^a/, "1").replace(/^b/, "2").replace(/^c/, "3").replace(/^d/, "4").replace(/^e/, "5").replace(/^f/, "6").replace(/^g/, "7").replace(/^h/, "8");

        const highlight = document.createElement("div");
        highlight.className = "chess-tactics-highlight";
        highlight.setAttribute("data-square", squareNum);
        highlight.style.cssText = "position: absolute; background: " + color + " !important; opacity: " + opacity + " !important; pointer-events: none; z-index: 999999 !important; border-radius: 4px;";

        const boardRect = board.getBoundingClientRect();
        const squareSize = boardRect.width / 8;

        const isFlipped = board.classList.contains("flipped") || $(board).find(".board").hasClass("flipped") || board.getAttribute("orientation") === "black";

        let file = parseInt(squareNum[0]) - 1;
        let rank = 8 - parseInt(squareNum[1]);

        if (isFlipped) {
            file = 7 - file;
            rank = 7 - rank;
        }

        highlight.style.width = squareSize + "px";
        highlight.style.height = squareSize + "px";
        highlight.style.left = (file * squareSize) + "px";
        highlight.style.top = (rank * squareSize) + "px";

        const boardContainer = board.querySelector('.board-container') || 
                             board.querySelector('.board') || 
                             board.querySelector('[class*="board"]') ||
                             board;
        
        if (boardContainer) {
            if (boardContainer.style.position !== 'relative' && boardContainer.style.position !== 'absolute') {
                boardContainer.style.position = "relative";
            }
            boardContainer.appendChild(highlight);
        }
    };
    
    myFunctions.clearHighlights = function() {
        const highlights = document.querySelectorAll(".chess-tactics-highlight");
        highlights.forEach(el => el.remove());
    };
    
    myFunctions.findForks = function() {
        const board = window.board;
        if (!board || !board.game) return [];
        
        const forks = [];
        const legalMoves = board.game.getLegalMoves();
        const playingAs = board.game.getPlayingAs();
        
        for (let move of legalMoves) {
            try {
                board.game.move(move);
                
                const enemyPieces = [];
                const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
                
                for (let file of files) {
                    for (let rank of ranks) {
                        const square = file + rank;
                        const piece = myFunctions.getPieceAt(square);
                        if (!piece) continue;
                        
                        const isWhitePiece = piece === piece.toUpperCase();
                        const isEnemyPiece = (playingAs === 1 && !isWhitePiece) || (playingAs === 2 && isWhitePiece);
                        
                        if (isEnemyPiece) {
                            enemyPieces.push({ square, piece });
                        }
                    }
                }
                
                const movesFromNewPos = board.game.getLegalMoves().filter(m => m.from === move.to);
                const attackedPieces = [];
                
                for (let attackMove of movesFromNewPos) {
                    const targetPiece = myFunctions.getPieceAt(attackMove.to);
                    if (targetPiece) {
                        const isWhitePiece = targetPiece === targetPiece.toUpperCase();
                        const isEnemyPiece = (playingAs === 1 && !isWhitePiece) || (playingAs === 2 && isWhitePiece);
                        
                        if (isEnemyPiece) {
                            attackedPieces.push(attackMove.to);
                        }
                    }
                }
                
                board.game.undo();
                
                if (attackedPieces.length >= 2) {
                    forks.push({ from: move.from, to: move.to, targets: attackedPieces });
                }
            } catch (e) {
                try { board.game.undo(); } catch (e2) {}
            }
        }
        
        return forks;
    };
    
    myFunctions.findSkewers = function() {
        return [];
    };
    
    myFunctions.findPins = function() {
        return [];
    };
    
    myFunctions.findDiscoveredAttacks = function() {
        return [];
    };
    
    myFunctions.analyzeTactics = function() {
        myFunctions.clearHighlights();
        
        const board = window.board;
        if (!board || !board.game) return;
        
        const currentTurn = board.game.getTurn();
        const playingAs = board.game.getPlayingAs();
        
        if (currentTurn !== playingAs) return;
        
        const forks = myFunctions.findForks();
        const skewers = myFunctions.findSkewers();
        const pins = myFunctions.findPins();
        const discoveredAttacks = myFunctions.findDiscoveredAttacks();
        
        for (let fork of forks) {
            myFunctions.highlightSquare(fork.from, myVars.forkColor, 0.6);
            myFunctions.highlightSquare(fork.to, myVars.forkColor, 0.8);
        }
        
        for (let skewer of skewers) {
            myFunctions.highlightSquare(skewer.from, myVars.skewerColor, 0.6);
            myFunctions.highlightSquare(skewer.to, myVars.skewerColor, 0.8);
        }
        
        for (let pin of pins) {
            myFunctions.highlightSquare(pin.from, myVars.pinColor, 0.6);
            myFunctions.highlightSquare(pin.to, myVars.pinColor, 0.8);
        }
        
        for (let discovered of discoveredAttacks) {
            myFunctions.highlightSquare(discovered.from, myVars.discoveredAttackColor, 0.6);
            myFunctions.highlightSquare(discovered.to, myVars.discoveredAttackColor, 0.8);
        }
    };
    
    myFunctions.checkPageStatus = function() {
        const board = $("chess-board")[0] || $("wc-chess-board")[0];
        const pageStatus = document.getElementById("pageStatus");
        const clientBody = document.querySelector(".client-body");

        if (board && board.game) {
            pageStatus.classList.remove("visible");
            clientBody.classList.remove("hidden");
            myVars.onGamePage = true;
        } else {
            pageStatus.classList.add("visible");
            clientBody.classList.add("hidden");
            myVars.onGamePage = false;
        }
    };
    
    myFunctions.saveSettings = function() {
        try {
            GM_setValue("forkColor", myVars.forkColor);
            GM_setValue("skewerColor", myVars.skewerColor);
            GM_setValue("pinColor", myVars.pinColor);
            GM_setValue("discoveredAttackColor", myVars.discoveredAttackColor);
        } catch (error) {
        }
    };
    
    myFunctions.loadSettings = function() {
        try {
            myVars.forkColor = GM_getValue("forkColor", "#ff6b6b");
            myVars.skewerColor = GM_getValue("skewerColor", "#4ecdc4");
            myVars.pinColor = GM_getValue("pinColor", "#ffe66d");
            myVars.discoveredAttackColor = GM_getValue("discoveredAttackColor", "#a8dadc");
        } catch (error) {
        }
    };
    
    myFunctions.loadEx = function() {
        if (myVars.loaded) return;
        
        const board = $("chess-board")[0] || $("wc-chess-board")[0];
        if (!board || !board.game) return;
        
        window.board = board;
        myVars.loaded = true;
        
        $("#versionText").text("v" + currentVersion);
    };
    
    return myFunctions;
}
