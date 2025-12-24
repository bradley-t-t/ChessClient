function setupParser(myVars, myFunctions) {
    var multiPvMoves = [];

    myFunctions.parser = function (e) {
        if (e.data.includes(" pv ") && e.data.includes("multipv")) {
            var pvMatch = e.data.match(/multipv (\d+)/);
            var moveMatch = e.data.match(/ pv ([a-h][1-8][a-h][1-8][qrbn]?)/);
            var scoreMatch = e.data.match(/score cp (-?\d+)/);
            var mateMatch = e.data.match(/score mate (-?\d+)/);

            if (pvMatch && moveMatch) {
                var pvNum = parseInt(pvMatch[1]);
                var move = moveMatch[1];
                var score = 0;

                if (mateMatch) {
                    score = parseInt(mateMatch[1]) > 0 ? 10000 : -10000;
                } else if (scoreMatch) {
                    score = parseInt(scoreMatch[1]);
                }

                multiPvMoves[pvNum - 1] = {move: move, score: score};
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

            console.log("Best move: " + bestMove + ", Selected move: " + selectedMove);

            myFunctions.displayRecommendedMove(selectedMove);
            window.isThinking = false;
            myFunctions.spinner();

            multiPvMoves = [];
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
