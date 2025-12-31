function setupUtilities(myVars) {
    const myFunctions = {};
    let stop_b = stop_w = 0;
    let s_br = s_br2 = s_wr = s_wr2 = 0;
    let obs = "";
    myFunctions.rescan = function (lev) {
        var ari = $("chess-board").find(".piece").map(function () {
            return this.className;
        }).get();
        jack = ari.map((f) => f.substring(f.indexOf(" ") + 1));

        function removeWord(arr, word) {
            for (var i2 = 0; i2 < arr.length; i2++) {
                arr[i2] = arr[i2].replace(word, "");
            }
        }

        removeWord(ari, "square-");
        jack = ari.map((f) => f.substring(f.indexOf(" ") + 1));
        for (var i = 0; i < jack.length; i++) {
            jack[i] = jack[i].replace("br", "r").replace("bn", "n").replace("bb", "b").replace("bq", "q").replace("bk", "k").replace("bb", "b").replace("bn", "n").replace("br", "r").replace("bp", "p").replace("wp", "P").replace("wr", "R").replace("wn", "N").replace("wb", "B").replace("br", "R").replace("wn", "N").replace("wb", "B").replace("wq", "Q").replace("wk", "K").replace("wb", "B");
        }
        str2 = "";
        var count = 0, str = "";
        for (var j = 8; j > 0; j--) {
            for (var i = 1; i < 9; i++) {
                (str = jack.find((el) => el.includes([i] + [j]))) ? str = str.replace(/[^a-zA-Z]+/g, "") : str = "";
                if (str == "") {
                    count++;
                    str = count.toString();
                    if (!isNaN(str2.charAt(str2.length - 1))) str2 = str2.slice(0, -1);
                    else {
                        count = 1;
                        str = count.toString();
                    }
                }
                str2 += str;
                if (i == 8) {
                    count = 0;
                    str2 += "/";
                }
            }
        }
        str2 = str2.slice(0, -1);
        color = "";
        wk = wq = bk = bq = "0";
        const move = $("vertical-move-list").children();
        if (move.length < 2) {
            stop_b = stop_w = s_br = s_br2 = s_wr = s_wr2 = 0;
        }
        if (stop_b != 1) {
            if (move.find(".black.node:contains('K')").length) {
                bk = "";
                bq = "";
                stop_b = 1;
            }
        } else {
            bq = "";
            bk = "";
        }
        if (stop_b != 1) (bk = move.find(".black.node:contains('O-O'):not(:contains('O-O-O'))").length ? "" : "k") ? bq = move.find(".black.node:contains('O-O-O')").length ? bk = "" : "q" : bq = "";
        if (s_br != 1) {
            if (move.find(".black.node:contains('R')").text().match("[abcd]+")) {
                bq = "";
                s_br = 1;
            }
        } else bq = "";
        if (s_br2 != 1) {
            if (move.find(".black.node:contains('R')").text().match("[hgf]+")) {
                bk = "";
                s_br2 = 1;
            }
        } else bk = "";
        if (stop_b == 0) {
            if (s_br == 0) {
                if (move.find(".white.node:contains('xa8')").length > 0) {
                    bq = "";
                    s_br = 1;
                }
            }
            if (s_br2 == 0) {
                if (move.find(".white.node:contains('xh8')").length > 0) {
                    bk = "";
                    s_br2 = 1;
                }
            }
        }
        if (stop_w != 1) {
            if (move.find(".white.node:contains('K')").length) {
                wk = "";
                wq = "";
                stop_w = 1;
            }
        } else {
            wq = "";
            wk = "";
        }
        if (stop_w != 1) (wk = move.find(".white.node:contains('O-O'):not(:contains('O-O-O'))").length ? "" : "K") ? wq = move.find(".white.node:contains('O-O-O')").length ? wk = "" : "Q" : wq = "";
        if (s_wr != 1) {
            if (move.find(".white.node:contains('R')").text().match("[abcd]+")) {
                wq = "";
                s_wr = 1;
            }
        } else wq = "";
        if (s_wr2 != 1) {
            if (move.find(".white.node:contains('R')").text().match("[hgf]+")) {
                wk = "";
                s_wr2 = 1;
            }
        } else wk = "";
        if (stop_w == 0) {
            if (s_wr == 0) {
                if (move.find(".black.node:contains('xa1')").length > 0) {
                    wq = "";
                    s_wr = 1;
                }
            }
            if (s_wr2 == 0) {
                if (move.find(".black.node:contains('xh1')").length > 0) {
                    wk = "";
                    s_wr2 = 1;
                }
            }
        }
        if ($(".coordinates").children().first().text() == 1) {
            str2 = str2 + " b " + wk + wq + bk + bq;
            color = "white";
        } else {
            str2 = str2 + " w " + wk + wq + bk + bq;
            color = "black";
        }
        return str2;
    };
    myFunctions.displayRecommendedMove = function (move, isIntermediate) {
        myFunctions.clearHighlights();
        if (!myVars.viewModeEnabled) {
            myFunctions.clearViewModeHighlights && myFunctions.clearViewModeHighlights();
        }

        var fromSquare = move.substring(0, 2);
        var toSquare = move.substring(2, 4);

        var moveColor = isIntermediate ? myVars.intermediateMoveColor || "#ffa500" : myVars.bestMoveColor || "#5b8c5a";

        myFunctions.highlightSingleSquare(fromSquare, moveColor, 0.5);
        myFunctions.highlightSingleSquare(toSquare, moveColor, 0.7);

        if (!isIntermediate && myVars.autoMove === true) {
            var minDelay, maxDelay;

            if (myVars.timeAffectedSpeed) {
                var timeRemaining = myFunctions.estimateTimeRemaining();
                if (timeRemaining > 300) {
                    minDelay = 2;
                    maxDelay = 5;
                } else if (timeRemaining > 120) {
                    minDelay = 1;
                    maxDelay = 3;
                } else if (timeRemaining > 60) {
                    minDelay = 0.5;
                    maxDelay = 1.5;
                } else if (timeRemaining > 30) {
                    minDelay = 0.3;
                    maxDelay = 0.8;
                } else {
                    minDelay = 0.1;
                    maxDelay = 0.3;
                }
            } else {
                var speedTier = myVars.moveSpeedTier || 4;

                switch (speedTier) {
                    case 1:
                        minDelay = 45;
                        maxDelay = 90;
                        break;
                    case 2:
                        minDelay = 15;
                        maxDelay = 30;
                        break;
                    case 3:
                        minDelay = 5;
                        maxDelay = 10;
                        break;
                    case 4:
                        minDelay = 2;
                        maxDelay = 4;
                        break;
                    case 5:
                        minDelay = 0.8;
                        maxDelay = 1.5;
                        break;
                    case 6:
                        minDelay = 0.3;
                        maxDelay = 0.8;
                        break;
                    case 7:
                        minDelay = 0.1;
                        maxDelay = 0.3;
                        break;
                    default:
                        minDelay = 2;
                        maxDelay = 4;
                }
            }

            var delay = (Math.random() * (maxDelay - minDelay) + minDelay) * 1000;

            setTimeout(function () {
                myFunctions.movePiece(fromSquare, toSquare);
            }, delay);
        }
    };
    myFunctions.highlightSingleSquare = function (square, color, opacity) {
        var board = $("chess-board")[0] || $("wc-chess-board")[0];
        if (!board) return;

        var squareNum = square.replace(/^a/, "1").replace(/^b/, "2").replace(/^c/, "3").replace(/^d/, "4").replace(/^e/, "5").replace(/^f/, "6").replace(/^g/, "7").replace(/^h/, "8");

        var highlight = document.createElement("div");
        highlight.className = "chess-client-highlight";
        highlight.setAttribute("data-square", squareNum);
        highlight.style.cssText = "position: absolute; background: " + color + "; opacity: " + opacity + "; pointer-events: none; z-index: 100; border-radius: 4px;";

        var boardRect = board.getBoundingClientRect();
        var squareSize = boardRect.width / 8;

        var isFlipped = board.classList.contains("flipped") || $(board).find(".board").hasClass("flipped") || board.getAttribute("orientation") === "black";

        var file = parseInt(squareNum[0]) - 1;
        var rank = 8 - parseInt(squareNum[1]);

        if (isFlipped) {
            file = 7 - file;
            rank = 7 - rank;
        }

        highlight.style.width = squareSize + "px";
        highlight.style.height = squareSize + "px";
        highlight.style.left = (file * squareSize) + "px";
        highlight.style.top = (rank * squareSize) + "px";

        var boardElement = $(board).find(".board")[0] || board;
        if (boardElement) {
            boardElement.style.position = "relative";
            boardElement.appendChild(highlight);
        }
    };
    myFunctions.highlightSplitSquare = function (square, color1, color2, type) {
        var board = $("chess-board")[0] || $("wc-chess-board")[0];
        if (!board) return;

        var squareNum = square.replace(/^a/, "1").replace(/^b/, "2").replace(/^c/, "3").replace(/^d/, "4").replace(/^e/, "5").replace(/^f/, "6").replace(/^g/, "7").replace(/^h/, "8");

        var highlight = document.createElement("div");
        highlight.className = "chess-client-highlight split-square";
        highlight.setAttribute("data-square", squareNum);

        var opacity = type === "to" ? 0.7 : 0.5;
        highlight.style.cssText = "position: absolute; pointer-events: none; z-index: 100; border-radius: 4px; overflow: hidden; opacity: " + opacity + "; background: linear-gradient(135deg, " + color1 + " 50%, " + color2 + " 50%);";

        var boardRect = board.getBoundingClientRect();
        var squareSize = boardRect.width / 8;

        var isFlipped = board.classList.contains("flipped") || $(board).find(".board").hasClass("flipped") || board.getAttribute("orientation") === "black";

        var file = parseInt(squareNum[0]) - 1;
        var rank = 8 - parseInt(squareNum[1]);

        if (isFlipped) {
            file = 7 - file;
            rank = 7 - rank;
        }

        highlight.style.width = squareSize + "px";
        highlight.style.height = squareSize + "px";
        highlight.style.left = (file * squareSize) + "px";
        highlight.style.top = (rank * squareSize) + "px";

        var boardElement = $(board).find(".board")[0] || board;
        if (boardElement) {
            boardElement.style.position = "relative";
            boardElement.appendChild(highlight);
        }
    };
    myFunctions.color = function (dat) {
        response = dat;
        var res1 = response.substring(0, 2);
        var res2 = response.substring(2, 4);
        if (myVars.autoMove === true) {
            myFunctions.movePiece(res1, res2);
        } else {
        }
        window.isThinking = false;
        myFunctions.spinner();

        myFunctions.clearHighlights();
        myFunctions.highlightSingleSquare(res1, myVars.bestMoveColor || "#5b8c5a", 0.5);
        myFunctions.highlightSingleSquare(res2, myVars.bestMoveColor || "#5b8c5a", 0.7);
    };
    myFunctions.movePiece = function (from, to) {
        let isLegalMove = false;
        let moveObject = null;
        for (let each = 0; each < window.board.game.getLegalMoves().length; each++) {
            if (window.board.game.getLegalMoves()[each].from === from && window.board.game.getLegalMoves()[each].to === to) {
                isLegalMove = true;
                moveObject = window.board.game.getLegalMoves()[each];
                break;
            }
        }
        if (!isLegalMove) {
            return;
        }

        var barEl = document.getElementById("depthBarFill");
        if (barEl) {
            barEl.style.width = "0%";
        }
        var depthEl = document.getElementById("currentDepthValue");
        if (depthEl) {
            depthEl.textContent = "0%";
        }

        window.moveInProgress = true;

        try {
            window.board.game.move({
                ...moveObject,
                promotion: moveObject.promotion || "q",
                animate: true,
                userGenerated: true
            });
        } catch (error) {
        }
        setTimeout(() => {
            window.moveInProgress = false;
            if (myVars.viewModeEnabled && myFunctions.displayViewMode) {
                setTimeout(() => {
                    myFunctions.displayViewMode();
                }, 500);
            }
        }, 2000);
    };
    myFunctions.getAdjustedDepth = function () {
        const userDepth = myVars.lastValue || 11;
        const gamePhase = myFunctions.estimateGamePhase();

        let depth = userDepth;

        if (gamePhase < 10) {
            depth = Math.min(depth, 15);
        } else if (gamePhase < 15) {
            let progress = (gamePhase - 9) / 5;
            let targetDepth = 15 + Math.floor((userDepth - 15) * progress);
            depth = Math.min(depth, targetDepth);
        }

        return depth;
    };
    myFunctions.analyzePositionType = function (fen) {
        const piecesCount = fen.split(" ")[0].match(/[pnbrqkPNBRQK]/g).length;
        if (piecesCount > 25) return "opening";
        if (piecesCount < 12) return "endgame";
        return "middlegame";
    };
    myFunctions.isPositionCriticalNow = function () {
        try {
            const inCheck = window.board.game.inCheck();
            const fen = window.board.game.getFEN();
            const whiteMaterial = myFunctions.countMaterial(fen, true);
            const blackMaterial = myFunctions.countMaterial(fen, false);
            const materialDifference = Math.abs(whiteMaterial - blackMaterial);
            return inCheck || materialDifference < 2;
        } catch (e) {
            return false;
        }
    };
    myFunctions.countMaterial = function (fen, isWhite) {
        const position = fen.split(" ")[0];
        let material = 0;
        const pieces = isWhite ? "PNBRQK" : "pnbrqk";
        const values = {
            "P": 1, "N": 3, "B": 3, "R": 5, "Q": 9, "K": 0,
            "p": 1, "n": 3, "b": 3, "r": 5, "q": 9, "k": 0
        };
        for (let char of position) {
            if (pieces.includes(char)) {
                material += values[char];
            }
        }
        return material;
    };
    myFunctions.estimateGamePhase = function () {
        try {
            const moveList = $("vertical-move-list").children().length;
            return moveList / 2;
        } catch (e) {
            return 15;
        }
    };
    myFunctions.estimateTimeRemaining = function () {
        let remainingTime = 600;
        try {
            const clockEl = document.querySelector(".clock-component.clock-bottom");
            if (clockEl) {
                const timeText = clockEl.textContent;
                if (timeText.includes(":")) {
                    const parts = timeText.split(":");
                    if (parts.length === 2) {
                        const minutes = parseInt(parts[0]);
                        const seconds = parseInt(parts[1]);
                        if (!isNaN(minutes) && !isNaN(seconds)) {
                            remainingTime = minutes * 60 + seconds;
                        }
                    }
                } else {
                    const seconds = parseInt(timeText);
                    if (!isNaN(seconds)) {
                        remainingTime = seconds;
                    }
                }
            }
        } catch (e) {
        }
        return remainingTime;
    };
    myFunctions.estimatePositionComplexity = function () {
        return Math.random() * 0.8 + 0.2;
    };
    
    myFunctions.displayViewMode = function () {
        
        if (!myVars.viewModeEnabled) {
            myFunctions.clearViewModeHighlights && myFunctions.clearViewModeHighlights();
            return;
        }

        myFunctions.clearViewModeHighlights && myFunctions.clearViewModeHighlights();

        const board = window.board;
        if (!board || !board.game || !board.game.getLegalMoves) {
            console.log("View Mode: Board not ready");
            return;
        }

        try {
            console.log("View Mode: Finding hanging pieces...");
            
            const pieceValues = {
                'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0,
                'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 0
            };
            
            const getPieceAt = (square) => {
                try {
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
            
            const getAttackersAndDefenders = (square) => {
                const attackers = [];
                const defenders = [];
                const piece = getPieceAt(square);
                
                if (!piece) return { attackers: [], defenders: [] };
                
                const isWhitePiece = piece === piece.toUpperCase();
                const legalMoves = board.game.getLegalMoves();
                
                for (let move of legalMoves) {
                    if (move.to === square) {
                        const movingPiece = getPieceAt(move.from);
                        if (movingPiece) {
                            const isWhiteAttacker = movingPiece === movingPiece.toUpperCase();
                            if (isWhiteAttacker !== isWhitePiece) {
                                attackers.push({ square: move.from, piece: movingPiece, value: pieceValues[movingPiece.toLowerCase()] });
                            } else {
                                defenders.push({ square: move.from, piece: movingPiece, value: pieceValues[movingPiece.toLowerCase()] });
                            }
                        }
                    }
                }
                
                return { attackers, defenders };
            };
            
            const hangingPieces = [];
            const conditionallyHanging = [];
            
            const currentTurn = board.game.getTurn();
            const playingAs = board.game.getPlayingAs();
            const isOurTurn = currentTurn === playingAs;
            
            const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
            
            for (let file of files) {
                for (let rank of ranks) {
                    const square = file + rank;
                    const piece = getPieceAt(square);
                    
                    if (!piece) continue;
                    
                    const isWhitePiece = piece === piece.toUpperCase();
                    const isOurPiece = (playingAs === 1 && isWhitePiece) || (playingAs === 2 && !isWhitePiece);
                    
                    if (isOurPiece) continue;
                    
                    const { attackers, defenders } = getAttackersAndDefenders(square);
                    
                    if (attackers.length > 0 && defenders.length === 0) {
                        hangingPieces.push({ square, piece, value: pieceValues[piece.toLowerCase()] });
                    }
                    else if (attackers.length > 0 && defenders.length > 0) {
                        const lowestAttacker = Math.min(...attackers.map(a => a.value));
                        const pieceValue = pieceValues[piece.toLowerCase()];
                        
                        if (lowestAttacker < pieceValue) {
                            hangingPieces.push({ square, piece, value: pieceValue });
                        }
                    }
                }
            }
            
            const legalMoves = board.game.getLegalMoves();
            for (let move of legalMoves) {
                try {
                    board.game.move(move);
                    
                    for (let file of files) {
                        for (let rank of ranks) {
                            const square = file + rank;
                            const piece = getPieceAt(square);
                            
                            if (!piece) continue;
                            
                            const isWhitePiece = piece === piece.toUpperCase();
                            const isOurPiece = (playingAs === 1 && isWhitePiece) || (playingAs === 2 && !isWhitePiece);
                            
                            if (isOurPiece) continue;
                            
                            const { attackers, defenders } = getAttackersAndDefenders(square);
                            
                            if (attackers.length > 0 && defenders.length === 0) {
                                const alreadyHanging = hangingPieces.some(h => h.square === square);
                                const alreadyConditional = conditionallyHanging.some(c => c.square === square);
                                
                                if (!alreadyHanging && !alreadyConditional) {
                                    conditionallyHanging.push({
                                        square,
                                        piece,
                                        value: pieceValues[piece.toLowerCase()],
                                        afterMove: move.from + move.to
                                    });
                                }
                            }
                        }
                    }
                    
                    board.game.undo();
                } catch (e) {
                    try { board.game.undo(); } catch (e2) {}
                }
            }
            
            console.log("View Mode: Found", hangingPieces.length, "hanging pieces and", conditionallyHanging.length, "conditionally hanging");
            
            for (let hanging of hangingPieces) {
                myFunctions.highlightViewModeSquare(hanging.square, myVars.hangingPieceColor || "#ff0000", 0.5);
            }
            
            for (let conditional of conditionallyHanging) {
                myFunctions.highlightViewModeSquare(conditional.square, myVars.checkCheckmateColor || "#9b59b6", 0.4);
            }
            
        } catch (e) {
            console.error("View Mode Error:", e);
        }
    };
    
    myFunctions.highlightViewModeSquare = function (square, color, opacity) {
        var board = $("chess-board")[0] || $("wc-chess-board")[0];
        if (!board) {
            console.log("View Mode: Board element not found for highlighting");
            return;
        }

        var squareNum = square.replace(/^a/, "1").replace(/^b/, "2").replace(/^c/, "3").replace(/^d/, "4").replace(/^e/, "5").replace(/^f/, "6").replace(/^g/, "7").replace(/^h/, "8");

        var highlight = document.createElement("div");
        highlight.className = "chess-client-view-mode-highlight";
        highlight.setAttribute("data-square", squareNum);
        highlight.style.cssText = "position: absolute; background: " + color + " !important; opacity: " + opacity + " !important; pointer-events: none; z-index: 999999 !important; border-radius: 4px;";

        var boardRect = board.getBoundingClientRect();
        var squareSize = boardRect.width / 8;

        var isFlipped = board.classList.contains("flipped") || $(board).find(".board").hasClass("flipped") || board.getAttribute("orientation") === "black";

        var file = parseInt(squareNum[0]) - 1;
        var rank = 8 - parseInt(squareNum[1]);

        if (isFlipped) {
            file = 7 - file;
            rank = 7 - rank;
        }

        highlight.style.width = squareSize + "px";
        highlight.style.height = squareSize + "px";
        highlight.style.left = (file * squareSize) + "px";
        highlight.style.top = (rank * squareSize) + "px";

        var boardContainer = board.querySelector('.board-container') || 
                             board.querySelector('.board') || 
                             board.querySelector('[class*="board"]') ||
                             board;
        
        if (boardContainer) {
            if (boardContainer.style.position !== 'relative' && boardContainer.style.position !== 'absolute') {
                boardContainer.style.position = "relative";
            }
            boardContainer.appendChild(highlight);
            console.log("View Mode: Highlighted square", square, "at", file, rank, "color:", color, "appended to:", boardContainer.className || boardContainer.tagName);
        } else {
            console.log("View Mode: Could not find board element to append highlight");
        }
    };
    
    myFunctions.clearViewModeHighlights = function () {
        var highlights = document.querySelectorAll(".chess-client-view-mode-highlight");
        highlights.forEach(function (el) {
            el.remove();
        });
    };
    
    myFunctions.saveSettings = function () {
        try {
            GM_setValue("autoMove", myVars.autoMove);
            GM_setValue("moveSpeedTier", myVars.moveSpeedTier);
            GM_setValue("timeAffectedSpeed", myVars.timeAffectedSpeed);
            GM_setValue("targetElo", myVars.targetElo);
            GM_setValue("bestMoveColor", myVars.bestMoveColor);
            GM_setValue("intermediateMoveColor", myVars.intermediateMoveColor);
            GM_setValue("consoleLogEnabled", myVars.consoleLogEnabled);
            GM_setValue("viewModeEnabled", myVars.viewModeEnabled);
            GM_setValue("hangingPieceColor", myVars.hangingPieceColor);
            GM_setValue("checkCheckmateColor", myVars.checkCheckmateColor);
        } catch (error) {
        }
    };
    myFunctions.loadSettings = function () {
        try {
            myVars.autoMove = GM_getValue("autoMove", false);
            myVars.targetElo = GM_getValue("targetElo", 1500);
            myVars.bestMoveColor = GM_getValue("bestMoveColor", "#5b8c5a");
            myVars.intermediateMoveColor = GM_getValue("intermediateMoveColor", "#ffa500");
            myVars.consoleLogEnabled = GM_getValue("consoleLogEnabled", true);
            myVars.viewModeEnabled = GM_getValue("viewModeEnabled", false);
            myVars.hangingPieceColor = GM_getValue("hangingPieceColor", "#ff0000");
            myVars.checkCheckmateColor = GM_getValue("checkCheckmateColor", "#9b59b6");

            function eloToDepthAndBlunder(elo) {
                var depth, blunderRate;
                if (elo < 800) {
                    depth = Math.round(1 + (elo - 400) / 400 * 2);
                    blunderRate = 0.95 - (elo - 400) / 400 * 0.25;
                } else if (elo < 1200) {
                    depth = Math.round(3 + (elo - 800) / 400 * 3);
                    blunderRate = 0.70 - (elo - 800) / 400 * 0.25;
                } else if (elo < 1600) {
                    depth = Math.round(6 + (elo - 1200) / 400 * 4);
                    blunderRate = 0.45 - (elo - 1200) / 400 * 0.20;
                } else if (elo < 2000) {
                    depth = Math.round(10 + (elo - 1600) / 400 * 3);
                    blunderRate = 0.25 - (elo - 1600) / 400 * 0.15;
                } else if (elo < 2400) {
                    depth = Math.round(13 + (elo - 2000) / 400 * 3);
                    blunderRate = 0.10 - (elo - 2000) / 400 * 0.07;
                } else {
                    depth = Math.round(16 + (elo - 2400) / 1000 * 5);
                    blunderRate = 0.03 - (elo - 2400) / 1000 * 0.03;
                }
                depth = Math.max(1, Math.min(21, depth));
                blunderRate = Math.max(0, Math.min(1, blunderRate));
                return {depth: depth, blunderRate: blunderRate};
            }

            var config = eloToDepthAndBlunder(myVars.targetElo);
            myVars.lastValue = config.depth;
            myVars.blunderRate = config.blunderRate;
        } catch (error) {
        }
    };
    return myFunctions;
}