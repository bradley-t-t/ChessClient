var positionalMeterTemplate = `
<div class="positional-meter" id="positionalMeter">
    <div class="meter-bar">
        <div class="meter-fill white-advantage" id="meterFillWhite"></div>
        <div class="meter-fill black-advantage" id="meterFillBlack"></div>
    </div>
    <div class="meter-value" id="meterValue">0.0</div>
</div>
`;

var mainTemplate = `
<div class="minimized-tab" id="minimizedTab">
    <span class="tab-label">Chess Client</span>
</div>

<div class="chess-client">
    <div class="client-header">
        <div class="header-left">
            <span class="client-title">Chess Client</span>
        </div>
        <div class="header-right">
            <div id="thinking-indicator" class="thinking-indicator">
                <span class="thinking-spinner"></span>
                <span class="thinking-text">Thinking</span>
            </div>
            <span id="minimizeHint" class="minimize-hint">(Esc)</span>
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
            <button class="tab-btn active" data-tab="engine-settings">Engine</button>
            <button class="tab-btn" data-tab="display-settings">Display</button>
            <button class="tab-btn" data-tab="speed-settings">Speed</button>
            <button class="tab-btn" data-tab="system-settings">System</button>
        </div>

        <div class="client-content">
        <div class="tab-panel active" id="engine-settings">
            <div class="setting-group">
                <div class="setting-row">
                    <span class="setting-label">Target ELO</span>
                    <span id="targetEloValue" class="setting-value">1500</span>
                </div>
                <div class="slider-row">
                    <button class="slider-btn" id="decreaseElo">-</button>
                    <input type="range" id="targetEloSlider" min="400" max="3400" step="50" value="1500" class="slider">
                    <button class="slider-btn" id="increaseElo">+</button>
                </div>
                <div class="setting-description" id="eloDescription">Intermediate</div>
            </div>

            <div class="setting-group">
                <div class="toggle-row">
                    <span class="toggle-label">Auto Move</span>
                    <label class="toggle">
                        <input type="checkbox" id="autoMove" name="autoMove" class="toggle-input" value="false">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>

        <div class="tab-panel" id="display-settings">
            <div class="setting-group">
                <div class="toggle-row">
                    <span class="toggle-label">Recommend Moves</span>
                    <label class="toggle">
                        <input type="checkbox" id="recommendMoves" class="toggle-input" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div class="setting-group">
                <div class="input-row">
                    <label for="intermediateMoveColor">Intermediate Move</label>
                    <input type="color" id="intermediateMoveColor" value="#ffa500" class="color-picker">
                </div>
                <div class="input-row">
                    <label for="bestMoveColor">Recommended Move</label>
                    <input type="color" id="bestMoveColor" value="#5b8c5a" class="color-picker">
                </div>
            </div>

            <div class="setting-group">
                <div class="toggle-row">
                    <span class="toggle-label">Highlight Attackable Pieces</span>
                    <label class="toggle">
                        <input type="checkbox" id="highlightHangingPieces" class="toggle-input" value="false">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div id="hangingPiecesColors" style="display: none;">
                    <div class="input-row">
                        <label for="ownHangingColor">Enemy Hanging Pieces</label>
                        <input type="color" id="ownHangingColor" value="#ff4444" class="color-picker">
                    </div>
                    <div class="input-row">
                        <label for="enemyHangingColor">Your Hanging Pieces</label>
                        <input type="color" id="enemyHangingColor" value="#44ff44" class="color-picker">
                    </div>
                </div>
            </div>
        </div>

        <div class="tab-panel" id="speed-settings">
            <div class="setting-group">
                <div class="toggle-row">
                    <span class="toggle-label">Time Affected Speed</span>
                    <label class="toggle">
                        <input type="checkbox" id="timeAffectedSpeed" class="toggle-input" value="false">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div id="speedSliderContainer" class="setting-group">
                <div class="setting-row">
                    <span class="setting-label">Move Speed</span>
                    <span id="moveSpeedValue" class="setting-value">Medium</span>
                </div>
                <div class="slider-row">
                    <button class="slider-btn" id="decreaseSpeed">-</button>
                    <input type="range" id="moveSpeedSlider" min="1" max="7" value="4" class="slider">
                    <button class="slider-btn" id="increaseSpeed">+</button>
                </div>
            </div>
        </div>

        <div class="tab-panel" id="system-settings">
            <div class="setting-group">
                <div class="toggle-row">
                    <span class="toggle-label">Show Score Meter</span>
                    <label class="toggle">
                        <input type="checkbox" id="showScoreMeter" class="toggle-input" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div class="setting-group">
                <div class="toggle-row">
                    <span class="toggle-label">Console Log</span>
                    <label class="toggle">
                        <input type="checkbox" id="consoleLogEnabled" class="toggle-input" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div class="setting-group">
                <button type="button" id="resetDefaults" class="btn-reset">Reset to Defaults</button>
            </div>
        </div>
        </div>

        <div class="detection-score">
            <span class="score-label">Detection Risk</span>
            <div class="score-bar">
                <div id="scoreBarFill" class="score-bar-fill" style="width: 50%;"></div>
            </div>
            <div class="score-footer">
                <span id="scoreDescription" class="score-description">Moderate</span>
                <span id="detectionScore" class="score-value">5</span>
            </div>
        </div>

        <div class="current-depth">
            <span class="depth-label">Analysis Progress</span>
            <div class="depth-bar-container">
                <div id="depthBarFill" class="depth-bar-fill"></div>
            </div>
            <span id="currentDepthValue" class="depth-value">0%</span>
        </div>
        </div>

        <div class="client-footer">
            <button type="button" id="relEngBut" class="btn-primary" onclick="document.myFunctions.reloadChessEngine()">
                Reload Engine
            </button>
        </div>
    </div>
    
    <div class="version-display">
        <span id="versionText"></span>
    </div>
</div>`;

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