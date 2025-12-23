// ==UserScript==
// @name         Chess Client by Trent
// @namespace    chess-client-trent
// @version      1.0.0
// @description  Chess.com assistant with move suggestions and customizable features
// @author       Trent
// @match       https://www.chess.com/play/*
// @match       https://www.chess.com/game/*
// @match       https://www.chess.com/puzzles/*
// @match       https://www.chess.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @resource    stockfish.js        https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/config.js
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/variables.js
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/engine.js
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/html.js
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/styles.js
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/ui.js
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/events.js
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/parser.js
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/utilities.js
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/main.js
// @run-at      document-start
// ==/UserScript==
(() => {
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

    // variables.js
    function initializeVariables() {
        const myVars = {
            autoMovePiece: false,
            autoRun: false,
            delay: 0.1,
            loaded: false,
            onGamePage: false,
            lastValue: 11,
            playStyle: {
                aggressive: Math.random() * 0.5 + 0.3,
                // 0.3-0.8 tendency for aggressive moves
                defensive: Math.random() * 0.5 + 0.3,
                // 0.3-0.8 tendency for defensive moves
                tactical: Math.random() * 0.6 + 0.2,
                // 0.2-0.8 tendency for tactical moves
                positional: Math.random() * 0.6 + 0.2
                // 0.2-0.8 tendency for positional moves
            },
            preferredOpenings: [
                "e4",
                "d4",
                "c4",
                "Nf3"
                // Just examples, could be expanded
            ].sort(() => Math.random() - 0.5),
            // Randomize the order
            playerFingerprint: GM_getValue("playerFingerprint", {
                favoredPieces: Math.random() < 0.5 ? "knights" : "bishops",
                openingTempo: Math.random() * 0.5 + 0.5,
                // 0.5-1.0 opening move speed
                tacticalAwareness: Math.random() * 0.4 + 0.6,
                // 0.6-1.0 tactical vision
                exchangeThreshold: Math.random() * 0.3 + 0.1,
                // When to accept exchanges
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
                // 0.7-1.0
                tiltFactor: 0,
                // 0-1, increases with blunders
                focus: 0.8 + Math.random() * 0.2,
                // 0.8-1.0, decreases with time
                playTime: 0
                // tracks continuous play time
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

    // engine.js
    function setupEngine(myVars, myFunctions) {
        const engine = {
            engine: null
        };
        myFunctions.loadChessEngine = function() {
            if (!engine.stockfishObjectURL) {
                engine.stockfishObjectURL = URL.createObjectURL(new Blob([GM_getResourceText("stockfish.js")], { type: "application/javascript" }));
            }
            console.log(engine.stockfishObjectURL);
            if (engine.stockfishObjectURL) {
                engine.engine = new Worker(engine.stockfishObjectURL);
                engine.engine.onmessage = (e) => {
                    myFunctions.parser(e);
                };
                engine.engine.onerror = (e) => {
                    console.log("Worker Error: " + e);
                };
                engine.engine.postMessage("ucinewgame");
            }
            console.log("loaded chess engine");
        };
        myFunctions.reloadChessEngine = function() {
            console.log(`Reloading the chess engine!`);
            engine.engine.terminate();
            window.isThinking = false;
            myFunctions.loadChessEngine();
        };
        myFunctions.runChessEngine = function(depth) {
            var adjustedDepth = myFunctions.getAdjustedDepth();
            var fen = window.board.game.getFEN();
            var positionType = myFunctions.analyzePositionType(fen);
            console.log(`Original depth: ${depth}, Adjusted for time/position: ${adjustedDepth}`);
            engine.engine.postMessage(`position fen ${fen}`);
            console.log(`updated: position fen ${fen}`);
            window.isThinking = true;
            myFunctions.spinner();
            if (depth >= 15) {
                engine.engine.postMessage(`setoption name MultiPV value 5`);
            } else {
                engine.engine.postMessage(`setoption name MultiPV value 1`);
            }
            engine.engine.postMessage(`go depth ${adjustedDepth}`);
            myVars.lastValue = depth;
        };
        myFunctions.autoRun = function(lstValue) {
            if (window.board.game.getTurn() == window.board.game.getPlayingAs()) {
                myFunctions.runChessEngine(lstValue);
            }
        };
        return engine;
    }

    // ui/html.js
    var mainTemplate = `
<div class="chess-client">
    <div class="client-header">
        <span class="client-title">Chess Client</span>
        <span class="client-author">by Trent</span>
        <div id="thinking-indicator" class="thinking-indicator">
            <span class="thinking-spinner"></span>
            <span class="thinking-text">Thinking</span>
        </div>
        <button id="minimizeBtn" class="minimize-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14"/>
            </svg>
        </button>
    </div>

    <div id="pageStatus" class="page-status">
        <div class="status-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
        </div>
        <span class="status-text">Navigate to a chess game to enable features</span>
    </div>

    <div class="client-body">
        <div class="client-tabs">
            <button class="tab-btn active" data-tab="main-settings">Main</button>
            <button class="tab-btn" data-tab="style-settings">Style</button>
            <button class="tab-btn" data-tab="advanced-settings">Advanced</button>
        </div>

        <div class="client-content">
        <div class="tab-panel active" id="main-settings">
            <div class="setting-group">
                <div class="setting-row">
                    <span class="setting-label">Depth</span>
                    <span id="depthValue" class="setting-value">11</span>
                </div>
                <div class="slider-row">
                    <button class="slider-btn" id="decreaseDepth">-</button>
                    <input type="range" id="depthSlider" min="1" max="21" value="11" class="slider">
                    <button class="slider-btn" id="increaseDepth">+</button>
                </div>
                <p id="depthText" style="display:none;">Current Depth: <strong>11</strong></p>
            </div>

            <div class="setting-group">
                <div class="toggle-row">
                    <span class="toggle-label">Auto Move</span>
                    <label class="toggle">
                        <input type="checkbox" id="autoMove" name="autoMove" class="toggle-input" value="false">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="toggle-row" id="useBestMoveRow" style="opacity: 0.5; pointer-events: none;">
                    <span class="toggle-label">Use Best Move</span>
                    <label class="toggle">
                        <input type="checkbox" id="useBestMove" name="useBestMove" class="toggle-input" value="false" disabled>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div class="setting-group">
                <div class="input-row">
                    <label for="timeDelayMin">Min Delay (s)</label>
                    <input type="number" id="timeDelayMin" name="timeDelayMin" min="0.1" value="0.1" step="0.1" class="input-field">
                </div>
                <div class="input-row">
                    <label for="timeDelayMax">Max Delay (s)</label>
                    <input type="number" id="timeDelayMax" name="timeDelayMax" min="0.1" value="1" step="0.1" class="input-field">
                </div>
            </div>
        </div>

        <div class="tab-panel" id="style-settings">
            <div class="setting-group">
                <div class="slider-group">
                    <div class="slider-header">
                        <span>Aggressive</span>
                        <span id="aggressiveValue">5</span>
                    </div>
                    <input type="range" id="aggressiveSlider" min="1" max="10" value="5" class="slider">
                </div>
                <div class="slider-group">
                    <div class="slider-header">
                        <span>Defensive</span>
                        <span id="defensiveValue">5</span>
                    </div>
                    <input type="range" id="defensiveSlider" min="1" max="10" value="5" class="slider">
                </div>
                <div class="slider-group">
                    <div class="slider-header">
                        <span>Tactical</span>
                        <span id="tacticalValue">5</span>
                    </div>
                    <input type="range" id="tacticalSlider" min="1" max="10" value="5" class="slider">
                </div>
                <div class="slider-group">
                    <div class="slider-header">
                        <span>Positional</span>
                        <span id="positionalValue">5</span>
                    </div>
                    <input type="range" id="positionalSlider" min="1" max="10" value="5" class="slider">
                </div>
                <div class="slider-group">
                    <div class="slider-header">
                        <span>Blunder Rate</span>
                        <span id="blunderRateValue">2</span>
                    </div>
                    <input type="range" id="blunderRateSlider" min="0" max="10" value="2" class="slider">
                </div>
            </div>
        </div>

        <div class="tab-panel" id="advanced-settings">
            <div class="setting-group advanced-controls">
                <div class="toggle-row">
                    <span class="toggle-label">Adapt to Rating</span>
                    <label class="toggle">
                        <input type="checkbox" id="adaptToRating" name="adaptToRating" class="toggle-input" value="true" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="toggle-row">
                    <span class="toggle-label">Opening Book</span>
                    <label class="toggle">
                        <input type="checkbox" id="useOpeningBook" name="useOpeningBook" class="toggle-input" value="true" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="input-row">
                    <label for="bestMoveColor">Best Move</label>
                    <input type="color" id="bestMoveColor" value="#5b8c5a" class="color-picker">
                </div>
                <div class="input-row">
                    <label for="humanMoveColor">Human Move</label>
                    <input type="color" id="humanMoveColor" value="#c9a227" class="color-picker">
                </div>
                <div class="input-row">
                    <label for="preferredOpeningSelect">Opening</label>
                    <select id="preferredOpeningSelect" class="select-field">
                        <option value="random">Random</option>
                        <option value="e4">e4</option>
                        <option value="d4">d4</option>
                        <option value="c4">c4</option>
                        <option value="Nf3">Nf3</option>
                    </select>
                </div>
            </div>
        </div>
        </div>

        <div class="detection-score">
            <div class="score-header">
                <span class="score-label">Detection Risk</span>
                <span id="detectionScore" class="score-value">5</span>
            </div>
            <div class="score-bar">
                <div id="scoreBarFill" class="score-bar-fill" style="width: 50%;"></div>
            </div>
            <span id="scoreDescription" class="score-description">Moderate</span>
        </div>

        <div class="elo-estimate">
            <div class="elo-header">
                <span class="elo-label">Estimated ELO</span>
                <span id="eloValue" class="elo-value">1500</span>
            </div>
            <div class="elo-bar">
                <div id="eloBarFill" class="elo-bar-fill" style="width: 50%;"></div>
            </div>
            <span id="eloDescription" class="elo-description">Intermediate</span>
        </div>

        <div class="client-footer">
            <button type="button" id="relEngBut" class="btn-primary" onclick="document.myFunctions.reloadChessEngine()">
                Reload Engine
            </button>
        </div>
    </div>
</div>`;
    var advancedSettingsTemplate = `
<div class="advanced-section">
    <div class="toggle-row">
        <span class="toggle-label">Randomize Timing</span>
        <label class="toggle">
            <input type="checkbox" id="randomizeTiming" name="randomizeTiming" class="toggle-input" checked>
            <span class="toggle-slider"></span>
        </label>
    </div>

    <div class="slider-group">
        <div class="slider-header">
            <span>Mouse Realism</span>
            <span id="mouseMovementSliderValue">7</span>
        </div>
        <input type="range" id="mouseMovementSlider" min="1" max="10" value="7" class="slider">
    </div>

    <div class="input-row">
        <label for="playingProfileSelect">Profile</label>
        <select id="playingProfileSelect" class="select-field">
            <option value="custom">Custom</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
            <option value="master">Master</option>
        </select>
    </div>

    <button type="button" id="resetDefaults" class="btn-reset">Reset to Defaults</button>
</div>
`;
    var spinnerTemplate = `
<div style="display:none;" id="overlay">
    <div style="
        margin: 0 auto;
        height: 40px;
        width: 40px;
        animation: rotate 0.8s infinite linear;
        border: 4px solid #89b4fa;
        border-right-color: transparent;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(137, 180, 250, 0.4);
    "></div>
</div>
`;

    // ui/styles.js
    var mainStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

#settingsContainer {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ffffff;
    color: #1a1a1a;
    border-radius: 16px;
    padding: 0;
    box-shadow: 0 4px 24px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08);
    font-family: 'Inter', -apple-system, sans-serif;
    width: 300px;
    max-width: 300px;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    border: 1px solid #e5e5e5;
    z-index: 999999;
    user-select: none;
}

#settingsContainer::-webkit-scrollbar {
    width: 6px;
}

#settingsContainer::-webkit-scrollbar-track {
    background: transparent;
}

#settingsContainer::-webkit-scrollbar-thumb {
    background: #d4d4d4;
    border-radius: 3px;
}

#settingsContainer::-webkit-scrollbar-thumb:hover {
    background: #a3a3a3;
}

#settingsContainer.minimized {
    display: none;
}

.minimized-tab {
    position: fixed;
    top: 20px;
    right: 0;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-right: none;
    border-radius: 8px 0 0 8px;
    padding: 14px 16px 14px 8px;
    cursor: pointer;
    z-index: 999999;
    box-shadow: -2px 2px 8px rgba(0,0,0,0.1);
    display: none;
    transition: transform 0.2s;
}

.minimized-tab:hover {
    transform: translateX(-4px);
}

.minimized-tab.visible {
    display: block;
}

.tab-label {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #1a1a1a;
    writing-mode: vertical-rl;
    text-orientation: mixed;
}

.chess-client {
    display: flex;
    flex-direction: column;
}

.page-status {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
    text-align: center;
    gap: 12px;
}

.page-status.visible {
    display: flex;
}

.status-icon {
    color: #9ca3af;
}

.status-text {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.4;
}

.client-body {
    display: flex;
    flex-direction: column;
}

.client-body.hidden {
    display: none;
}

.client-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 18px;
    background: #fafafa;
    border-bottom: 1px solid #ebebeb;
    cursor: move;
}

.minimize-btn {
    margin-left: auto;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: transparent;
    border: 1px solid #e0e0e0;
    color: #666666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
}

.minimize-btn:hover {
    background: #f0f0f0;
    color: #1a1a1a;
}

.client-title {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
}

.client-author {
    font-size: 12px;
    color: #888888;
    font-weight: 400;
}

.thinking-indicator {
    display: none;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    margin-right: 8px;
    padding: 4px 10px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 12px;
}

.thinking-indicator.active {
    display: flex;
}

.thinking-spinner {
    width: 12px;
    height: 12px;
    border: 2px solid #bbf7d0;
    border-top-color: #22c55e;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.thinking-text {
    font-size: 11px;
    font-weight: 600;
    color: #16a34a;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
}

.client-tabs {
    display: flex;
    background: #fafafa;
    border-bottom: 1px solid #ebebeb;
    padding: 0 12px;
}

.tab-btn {
    flex: 1;
    background: transparent;
    border: none;
    color: #888888;
    font-size: 12px;
    font-weight: 500;
    padding: 12px 8px;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 2px solid transparent;
    font-family: inherit;
}

.tab-btn:hover {
    color: #555555;
}

.tab-btn.active {
    color: #1a1a1a;
    border-bottom-color: #1a1a1a;
}

.client-content {
    padding: 16px 18px;
    background: #ffffff;
    max-height: 50vh;
    overflow-y: auto;
}

.client-content::-webkit-scrollbar {
    width: 5px;
}

.client-content::-webkit-scrollbar-track {
    background: transparent;
}

.client-content::-webkit-scrollbar-thumb {
    background: #d4d4d4;
    border-radius: 3px;
}

.client-content::-webkit-scrollbar-thumb:hover {
    background: #a3a3a3;
}

.tab-panel {
    display: none;
}

.tab-panel.active {
    display: block;
}

.setting-group {
    margin-bottom: 18px;
}

.setting-group:last-child {
    margin-bottom: 0;
}

.setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.setting-label {
    font-size: 12px;
    color: #666666;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.setting-value {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
}

.slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.slider-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #f5f5f5;
    color: #1a1a1a;
    border: 1px solid #e0e0e0;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.slider-btn:hover {
    background: #ebebeb;
    border-color: #d0d0d0;
}

.slider-btn:active {
    transform: scale(0.95);
}

.slider {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: #e8e8e8;
    border-radius: 3px;
    outline: none;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #1a1a1a;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
}

.slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #1a1a1a;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
}

.toggle-row:last-child {
    border-bottom: none;
}

.toggle-label {
    font-size: 13px;
    color: #333333;
    font-weight: 500;
}

.toggle {
    position: relative;
    width: 44px;
    height: 24px;
}

.toggle .toggle-input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #e0e0e0;
    border-radius: 24px;
    transition: 0.2s;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background: #ffffff;
    border-radius: 50%;
    transition: 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}

.toggle-input:checked + .toggle-slider {
    background: #10b981;
}

.toggle-input:checked + .toggle-slider:before {
    transform: translateX(20px);
}

.input-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}

.input-row label {
    font-size: 13px;
    color: #555555;
    font-weight: 500;
}

.input-field {
    width: 72px;
    background: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    color: #1a1a1a;
    padding: 8px 12px;
    font-size: 13px;
    font-family: inherit;
    text-align: right;
    font-weight: 500;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
    outline: none;
    border-color: #1a1a1a;
    box-shadow: 0 0 0 3px rgba(26,26,26,0.1);
}

.slider-group {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
}

.slider-group:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
}

.slider-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 13px;
}

.slider-header span:first-child {
    color: #555555;
    font-weight: 500;
}

.slider-header span:last-child {
    color: #1a1a1a;
    font-weight: 600;
    background: #f5f5f5;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.color-picker {
    width: 36px;
    height: 36px;
    padding: 0;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: none;
}

.color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
}

.color-picker::-webkit-color-swatch {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
}

.select-field {
    width: 120px;
    background: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    color: #1a1a1a;
    padding: 8px 12px;
    font-size: 13px;
    font-family: inherit;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.2s;
}

.select-field:focus {
    outline: none;
    border-color: #1a1a1a;
}

.client-footer {
    padding: 14px 18px;
    border-top: 1px solid #ebebeb;
    background: #fafafa;
}

.detection-score {
    padding: 14px 18px;
    background: #fafafa;
    border-top: 1px solid #ebebeb;
}

.score-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.score-label {
    font-size: 12px;
    font-weight: 600;
    color: #666666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.score-value {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
}

.score-bar {
    height: 6px;
    background: #e8e8e8;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 6px;
}

.score-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease, background-color 0.3s ease;
    background: #10b981;
}

.score-bar-fill.low {
    background: #10b981;
}

.score-bar-fill.medium {
    background: #f59e0b;
}

.score-bar-fill.high {
    background: #ef4444;
}

.score-description {
    font-size: 11px;
    color: #888888;
    font-weight: 500;
}

.elo-estimate {
    padding: 14px 18px;
    background: #fafafa;
    border-top: 1px solid #ebebeb;
}

.elo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.elo-label {
    font-size: 12px;
    font-weight: 600;
    color: #666666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.elo-value {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
}

.elo-bar {
    height: 6px;
    background: #e8e8e8;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 6px;
}

.elo-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease, background-color 0.3s ease;
    background: #3b82f6;
}

.elo-description {
    font-size: 11px;
    color: #888888;
    font-weight: 500;
}

.btn-primary {
    width: 100%;
    background: #1a1a1a;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
}

.btn-primary:hover {
    background: #333333;
}

.btn-primary:active {
    transform: scale(0.98);
}

.btn-reset {
    width: 100%;
    background: transparent;
    color: #888888;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 12px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 16px;
}

.btn-reset:hover {
    background: #f5f5f5;
    color: #666666;
    border-color: #d0d0d0;
}

.advanced-controls {
    display: flex;
    flex-direction: column;
    gap: 0;
}

@keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
    var advancedStyles = `
.advanced-section {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid #f0f0f0;
}

.advanced-section .toggle-row {
    border-bottom: 1px solid #f0f0f0;
}

.advanced-section .toggle-row:last-of-type {
    border-bottom: none;
}

.advanced-section .slider-group {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid #f0f0f0;
}

.advanced-section .input-row {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid #f0f0f0;
}
`;

    // ui.js
    function setupUI(myVars, myFunctions) {
        let dynamicStyles = null;
        function addAnimation(body) {
            if (!dynamicStyles) {
                dynamicStyles = document.createElement("style");
                dynamicStyles.type = "text/css";
                document.head.appendChild(dynamicStyles);
            }
            dynamicStyles.sheet.insertRule(body, dynamicStyles.length);
        }
        myFunctions.spinner = function() {
            if (window.isThinking == true) {
                $("#thinking-indicator").addClass("active");
            }
            if (window.isThinking == false) {
                $("#thinking-indicator").removeClass("active");
            }
        };
        myFunctions.highlightSquares = function(fromSq, toSq, color) {
            var board = $("chess-board")[0] || $("wc-chess-board")[0];
            if (!board) return;
            
            myFunctions.clearHighlights();
            
            var highlightColor = color || myVars.highlightColor || "#7c9a5e";
            
            var fromSquareNum = fromSq.replace(/^a/, "1").replace(/^b/, "2").replace(/^c/, "3").replace(/^d/, "4").replace(/^e/, "5").replace(/^f/, "6").replace(/^g/, "7").replace(/^h/, "8");
            var toSquareNum = toSq.replace(/^a/, "1").replace(/^b/, "2").replace(/^c/, "3").replace(/^d/, "4").replace(/^e/, "5").replace(/^f/, "6").replace(/^g/, "7").replace(/^h/, "8");
            
            var fromHighlight = document.createElement("div");
            fromHighlight.className = "chess-client-highlight from-square";
            fromHighlight.setAttribute("data-square", fromSquareNum);
            fromHighlight.style.cssText = "position: absolute; background: " + highlightColor + "; opacity: 0.5; pointer-events: none; z-index: 100; border-radius: 4px; box-shadow: inset 0 0 0 3px " + highlightColor + ";";
            
            var toHighlight = document.createElement("div");
            toHighlight.className = "chess-client-highlight to-square";
            toHighlight.setAttribute("data-square", toSquareNum);
            toHighlight.style.cssText = "position: absolute; background: " + highlightColor + "; opacity: 0.7; pointer-events: none; z-index: 100; border-radius: 4px; box-shadow: inset 0 0 0 3px " + highlightColor + ";";
            
            var boardRect = board.getBoundingClientRect();
            var squareSize = boardRect.width / 8;
            
            var isFlipped = board.classList.contains("flipped") || 
                            $(board).find(".board").hasClass("flipped") ||
                            board.getAttribute("orientation") === "black";
            
            var fromFile = parseInt(fromSquareNum[0]) - 1;
            var fromRank = 8 - parseInt(fromSquareNum[1]);
            var toFile = parseInt(toSquareNum[0]) - 1;
            var toRank = 8 - parseInt(toSquareNum[1]);
            
            if (isFlipped) {
                fromFile = 7 - fromFile;
                fromRank = 7 - fromRank;
                toFile = 7 - toFile;
                toRank = 7 - toRank;
            }
            
            fromHighlight.style.width = squareSize + "px";
            fromHighlight.style.height = squareSize + "px";
            fromHighlight.style.left = (fromFile * squareSize) + "px";
            fromHighlight.style.top = (fromRank * squareSize) + "px";
            
            toHighlight.style.width = squareSize + "px";
            toHighlight.style.height = squareSize + "px";
            toHighlight.style.left = (toFile * squareSize) + "px";
            toHighlight.style.top = (toRank * squareSize) + "px";
            
            var boardElement = $(board).find(".board")[0] || board;
            if (boardElement) {
                boardElement.style.position = "relative";
                boardElement.appendChild(fromHighlight);
                boardElement.appendChild(toHighlight);
            }
            
            setTimeout(function() {
                fromHighlight.style.transition = "opacity 0.5s ease";
                toHighlight.style.transition = "opacity 0.5s ease";
                fromHighlight.style.opacity = "0";
                toHighlight.style.opacity = "0";
                setTimeout(function() {
                    if (fromHighlight.parentNode) fromHighlight.remove();
                    if (toHighlight.parentNode) toHighlight.remove();
                }, 500);
            }, 2500);
        };
        myFunctions.clearHighlights = function() {
            var highlights = document.querySelectorAll(".chess-client-highlight");
            highlights.forEach(function(el) { el.remove(); });
        };
        myFunctions.loadEx = function() {
            try {
                window.board = $("chess-board")[0] || $("wc-chess-board")[0];
                myVars.board = window.board;
                var div = document.createElement("div");
                div.setAttribute("id", "settingsContainer");
                div.innerHTML = mainTemplate;
                div.prepend($(spinnerTemplate)[0]);
                document.body.appendChild(div);
                
                var minimizedTab = document.createElement("div");
                minimizedTab.setAttribute("id", "minimizedTab");
                minimizedTab.className = "minimized-tab";
                minimizedTab.innerHTML = '<span class="tab-label">Chess Client</span>';
                document.body.appendChild(minimizedTab);
                
                var botStyles = document.createElement("style");
                botStyles.innerHTML = mainStyles + advancedStyles;
                document.head.appendChild(botStyles);
                addAnimation(`@keyframes rotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }`);
                $("#advanced-settings .advanced-controls").append(advancedSettingsTemplate);
                myFunctions.loadSettings();
                applySettingsToUI(myVars);
                
                myFunctions.initDraggable();
                myFunctions.initMinimize();
                myFunctions.updateDetectionScore();
                myFunctions.checkPageStatus();
                
                myVars.loaded = true;
            } catch (error) {
                console.log(error);
            }
        };
        myFunctions.checkPageStatus = function() {
            var board = $("chess-board")[0] || $("wc-chess-board")[0];
            var pageStatus = document.getElementById("pageStatus");
            var clientBody = document.querySelector(".client-body");
            
            if (board && board.game) {
                pageStatus.classList.remove("visible");
                clientBody.classList.remove("hidden");
                myVars.onGamePage = true;
            } else {
                pageStatus.classList.add("visible");
                clientBody.classList.add("hidden");
                myVars.onGamePage = false;
            }
        };
        myFunctions.initMinimize = function() {
            var panel = document.getElementById("settingsContainer");
            var minimizeBtn = document.getElementById("minimizeBtn");
            var minimizedTab = document.getElementById("minimizedTab");
            
            minimizeBtn.addEventListener("click", function(e) {
                e.stopPropagation();
                panel.classList.add("minimized");
                minimizedTab.classList.add("visible");
            });
            
            minimizedTab.addEventListener("click", function() {
                panel.classList.remove("minimized");
                minimizedTab.classList.remove("visible");
            });
        };
        myFunctions.updateDetectionScore = function() {
            var score = 5;
            
            var depth = myVars.lastValue || 11;
            if (depth <= 5) score -= 2;
            else if (depth <= 10) score -= 1;
            else if (depth >= 15) score += 2;
            else if (depth >= 12) score += 1;
            
            var blunderRate = myVars.blunderRate !== undefined ? myVars.blunderRate : 0.05;
            if (blunderRate >= 0.5) score -= 2;
            else if (blunderRate >= 0.3) score -= 1;
            else if (blunderRate <= 0.1) score += 1;
            else if (blunderRate <= 0.02) score += 2;
            
            if (myVars.randomizeTiming === true) score -= 1;
            else if (myVars.randomizeTiming === false) score += 1;
            
            var mouseRealism = myVars.mouseMovementRealism !== undefined ? myVars.mouseMovementRealism : 0.7;
            if (mouseRealism >= 0.8) score -= 1;
            else if (mouseRealism <= 0.3) score += 1;
            
            if (myVars.autoMove === true) score += 2;
            
            var minDelay = parseFloat($("#timeDelayMin").val()) || 0.1;
            var maxDelay = parseFloat($("#timeDelayMax").val()) || 1;
            var avgDelay = (minDelay + maxDelay) / 2;
            if (avgDelay >= 2) score -= 1;
            else if (avgDelay <= 0.3) score += 1;
            
            score = Math.max(1, Math.min(10, score));
            
            var scoreEl = document.getElementById("detectionScore");
            var barEl = document.getElementById("scoreBarFill");
            var descEl = document.getElementById("scoreDescription");
            
            if (scoreEl) scoreEl.textContent = score;
            if (barEl) {
                barEl.style.width = (score * 10) + "%";
                barEl.classList.remove("low", "medium", "high");
                if (score <= 3) barEl.classList.add("low");
                else if (score <= 6) barEl.classList.add("medium");
                else barEl.classList.add("high");
            }
            if (descEl) {
                if (score <= 2) descEl.textContent = "Very Safe";
                else if (score <= 4) descEl.textContent = "Safe";
                else if (score <= 6) descEl.textContent = "Moderate";
                else if (score <= 8) descEl.textContent = "Risky";
                else descEl.textContent = "Very Risky";
            }
            
            myFunctions.updateEloEstimate();
        };
        myFunctions.updateEloEstimate = function() {
            var elo = 800;
            
            var depth = myVars.lastValue || 11;
            elo += depth * 80;
            
            var blunderRate = myVars.blunderRate !== undefined ? myVars.blunderRate : 0.05;
            elo -= blunderRate * 1500;
            
            var playStyle = myVars.playStyle || { tactical: 0.5, positional: 0.5 };
            var tacticalBonus = (playStyle.tactical - 0.2) * 300;
            var positionalBonus = (playStyle.positional - 0.2) * 200;
            elo += tacticalBonus + positionalBonus;
            
            if (myVars.useBestMove) {
                elo += 200;
            }
            
            elo = Math.max(400, Math.min(3200, Math.round(elo)));
            
            var eloEl = document.getElementById("eloValue");
            var barEl = document.getElementById("eloBarFill");
            var descEl = document.getElementById("eloDescription");
            
            if (eloEl) eloEl.textContent = elo;
            if (barEl) {
                var percentage = ((elo - 400) / 2800) * 100;
                barEl.style.width = percentage + "%";
            }
            if (descEl) {
                if (elo < 800) descEl.textContent = "Beginner";
                else if (elo < 1000) descEl.textContent = "Novice";
                else if (elo < 1200) descEl.textContent = "Amateur";
                else if (elo < 1400) descEl.textContent = "Intermediate";
                else if (elo < 1600) descEl.textContent = "Club Player";
                else if (elo < 1800) descEl.textContent = "Tournament Player";
                else if (elo < 2000) descEl.textContent = "Expert";
                else if (elo < 2200) descEl.textContent = "Candidate Master";
                else if (elo < 2400) descEl.textContent = "Master";
                else if (elo < 2600) descEl.textContent = "International Master";
                else descEl.textContent = "Grandmaster";
            }
        };
        myFunctions.initDraggable = function() {
            var panel = document.getElementById("settingsContainer");
            var header = panel.querySelector(".client-header");
            var isDragging = false;
            var offsetX = 0;
            var offsetY = 0;
            
            header.addEventListener("mousedown", function(e) {
                if (e.target.closest(".toggle") || e.target.closest("input") || e.target.closest("button")) return;
                isDragging = true;
                offsetX = e.clientX - panel.getBoundingClientRect().left;
                offsetY = e.clientY - panel.getBoundingClientRect().top;
                panel.style.transition = "none";
            });
            
            document.addEventListener("mousemove", function(e) {
                if (!isDragging) return;
                var newX = e.clientX - offsetX;
                var newY = e.clientY - offsetY;
                
                newX = Math.max(0, Math.min(newX, window.innerWidth - panel.offsetWidth));
                newY = Math.max(0, Math.min(newY, window.innerHeight - panel.offsetHeight));
                
                panel.style.left = newX + "px";
                panel.style.top = newY + "px";
                panel.style.right = "auto";
            });
            
            document.addEventListener("mouseup", function() {
                isDragging = false;
                panel.style.transition = "";
            });
        };
        function applySettingsToUI(myVars2) {
            $("#autoMove").prop("checked", myVars2.autoMove);
            $("#useBestMove").prop("checked", myVars2.useBestMove);
            $("#adaptToRating").prop("checked", myVars2.adaptToRating !== void 0 ? myVars2.adaptToRating : true);
            $("#useOpeningBook").prop("checked", myVars2.useOpeningBook !== void 0 ? myVars2.useOpeningBook : true);
            $("#randomizeTiming").prop("checked", myVars2.randomizeTiming !== void 0 ? myVars2.randomizeTiming : true);
            
            var useBestMoveRow = document.getElementById("useBestMoveRow");
            var useBestMoveInput = document.getElementById("useBestMove");
            if (myVars2.autoMove) {
                useBestMoveRow.style.opacity = "1";
                useBestMoveRow.style.pointerEvents = "auto";
                useBestMoveInput.disabled = false;
            } else {
                useBestMoveRow.style.opacity = "0.5";
                useBestMoveRow.style.pointerEvents = "none";
                useBestMoveInput.disabled = true;
            }
            
            $("#depthSlider").val(myVars2.lastValue);
            $("#depthValue").text(myVars2.lastValue);
            $("#depthText").html("Current Depth: <strong>" + myVars2.lastValue + "</strong>");
            $("#timeDelayMin").val(GM_getValue("timeDelayMin", 0.1));
            $("#timeDelayMax").val(GM_getValue("timeDelayMax", 1));
            if (myVars2.bestMoveColor) {
                $("#bestMoveColor").val(myVars2.bestMoveColor);
            }
            if (myVars2.humanMoveColor) {
                $("#humanMoveColor").val(myVars2.humanMoveColor);
            }
            if (myVars2.playStyle) {
                const aggressiveValue = Math.round((myVars2.playStyle.aggressive - 0.3) / 0.5 * 10);
                $("#aggressiveSlider").val(aggressiveValue);
                $("#aggressiveValue").text(aggressiveValue);
                const defensiveValue = Math.round((myVars2.playStyle.defensive - 0.3) / 0.5 * 10);
                $("#defensiveSlider").val(defensiveValue);
                $("#defensiveValue").text(defensiveValue);
                const tacticalValue = Math.round((myVars2.playStyle.tactical - 0.2) / 0.6 * 10);
                $("#tacticalSlider").val(tacticalValue);
                $("#tacticalValue").text(tacticalValue);
                const positionalValue = Math.round((myVars2.playStyle.positional - 0.2) / 0.6 * 10);
                $("#positionalSlider").val(positionalValue);
                $("#positionalValue").text(positionalValue);
            }
            if (myVars2.blunderRate !== void 0) {
                const blunderValue = Math.round(myVars2.blunderRate * 10);
                $("#blunderRateSlider").val(blunderValue);
                $("#blunderRateValue").text(blunderValue);
            }
            if (myVars2.mouseMovementRealism !== void 0) {
                const movementValue = Math.round(myVars2.mouseMovementRealism * 10);
                $("#mouseMovementSlider").val(movementValue);
                $("#mouseMovementSliderValue").text(movementValue);
            }
            if (myVars2.preferredOpenings && myVars2.preferredOpenings.length === 1) {
                $("#preferredOpeningSelect").val(myVars2.preferredOpenings[0]);
            }
            console.log("Settings applied to UI");
        }
        return myFunctions;
    }

    // events/ui-events.js
    function setupUIEventHandlers(myVars, myFunctions) {
        $(document).on("input", "#depthSlider", function() {
            const depth = parseInt($(this).val());
            $("#depthValue").text(depth);
            myVars.lastValue = depth;
            $("#depthText")[0].innerHTML = "Current Depth: <strong>" + depth + "</strong>";
            myFunctions.saveSettings();
            myFunctions.updateDetectionScore();
        });
        $(document).on("click", "#decreaseDepth", function() {
            const currentDepth = parseInt($("#depthSlider").val());
            if (currentDepth > 1) {
                const newDepth = currentDepth - 1;
                $("#depthSlider").val(newDepth).trigger("input");
            }
        });
        $(document).on("click", "#increaseDepth", function() {
            const currentDepth = parseInt($("#depthSlider").val());
            if (currentDepth < 26) {
                const newDepth = currentDepth + 1;
                $("#depthSlider").val(newDepth).trigger("input");
            }
        });
        $(document).on("click", ".tab-btn", function() {
            $(".tab-btn").removeClass("active");
            $(this).addClass("active");
            const tabId = $(this).data("tab");
            $(".tab-panel").removeClass("active");
            $(`#${tabId}`).addClass("active");
        });
    }

    // events/style-events.js
    function setupStyleEventHandlers(myVars, myFunctions) {
        $(document).on("input", "#aggressiveSlider, #defensiveSlider, #tacticalSlider, #positionalSlider, #blunderRateSlider", function() {
            const value = $(this).val();
            const styleType = this.id.replace("Slider", "");
            $(`#${styleType}Value`).text(value);
            if (styleType === "blunderRate") {
                myVars.blunderRate = parseFloat(value) / 10;
            } else if (myVars.playStyle && styleType in myVars.playStyle) {
                if (styleType === "aggressive" || styleType === "defensive") {
                    myVars.playStyle[styleType] = 0.3 + parseFloat(value) / 10 * 0.5;
                } else {
                    myVars.playStyle[styleType] = 0.2 + parseFloat(value) / 10 * 0.6;
                }
            }
            myFunctions.saveSettings();
            myFunctions.updateDetectionScore();
        });
        $(document).on("change", "#autoMove", function() {
            myVars.autoMove = $(this).prop("checked");
            var useBestMoveRow = document.getElementById("useBestMoveRow");
            var useBestMoveInput = document.getElementById("useBestMove");
            if (myVars.autoMove) {
                useBestMoveRow.style.opacity = "1";
                useBestMoveRow.style.pointerEvents = "auto";
                useBestMoveInput.disabled = false;
            } else {
                useBestMoveRow.style.opacity = "0.5";
                useBestMoveRow.style.pointerEvents = "none";
                useBestMoveInput.disabled = true;
                useBestMoveInput.checked = false;
                myVars.useBestMove = false;
            }
            myFunctions.saveSettings();
            myFunctions.updateDetectionScore();
        });
        $(document).on("change", "#useBestMove, #adaptToRating, #useOpeningBook, #randomizeTiming", function() {
            const id = $(this).attr("id");
            myVars[id] = $(this).prop("checked");
            myFunctions.saveSettings();
            myFunctions.updateDetectionScore();
        });
        $(document).on("input", "#bestMoveColor", function() {
            myVars.bestMoveColor = $(this).val();
            myFunctions.saveSettings();
        });
        $(document).on("input", "#humanMoveColor", function() {
            myVars.humanMoveColor = $(this).val();
            myFunctions.saveSettings();
        });
    }

    // events/advanced-events.js
    function setupAdvancedEventHandlers(myVars, myFunctions) {
        $(document).on("change", "#preferredOpeningSelect", function() {
            const selectedOpening = $(this).val();
            if (selectedOpening === "random") {
                myVars.preferredOpenings = ["e4", "d4", "c4", "Nf3"].sort(() => Math.random() - 0.5);
            } else {
                myVars.preferredOpenings = [selectedOpening];
            }
            myFunctions.saveSettings();
        });
        $(document).on("input", "#mouseMovementSlider", function() {
            const value = $(this).val();
            $("#mouseMovementSliderValue").text(value);
            myVars.mouseMovementRealism = parseFloat(value) / 10;
            myFunctions.saveSettings();
            myFunctions.updateDetectionScore();
        });
        $(document).on("change", "#playingProfileSelect", function() {
            const profile = $(this).val();
            if (profile !== "custom") {
                switch (profile) {
                    case "beginner":
                        $("#depthSlider").val(3).trigger("input");
                        $("#blunderRateSlider").val(7).trigger("input");
                        $("#aggressiveSlider").val(Math.floor(3 + Math.random() * 5)).trigger("input");
                        $("#tacticalSlider").val(3).trigger("input");
                        break;
                    case "intermediate":
                        $("#depthSlider").val(6).trigger("input");
                        $("#blunderRateSlider").val(5).trigger("input");
                        $("#tacticalSlider").val(5).trigger("input");
                        break;
                    case "advanced":
                        $("#depthSlider").val(9).trigger("input");
                        $("#blunderRateSlider").val(3).trigger("input");
                        $("#tacticalSlider").val(7).trigger("input");
                        break;
                    case "expert":
                        $("#depthSlider").val(12).trigger("input");
                        $("#blunderRateSlider").val(2).trigger("input");
                        $("#tacticalSlider").val(8).trigger("input");
                        $("#positionalSlider").val(8).trigger("input");
                        break;
                    case "master":
                        $("#depthSlider").val(15).trigger("input");
                        $("#blunderRateSlider").val(1).trigger("input");
                        $("#tacticalSlider").val(9).trigger("input");
                        $("#positionalSlider").val(9).trigger("input");
                        break;
                }
                setTimeout(myFunctions.saveSettings, 100);
            }
        });
        $(document).on("change", "#timeDelayMin, #timeDelayMax", function() {
            myFunctions.saveSettings();
            myFunctions.updateDetectionScore();
        });
    }

    // events.js
    function setupEventHandlers(myVars, myFunctions, engine) {
        $(document).ready(function() {
            setupUIEventHandlers(myVars, myFunctions);
            setupStyleEventHandlers(myVars, myFunctions);
            setupAdvancedEventHandlers(myVars, myFunctions);
        });
    }

    // parser.js
    function setupParser(myVars, myFunctions) {
        myFunctions.parser = function(e) {
            if (e.data.includes("bestmove")) {
                const bestMove = e.data.split(" ")[1];
                let alternativeMoves = [bestMove];
                try {
                    if (e.data.includes("pv")) {
                        const lines = e.data.split("\n").filter((line) => line.includes(" pv ")).map((line) => {
                            const pvIndex = line.indexOf(" pv ");
                            return line.substring(pvIndex + 4).split(" ")[0];
                        });
                        if (lines.length > 1) {
                            alternativeMoves = [...new Set(lines)];
                        }
                    }
                } catch (error) {
                    console.log("Error extracting alternative moves", error);
                }
                
                let humanMove = myFunctions.calculateHumanMove(bestMove, alternativeMoves, e.data);
                myFunctions.displayBothMoves(bestMove, humanMove);
                window.isThinking = false;
                myFunctions.spinner();
            }
        };
        myFunctions.calculateHumanMove = function(bestMove, alternativeMoves, engineData) {
            try {
                const legalMoves = window.board.game.getLegalMoves();
                if (!legalMoves || legalMoves.length <= 1) {
                    return bestMove;
                }
                
                const blunderRate = myVars.blunderRate !== void 0 ? myVars.blunderRate : 0.2;
                const variationChance = Math.min(0.7, blunderRate + 0.3);
                
                if (Math.random() > variationChance) {
                    return bestMove;
                }
                
                const bestFrom = bestMove.substring(0, 2);
                const bestTo = bestMove.substring(2, 4);
                
                let candidateMoves = [];
                
                for (let i = 0; i < legalMoves.length; i++) {
                    const move = legalMoves[i];
                    const moveStr = move.from + move.to;
                    if (moveStr === bestMove) continue;
                    
                    let score = 0;
                    
                    if (move.from === bestFrom) {
                        score += 3;
                    }
                    
                    if (move.to === bestTo) {
                        score += 2;
                    }
                    
                    if (move.captured) {
                        score += 2;
                    }
                    
                    if (move.san && (move.san.includes("+") || move.san.includes("#"))) {
                        score += 3;
                    }
                    
                    const fromFile = move.from.charCodeAt(0) - 97;
                    const toFile = move.to.charCodeAt(0) - 97;
                    if (toFile >= 2 && toFile <= 5) {
                        score += 1;
                    }
                    
                    candidateMoves.push({ move: moveStr, score: score });
                }
                
                if (candidateMoves.length === 0) {
                    return bestMove;
                }
                
                candidateMoves.sort((a, b) => b.score - a.score);
                
                const topMoves = candidateMoves.slice(0, Math.min(5, candidateMoves.length));
                const weights = topMoves.map((m, i) => Math.pow(0.6, i));
                const totalWeight = weights.reduce((a, b) => a + b, 0);
                
                let random = Math.random() * totalWeight;
                for (let i = 0; i < topMoves.length; i++) {
                    random -= weights[i];
                    if (random <= 0) {
                        return topMoves[i].move;
                    }
                }
                
                return topMoves[0].move;
            } catch (e) {
                console.log("Error calculating human move:", e);
                return bestMove;
            }
        };
        myFunctions.getBlunderProbability = function() {
            const userBlunderRate = myVars.blunderRate !== void 0 ? myVars.blunderRate : 0.05;
            const gamePhase = myFunctions.estimateGamePhase();
            const timeRemaining = myFunctions.estimateTimeRemaining();
            const complexity = myFunctions.estimatePositionComplexity();
            let baseProb = userBlunderRate;
            if (timeRemaining < 30) {
                baseProb += 0.1 * (1 - timeRemaining / 30);
            }
            if (complexity > 0.6) {
                baseProb += 0.05 * (complexity - 0.6) * 2;
            }
            if (gamePhase > 30) {
                baseProb += 0.03 * ((gamePhase - 30) / 10);
            }
            return Math.min(0.4, baseProb * (0.7 + Math.random() * 0.6));
        };
        myFunctions.generateHumanLikeMove = function(bestMove, engineData) {
            if (engineData.includes("pv") && Math.random() < 0.4) {
                try {
                    const lines = engineData.split("\n").filter((line) => line.includes(" pv ")).map((line) => {
                        const pvIndex = line.indexOf(" pv ");
                        return line.substring(pvIndex + 4).split(" ")[0];
                    });
                    if (lines.length > 1) {
                        const moveIndex = Math.floor(Math.pow(Math.random(), 2.5) * Math.min(lines.length, 4));
                        return lines[moveIndex] || bestMove;
                    }
                } catch (e) {
                    console.log("Error extracting alternative moves", e);
                }
            }
            if (Math.random() < 0.15) {
                const fromSquare = bestMove.substring(0, 2);
                const toSquare = bestMove.substring(2, 4);
                if (Math.random() < 0.7) {
                    const files = "abcdefgh";
                    const ranks = "12345678";
                    const fromFile = fromSquare.charAt(0);
                    const fromRank = fromSquare.charAt(1);
                    const toFile = toSquare.charAt(0);
                    const toRank = toSquare.charAt(1);
                    const fileDiff = files.indexOf(toFile) - files.indexOf(fromFile);
                    const rankDiff = ranks.indexOf(toRank) - ranks.indexOf(fromRank);
                    if (Math.abs(fileDiff) > 1 || Math.abs(rankDiff) > 1) {
                        const newToFile = files[files.indexOf(fromFile) + (fileDiff > 0 ? Math.max(1, fileDiff - 1) : Math.min(-1, fileDiff + 1))];
                        const newToRank = ranks[ranks.indexOf(fromRank) + (rankDiff > 0 ? Math.max(1, rankDiff - 1) : Math.min(-1, rankDiff + 1))];
                        if (newToFile && newToRank) {
                            const alternativeMove = fromSquare + newToFile + newToRank;
                            for (let each = 0; each < window.board.game.getLegalMoves().length; each++) {
                                if (window.board.game.getLegalMoves()[each].from === fromSquare && window.board.game.getLegalMoves()[each].to === newToFile + newToRank) {
                                    return alternativeMove;
                                }
                            }
                        }
                    }
                }
            }
            return bestMove;
        };
    }

    // utilities.js
    function setupUtilities(myVars) {
        const myFunctions = {};
        let stop_b = stop_w = 0;
        let s_br = s_br2 = s_wr = s_wr2 = 0;
        let obs = "";
        setupParser(myVars, myFunctions);
        myFunctions.rescan = function(lev) {
            var ari = $("chess-board").find(".piece").map(function() {
                return this.className;
            }).get();
            jack = ari.map((f) => f.substring(f.indexOf(" ") + 1));
            function removeWord(arr, word) {
                for (var i2 = 0; i2 < arr.length; i2++) {
                    arr[i2] = arr[i2].replace(word, "");
                }
            }
            removeWord(ari, "square-");
            jack = ari.map((f) => f.substring(f.indexOf(" ") + 1));
            for (var i = 0; i < jack.length; i++) {
                jack[i] = jack[i].replace("br", "r").replace("bn", "n").replace("bb", "b").replace("bq", "q").replace("bk", "k").replace("bb", "b").replace("bn", "n").replace("br", "r").replace("bp", "p").replace("wp", "P").replace("wr", "R").replace("wn", "N").replace("wb", "B").replace("br", "R").replace("wn", "N").replace("wb", "B").replace("wq", "Q").replace("wk", "K").replace("wb", "B");
            }
            str2 = "";
            var count = 0, str = "";
            for (var j = 8; j > 0; j--) {
                for (var i = 1; i < 9; i++) {
                    (str = jack.find((el) => el.includes([i] + [j]))) ? str = str.replace(/[^a-zA-Z]+/g, "") : str = "";
                    if (str == "") {
                        count++;
                        str = count.toString();
                        if (!isNaN(str2.charAt(str2.length - 1))) str2 = str2.slice(0, -1);
                        else {
                            count = 1;
                            str = count.toString();
                        }
                    }
                    str2 += str;
                    if (i == 8) {
                        count = 0;
                        str2 += "/";
                    }
                }
            }
            str2 = str2.slice(0, -1);
            color = "";
            wk = wq = bk = bq = "0";
            const move = $("vertical-move-list").children();
            if (move.length < 2) {
                stop_b = stop_w = s_br = s_br2 = s_wr = s_wr2 = 0;
            }
            if (stop_b != 1) {
                if (move.find(".black.node:contains('K')").length) {
                    bk = "";
                    bq = "";
                    stop_b = 1;
                    console.log("debug secb");
                }
            } else {
                bq = "";
                bk = "";
            }
            if (stop_b != 1) (bk = move.find(".black.node:contains('O-O'):not(:contains('O-O-O'))").length ? "" : "k") ? bq = move.find(".black.node:contains('O-O-O')").length ? bk = "" : "q" : bq = "";
            if (s_br != 1) {
                if (move.find(".black.node:contains('R')").text().match("[abcd]+")) {
                    bq = "";
                    s_br = 1;
                }
            } else bq = "";
            if (s_br2 != 1) {
                if (move.find(".black.node:contains('R')").text().match("[hgf]+")) {
                    bk = "";
                    s_br2 = 1;
                }
            } else bk = "";
            if (stop_b == 0) {
                if (s_br == 0) {
                    if (move.find(".white.node:contains('xa8')").length > 0) {
                        bq = "";
                        s_br = 1;
                        console.log("debug b castle_r");
                    }
                }
                if (s_br2 == 0) {
                    if (move.find(".white.node:contains('xh8')").length > 0) {
                        bk = "";
                        s_br2 = 1;
                        console.log("debug b castle_l");
                    }
                }
            }
            if (stop_w != 1) {
                if (move.find(".white.node:contains('K')").length) {
                    wk = "";
                    wq = "";
                    stop_w = 1;
                    console.log("debug secw");
                }
            } else {
                wq = "";
                wk = "";
            }
            if (stop_w != 1) (wk = move.find(".white.node:contains('O-O'):not(:contains('O-O-O'))").length ? "" : "K") ? wq = move.find(".white.node:contains('O-O-O')").length ? wk = "" : "Q" : wq = "";
            if (s_wr != 1) {
                if (move.find(".white.node:contains('R')").text().match("[abcd]+")) {
                    wq = "";
                    s_wr = 1;
                }
            } else wq = "";
            if (s_wr2 != 1) {
                if (move.find(".white.node:contains('R')").text().match("[hgf]+")) {
                    wk = "";
                    s_wr2 = 1;
                }
            } else wk = "";
            if (stop_w == 0) {
                if (s_wr == 0) {
                    if (move.find(".black.node:contains('xa1')").length > 0) {
                        wq = "";
                        s_wr = 1;
                        console.log("debug w castle_l");
                    }
                }
                if (s_wr2 == 0) {
                    if (move.find(".black.node:contains('xh1')").length > 0) {
                        wk = "";
                        s_wr2 = 1;
                        console.log("debug w castle_r");
                    }
                }
            }
            if ($(".coordinates").children().first().text() == 1) {
                str2 = str2 + " b " + wk + wq + bk + bq;
                color = "white";
            } else {
                str2 = str2 + " w " + wk + wq + bk + bq;
                color = "black";
            }
            return str2;
        };
        myFunctions.displayBothMoves = function(bestMove, humanMove) {
            myFunctions.clearHighlights();
            
            var bestFrom = bestMove.substring(0, 2);
            var bestTo = bestMove.substring(2, 4);
            var humanFrom = humanMove.substring(0, 2);
            var humanTo = humanMove.substring(2, 4);
            
            var bestColor = myVars.bestMoveColor || "#5b8c5a";
            var humanColor = myVars.humanMoveColor || "#c9a227";
            
            if (bestFrom === humanFrom) {
                myFunctions.highlightSplitSquare(bestFrom, bestColor, humanColor, "from");
            } else {
                myFunctions.highlightSingleSquare(bestFrom, bestColor, 0.5);
                myFunctions.highlightSingleSquare(humanFrom, humanColor, 0.5);
            }
            
            if (bestTo === humanTo) {
                myFunctions.highlightSplitSquare(bestTo, bestColor, humanColor, "to");
            } else {
                myFunctions.highlightSingleSquare(bestTo, bestColor, 0.7);
                myFunctions.highlightSingleSquare(humanTo, humanColor, 0.7);
            }
            
            if (myVars.autoMove === true) {
                if (myVars.useBestMove) {
                    myFunctions.movePiece(bestFrom, bestTo);
                } else {
                    myFunctions.movePiece(humanFrom, humanTo);
                }
            }
        };
        myFunctions.highlightSingleSquare = function(square, color, opacity) {
            var board = $("chess-board")[0] || $("wc-chess-board")[0];
            if (!board) return;
            
            var squareNum = square.replace(/^a/, "1").replace(/^b/, "2").replace(/^c/, "3").replace(/^d/, "4").replace(/^e/, "5").replace(/^f/, "6").replace(/^g/, "7").replace(/^h/, "8");
            
            var highlight = document.createElement("div");
            highlight.className = "chess-client-highlight";
            highlight.setAttribute("data-square", squareNum);
            highlight.style.cssText = "position: absolute; background: " + color + "; opacity: " + opacity + "; pointer-events: none; z-index: 100; border-radius: 4px;";
            
            var boardRect = board.getBoundingClientRect();
            var squareSize = boardRect.width / 8;
            
            var isFlipped = board.classList.contains("flipped") || $(board).find(".board").hasClass("flipped") || board.getAttribute("orientation") === "black";
            
            var file = parseInt(squareNum[0]) - 1;
            var rank = 8 - parseInt(squareNum[1]);
            
            if (isFlipped) {
                file = 7 - file;
                rank = 7 - rank;
            }
            
            highlight.style.width = squareSize + "px";
            highlight.style.height = squareSize + "px";
            highlight.style.left = (file * squareSize) + "px";
            highlight.style.top = (rank * squareSize) + "px";
            
            var boardElement = $(board).find(".board")[0] || board;
            if (boardElement) {
                boardElement.style.position = "relative";
                boardElement.appendChild(highlight);
            }
        };
        myFunctions.highlightSplitSquare = function(square, color1, color2, type) {
            var board = $("chess-board")[0] || $("wc-chess-board")[0];
            if (!board) return;
            
            var squareNum = square.replace(/^a/, "1").replace(/^b/, "2").replace(/^c/, "3").replace(/^d/, "4").replace(/^e/, "5").replace(/^f/, "6").replace(/^g/, "7").replace(/^h/, "8");
            
            var highlight = document.createElement("div");
            highlight.className = "chess-client-highlight split-square";
            highlight.setAttribute("data-square", squareNum);
            
            var opacity = type === "to" ? 0.7 : 0.5;
            highlight.style.cssText = "position: absolute; pointer-events: none; z-index: 100; border-radius: 4px; overflow: hidden; opacity: " + opacity + "; background: linear-gradient(135deg, " + color1 + " 50%, " + color2 + " 50%);";
            
            var boardRect = board.getBoundingClientRect();
            var squareSize = boardRect.width / 8;
            
            var isFlipped = board.classList.contains("flipped") || $(board).find(".board").hasClass("flipped") || board.getAttribute("orientation") === "black";
            
            var file = parseInt(squareNum[0]) - 1;
            var rank = 8 - parseInt(squareNum[1]);
            
            if (isFlipped) {
                file = 7 - file;
                rank = 7 - rank;
            }
            
            highlight.style.width = squareSize + "px";
            highlight.style.height = squareSize + "px";
            highlight.style.left = (file * squareSize) + "px";
            highlight.style.top = (rank * squareSize) + "px";
            
            var boardElement = $(board).find(".board")[0] || board;
            if (boardElement) {
                boardElement.style.position = "relative";
                boardElement.appendChild(highlight);
            }
        };
        myFunctions.color = function(dat) {
            response = dat;
            var res1 = response.substring(0, 2);
            var res2 = response.substring(2, 4);
            if (myVars.autoMove === true) {
                console.log(`Auto move enabled, moving from ${res1} to ${res2}`);
                myFunctions.movePiece(res1, res2);
            } else {
                console.log(`Auto move disabled, highlighting ${res1} to ${res2}`);
            }
            window.isThinking = false;
            myFunctions.spinner();
            
            myFunctions.clearHighlights();
            myFunctions.highlightSingleSquare(res1, myVars.bestMoveColor || "#5b8c5a", 0.5);
            myFunctions.highlightSingleSquare(res2, myVars.bestMoveColor || "#5b8c5a", 0.7);
        };
        myFunctions.movePiece = function(from, to) {
            let isLegalMove = false;
            let moveObject = null;
            for (let each = 0; each < window.board.game.getLegalMoves().length; each++) {
                if (window.board.game.getLegalMoves()[each].from === from && window.board.game.getLegalMoves()[each].to === to) {
                    isLegalMove = true;
                    moveObject = window.board.game.getLegalMoves()[each];
                    break;
                }
            }
            if (!isLegalMove) {
                console.log(`Attempted illegal move: ${from} to ${to}`);
                return;
            }
            setTimeout(() => {
                try {
                    window.board.game.move({
                        ...moveObject,
                        promotion: moveObject.promotion || "q",
                        // Default to queen for simplicity
                        animate: true,
                        userGenerated: true
                    });
                    console.log(`Successfully moved from ${from} to ${to}`);
                } catch (error) {
                    console.error("Error making move:", error);
                }
            }, 100 + Math.random() * 300);
        };
        myFunctions.other = function(delay) {
            const gamePhase = myFunctions.estimateGamePhase();
            const positionComplexity = myFunctions.estimatePositionComplexity();
            let naturalDelay = delay;
            if (gamePhase < 10) {
                naturalDelay *= 0.6 + Math.random() * 0.4;
            }
            if (positionComplexity > 0.7) {
                naturalDelay *= 1 + Math.random() * 1.5;
            }
            naturalDelay *= 0.85 + Math.random() * 0.3;
            var endTime = Date.now() + naturalDelay;
            var timer = setInterval(() => {
                if (Date.now() >= endTime) {
                    myFunctions.autoRun(myFunctions.getAdjustedDepth());
                    window.canGo = true;
                    clearInterval(timer);
                }
            }, 10);
        };
        myFunctions.getAdjustedDepth = function() {
            const timeRemaining = myFunctions.estimateTimeRemaining();
            const gamePhase = myFunctions.estimateGamePhase();
            const positionType = myFunctions.analyzePositionType(window.board.game.getFEN());
            const isPositionCritical = myFunctions.isPositionCriticalNow();
            let baseDepth = myVars.lastValue;
            if (timeRemaining < 10) {
                return Math.floor(Math.random() * 3) + 1;
            } else if (timeRemaining < 30) {
                return Math.floor(Math.random() * 4) + 4;
            } else if (timeRemaining < 60) {
                return Math.floor(Math.random() * 7) + 6;
            } else if (timeRemaining < 120) {
                return Math.floor(Math.random() * 7) + 9;
            } else {
                if (!isPositionCritical && Math.random() < 0.07) {
                    return Math.floor(Math.random() * 4) + 2;
                }
                return Math.floor(Math.random() * 9) + 11;
            }
        };
        myFunctions.analyzePositionType = function(fen) {
            const piecesCount = fen.split(" ")[0].match(/[pnbrqkPNBRQK]/g).length;
            if (piecesCount > 25) return "opening";
            if (piecesCount < 12) return "endgame";
            return "middlegame";
        };
        myFunctions.isPositionCriticalNow = function() {
            try {
                const inCheck = window.board.game.inCheck();
                const fen = window.board.game.getFEN();
                const whiteMaterial = myFunctions.countMaterial(fen, true);
                const blackMaterial = myFunctions.countMaterial(fen, false);
                const materialDifference = Math.abs(whiteMaterial - blackMaterial);
                return inCheck || materialDifference < 2;
            } catch (e) {
                return false;
            }
        };
        myFunctions.countMaterial = function(fen, isWhite) {
            const position = fen.split(" ")[0];
            let material = 0;
            const pieces = isWhite ? "PNBRQK" : "pnbrqk";
            const values = {
                "P": 1,
                "N": 3,
                "B": 3,
                "R": 5,
                "Q": 9,
                "K": 0,
                "p": 1,
                "n": 3,
                "b": 3,
                "r": 5,
                "q": 9,
                "k": 0
            };
            for (let char of position) {
                if (pieces.includes(char)) {
                    material += values[char];
                }
            }
            return material;
        };
        myFunctions.estimateGamePhase = function() {
            try {
                const moveList = $("vertical-move-list").children().length;
                return moveList / 2;
            } catch (e) {
                return 15;
            }
        };
        myFunctions.estimateTimeRemaining = function() {
            let remainingTime = 600;
            try {
                const clockEl = document.querySelector(".clock-component.clock-bottom");
                if (clockEl) {
                    const timeText = clockEl.textContent;
                    if (timeText.includes(":")) {
                        const parts = timeText.split(":");
                        if (parts.length === 2) {
                            const minutes = parseInt(parts[0]);
                            const seconds = parseInt(parts[1]);
                            if (!isNaN(minutes) && !isNaN(seconds)) {
                                remainingTime = minutes * 60 + seconds;
                            } else {
                                console.log("Error parsing time:", timeText);
                            }
                        }
                    } else {
                        const seconds = parseInt(timeText);
                        if (!isNaN(seconds)) {
                            remainingTime = seconds;
                        } else {
                            console.log("Error parsing time:", timeText);
                        }
                    }
                } else {
                    console.log("Clock element not found with selector '.clock-component.clock-bottom'");
                }
            } catch (e) {
                console.log("Error getting time remaining:", e);
            }
            console.log("Remaining time:", remainingTime);
            return remainingTime;
        };
        myFunctions.estimatePositionComplexity = function() {
            return Math.random() * 0.8 + 0.2;
        };
        myFunctions.saveSettings = function() {
            try {
                GM_setValue("autoMove", myVars.autoMove);
                GM_setValue("useBestMove", myVars.useBestMove);
                GM_setValue("timeDelayMin", $("#timeDelayMin").val());
                GM_setValue("timeDelayMax", $("#timeDelayMax").val());
                GM_setValue("depthValue", myVars.lastValue);
                GM_setValue("bestMoveColor", myVars.bestMoveColor);
                GM_setValue("humanMoveColor", myVars.humanMoveColor);
                GM_setValue("playStyle", myVars.playStyle);
                GM_setValue("blunderRate", myVars.blunderRate);
                GM_setValue("adaptToRating", myVars.adaptToRating);
                GM_setValue("useOpeningBook", myVars.useOpeningBook);
                GM_setValue("preferredOpenings", myVars.preferredOpenings);
                GM_setValue("randomizeTiming", myVars.randomizeTiming);
                GM_setValue("mouseMovementRealism", myVars.mouseMovementRealism);
                console.log("Settings saved successfully");
            } catch (error) {
                console.error("Error saving settings:", error);
            }
        };
        myFunctions.loadSettings = function() {
            try {
                myVars.autoMove = GM_getValue("autoMove", false);
                myVars.useBestMove = GM_getValue("useBestMove", false);
                myVars.lastValue = GM_getValue("depthValue", 11);
                myVars.bestMoveColor = GM_getValue("bestMoveColor", "#5b8c5a");
                myVars.humanMoveColor = GM_getValue("humanMoveColor", "#c9a227");
                myVars.blunderRate = GM_getValue("blunderRate", 0.05);
                myVars.adaptToRating = GM_getValue("adaptToRating", true);
                myVars.useOpeningBook = GM_getValue("useOpeningBook", true);
                myVars.preferredOpenings = GM_getValue("preferredOpenings", ["e4", "d4", "c4", "Nf3"]);
                myVars.randomizeTiming = GM_getValue("randomizeTiming", true);
                myVars.mouseMovementRealism = GM_getValue("mouseMovementRealism", 0.7);
                const savedPlayStyle = GM_getValue("playStyle", null);
                if (savedPlayStyle) {
                    myVars.playStyle = savedPlayStyle;
                }
                console.log("Settings loaded successfully");
            } catch (error) {
                console.error("Error loading settings:", error);
            }
        };
        return myFunctions;
    }

    // main.js
    window.isThinking = false;
    window.canGo = true;
    window.myTurn = false;
    window.board = null;
    function main() {
        const myVars = initializeVariables();
        const myFunctions = setupUtilities(myVars);
        myFunctions.loadSettings();
        const engine = setupEngine(myVars, myFunctions);
        document.engine = engine;
        document.myVars = myVars;
        document.myFunctions = myFunctions;
        setupUI(myVars, myFunctions, engine);
        setupEventHandlers(myVars, myFunctions, engine);
        console.log("Chess Client by Trent initialized");
    }
    window.addEventListener("load", (event) => {
        main();
    });
    var waitForChessBoard = setInterval(() => {
        if (!document.myVars || !document.myFunctions) return;
        const myVars = document.myVars;
        const myFunctions = document.myFunctions;
        if (myVars.loaded) {
            window.board = $("chess-board")[0] || $("wc-chess-board")[0];
            myFunctions.checkPageStatus();
            
            if (!myVars.onGamePage) return;
            
            myVars.autoMove = $("#autoMove")[0].checked;
            let minDel = parseFloat($("#timeDelayMin")[0].value);
            let maxDel = parseFloat($("#timeDelayMax")[0].value);
            myVars.delay = Math.random() * (maxDel - minDel) + minDel;
            myVars.isThinking = window.isThinking;
            myFunctions.spinner();
            if (window.board && window.board.game && window.board.game.getTurn() == window.board.game.getPlayingAs()) {
                window.myTurn = true;
            } else {
                window.myTurn = false;
            }
            $("#depthText")[0].innerHTML = "Current Depth: <strong>" + myVars.lastValue + "</strong>";
        } else {
            myFunctions.loadEx();
        }
        if (!document.engine.engine) {
            myFunctions.loadChessEngine();
        }
        if (myVars.onGamePage && window.canGo == true && window.isThinking == false && window.myTurn) {
            window.canGo = false;
            var currentDelay = myVars.delay != void 0 ? myVars.delay * 1e3 : 10;
            myFunctions.other(currentDelay);
        }
    }, 100);
})();
