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
            <button class="tab-btn active" data-tab="main-settings">Main</button>
            <button class="tab-btn" data-tab="advanced-settings">Advanced</button>
        </div>

        <div class="client-content">
            <div class="tab-panel active" id="main-settings">
                <div class="setting-group">
                    <div class="toggle-row">
                        <span class="toggle-label">View Mode Only</span>
                        <label class="toggle">
                            <input type="checkbox" id="viewModeEnabled" class="toggle-input">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <div id="engineSettings">
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
            </div>

            <div class="tab-panel" id="advanced-settings">
                <div class="setting-group advanced-controls">
                    <div class="toggle-row">
                        <span class="toggle-label">Console Log</span>
                        <label class="toggle">
                            <input type="checkbox" id="consoleLogEnabled" class="toggle-input" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <div id="viewModeColors" style="display: none;">
                        <div class="input-row">
                            <label for="attackColor">Safe Moves Color</label>
                            <input type="color" id="attackColor" value="#ff6b6b" class="color-picker">
                        </div>
                        <div class="input-row">
                            <label for="checkCheckmateColor">Check/Checkmate Color</label>
                            <input type="color" id="checkCheckmateColor" value="#9b59b6" class="color-picker">
                        </div>
                    </div>

                    <div id="engineAdvancedSettings">
                        <div class="input-row">
                            <label for="intermediateMoveColor">Intermediate Move</label>
                            <input type="color" id="intermediateMoveColor" value="#ffa500" class="color-picker">
                        </div>
                        <div class="input-row">
                            <label for="bestMoveColor">Recommended Move</label>
                            <input type="color" id="bestMoveColor" value="#5b8c5a" class="color-picker">
                        </div>
                        <div class="toggle-row">
                            <span class="toggle-label">Time Affected Speed</span>
                            <label class="toggle">
                                <input type="checkbox" id="timeAffectedSpeed" class="toggle-input" value="false">
                                <span class="toggle-slider"></span>
                            </label>
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
    
    <div class="version-display">
        <span id="versionText"></span>
    </div>
</div>`;

var advancedSettingsTemplate = `
<div class="advanced-section">
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