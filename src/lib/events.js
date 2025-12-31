function setupEventHandlers(myVars, myFunctions) {
    $(document).on("click", ".tab-btn", function() {
        $(".tab-btn").removeClass("active");
        $(this).addClass("active");
        
        const tabName = $(this).data("tab");
        $(".tab-panel").removeClass("active");
        $("#" + tabName).addClass("active");
    });
    
    $(document).on("input", "#forkColor", function() {
        myVars.forkColor = $(this).val();
        myFunctions.saveSettings();
        myFunctions.analyzeTactics();
    });
    
    $(document).on("input", "#skewerColor", function() {
        myVars.skewerColor = $(this).val();
        myFunctions.saveSettings();
        myFunctions.analyzeTactics();
    });
    
    $(document).on("input", "#pinColor", function() {
        myVars.pinColor = $(this).val();
        myFunctions.saveSettings();
        myFunctions.analyzeTactics();
    });
    
    $(document).on("input", "#discoveredAttackColor", function() {
        myVars.discoveredAttackColor = $(this).val();
        myFunctions.saveSettings();
        myFunctions.analyzeTactics();
    });
    
    $(document).on("keydown", function(e) {
        if (e.key === "Escape") {
            const chessClient = $(".chess-client");
            
            if (chessClient.hasClass("minimized")) {
                chessClient.removeClass("minimized");
            } else {
                chessClient.addClass("minimized");
            }
        }
    });
}
