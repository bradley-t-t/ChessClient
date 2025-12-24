function setupUIEventHandlers(myVars, myFunctions) {
    $(document).on("input", "#depthSlider", function () {
        const depth = parseInt($(this).val());
        $("#depthValue").text(depth);
        myVars.lastValue = depth;
        $("#depthText")[0].innerHTML = "Current Depth: <strong>" + depth + "</strong>";
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
    $(document).on("click", "#decreaseDepth", function () {
        const currentDepth = parseInt($("#depthSlider").val());
        if (currentDepth > 1) {
            const newDepth = currentDepth - 1;
            $("#depthSlider").val(newDepth).trigger("input");
        }
    });
    $(document).on("click", "#increaseDepth", function () {
        const currentDepth = parseInt($("#depthSlider").val());
        if (currentDepth < 26) {
            const newDepth = currentDepth + 1;
            $("#depthSlider").val(newDepth).trigger("input");
        }
    });
    $(document).on("click", ".tab-btn", function () {
        $(".tab-btn").removeClass("active");
        $(this).addClass("active");
        const tabId = $(this).data("tab");
        $(".tab-panel").removeClass("active");
        $(`#${tabId}`).addClass("active");
    });
}

function setupStyleEventHandlers(myVars, myFunctions) {
    $(document).on("input", "#aggressiveSlider, #defensiveSlider, #tacticalSlider, #positionalSlider, #blunderRateSlider", function () {
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
    $(document).on("change", "#autoMove", function () {
        myVars.autoMove = $(this).prop("checked");
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
    $(document).on("change", "#adaptToRating, #useOpeningBook, #randomizeTiming", function () {
        const id = $(this).attr("id");
        myVars[id] = $(this).prop("checked");
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
    $(document).on("input", "#bestMoveColor", function () {
        myVars.bestMoveColor = $(this).val();
        myFunctions.saveSettings();
    });
}

function setupAdvancedEventHandlers(myVars, myFunctions) {
    $(document).on("change", "#preferredOpeningSelect", function () {
        const selectedOpening = $(this).val();
        if (selectedOpening === "random") {
            myVars.preferredOpenings = ["e4", "d4", "c4", "Nf3"].sort(() => Math.random() - 0.5);
        } else {
            myVars.preferredOpenings = [selectedOpening];
        }
        myFunctions.saveSettings();
    });
    $(document).on("change", "#timeDelayMin, #timeDelayMax", function () {
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
}

function setupEventHandlers(myVars, myFunctions, engine) {
    $(document).ready(function () {
        setupUIEventHandlers(myVars, myFunctions);
        setupStyleEventHandlers(myVars, myFunctions);
        setupAdvancedEventHandlers(myVars, myFunctions);
    });
}
