function setupUI(myVars, myFunctions) {
    let dynamicStyles = null;

    function addAnimation(body) {
        if (!dynamicStyles) {
            dynamicStyles = document.createElement("style");
            dynamicStyles.type = "text/css";
            document.head.appendChild(dynamicStyles);
        }
        dynamicStyles.sheet.insertRule(body, dynamicStyles.length);
    }

    myFunctions.spinner = function () {
        if (window.isThinking == true) {
            $("#thinking-indicator").addClass("active");
        }
        if (window.isThinking == false) {
            $("#thinking-indicator").removeClass("active");
        }
    };

    myFunctions.updatePositionalMeter = function (score) {
        var meterValue = document.getElementById("meterValue");
        var whiteFill = document.getElementById("meterFillWhite");
        var blackFill = document.getElementById("meterFillBlack");

        if (!meterValue || !whiteFill || !blackFill) {
            console.log("Positional meter elements not found");
            return;
        }

        var playingAs = 1;
        if (window.board && window.board.game && window.board.game.getPlayingAs) {
            try {
                playingAs = window.board.game.getPlayingAs();
            } catch (e) {
                playingAs = 1;
            }
        }

        var evaluation = score / 100;

        if (playingAs === 2) {
            evaluation = -evaluation;
        }

        var cappedEval = Math.max(-10, Math.min(10, evaluation));

        var whitePercentage = 50 + (cappedEval * 5);
        whitePercentage = Math.max(0, Math.min(100, whitePercentage));
        var blackPercentage = 100 - whitePercentage;

        console.log("Meter Update - Score:", score, "Playing as:", playingAs === 2 ? "Black" : "White", "Eval:", evaluation, "White:", whitePercentage + "%", "Black:", blackPercentage + "%");

        blackFill.style.height = blackPercentage + "%";
        whiteFill.style.height = whitePercentage + "%";

        if (evaluation > 0) {
            meterValue.textContent = "+" + Math.abs(evaluation).toFixed(1);
        } else if (evaluation < 0) {
            meterValue.textContent = "-" + Math.abs(evaluation).toFixed(1);
        } else {
            meterValue.textContent = "0.0";
        }
        meterValue.style.color = "#ffffff";
    };

    myFunctions.highlightSquares = function (fromSq, toSq, color) {
        var board = $("chess-board")[0] || $("wc-chess-board")[0];
        if (!board) return;

        myFunctions.clearHighlights();

        var highlightColor = color || myVars.highlightColor || "#7c9a5e";

        var fromSquareNum = fromSq.replace(/^a/, "1").replace(/^b/, "2").replace(/^c/, "3").replace(/^d/, "4").replace(/^e/, "5").replace(/^f/, "6").replace(/^g/, "7").replace(/^h/, "8");
        var toSquareNum = toSq.replace(/^a/, "1").replace(/^b/, "2").replace(/^c/, "3").replace(/^d/, "4").replace(/^e/, "5").replace(/^f/, "6").replace(/^g/, "7").replace(/^h/, "8");

        var fromHighlight = document.createElement("div");
        fromHighlight.className = "chess-client-highlight from-square";
        fromHighlight.setAttribute("data-square", fromSquareNum);
        fromHighlight.style.cssText = "position: absolute; background: " + highlightColor + "; opacity: 0.5; pointer-events: none; z-index: 100; border-radius: 4px; box-shadow: inset 0 0 0 3px " + highlightColor + ";";

        var toHighlight = document.createElement("div");
        toHighlight.className = "chess-client-highlight to-square";
        toHighlight.setAttribute("data-square", toSquareNum);
        toHighlight.style.cssText = "position: absolute; background: " + highlightColor + "; opacity: 0.7; pointer-events: none; z-index: 100; border-radius: 4px; box-shadow: inset 0 0 0 3px " + highlightColor + ";";

        var boardRect = board.getBoundingClientRect();
        var squareSize = boardRect.width / 8;

        var isFlipped = board.classList.contains("flipped") ||
            $(board).find(".board").hasClass("flipped") ||
            board.getAttribute("orientation") === "black";

        var fromFile = parseInt(fromSquareNum[0]) - 1;
        var fromRank = 8 - parseInt(fromSquareNum[1]);
        var toFile = parseInt(toSquareNum[0]) - 1;
        var toRank = 8 - parseInt(toSquareNum[1]);

        if (isFlipped) {
            fromFile = 7 - fromFile;
            fromRank = 7 - fromRank;
            toFile = 7 - toFile;
            toRank = 7 - toRank;
        }

        fromHighlight.style.width = squareSize + "px";
        fromHighlight.style.height = squareSize + "px";
        fromHighlight.style.left = fromFile * squareSize + "px";
        fromHighlight.style.top = fromRank * squareSize + "px";

        toHighlight.style.width = squareSize + "px";
        toHighlight.style.height = squareSize + "px";
        toHighlight.style.left = toFile * squareSize + "px";
        toHighlight.style.top = toRank * squareSize + "px";

        var boardElement = $(board).find(".board")[0] || board;
        if (boardElement) {
            boardElement.style.position = "relative";
            boardElement.appendChild(fromHighlight);
            boardElement.appendChild(toHighlight);
        }

        setTimeout(function () {
            fromHighlight.style.transition = "opacity 0.5s ease";
            toHighlight.style.transition = "opacity 0.5s ease";
            fromHighlight.style.opacity = "0";
            toHighlight.style.opacity = "0";
            setTimeout(function () {
                if (fromHighlight.parentNode) fromHighlight.remove();
                if (toHighlight.parentNode) toHighlight.remove();
            }, 500);
        }, 2500);
    };
    myFunctions.clearHighlights = function (withFade) {
        var highlights = document.querySelectorAll(".chess-client-highlight");
        if (withFade) {
            highlights.forEach(function (el) {
                el.style.transition = "opacity 0.4s ease";
                el.style.opacity = "0";
                setTimeout(function () {
                    if (el.parentNode) el.remove();
                }, 400);
            });
        } else {
            highlights.forEach(function (el) {
                el.remove();
            });
        }
    };
    myFunctions.loadEx = function () {
        try {
            if (document.getElementById("settingsContainer")) return;

            window.board = $("chess-board")[0] || $("wc-chess-board")[0];
            myVars.board = window.board;

            var meterDiv = document.createElement("div");
            meterDiv.innerHTML = positionalMeterTemplate;
            document.body.appendChild(meterDiv.firstElementChild);

            var div = document.createElement("div");
            div.setAttribute("id", "settingsContainer");
            div.innerHTML = mainTemplate;
            div.prepend($(spinnerTemplate)[0]);
            document.body.appendChild(div);

            if (!document.querySelector('style[data-chess-client]')) {
                var botStyles = document.createElement("style");
                botStyles.setAttribute("data-chess-client", "true");
                botStyles.innerHTML = mainStyles + advancedStyles;
                document.head.appendChild(botStyles);
                addAnimation(`@keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }`);
            }

            $("#advanced-settings .advanced-controls").append(advancedSettingsTemplate);
            myFunctions.loadSettings();
            applySettingsToUI(myVars);

            myFunctions.initDraggable();
            myFunctions.initMinimize();
            myFunctions.updateDetectionScore();
            myFunctions.checkPageStatus();

            var versionEl = document.getElementById("versionText");
            if (versionEl) {
                versionEl.textContent = "v" + currentVersion;
            }

            myVars.loaded = true;
        } catch (error) {
        }
    };
    myFunctions.checkPageStatus = function () {
        var board = $("chess-board")[0] || $("wc-chess-board")[0];
        var pageStatus = document.getElementById("pageStatus");
        var clientBody = document.querySelector(".client-body");

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
    myFunctions.initMinimize = function () {
        var panel = document.getElementById("settingsContainer");
        var minimizeHint = document.getElementById("minimizeHint");
        var minimizedTab = document.getElementById("minimizedTab");
        var positionMeter = document.getElementById("positionalMeter");

        panel.classList.add("minimized", "initial-load");
        if (minimizedTab) {
            minimizedTab.classList.add("visible");
        }
        if (positionMeter) {
            positionMeter.style.display = "none";
        }

        setTimeout(function () {
            panel.classList.remove("initial-load");
        }, 100);

        minimizeHint.addEventListener("click", function (e) {
            e.stopPropagation();
            panel.classList.add("minimized");
            if (minimizedTab) {
                minimizedTab.classList.add("visible");
            }
            if (positionMeter) {
                positionMeter.style.display = "none";
            }
        });

        if (minimizedTab) {
            minimizedTab.addEventListener("click", function () {
                panel.classList.remove("minimized");
                minimizedTab.classList.remove("visible");
                if (positionMeter) {
                    positionMeter.style.display = "flex";
                }
            });
        }

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                e.preventDefault();
                
                var consoleLog = document.getElementById('notificationContainer');
                
                if (panel.classList.contains("minimized")) {
                    panel.classList.remove("minimized");
                    if (minimizedTab) {
                        minimizedTab.classList.remove("visible");
                    }
                    if (positionMeter) {
                        positionMeter.style.display = "flex";
                    }
                    if (consoleLog && myVars.consoleLogEnabled) {
                        consoleLog.classList.add("visible");
                    }
                } else {
                    panel.classList.add("minimized");
                    if (minimizedTab) {
                        minimizedTab.classList.add("visible");
                    }
                    if (positionMeter) {
                        positionMeter.style.display = "none";
                    }
                    if (consoleLog) {
                        consoleLog.classList.remove("visible");
                    }
                }
            }
        });
    };
    myFunctions.updateDetectionScore = function () {
        var score = 5;

        var targetElo = myVars.targetElo || 1500;
        if (targetElo < 800) score -= 2;
        else if (targetElo < 1200) score -= 1;
        else if (targetElo >= 2800) score += 3;
        else if (targetElo >= 2400) score += 2;
        else if (targetElo >= 2000) score += 1;

        if (myVars.autoMove === true) score += 3;

        if (myVars.timeAffectedSpeed) {
            score -= 1;
        } else {
            var speedTier = myVars.moveSpeedTier || 4;
            if (speedTier <= 2) score -= 1;
            else if (speedTier >= 6) score += 2;
            else if (speedTier === 5) score += 1;
        }

        score = Math.max(1, Math.min(10, score));

        var scoreEl = document.getElementById("detectionScore");
        var barEl = document.getElementById("scoreBarFill");
        var descEl = document.getElementById("scoreDescription");

        if (scoreEl) scoreEl.textContent = score;
        if (barEl) {
            barEl.style.width = score * 10 + "%";
            barEl.classList.remove("low", "medium", "high");
            if (score <= 3) barEl.classList.add("low"); else if (score <= 6) barEl.classList.add("medium"); else
                barEl.classList.add("high");
        }
        if (descEl) {
            if (score <= 2) descEl.textContent = "Very Safe"; else if (score <= 4) descEl.textContent = "Safe"; else if (score <= 6) descEl.textContent = "Moderate"; else if (score <= 8) descEl.textContent = "Risky"; else
                descEl.textContent = "Very Risky";
        }
    };
    
    var lastNotificationCache = {
        message: '',
        type: '',
        timestamp: 0
    };
    
    myFunctions.showNotification = function (message, type, duration) {
        if (!myVars.consoleLogEnabled) return;

        type = type || 'info';
        
        var now = Date.now();
        var cacheKey = message + '|' + type;
        var lastCacheKey = lastNotificationCache.message + '|' + lastNotificationCache.type;
        
        if (cacheKey === lastCacheKey && (now - lastNotificationCache.timestamp) < 2000) {
            return;
        }
        
        lastNotificationCache.message = message;
        lastNotificationCache.type = type;
        lastNotificationCache.timestamp = now;

        var container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = '';
            container.innerHTML = `
                <div class="console-header" id="consoleHeader">
                    <span class="console-title">Console Log</span>
                    <span class="console-close" id="consoleClose">×</span>
                </div>
                <div class="console-body" id="consoleBody"></div>
                <div class="console-footer">
                    <span class="console-clear" id="consoleClear">Clear</span>
                    <span id="consoleCount" class="console-count">0 entries</span>
                </div>
            `;
            document.body.appendChild(container);

            document.getElementById('consoleClose').onclick = function () {
                container.classList.remove('visible');
            };

            document.getElementById('consoleClear').onclick = function () {
                document.getElementById('consoleBody').innerHTML = '';
                document.getElementById('consoleCount').textContent = '0 entries';
            };
            
            var header = document.getElementById('consoleHeader');
            var isDragging = false;
            var offsetX = 0;
            var offsetY = 0;
            
            header.addEventListener('mousedown', function(e) {
                if (e.target.id === 'consoleClose') return;
                isDragging = true;
                offsetX = e.clientX - container.getBoundingClientRect().left;
                offsetY = e.clientY - container.getBoundingClientRect().top;
                container.style.transition = 'none';
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                var newX = e.clientX - offsetX;
                var newY = e.clientY - offsetY;
                
                newX = Math.max(0, Math.min(newX, window.innerWidth - container.offsetWidth));
                newY = Math.max(0, Math.min(newY, window.innerHeight - container.offsetHeight));
                
                container.style.left = newX + 'px';
                container.style.top = newY + 'px';
                container.style.bottom = 'auto';
            });
            
            document.addEventListener('mouseup', function() {
                if (isDragging) {
                    isDragging = false;
                    container.style.transition = '';
                }
            });
        }

        var body = document.getElementById('consoleBody');
        
        var allEntries = body.querySelectorAll('.console-entry');
        allEntries.forEach(function(oldEntry) {
            oldEntry.classList.add('faded');
        });
        
        var entry = document.createElement('div');
        entry.className = 'console-entry ' + type;

        var icons = {
            info: '[i]',
            success: '[✓]',
            warning: '[!]',
            error: '[✗]'
        };

        var timestamp = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        entry.innerHTML =
            '<span class="console-timestamp">' + timestamp + '</span>' +
            '<span class="console-icon">' + (icons[type] || icons.info) + '</span>' +
            message;

        body.appendChild(entry);
        body.scrollTop = body.scrollHeight;

        var count = body.children.length;
        document.getElementById('consoleCount').textContent = count + ' ' + (count === 1 ? 'entry' : 'entries');

        if (count > 100) {
            body.removeChild(body.firstChild);
        }
    };
    myFunctions.initDraggable = function () {
        var panel = document.getElementById("settingsContainer");
        var header = panel.querySelector(".client-header");
        var isDragging = false;
        var offsetX = 0;
        var offsetY = 0;

        header.addEventListener("mousedown", function (e) {
            if (e.target.closest(".toggle") || e.target.closest("input") || e.target.closest("button")) return;
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            panel.style.transition = "none";
        });

        document.addEventListener("mousemove", function (e) {
            if (!isDragging) return;
            var newX = e.clientX - offsetX;
            var newY = e.clientY - offsetY;

            newX = Math.max(0, Math.min(newX, window.innerWidth - panel.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - panel.offsetHeight));

            panel.style.left = newX + "px";
            panel.style.top = newY + "px";
            panel.style.right = "auto";
        });

        document.addEventListener("mouseup", function () {
            isDragging = false;
            panel.style.transition = "";
        });
    };

    function applySettingsToUI(myVars2) {
        $("#autoMove").prop("checked", myVars2.autoMove);

        $("#targetEloSlider").val(myVars2.targetElo);
        $("#targetEloValue").text(myVars2.targetElo);

        const eloDesc = $("#eloDescription");
        const elo = myVars2.targetElo;
        if (elo < 800) eloDesc.text("Beginner");
        else if (elo < 1000) eloDesc.text("Novice");
        else if (elo < 1200) eloDesc.text("Amateur");
        else if (elo < 1400) eloDesc.text("Intermediate");
        else if (elo < 1600) eloDesc.text("Club Player");
        else if (elo < 1800) eloDesc.text("Tournament Player");
        else if (elo < 2000) eloDesc.text("Expert");
        else if (elo < 2200) eloDesc.text("Candidate Master");
        else if (elo < 2400) eloDesc.text("Master");
        else if (elo < 2600) eloDesc.text("International Master");
        else if (elo < 2800) eloDesc.text("Grandmaster");
        else if (elo < 3000) eloDesc.text("Super Grandmaster");
        else eloDesc.text("World Champion");

        myVars2.moveSpeedTier = GM_getValue("moveSpeedTier", 4);
        myVars2.timeAffectedSpeed = GM_getValue("timeAffectedSpeed", false);

        const speedLabels = ["", "Slowest", "Very Slow", "Slow", "Medium", "Fast", "Very Fast", "Fastest"];
        $("#moveSpeedSlider").val(myVars2.moveSpeedTier);
        $("#moveSpeedValue").text(speedLabels[myVars2.moveSpeedTier]);
        $("#timeAffectedSpeed").prop("checked", myVars2.timeAffectedSpeed);

        if (myVars2.timeAffectedSpeed) {
            $("#speedSliderContainer").hide();
        } else {
            $("#speedSliderContainer").show();
        }

        if (myVars2.bestMoveColor) {
            $("#bestMoveColor").val(myVars2.bestMoveColor);
        }
        if (myVars2.intermediateMoveColor) {
            $("#intermediateMoveColor").val(myVars2.intermediateMoveColor);
        }

        myVars2.consoleLogEnabled = GM_getValue("consoleLogEnabled", true);
        $("#consoleLogEnabled").prop("checked", myVars2.consoleLogEnabled);
    }

    return myFunctions;
}