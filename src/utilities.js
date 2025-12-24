function setupUtilities(myVars) {
    const myFunctions = {};
    let stop_b = stop_w = 0;
    let s_br = s_br2 = s_wr = s_wr2 = 0;
    let obs = "";
    setupParser(myVars, myFunctions);
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

        var fromSquare = move.substring(0, 2);
        var toSquare = move.substring(2, 4);

        // Use different color for intermediate vs final results
        var moveColor = isIntermediate ? (myVars.intermediateMoveColor || "#ffa500") : (myVars.bestMoveColor || "#5b8c5a"); // Configurable intermediate color, configured color for final

        myFunctions.highlightSingleSquare(fromSquare, moveColor, 0.5);
        myFunctions.highlightSingleSquare(toSquare, moveColor, 0.7);

        if (!isIntermediate && myVars.autoMove === true) {
            myFunctions.movePiece(fromSquare, toSquare);
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
        setTimeout(() => {
            try {
                window.board.game.move({
                    ...moveObject,
                    promotion: moveObject.promotion || "q",
                    animate: true,
                    userGenerated: true
                });
            } catch (error) {
                console.error("Error making move:", error);
            }
        }, 100 + Math.random() * 300);
    };
    myFunctions.other = function (delay) {
        const gamePhase = myFunctions.estimateGamePhase();
        const positionComplexity = myFunctions.estimatePositionComplexity();
        let naturalDelay = delay;
        if (gamePhase < 10) {
            naturalDelay *= 0.6 + Math.random() * 0.4;
        }
        if (positionComplexity > 0.7) {
            naturalDelay *= 1 + Math.random() * 1.5;
        }
        naturalDelay *= 0.85 + Math.random() * 0.3;
        var endTime = Date.now() + naturalDelay;
        var timer = setInterval(() => {
            if (Date.now() >= endTime) {
                myFunctions.autoRun(myVars.lastValue);
                window.canGo = true;
                clearInterval(timer);
            }
        }, 10);
    };
    myFunctions.getAdjustedDepth = function () {
        const userDepth = myVars.lastValue || 11;
        const gamePhase = myFunctions.estimateGamePhase();

        let depth = userDepth;

        // Cap depth at 15 in opening (first 10 moves)
        if (gamePhase < 10) {
            depth = Math.min(depth, 15);
        } else if (gamePhase < 15) {
            // Gradually increase depth from move 10 to 14
            let progress = (gamePhase - 9) / 5; // 0.2 at move 10, 1.0 at move 14
            let targetDepth = 15 + Math.floor((userDepth - 15) * progress);
            depth = Math.min(depth, targetDepth);
        }
        // After 15 moves, use full depth

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
                        } else {
                        }
                    }
                } else {
                    const seconds = parseInt(timeText);
                    if (!isNaN(seconds)) {
                        remainingTime = seconds;
                    } else {
                    }
                }
            } else {
            }
        } catch (e) {
        }
        return remainingTime;
    };
    myFunctions.estimatePositionComplexity = function () {
        return Math.random() * 0.8 + 0.2;
    };
    myFunctions.saveSettings = function () {
        try {
            GM_setValue("autoMove", myVars.autoMove);
            GM_setValue("timeDelayMin", $("#timeDelayMin").val());
            GM_setValue("timeDelayMax", $("#timeDelayMax").val());
            GM_setValue("depthValue", myVars.lastValue);
            GM_setValue("bestMoveColor", myVars.bestMoveColor);
            GM_setValue("intermediateMoveColor", myVars.intermediateMoveColor);
            GM_setValue("playStyle", myVars.playStyle);
            GM_setValue("blunderRate", myVars.blunderRate);
            GM_setValue("adaptToRating", myVars.adaptToRating);
            GM_setValue("useOpeningBook", myVars.useOpeningBook);
            GM_setValue("preferredOpenings", myVars.preferredOpenings);
            GM_setValue("randomizeTiming", myVars.randomizeTiming);
            GM_setValue("mouseMovementRealism", myVars.mouseMovementRealism);
        } catch (error) {
        }
    };
    myFunctions.loadSettings = function () {
        try {
            myVars.autoMove = GM_getValue("autoMove", false);
            myVars.lastValue = GM_getValue("depthValue", 3);
            myVars.bestMoveColor = GM_getValue("bestMoveColor", "#5b8c5a");
            myVars.intermediateMoveColor = GM_getValue("intermediateMoveColor", "#ffa500");
            myVars.blunderRate = GM_getValue("blunderRate", 0.7);
            myVars.adaptToRating = GM_getValue("adaptToRating", true);
            myVars.useOpeningBook = GM_getValue("useOpeningBook", true);
            myVars.preferredOpenings = GM_getValue("preferredOpenings", ["e4", "d4", "c4", "Nf3"]);
            myVars.randomizeTiming = GM_getValue("randomizeTiming", true);
            myVars.mouseMovementRealism = GM_getValue("mouseMovementRealism", 0.7);
            const savedPlayStyle = GM_getValue("playStyle", null);
            if (savedPlayStyle) {
                myVars.playStyle = savedPlayStyle;
            }
        } catch (error) {
        }
    };
    return myFunctions;
}