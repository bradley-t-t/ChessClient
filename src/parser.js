function setupParser(myVars, myFunctions) {
  var multiPvMoves = [];
  var currentDepth = 0;
  var lastDisplayedDepth = 0;
  var maxDepth = 0;
  var targetDepth = 0;

  myFunctions.parser = function (e) {
    if (e.data.includes(" pv ")) {
      var depthMatch = e.data.match(/depth (\d+)/);
      var pvMatch = e.data.match(/multipv (\d+)/);
      var moveMatch = e.data.match(/ pv ([a-h][1-8][a-h][1-8][qrbn]?)/);
      var scoreMatch = e.data.match(/score cp (-?\d+)/);
      var mateMatch = e.data.match(/score mate (-?\d+)/);

      if (depthMatch && moveMatch) {
        var depth = parseInt(depthMatch[1]);
        var pvNum = pvMatch ? parseInt(pvMatch[1]) : 1;
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

        // Force stop if target depth reached
        if (maxDepth >= myFunctions.targetDepth && !window.stopSent) {
          if (document.engine && document.engine.engine) {
            document.engine.engine.postMessage("stop");
            window.stopSent = true;
          }
        }

        // Update current depth display and progress bar
        var depthEl = document.getElementById("currentDepthValue");
        var barEl = document.getElementById("depthBarFill");
        if (depthEl) {
          depthEl.textContent = maxDepth;
        }
        if (barEl && myFunctions.targetDepth > 0) {
          var percentage = Math.min(100, maxDepth / myFunctions.targetDepth * 100);
          barEl.style.width = percentage + "%";
        }

        // Display intermediate results for depths >= 1 and different from last displayed
        var targetDepthLocal = myVars.lastValue || 11;
        if (depth >= 1 && depth !== lastDisplayedDepth && depth < targetDepthLocal) {
          var validMoves = multiPvMoves.filter(function (m) {
            return m && m.move;
          });

          if (validMoves.length > 0) {
            var selectedMove = myFunctions.selectMoveBySkill(validMoves, validMoves[0].move);
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
        validMoves = [{ move: bestMove, score: 0 }];
      }

      var selectedMove = myFunctions.selectMoveBySkill(validMoves, bestMove);


      myFunctions.displayRecommendedMove(selectedMove, false); // false = final
      window.isThinking = false;
      myFunctions.spinner();

      // Clear any pending timeouts to prevent reload
      if (document.engine && document.engine.thinkingTimeout) {
        clearTimeout(document.engine.thinkingTimeout);
        document.engine.thinkingTimeout = null;
      }
      if (document.engine && document.engine.reloadTimeout) {
        clearTimeout(document.engine.reloadTimeout);
        document.engine.reloadTimeout = null;
      }

      // Mark analysis as complete
      if (document.engine) {
        document.engine.analysisComplete = true;
      }

      multiPvMoves = [];
      currentDepth = 0;
      lastDisplayedDepth = 0;
      maxDepth = 0;
      targetDepth = 0; // Reset target depth
      window.stopSent = false; // Reset stop flag
    }
  };

  myFunctions.selectMoveBySkill = function (moves, bestMove) {
    var depth = myVars.lastValue || 3;
    var blunderRate = myVars.blunderRate !== undefined ? myVars.blunderRate : 0.7;

    var skillFactor = depth / 21 * (1 - blunderRate);

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