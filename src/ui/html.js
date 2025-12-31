var mainTemplate = `
<div class="chess-client">
    <div class="client-header">
        <span class="client-title">TACTICS</span>
        <span id="minimizeHint" class="minimize-hint">ESC</span>
    </div>

    <div id="pageStatus" class="page-status">
        <div class="status-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
        </div>
        <span class="status-text">Start a game to begin</span>
    </div>

    <div class="client-body">
        <div class="client-content">
            <div class="tactic-section">
                <div class="tactic-header">Fork</div>
                <div class="tactic-info">
                    <p>Attack multiple pieces at once</p>
                </div>
                <div class="input-row">
                    <label for="forkColor">Color</label>
                    <input type="color" id="forkColor" value="#ff6b6b" class="color-picker">
                </div>
            </div>

            <div class="tactic-section">
                <div class="tactic-header">Skewer</div>
                <div class="tactic-info">
                    <p>Force a piece to move and expose another</p>
                </div>
                <div class="input-row">
                    <label for="skewerColor">Color</label>
                    <input type="color" id="skewerColor" value="#4ecdc4" class="color-picker">
                </div>
            </div>

            <div class="tactic-section">
                <div class="tactic-header">Pin</div>
                <div class="tactic-info">
                    <p>Pin a piece to protect a valuable one</p>
                </div>
                <div class="input-row">
                    <label for="pinColor">Color</label>
                    <input type="color" id="pinColor" value="#ffe66d" class="color-picker">
                </div>
            </div>

            <div class="tactic-section">
                <div class="tactic-header">Discovered Attack</div>
                <div class="tactic-info">
                    <p>Reveal an attack by moving a piece</p>
                </div>
                <div class="input-row">
                    <label for="discoveredAttackColor">Color</label>
                    <input type="color" id="discoveredAttackColor" value="#a8dadc" class="color-picker">
                </div>
            </div>
        </div>
    </div>
    
    <div class="version-display">
        <span id="versionText"></span>
    </div>
</div>`;