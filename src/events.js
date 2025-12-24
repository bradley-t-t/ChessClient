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
}

function setupEventHandlers(myVars, myFunctions, engine) {
    $(document).ready(function () {
        setupUIEventHandlers(myVars, myFunctions);
        setupStyleEventHandlers(myVars, myFunctions);
        setupAdvancedEventHandlers(myVars, myFunctions);
    });
}