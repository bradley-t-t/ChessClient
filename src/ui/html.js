var mainTemplate = `
<div class="minimized-tab" id="minimizedTab">
    <span class="tab-label">Chess Tactics</span>
</div>

<div class="chess-client">
    <div class="client-header">
        <div class="header-left">
            <span class="client-title">Chess Tactics Analyzer</span>
        </div>
        <div class="header-right">
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
            <button class="tab-btn active" data-tab="forks">Forks</button>
            <button class="tab-btn" data-tab="skewers">Skewers</button>
            <button class="tab-btn" data-tab="pins">Pins</button>
            <button class="tab-btn" data-tab="discovered">Discovered</button>
        </div>

        <div class="client-content">
            <div class="tab-panel active" id="forks">
                <div class="tactic-info">
                    <p>Attacking two or more pieces simultaneously</p>
                </div>
                <div class="input-row">
                    <label for="forkColor">Highlight Color</label>
                    <input type="color" id="forkColor" value="#ff6b6b" class="color-picker">
                </div>
            </div>

            <div class="tab-panel" id="skewers">
                <div class="tactic-info">
                    <p>Forcing a valuable piece to move, exposing a less valuable piece behind it</p>
                </div>
                <div class="input-row">
                    <label for="skewerColor">Highlight Color</label>
                    <input type="color" id="skewerColor" value="#4ecdc4" class="color-picker">
                </div>
            </div>

            <div class="tab-panel" id="pins">
                <div class="tactic-info">
                    <p>Restricting a piece from moving because it would expose a more valuable piece</p>
                </div>
                <div class="input-row">
                    <label for="pinColor">Highlight Color</label>
                    <input type="color" id="pinColor" value="#ffe66d" class="color-picker">
                </div>
            </div>

            <div class="tab-panel" id="discovered">
                <div class="tactic-info">
                    <p>Moving a piece reveals an attack from another piece behind it</p>
                </div>
                <div class="input-row">
                    <label for="discoveredAttackColor">Highlight Color</label>
                    <input type="color" id="discoveredAttackColor" value="#a8dadc" class="color-picker">
                </div>
            </div>
        </div>
    </div>
    
    <div class="version-display">
        <span id="versionText"></span>
    </div>
</div>`;