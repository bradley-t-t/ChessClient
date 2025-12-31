function setupUIEventHandlers(myVars, myFunctions) {
    function eloToDepthAndBlunder(elo) {
        var depth, blunderRate;

        if (elo < 800) {
            depth = Math.round(3 + (elo - 400) / 400 * 2);
            blunderRate = 0.8 - (elo - 400) / 400 * 0.3;
        } else if (elo < 1200) {
            depth = Math.round(5 + (elo - 800) / 400 * 3);
            blunderRate = 0.5 - (elo - 800) / 400 * 0.2;
        } else if (elo < 1600) {
            depth = Math.round(8 + (elo - 1200) / 400 * 3);
            blunderRate = 0.3 - (elo - 1200) / 400 * 0.15;
        } else if (elo < 2000) {
            depth = Math.round(11 + (elo - 1600) / 400 * 3);
            blunderRate = 0.15 - (elo - 1600) / 400 * 0.1;
        } else if (elo < 2400) {
            depth = Math.round(14 + (elo - 2000) / 400 * 3);
            blunderRate = 0.05 - (elo - 2000) / 400 * 0.03;
        } else {
            depth = Math.round(17 + (elo - 2400) / 1000 * 4);
            blunderRate = 0.02 - (elo - 2400) / 1000 * 0.02;
        }

        depth = Math.max(1, Math.min(21, depth));
        blunderRate = Math.max(0, Math.min(1, blunderRate));

        return {depth: depth, blunderRate: blunderRate};
    }

    $(document).on("input", "#targetEloSlider", function () {
        const elo = parseInt($(this).val());
        $("#targetEloValue").text(elo);
        myVars.targetElo = elo;

        const config = eloToDepthAndBlunder(elo);
        myVars.lastValue = config.depth;
        myVars.blunderRate = config.blunderRate;

        const eloDesc = $("#eloDescription");
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

        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
        myFunctions.reloadChessEngine();
    });

    $(document).on("click", "#decreaseElo", function () {
        const currentElo = parseInt($("#targetEloSlider").val());
        if (currentElo > 400) {
            const newElo = currentElo - 50;
            $("#targetEloSlider").val(newElo).trigger("input");
        }
    });

    $(document).on("click", "#increaseElo", function () {
        const currentElo = parseInt($("#targetEloSlider").val());
        if (currentElo < 3400) {
            const newElo = currentElo + 50;
            $("#targetEloSlider").val(newElo).trigger("input");
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
    const speedLabels = ["", "Slowest", "Very Slow", "Slow", "Medium", "Fast", "Very Fast", "Fastest"];

    $(document).on("change", "#highlightHangingPieces", function () {
        myVars.highlightHangingPieces = $(this).prop("checked");
        var colorContainer = $("#hangingPiecesColors");
        if (myVars.highlightHangingPieces) {
            colorContainer.show();
            if (myFunctions.updateHangingPieces) {
                myFunctions.updateHangingPieces();
            }
        } else {
            colorContainer.hide();
            if (myFunctions.clearHangingHighlights) {
                myFunctions.clearHangingHighlights();
            }
        }
        myFunctions.saveSettings();
    });

    $(document).on("input", "#ownHangingColor", function () {
        myVars.ownHangingColor = $(this).val();
        myFunctions.saveSettings();
        if (myVars.highlightHangingPieces && myFunctions.updateHangingPieces) {
            myFunctions.updateHangingPieces();
        }
    });

    $(document).on("input", "#enemyHangingColor", function () {
        myVars.enemyHangingColor = $(this).val();
        myFunctions.saveSettings();
        if (myVars.highlightHangingPieces && myFunctions.updateHangingPieces) {
            myFunctions.updateHangingPieces();
        }
    });

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
        if (currentSpeed < 7) {
            $("#moveSpeedSlider").val(currentSpeed + 1).trigger("input");
        }
    });

    $(document).on("change", "#timeAffectedSpeed", function () {
        myVars.timeAffectedSpeed = $(this).prop("checked");
        var speedContainer = $("#speedSliderContainer");
        if (myVars.timeAffectedSpeed) {
            speedContainer.hide();
        } else {
            speedContainer.show();
        }
        myFunctions.saveSettings();
        myFunctions.updateDetectionScore();
    });

    $(document).on("change", "#consoleLogEnabled", function () {
        myVars.consoleLogEnabled = $(this).prop("checked");
        myFunctions.saveSettings();
        var container = document.getElementById('notificationContainer');
        if (container) {
            if (myVars.consoleLogEnabled) {
                container.classList.add('visible');
            } else {
                container.classList.remove('visible');
            }
        }
    });

    $(document).on("click", "#resetDefaults", function () {
        myVars.autoMove = false;
        myVars.targetElo = 1500;
        myVars.bestMoveColor = "#87ceeb";
        myVars.intermediateMoveColor = "#ffdab9";
        myVars.moveSpeedTier = 4;
        myVars.timeAffectedSpeed = false;
        myVars.highlightHangingPieces = false;
        myVars.ownHangingColor = "#ff4444";
        myVars.enemyHangingColor = "#44ff44";

        $("#autoMove").prop("checked", myVars.autoMove);
        $("#targetEloSlider").val(myVars.targetElo).trigger("input");
        $("#bestMoveColor").val(myVars.bestMoveColor);
        $("#intermediateMoveColor").val(myVars.intermediateMoveColor);
        $("#moveSpeedSlider").val(myVars.moveSpeedTier).trigger("input");
        $("#timeAffectedSpeed").prop("checked", myVars.timeAffectedSpeed).trigger("change");
        $("#highlightHangingPieces").prop("checked", myVars.highlightHangingPieces).trigger("change");
        $("#ownHangingColor").val(myVars.ownHangingColor);
        $("#enemyHangingColor").val(myVars.enemyHangingColor);

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