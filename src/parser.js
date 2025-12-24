function setupParser(myVars, myFunctions) {
    myFunctions.parser = function(e) {
        if (e.data.includes("bestmove")) {
            var bestMove = e.data.split(" ")[1];
            console.log("Engine returned move: " + bestMove);
            myFunctions.displayRecommendedMove(bestMove);
            window.isThinking = false;
            myFunctions.spinner();
        }
    };
}
