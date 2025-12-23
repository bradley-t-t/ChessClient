function initializeVariables() {
    const myVars = {
        autoMovePiece: false,
        autoRun: false,
        delay: 0.1,
        loaded: false,
        onGamePage: false,
        lastValue: 3,
        blunderRate: 0.7,
        playStyle: {
            aggressive: 0.4,
            defensive: 0.4,
            tactical: 0.3,
            positional: 0.3
        },
        preferredOpenings: [
            "e4",
            "d4",
            "c4",
            "Nf3"
        ].sort(() => Math.random() - 0.5),
        playerFingerprint: GM_getValue("playerFingerprint", {
            favoredPieces: Math.random() < 0.5 ? "knights" : "bishops",
            openingTempo: Math.random() * 0.5 + 0.5,
            tacticalAwareness: Math.random() * 0.4 + 0.6,
            exchangeThreshold: Math.random() * 0.3 + 0.1,
            attackingStyle: ["kingside", "queenside", "central"][Math.floor(Math.random() * 3)]
        }),
        tacticalProfile: GM_getValue("tacticalProfile", {
            strengths: [
                getRandomTacticalStrength(),
                getRandomTacticalStrength()
            ],
            weaknesses: [
                getRandomTacticalWeakness(),
                getRandomTacticalWeakness()
            ]
        }),
        psychologicalState: {
            confidence: 0.7 + Math.random() * 0.3,
            tiltFactor: 0,
            focus: 0.8 + Math.random() * 0.2,
            playTime: 0
        }
    };
    if (!GM_getValue("playerFingerprint")) {
        GM_setValue("playerFingerprint", myVars.playerFingerprint);
    }
    if (!GM_getValue("tacticalProfile")) {
        GM_setValue("tacticalProfile", myVars.tacticalProfile);
    }
    return myVars;
}
