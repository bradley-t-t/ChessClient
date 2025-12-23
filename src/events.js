function setupUIEventHandlers(myVars, myFunctions) {
    $(document).on("input", "#depthSlider", function() {
        const depth = parseInt($(this).val());
        $("#depthValue").text(depth);
        myVars.lastValue = depth;
        $("#depthText")[0].innerHTML = "Current Depth: <strong>" + depth + "</strong>";
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
    $(document).on("click", "#decreaseDepth", function() {
        const currentDepth = parseInt($("#depthSlider").val());
        if (currentDepth > 1) {
            const newDepth = currentDepth - 1;
            $("#depthSlider").val(newDepth).trigger("input");
        }
    });
    $(document).on("click", "#increaseDepth", function() {
        const currentDepth = parseInt($("#depthSlider").val());
        if (currentDepth < 26) {
            const newDepth = currentDepth + 1;
            $("#depthSlider").val(newDepth).trigger("input");
        }
    });
    $(document).on("click", ".tab-btn", function() {
        $(".tab-btn").removeClass("active");
        $(this).addClass("active");
        const tabId = $(this).data("tab");
        $(".tab-panel").removeClass("active");
        $(`#${tabId}`).addClass("active");
    });
}

function setupStyleEventHandlers(myVars, myFunctions) {
    $(document).on("input", "#aggressiveSlider, #defensiveSlider, #tacticalSlider, #positionalSlider, #blunderRateSlider", function() {
        const value = $(this).val();
        const styleType = this.id.replace("Slider", "");
        $(`#${styleType}Value`).text(value);
        if (styleType === "blunderRate") {
            myVars.blunderRate = parseFloat(value) / 10;
        } else if (myVars.playStyle && styleType in myVars.playStyle) {
            if (styleType === "aggressive" || styleType === "defensive") {
                myVars.playStyle[styleType] = 0.3 + parseFloat(value) / 10 * 0.5;
            } else {
                myVars.playStyle[styleType] = 0.2 + parseFloat(value) / 10 * 0.6;
            }
        }
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
    $(document).on("change", "#autoMove", function() {
        myVars.autoMove = $(this).prop("checked");
        var useBestMoveRow = document.getElementById("useBestMoveRow");
        var useBestMoveInput = document.getElementById("useBestMove");
        if (myVars.autoMove) {
            useBestMoveRow.style.opacity = "1";
            useBestMoveRow.style.pointerEvents = "auto";
            useBestMoveInput.disabled = false;
        } else {
            useBestMoveRow.style.opacity = "0.5";
            useBestMoveRow.style.pointerEvents = "none";
            useBestMoveInput.disabled = true;
            useBestMoveInput.checked = false;
            myVars.useBestMove = false;
        }
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
    $(document).on("change", "#useBestMove, #adaptToRating, #useOpeningBook, #randomizeTiming", function() {
        const id = $(this).attr("id");
        myVars[id] = $(this).prop("checked");
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
    $(document).on("input", "#bestMoveColor", function() {
        myVars.bestMoveColor = $(this).val();
        myFunctions.saveSettings();
    });
    $(document).on("input", "#humanMoveColor", function() {
        myVars.humanMoveColor = $(this).val();
        myFunctions.saveSettings();
    });
}

function setupAdvancedEventHandlers(myVars, myFunctions) {
    $(document).on("change", "#preferredOpeningSelect", function() {
        const selectedOpening = $(this).val();
        if (selectedOpening === "random") {
            myVars.preferredOpenings = ["e4", "d4", "c4", "Nf3"].sort(() => Math.random() - 0.5);
        } else {
            myVars.preferredOpenings = [selectedOpening];
        }
        myFunctions.saveSettings();
    });
    $(document).on("input", "#mouseMovementSlider", function() {
        const value = $(this).val();
        $("#mouseMovementSliderValue").text(value);
        myVars.mouseMovementRealism = parseFloat(value) / 10;
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
    $(document).on("change", "#playingProfileSelect", function() {
        const profile = $(this).val();
        if (profile !== "custom") {
            switch (profile) {
                case "beginner":
                    $("#depthSlider").val(3).trigger("input");
                    $("#blunderRateSlider").val(7).trigger("input");
                    $("#aggressiveSlider").val(Math.floor(3 + Math.random() * 5)).trigger("input");
                    $("#tacticalSlider").val(3).trigger("input");
                    break;
                case "intermediate":
                    $("#depthSlider").val(6).trigger("input");
                    $("#blunderRateSlider").val(5).trigger("input");
                    $("#tacticalSlider").val(5).trigger("input");
                    break;
                case "advanced":
                    $("#depthSlider").val(9).trigger("input");
                    $("#blunderRateSlider").val(3).trigger("input");
                    $("#tacticalSlider").val(7).trigger("input");
                    break;
                case "expert":
                    $("#depthSlider").val(12).trigger("input");
                    $("#blunderRateSlider").val(2).trigger("input");
                    $("#tacticalSlider").val(8).trigger("input");
                    $("#positionalSlider").val(8).trigger("input");
                    break;
                case "master":
                    $("#depthSlider").val(15).trigger("input");
                    $("#blunderRateSlider").val(1).trigger("input");
                    $("#tacticalSlider").val(9).trigger("input");
                    $("#positionalSlider").val(9).trigger("input");
                    break;
            }
            setTimeout(myFunctions.saveSettings, 100);
        }
    });
    $(document).on("change", "#timeDelayMin, #timeDelayMax", function() {
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
}

function setupEventHandlers(myVars, myFunctions, engine) {
    $(document).ready(function() {
        setupUIEventHandlers(myVars, myFunctions);
        setupStyleEventHandlers(myVars, myFunctions);
        setupAdvancedEventHandlers(myVars, myFunctions);
    });
}
