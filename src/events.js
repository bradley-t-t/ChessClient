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
        if (currentDepth < 21) {
            const newDepth = currentDepth + 1;
            $("#depthSlider").val(newDepth).trigger("input");
        }
    });
    $(document).on("input", "#blunderRateSlider", function () {
        const value = parseInt($(this).val());
        $("#blunderRateValue").text(value);
        myVars.blunderRate = parseFloat(value) / 10;
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
    $(document).on("click", "#decreaseBlunder", function () {
        const currentVal = parseInt($("#blunderRateSlider").val());
        if (currentVal > 0) {
            const newVal = currentVal - 1;
            $("#blunderRateSlider").val(newVal).trigger("input");
        }
    });
    $(document).on("click", "#increaseBlunder", function () {
        const currentVal = parseInt($("#blunderRateSlider").val());
        if (currentVal < 10) {
            const newVal = currentVal + 1;
            $("#blunderRateSlider").val(newVal).trigger("input");
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
    $(document).on("change", "#autoMove", function () {
        myVars.autoMove = $(this).prop("checked");
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
    $(document).on("input", "#bestMoveColor", function () {
        myVars.bestMoveColor = $(this).val();
        myFunctions.saveSettings();
    });
    $(document).on("input", "#intermediateMoveColor", function () {
        myVars.intermediateMoveColor = $(this).val();
        myFunctions.saveSettings();
    });
}

function setupAdvancedEventHandlers(myVars, myFunctions) {
    $(document).on("change", "#timeDelayMin, #timeDelayMax", function () {
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
    $(document).on("click", "#resetDefaults", function () {
        // Reset to specified defaults
        myVars.lastValue = 7;
        myVars.blunderRate = 0.1; // 1 on the 0-10 scale = 0.1
        myVars.autoMove = false;
        myVars.bestMoveColor = "#87ceeb"; // light blue
        myVars.intermediateMoveColor = "#ffdab9"; // light orange/peach
        
        // Update UI elements
        $("#depthSlider").val(7);
        $("#depthValue").text(7);
        $("#depthText").html("Current Depth: <strong>7</strong>");
        
        $("#blunderRateSlider").val(1);
        $("#blunderRateValue").text(1);
        
        $("#autoMove").prop("checked", false);
        
        $("#bestMoveColor").val("#87ceeb");
        $("#intermediateMoveColor").val("#ffdab9");
        
        // Reset delay values to defaults
        $("#timeDelayMin").val(0.1);
        $("#timeDelayMax").val(1);
        
        // Save settings and update UI
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
        myFunctions.updateEloEstimate();
    });
}

function setupEventHandlers(myVars, myFunctions, engine) {
    $(document).ready(function () {
        setupUIEventHandlers(myVars, myFunctions);
        setupStyleEventHandlers(myVars, myFunctions);
        setupAdvancedEventHandlers(myVars, myFunctions);
    });
}