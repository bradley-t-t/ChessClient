function setupUIEventHandlers(myVars, myFunctions) {
    $(document).on("input", "#depthSlider", function () {
        const depth = parseInt($(this).val());
        $("#depthValue").text(depth);
        myVars.lastValue = depth;
        $("#depthText")[0].innerHTML = "Current Depth: <strong>" + depth + "</strong>";
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
        myFunctions.reloadChessEngine();
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
    const speedLabels = ["", "Fastest", "Fast", "Slow", "Slowest"];
    
    $(document).on("input", "#moveSpeedSlider", function () {
        const speed = parseInt($(this).val());
        $("#moveSpeedValue").text(speedLabels[speed]);
        myVars.moveSpeedTier = speed;
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
    
    $(document).on("click", "#decreaseSpeed", function () {
        const currentSpeed = parseInt($("#moveSpeedSlider").val());
        if (currentSpeed > 1) {
            $("#moveSpeedSlider").val(currentSpeed - 1).trigger("input");
        }
    });
    
    $(document).on("click", "#increaseSpeed", function () {
        const currentSpeed = parseInt($("#moveSpeedSlider").val());
        if (currentSpeed < 4) {
            $("#moveSpeedSlider").val(currentSpeed + 1).trigger("input");
        }
    });
    
    $(document).on("change", "#timeAffectedSpeed", function () {
        myVars.timeAffectedSpeed = $(this).prop("checked");
        const speedContainer = $("#speedSliderContainer");
        if (myVars.timeAffectedSpeed) {
            speedContainer.hide();
        } else {
            speedContainer.show();
        }
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });
    
    $(document).on("click", "#resetDefaults", function () {
        myVars.autoMove = false;
        myVars.lastValue = 7;
        myVars.blunderRate = 0.1;
        myVars.bestMoveColor = "#87ceeb";
        myVars.intermediateMoveColor = "#ffdab9";
        myVars.moveSpeedTier = 2;
        myVars.timeAffectedSpeed = false;

        $("#autoMove").prop("checked", myVars.autoMove);
        $("#depthSlider").val(myVars.lastValue).trigger("input");
        $("#blunderRateSlider").val(1).trigger("input");
        $("#bestMoveColor").val(myVars.bestMoveColor);
        $("#intermediateMoveColor").val(myVars.intermediateMoveColor);
        $("#moveSpeedSlider").val(myVars.moveSpeedTier).trigger("input");
        $("#timeAffectedSpeed").prop("checked", myVars.timeAffectedSpeed).trigger("change");

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