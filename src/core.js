var currentVersion = "5.0.9";

function initializeVariables() {
    const myVars = {
        delay: 0.1,
        loaded: false,
        onGamePage: false,
        targetElo: 1500,
        lastValue: 11,
        blunderRate: 0.2,
        bestMoveColor: "#5b8c5a",
        intermediateMoveColor: "#ffa500",
        moveSpeedTier: 4,
        timeAffectedSpeed: false,
        recommendMoves: true,
        highlightHangingPieces: false,
        ownHangingColor: "#ff4444",
        enemyHangingColor: "#44ff44"
    };
    return myVars;
}

function setupCore(myVars, myFunctions) {
    const engine = {
        engine: null,
        thinkingTimeout: null,
        reloadTimeout: null,
        analysisComplete: false,
        stockfishObjectURL: null
    };

    var multiPvMoves = [];
    var currentDepth = 0;
    var lastDisplayedDepth = 0;
    var maxDepth = 0;
    var finalMoveShown = false;

    myFunctions.loadChessEngine = function () {
        if (!engine.stockfishObjectURL) {
            engine.stockfishObjectURL = URL.createObjectURL(new Blob([GM_getResourceText("stockfish.js")], {type: "application/javascript"}));
        }
        if (engine.stockfishObjectURL) {
            engine.engine = new Worker(engine.stockfishObjectURL);
            engine.engine.onmessage = (e) => {
                parseEngineMessage(e);
            };
            engine.engine.onerror = (e) => {
            };
            engine.engine.postMessage("uci");
            engine.engine.postMessage("ucinewgame");
        }
    };

    myFunctions.reloadChessEngine = function () {
        var reloadBtn = document.getElementById("relEngBut");
        if (reloadBtn) {
            var originalText = reloadBtn.textContent;
            reloadBtn.disabled = true;
            reloadBtn.style.opacity = '0.7';
            var dotCount = 0;
            var loopCount = 0;

            var dotInterval = setInterval(function () {
                dotCount = (dotCount % 3) + 1;
                var dots = '.'.repeat(dotCount);
                reloadBtn.textContent = 'Reloading' + dots;

                if (dotCount === 3) {
                    loopCount++;
                    if (loopCount >= 2) {
                        clearInterval(dotInterval);
                        setTimeout(function () {
                            reloadBtn.textContent = originalText;
                            reloadBtn.disabled = false;
                            reloadBtn.style.opacity = '1';
                        }, 200);
                    }
                }
            }, 200);
        }

        $("#thinking-indicator").addClass("reloading");

        if (myFunctions.showNotification) {
            myFunctions.showNotification("Engine reloaded successfully", "info", 3000);
        }

        setTimeout(function () {
            $("#thinking-indicator").removeClass("reloading");
        }, 4500);

        if (engine.engine) {
            engine.engine.terminate();
        }

        window.isThinking = false;
        window.canGo = true;
        window.lastAnalyzedFen = null;

        if (engine.analysisComplete) {
            engine.analysisComplete = false;
        }

        myFunctions.loadChessEngine();
    };

    myFunctions.getEstimatedElo = function () {
        var depth = myVars.lastValue || 3;
        var blunderRate = myVars.blunderRate !== undefined ? myVars.blunderRate : 0.7;

        var baseElo = 500;
        var maxElo = 3400;
        var eloRange = maxElo - baseElo;

        var depthFactor = Math.pow(depth / 21, 0.8);
        var accuracyFactor = (1 - blunderRate);

        var elo = Math.round(baseElo + (depthFactor * accuracyFactor * eloRange));
        return Math.max(400, Math.min(3400, elo));
    };

    myFunctions.runChessEngine = function (depth) {
        var fen = window.board.game.getFEN();
        var estimatedElo = myFunctions.getEstimatedElo();
        var skillLevel = Math.floor((estimatedElo - 400) / 120);
        skillLevel = Math.max(0, Math.min(20, skillLevel));

        console.log("Running engine with Target ELO:", myVars.targetElo, "Depth:", myVars.lastValue, "Blunder Rate:", myVars.blunderRate.toFixed(2));

        if (!engine.engine) {
            myFunctions.loadChessEngine();
        }

        var parts = fen.split(" ");
        var moveNumber = parseInt(parts[5]) || 1;
        var userDepth = myVars.lastValue || 11;
        var adjustedDepth = userDepth;

        if (moveNumber <= 10) {
            adjustedDepth = Math.min(adjustedDepth, 15);
        } else if (moveNumber <= 15) {
            var progress = (moveNumber - 10) / 5;
            var targetDepth = 15 + Math.floor((userDepth - 15) * progress);
            adjustedDepth = Math.min(adjustedDepth, targetDepth);
        }

        myFunctions.targetDepth = adjustedDepth;

        engine.analysisComplete = false;

        engine.engine.postMessage("position fen " + fen);
        window.isThinking = true;
        myFunctions.spinner();
        engine.engine.postMessage("setoption name MultiPV value 5");
        engine.engine.postMessage("go depth " + adjustedDepth);
        myVars.lastValue = depth;

        var depthEl = document.getElementById("currentDepthValue");
        if (depthEl) {
            depthEl.textContent = "0%";
        }
        var barEl = document.getElementById("depthBarFill");
        if (barEl) {
            barEl.style.width = "0%";
        }

        if (engine.thinkingTimeout) clearTimeout(engine.thinkingTimeout);
        if (engine.reloadTimeout) clearTimeout(engine.reloadTimeout);

        var timeout = myVars.lastValue > 10 ? 600000 : 180000;

        engine.thinkingTimeout = setTimeout(function () {
            if (engine.analysisComplete) return;
            myFunctions.reloadChessEngine();

            engine.reloadTimeout = setTimeout(function () {
                window.isThinking = false;
                myFunctions.spinner();
            }, 180000);
        }, timeout);
    };

    myFunctions.autoRun = function (lstValue) {
        if (!myVars.recommendMoves) return;
        if (window.moveInProgress) return;
        if (window.board.game.getTurn() == window.board.game.getPlayingAs()) {
            myFunctions.runChessEngine(lstValue);
        }
    };

    myFunctions.stopEngine = function () {
        if (engine.engine) {
            engine.engine.postMessage("stop");
        }
        window.isThinking = false;
        window.canGo = true;
        engine.analysisComplete = true;

        if (engine.thinkingTimeout) {
            clearTimeout(engine.thinkingTimeout);
            engine.thinkingTimeout = null;
        }
        if (engine.reloadTimeout) {
            clearTimeout(engine.reloadTimeout);
            engine.reloadTimeout = null;
        }
    };

    function parseEngineMessage(e) {
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

                if (myFunctions.updatePositionalMeter) {
                    myFunctions.updatePositionalMeter(score);
                }

                currentDepth = depth;
                maxDepth = Math.max(maxDepth, depth);
                multiPvMoves[pvNum - 1] = {move: move, score: score};

                if (maxDepth >= myFunctions.targetDepth && !window.stopSent) {
                    if (engine.engine) {
                        engine.engine.postMessage("stop");
                        window.stopSent = true;
                    }
                }

                var depthEl = document.getElementById("currentDepthValue");
                var barEl = document.getElementById("depthBarFill");
                if (barEl && myFunctions.targetDepth > 0) {
                    var targetPercentage = Math.min(100, Math.max(1, maxDepth / myFunctions.targetDepth * 100));
                    var currentWidth = parseFloat(barEl.style.width) || 0;

                    if (targetPercentage > currentWidth) {
                        var step = (targetPercentage - currentWidth) / 10;
                        var animateBar = function (current) {
                            if (current < targetPercentage) {
                                current = Math.min(current + step, targetPercentage);
                                barEl.style.width = current + "%";
                                if (depthEl) {
                                    depthEl.textContent = Math.round(current) + "%";
                                }
                                requestAnimationFrame(function () {
                                    animateBar(current);
                                });
                            } else {
                                barEl.style.width = targetPercentage + "%";
                                if (depthEl) {
                                    depthEl.textContent = Math.round(targetPercentage) + "%";
                                }
                            }
                        };
                        animateBar(currentWidth);
                    }
                }

                var targetDepthLocal = myVars.lastValue || 11;
                if (depth >= 1 && depth !== lastDisplayedDepth && depth < targetDepthLocal && !finalMoveShown) {
                    var validMoves = multiPvMoves.filter(function (m) {
                        return m && m.move;
                    });

                    if (validMoves.length > 0) {
                        var selectedMove = selectMoveBySkill(validMoves, validMoves[0].move);
                        myFunctions.displayRecommendedMove(selectedMove, true);
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

            var selectedMove = selectMoveBySkill(validMoves, bestMove);

            myFunctions.displayRecommendedMove(selectedMove, false);
            finalMoveShown = true;
            window.isThinking = false;
            window.canGo = true;
            myFunctions.spinner();

            if (engine.thinkingTimeout) {
                clearTimeout(engine.thinkingTimeout);
                engine.thinkingTimeout = null;
            }
            if (engine.reloadTimeout) {
                clearTimeout(engine.reloadTimeout);
                engine.reloadTimeout = null;
            }

            engine.analysisComplete = true;

            multiPvMoves = [];
            currentDepth = 0;
            lastDisplayedDepth = 0;
            maxDepth = 0;
            finalMoveShown = false;
            window.stopSent = false;
        }
    }

    function selectMoveBySkill(moves, bestMove) {
        var targetElo = myVars.targetElo || 1500;
        var depth = myVars.lastValue || 3;
        var blunderRate = myVars.blunderRate !== undefined ? myVars.blunderRate : 0.7;

        var rand = Math.random();

        if (targetElo < 800) {
            if (rand < 0.35) {
                if (window.board && window.board.game && window.board.game.getLegalMoves) {
                    var legalMoves = window.board.game.getLegalMoves();
                    if (legalMoves && legalMoves.length > 0) {
                        var randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
                        var randomMoveStr = randomMove.from + randomMove.to + (randomMove.promotion || '');
                        if (myFunctions.showNotification && randomMoveStr !== bestMove) {
                            myFunctions.showNotification(
                                "Random legal move selected (simulating very low ELO play)",
                                "warning",
                                4000
                            );
                        }
                        return randomMoveStr;
                    }
                }
            }
        }

        var blunderChance = blunderRate;
        if (targetElo < 600) {
            blunderChance = Math.min(1, blunderRate * 1.5);
        } else if (targetElo < 1000) {
            blunderChance = Math.min(1, blunderRate * 1.2);
        }

        if (rand < blunderChance && moves.length > 1) {
            var maxWorseIndex = Math.min(moves.length - 1, Math.floor(moves.length * 0.7));
            var worseIndex = 1 + Math.floor(Math.random() * maxWorseIndex);
            var worseMove = moves[worseIndex];

            if (worseMove && worseMove.move) {
                if (myFunctions.showNotification) {
                    var scoreDiff = Math.abs((worseMove.score || 0) - (moves[0].score || 0));
                    var scoreDiffText = (scoreDiff / 100).toFixed(2);
                    myFunctions.showNotification(
                        "Intentional inaccuracy made (-" + scoreDiffText + " evaluation)",
                        "warning",
                        4000
                    );
                }
                return worseMove.move;
            }
        }

        return bestMove;
    }

    myFunctions.selectMoveBySkill = selectMoveBySkill;

    return engine;
}