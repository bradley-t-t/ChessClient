function setupParser(myVars, myFunctions) {
    myFunctions.parser = function(e) {
        if (e.data.includes("bestmove")) {
            const bestMove = e.data.split(" ")[1];
            let alternativeMoves = [bestMove];
            try {
                if (e.data.includes("pv")) {
                    const lines = e.data.split("\n").filter((line) => line.includes(" pv ")).map((line) => {
                        const pvIndex = line.indexOf(" pv ");
                        return line.substring(pvIndex + 4).split(" ")[0];
                    });
                    if (lines.length > 1) {
                        alternativeMoves = [...new Set(lines)];
                    }
                }
            } catch (error) {
                console.log("Error extracting alternative moves", error);
            }
            
            let humanMove = myFunctions.calculateHumanMove(bestMove, alternativeMoves, e.data);
            myFunctions.displayBothMoves(bestMove, humanMove);
            window.isThinking = false;
            myFunctions.spinner();
        }
    };
    myFunctions.calculateHumanMove = function(bestMove, alternativeMoves, engineData) {
        try {
            const legalMoves = window.board.game.getLegalMoves();
            if (!legalMoves || legalMoves.length <= 1) {
                return bestMove;
            }
            
            const blunderRate = myVars.blunderRate !== void 0 ? myVars.blunderRate : 0.2;
            const variationChance = Math.min(0.7, blunderRate + 0.3);
            
            if (Math.random() > variationChance) {
                return bestMove;
            }
            
            const bestFrom = bestMove.substring(0, 2);
            const bestTo = bestMove.substring(2, 4);
            
            let candidateMoves = [];
            
            for (let i = 0; i < legalMoves.length; i++) {
                const move = legalMoves[i];
                const moveStr = move.from + move.to;
                if (moveStr === bestMove) continue;
                
                let score = 0;
                
                if (move.from === bestFrom) {
                    score += 3;
                }
                
                if (move.to === bestTo) {
                    score += 2;
                }
                
                if (move.captured) {
                    score += 2;
                }
                
                if (move.san && (move.san.includes("+") || move.san.includes("#"))) {
                    score += 3;
                }
                
                const fromFile = move.from.charCodeAt(0) - 97;
                const toFile = move.to.charCodeAt(0) - 97;
                if (toFile >= 2 && toFile <= 5) {
                    score += 1;
                }
                
                candidateMoves.push({ move: moveStr, score: score });
            }
            
            if (candidateMoves.length === 0) {
                return bestMove;
            }
            
            candidateMoves.sort((a, b) => b.score - a.score);
            
            const topMoves = candidateMoves.slice(0, Math.min(5, candidateMoves.length));
            const weights = topMoves.map((m, i) => Math.pow(0.6, i));
            const totalWeight = weights.reduce((a, b) => a + b, 0);
            
            let random = Math.random() * totalWeight;
            for (let i = 0; i < topMoves.length; i++) {
                random -= weights[i];
                if (random <= 0) {
                    return topMoves[i].move;
                }
            }
            
            return topMoves[0].move;
        } catch (e) {
            console.log("Error calculating human move:", e);
            return bestMove;
        }
    };
    myFunctions.getBlunderProbability = function() {
        const userBlunderRate = myVars.blunderRate !== void 0 ? myVars.blunderRate : 0.05;
        const gamePhase = myFunctions.estimateGamePhase();
        const timeRemaining = myFunctions.estimateTimeRemaining();
        const complexity = myFunctions.estimatePositionComplexity();
        let baseProb = userBlunderRate;
        if (timeRemaining < 30) {
            baseProb += 0.1 * (1 - timeRemaining / 30);
        }
        if (complexity > 0.6) {
            baseProb += 0.05 * (complexity - 0.6) * 2;
        }
        if (gamePhase > 30) {
            baseProb += 0.03 * ((gamePhase - 30) / 10);
        }
        return Math.min(0.4, baseProb * (0.7 + Math.random() * 0.6));
    };
    myFunctions.generateHumanLikeMove = function(bestMove, engineData) {
        if (engineData.includes("pv") && Math.random() < 0.4) {
            try {
                const lines = engineData.split("\n").filter((line) => line.includes(" pv ")).map((line) => {
                    const pvIndex = line.indexOf(" pv ");
                    return line.substring(pvIndex + 4).split(" ")[0];
                });
                if (lines.length > 1) {
                    const moveIndex = Math.floor(Math.pow(Math.random(), 2.5) * Math.min(lines.length, 4));
                    return lines[moveIndex] || bestMove;
                }
            } catch (e) {
                console.log("Error extracting alternative moves", e);
            }
        }
        if (Math.random() < 0.15) {
            const fromSquare = bestMove.substring(0, 2);
            const toSquare = bestMove.substring(2, 4);
            if (Math.random() < 0.7) {
                const files = "abcdefgh";
                const ranks = "12345678";
                const fromFile = fromSquare.charAt(0);
                const fromRank = fromSquare.charAt(1);
                const toFile = toSquare.charAt(0);
                const toRank = toSquare.charAt(1);
                const fileDiff = files.indexOf(toFile) - files.indexOf(fromFile);
                const rankDiff = ranks.indexOf(toRank) - ranks.indexOf(fromRank);
                if (Math.abs(fileDiff) > 1 || Math.abs(rankDiff) > 1) {
                    const newToFile = files[files.indexOf(fromFile) + (fileDiff > 0 ? Math.max(1, fileDiff - 1) : Math.min(-1, fileDiff + 1))];
                    const newToRank = ranks[ranks.indexOf(fromRank) + (rankDiff > 0 ? Math.max(1, rankDiff - 1) : Math.min(-1, rankDiff + 1))];
                    if (newToFile && newToRank) {
                        const alternativeMove = fromSquare + newToFile + newToRank;
                        for (let each = 0; each < window.board.game.getLegalMoves().length; each++) {
                            if (window.board.game.getLegalMoves()[each].from === fromSquare && window.board.game.getLegalMoves()[each].to === newToFile + newToRank) {
                                return alternativeMove;
                            }
                        }
                    }
                }
            }
        }
        return bestMove;
    };
}
