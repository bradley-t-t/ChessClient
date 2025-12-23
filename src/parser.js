function setupParser(myVars, myFunctions) {
    var multiPvMoves = [];
    
    myFunctions.parser = function(e) {
        if (e.data.includes(" pv ") && e.data.includes("multipv")) {
            try {
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
                    
                    multiPvMoves[pvNum - 1] = { move: move, score: score };
                }
            } catch (err) {
            }
        }
        
        if (e.data.includes("bestmove")) {
            var bestMove = e.data.split(" ")[1];
            
            var validMoves = multiPvMoves.filter(function(m) { return m && m.move; });
            
            if (validMoves.length === 0) {
                validMoves = [{ move: bestMove, score: 0 }];
            }
            
            var selectedMove = myFunctions.selectMoveBySkill(validMoves, bestMove);
            
            myFunctions.displayBothMoves(bestMove, selectedMove);
            window.isThinking = false;
            myFunctions.spinner();
            
            multiPvMoves = [];
        }
    };
    
    myFunctions.selectMoveBySkill = function(moves, bestMove) {
        var depth = myVars.lastValue || 3;
        var blunderRate = myVars.blunderRate !== undefined ? myVars.blunderRate : 0.7;
        
        var skillFactor = (depth / 21) * (1 - blunderRate);
        
        if (moves.length <= 1 || Math.random() < skillFactor) {
            return bestMove;
        }
        
        var validMoves = moves.slice(0, Math.min(5, moves.length));
        
        var weights = [];
        for (var i = 0; i < validMoves.length; i++) {
            if (i === 0) {
                weights.push(skillFactor * 10);
            } else {
                weights.push((1 - skillFactor) * (5 - i));
            }
        }
        
        var totalWeight = 0;
        for (var j = 0; j < weights.length; j++) {
            totalWeight += weights[j];
        }
        
        var random = Math.random() * totalWeight;
        var cumulative = 0;
        
        for (var k = 0; k < validMoves.length; k++) {
            cumulative += weights[k];
            if (random <= cumulative) {
                return validMoves[k].move;
            }
        }
        
        return bestMove;
    };
}
