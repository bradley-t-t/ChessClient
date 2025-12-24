function initializeVariables() {
    const myVars = {
        autoMovePiece: false,
        autoRun: false,
        delay: 0.1,
        loaded: false,
        onGamePage: false,
        lastValue: 3,
        blunderRate: 0.2,
        preferredOpenings: [
            "e4",
            "d4",
            "c4",
            "Nf3"
        ].sort(() => Math.random() - 0.5)
    };
    return myVars;
}
