function setupUI(myVars, myFunctions) {
    myFunctions.loadEx = function() {
        if (myVars.loaded) return;
        
        const styleElement = document.createElement("style");
        styleElement.textContent = mainStyles;
        document.head.appendChild(styleElement);
        
        $("body").append(mainTemplate);
        
        const board = $("chess-board")[0] || $("wc-chess-board")[0];
        if (!board || !board.game) return;
        
        window.board = board;
        
        $("#forkColor").val(myVars.forkColor);
        $("#skewerColor").val(myVars.skewerColor);
        $("#pinColor").val(myVars.pinColor);
        $("#discoveredAttackColor").val(myVars.discoveredAttackColor);
        
        $("#versionText").text("v" + currentVersion);
        
        myVars.loaded = true;
    };
    
    myFunctions.checkPageStatus = function() {
        const board = $("chess-board")[0] || $("wc-chess-board")[0];
        const pageStatus = document.getElementById("pageStatus");
        const clientBody = document.querySelector(".client-body");

        if (board && board.game) {
            if (pageStatus) pageStatus.classList.remove("visible");
            if (clientBody) clientBody.classList.remove("hidden");
            myVars.onGamePage = true;
        } else {
            if (pageStatus) pageStatus.classList.add("visible");
            if (clientBody) clientBody.classList.add("hidden");
            myVars.onGamePage = false;
        }
    };
}
