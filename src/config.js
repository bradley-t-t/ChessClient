var currentVersion = "1.0.1.1";

function getRandomTacticalStrength() {
    const strengths = [
        "fork",
        "pin",
        "skewer",
        "discovery",
        "zwischenzug",
        "removing-defender",
        "attraction"
    ];
    return strengths[Math.floor(Math.random() * strengths.length)];
}

function getRandomTacticalWeakness() {
    const weaknesses = [
        "long-calculation",
        "quiet-moves",
        "backward-moves",
        "zugzwang",
        "prophylaxis",
        "piece-coordination"
    ];
    return weaknesses[Math.floor(Math.random() * weaknesses.length)];
}
