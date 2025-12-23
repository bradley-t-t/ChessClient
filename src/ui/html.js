var mainTemplate = `
<div class="chess-client">
    <div class="client-header">
        <div class="header-left">
            <span class="client-title">Chess Client</span>
            <span class="client-author">by Trent</span>
        </div>
        <div class="header-right">
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
            <div class="version-display">
                <span id="versionText"></span>
            </div>
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
