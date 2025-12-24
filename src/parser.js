function setupParser(myVars, myFunctions) {
    var multiPvMoves = [];
    var currentDepth = 0;
    var lastDisplayedDepth = 0;
    var maxDepth = 0;

    myFunctions.parser = function (e) {
        if (e.data.includes(" pv ") && e.data.includes("multipv")) {
            var depthMatch = e.data.match(/depth (\d+)/);
            var pvMatch = e.data.match(/multipv (\d+)/);
            var moveMatch = e.data.match(/ pv ([a-h][1-8][a-h][1-8][qrbn]?)/);
            var scoreMatch = e.data.match(/score cp (-?\d+)/);
            var mateMatch = e.data.match(/score mate (-?\d+)/);

            if (depthMatch && pvMatch && moveMatch) {
                var depth = parseInt(depthMatch[1]);
                var pvNum = parseInt(pvMatch[1]);
                var move = moveMatch[1];
                var score = 0;

                if (mateMatch) {
                    score = parseInt(mateMatch[1]) > 0 ? 10000 : -10000;
                } else if (scoreMatch) {
                    score = parseInt(scoreMatch[1]);
                }

                currentDepth = depth;
                maxDepth = Math.max(maxDepth, depth);
                multiPvMoves[pvNum - 1] = {move: move, score: score};

                // Update current depth display
                var depthEl = document.getElementById("currentDepthValue");
                if (depthEl) {
                    depthEl.textContent = maxDepth;
                }

                // Display intermediate results for depths >= 3 and different from last displayed
                var targetDepth = myVars.lastValue || 11;
                if (depth >= 3 && depth !== lastDisplayedDepth && depth < targetDepth) {
                    var validMoves = multiPvMoves.filter(function (m) {
                        return m && m.move;
                    });

                    if (validMoves.length > 0) {
                        var selectedMove = myFunctions.selectMoveBySkill(validMoves, validMoves[0].move);
                        console.log("Intermediate result at depth " + depth + ": " + selectedMove);
                        myFunctions.displayRecommendedMove(selectedMove, true); // true = intermediate
                        lastDisplayedDepth = depth;
                    }
                }
            }
        }

        if (e.data.includes("bestmove")) {
            var bestMove = e.data.split(" ")[1];

            var validMoves = multiPvMoves.filter(function (m) {
                return m && m.move;
            });

            if (validMoves.length === 0) {
                validMoves = [{move: bestMove, score: 0}];
            }

            var selectedMove = myFunctions.selectMoveBySkill(validMoves, bestMove);

            console.log("Final result at depth " + (myVars.lastValue || 11) + ": " + selectedMove);

            myFunctions.displayRecommendedMove(selectedMove, false); // false = final
            window.isThinking = false;
            myFunctions.spinner();
            
            // Clear any pending timeouts
            if (document.engine && document.engine.thinkingTimeout) {
                clearTimeout(document.engine.thinkingTimeout);
                document.engine.thinkingTimeout = null;
            }
            if (document.engine && document.engine.reloadTimeout) {
                clearTimeout(document.engine.reloadTimeout);
                document.engine.reloadTimeout = null;
            }
            
            multiPvMoves = [];
            currentDepth = 0;
            lastDisplayedDepth = 0;
            maxDepth = 0; // Reset max depth for next analysis
        }
    };

    myFunctions.selectMoveBySkill = function (moves, bestMove) {
        var depth = myVars.lastValue || 3;
        var blunderRate = myVars.blunderRate !== undefined ? myVars.blunderRate : 0.7;

        var skillFactor = (depth / 21) * (1 - blunderRate);

        if (moves.length <= 1 || Math.random() < skillFactor * 0.7 + 0.3) {
            return bestMove;
        }

        var blunderChance = blunderRate * 0.5;
        if (Math.random() < blunderChance && moves.length > 1) {
            var worseMove = moves[Math.min(moves.length - 1, 1 + Math.floor(Math.random() * (moves.length - 1)))];
            if (worseMove && worseMove.move) {
                return worseMove.move;
            }
        }

        return bestMove;
    };
}