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
    myFunctions.spinner = function() {
        if (window.isThinking == true) {
            $("#thinking-indicator").addClass("active");
        }
        if (window.isThinking == false) {
            $("#thinking-indicator").removeClass("active");
        }
    };
    myFunctions.highlightSquares = function(fromSq, toSq, color) {
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
        fromHighlight.style.left = (fromFile * squareSize) + "px";
        fromHighlight.style.top = (fromRank * squareSize) + "px";
        
        toHighlight.style.width = squareSize + "px";
        toHighlight.style.height = squareSize + "px";
        toHighlight.style.left = (toFile * squareSize) + "px";
        toHighlight.style.top = (toRank * squareSize) + "px";
        
        var boardElement = $(board).find(".board")[0] || board;
        if (boardElement) {
            boardElement.style.position = "relative";
            boardElement.appendChild(fromHighlight);
            boardElement.appendChild(toHighlight);
        }
        
        setTimeout(function() {
            fromHighlight.style.transition = "opacity 0.5s ease";
            toHighlight.style.transition = "opacity 0.5s ease";
            fromHighlight.style.opacity = "0";
            toHighlight.style.opacity = "0";
            setTimeout(function() {
                if (fromHighlight.parentNode) fromHighlight.remove();
                if (toHighlight.parentNode) toHighlight.remove();
            }, 500);
        }, 2500);
    };
    myFunctions.clearHighlights = function(withFade) {
        var highlights = document.querySelectorAll(".chess-client-highlight");
        if (withFade) {
            highlights.forEach(function(el) {
                el.style.transition = "opacity 0.4s ease";
                el.style.opacity = "0";
                setTimeout(function() {
                    if (el.parentNode) el.remove();
                }, 400);
            });
        } else {
            highlights.forEach(function(el) { el.remove(); });
        }
    };
    myFunctions.loadEx = function() {
        try {
            window.board = $("chess-board")[0] || $("wc-chess-board")[0];
            myVars.board = window.board;
            var div = document.createElement("div");
            div.setAttribute("id", "settingsContainer");
            div.innerHTML = mainTemplate;
            div.prepend($(spinnerTemplate)[0]);
            document.body.appendChild(div);
            
            var minimizedTab = document.createElement("div");
            minimizedTab.setAttribute("id", "minimizedTab");
            minimizedTab.className = "minimized-tab";
            minimizedTab.innerHTML = '<span class="tab-label">Chess Client</span>';
            document.body.appendChild(minimizedTab);
            
            var botStyles = document.createElement("style");
            botStyles.innerHTML = mainStyles + advancedStyles;
            document.head.appendChild(botStyles);
            addAnimation(`@keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }`);
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
    myFunctions.checkPageStatus = function() {
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
    myFunctions.initMinimize = function() {
        var panel = document.getElementById("settingsContainer");
        var minimizeBtn = document.getElementById("minimizeBtn");
        var minimizedTab = document.getElementById("minimizedTab");
        
        minimizeBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            panel.classList.add("minimized");
            minimizedTab.classList.add("visible");
        });
        
        minimizedTab.addEventListener("click", function() {
            panel.classList.remove("minimized");
            minimizedTab.classList.remove("visible");
        });
    };
    myFunctions.updateDetectionScore = function() {
        var score = 5;
        
        var depth = myVars.lastValue || 11;
        if (depth <= 5) score -= 2;
        else if (depth <= 10) score -= 1;
        else if (depth >= 15) score += 2;
        else if (depth >= 12) score += 1;
        
        var blunderRate = myVars.blunderRate !== undefined ? myVars.blunderRate : 0.05;
        if (blunderRate >= 0.5) score -= 2;
        else if (blunderRate >= 0.3) score -= 1;
        else if (blunderRate <= 0.1) score += 1;
        else if (blunderRate <= 0.02) score += 2;
        
        if (myVars.randomizeTiming === true) score -= 1;
        else if (myVars.randomizeTiming === false) score += 1;
        
        var mouseRealism = myVars.mouseMovementRealism !== undefined ? myVars.mouseMovementRealism : 0.7;
        if (mouseRealism >= 0.8) score -= 1;
        else if (mouseRealism <= 0.3) score += 1;
        
        if (myVars.autoMove === true) score += 2;
        
        var minDelay = parseFloat($("#timeDelayMin").val()) || 0.1;
        var maxDelay = parseFloat($("#timeDelayMax").val()) || 1;
        var avgDelay = (minDelay + maxDelay) / 2;
        if (avgDelay >= 2) score -= 1;
        else if (avgDelay <= 0.3) score += 1;
        
        score = Math.max(1, Math.min(10, score));
        
        var scoreEl = document.getElementById("detectionScore");
        var barEl = document.getElementById("scoreBarFill");
        var descEl = document.getElementById("scoreDescription");
        
        if (scoreEl) scoreEl.textContent = score;
        if (barEl) {
            barEl.style.width = (score * 10) + "%";
            barEl.classList.remove("low", "medium", "high");
            if (score <= 3) barEl.classList.add("low");
            else if (score <= 6) barEl.classList.add("medium");
            else barEl.classList.add("high");
        }
        if (descEl) {
            if (score <= 2) descEl.textContent = "Very Safe";
            else if (score <= 4) descEl.textContent = "Safe";
            else if (score <= 6) descEl.textContent = "Moderate";
            else if (score <= 8) descEl.textContent = "Risky";
            else descEl.textContent = "Very Risky";
        }
        
        myFunctions.updateEloEstimate();
    };
    myFunctions.updateEloEstimate = function() {
        var depth = myVars.lastValue || 3;
        var blunderRate = myVars.blunderRate !== undefined ? myVars.blunderRate : 0.7;
        
        var skillFactor = (depth / 21) * (1 - blunderRate);
        
        var elo = Math.round(400 + (skillFactor * 2400));
        
        if (myVars.useBestMove) {
            elo = 2800;
        }
        
        elo = Math.max(400, Math.min(3200, elo));
        
        var eloEl = document.getElementById("eloValue");
        var barEl = document.getElementById("eloBarFill");
        var descEl = document.getElementById("eloDescription");
        
        if (eloEl) eloEl.textContent = elo;
        if (barEl) {
            var percentage = ((elo - 400) / 2800) * 100;
            barEl.style.width = percentage + "%";
        }
        if (descEl) {
            if (elo < 800) descEl.textContent = "Beginner";
            else if (elo < 1000) descEl.textContent = "Novice";
            else if (elo < 1200) descEl.textContent = "Amateur";
            else if (elo < 1400) descEl.textContent = "Intermediate";
            else if (elo < 1600) descEl.textContent = "Club Player";
            else if (elo < 1800) descEl.textContent = "Tournament Player";
            else if (elo < 2000) descEl.textContent = "Expert";
            else if (elo < 2200) descEl.textContent = "Candidate Master";
            else if (elo < 2400) descEl.textContent = "Master";
            else if (elo < 2600) descEl.textContent = "International Master";
            else descEl.textContent = "Grandmaster";
        }
    };
    myFunctions.initDraggable = function() {
        var panel = document.getElementById("settingsContainer");
        var header = panel.querySelector(".client-header");
        var isDragging = false;
        var offsetX = 0;
        var offsetY = 0;
        
        header.addEventListener("mousedown", function(e) {
            if (e.target.closest(".toggle") || e.target.closest("input") || e.target.closest("button")) return;
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            panel.style.transition = "none";
        });
        
        document.addEventListener("mousemove", function(e) {
            if (!isDragging) return;
            var newX = e.clientX - offsetX;
            var newY = e.clientY - offsetY;
            
            newX = Math.max(0, Math.min(newX, window.innerWidth - panel.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - panel.offsetHeight));
            
            panel.style.left = newX + "px";
            panel.style.top = newY + "px";
            panel.style.right = "auto";
        });
        
        document.addEventListener("mouseup", function() {
            isDragging = false;
            panel.style.transition = "";
        });
    };
    function applySettingsToUI(myVars2) {
        $("#autoMove").prop("checked", myVars2.autoMove);
        $("#useBestMove").prop("checked", myVars2.useBestMove);
        $("#adaptToRating").prop("checked", myVars2.adaptToRating !== void 0 ? myVars2.adaptToRating : true);
        $("#useOpeningBook").prop("checked", myVars2.useOpeningBook !== void 0 ? myVars2.useOpeningBook : true);
        $("#randomizeTiming").prop("checked", myVars2.randomizeTiming !== void 0 ? myVars2.randomizeTiming : true);
        
        var useBestMoveRow = document.getElementById("useBestMoveRow");
        var useBestMoveInput = document.getElementById("useBestMove");
        if (myVars2.autoMove) {
            useBestMoveRow.style.opacity = "1";
            useBestMoveRow.style.pointerEvents = "auto";
            useBestMoveInput.disabled = false;
        } else {
            useBestMoveRow.style.opacity = "0.5";
            useBestMoveRow.style.pointerEvents = "none";
            useBestMoveInput.disabled = true;
        }
        
        $("#depthSlider").val(myVars2.lastValue);
        $("#depthValue").text(myVars2.lastValue);
        $("#depthText").html("Current Depth: <strong>" + myVars2.lastValue + "</strong>");
        $("#timeDelayMin").val(GM_getValue("timeDelayMin", 0.1));
        $("#timeDelayMax").val(GM_getValue("timeDelayMax", 1));
        if (myVars2.bestMoveColor) {
            $("#bestMoveColor").val(myVars2.bestMoveColor);
        }
        if (myVars2.humanMoveColor) {
            $("#humanMoveColor").val(myVars2.humanMoveColor);
        }
        if (myVars2.playStyle) {
            const aggressiveValue = Math.round((myVars2.playStyle.aggressive - 0.3) / 0.5 * 10);
            $("#aggressiveSlider").val(aggressiveValue);
            $("#aggressiveValue").text(aggressiveValue);
            const defensiveValue = Math.round((myVars2.playStyle.defensive - 0.3) / 0.5 * 10);
            $("#defensiveSlider").val(defensiveValue);
            $("#defensiveValue").text(defensiveValue);
            const tacticalValue = Math.round((myVars2.playStyle.tactical - 0.2) / 0.6 * 10);
            $("#tacticalSlider").val(tacticalValue);
            $("#tacticalValue").text(tacticalValue);
            const positionalValue = Math.round((myVars2.playStyle.positional - 0.2) / 0.6 * 10);
            $("#positionalSlider").val(positionalValue);
            $("#positionalValue").text(positionalValue);
        }
        if (myVars2.blunderRate !== void 0) {
            const blunderValue = Math.round(myVars2.blunderRate * 10);
            $("#blunderRateSlider").val(blunderValue);
            $("#blunderRateValue").text(blunderValue);
        }
        if (myVars2.mouseMovementRealism !== void 0) {
            const movementValue = Math.round(myVars2.mouseMovementRealism * 10);
            $("#mouseMovementSlider").val(movementValue);
            $("#mouseMovementSliderValue").text(movementValue);
        }
        if (myVars2.preferredOpenings && myVars2.preferredOpenings.length === 1) {
            $("#preferredOpeningSelect").val(myVars2.preferredOpenings[0]);
        }
    }
    return myFunctions;
}
