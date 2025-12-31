var mainStyles = `
* {
    box-sizing: border-box;
}

.minimized-tab {
    display: none !important;
}

.chess-client {
    position: fixed;
    top: 16px;
    right: 16px;
    background: #ffffff;
    color: #000000;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    width: 280px;
    border: 1px solid #e0e0e0;
    z-index: 999999;
    user-select: none;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.chess-client.minimized {
    display: none;
}

.client-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #fafafa;
    border-bottom: 1px solid #e0e0e0;
}

.header-left {
    display: flex;
    align-items: center;
}

.header-right {
    display: flex;
    align-items: center;
}

.client-title {
    font-size: 12px;
    font-weight: 600;
    color: #000000;
    letter-spacing: 0.3px;
    text-transform: uppercase;
}

.minimize-hint {
    font-size: 10px;
    color: #999999;
    font-weight: 400;
    cursor: pointer;
    transition: color 0.2s;
}

.minimize-hint:hover {
    color: #000000;
}

.page-status {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
    text-align: center;
}

.page-status.visible {
    display: flex;
}

.status-icon {
    color: #999999;
    margin-bottom: 8px;
}

.status-text {
    font-size: 11px;
    color: #666666;
    line-height: 1.5;
}

.client-body {
    display: flex;
    flex-direction: column;
}

.client-body.hidden {
    display: none;
}

.client-tabs {
    display: flex;
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
}

.tab-btn {
    flex: 1;
    background: transparent;
    border: none;
    color: #999999;
    font-size: 10px;
    font-weight: 600;
    padding: 10px 6px;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 2px solid transparent;
    font-family: inherit;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.tab-btn:hover {
    color: #000000;
}

.tab-btn.active {
    color: #000000;
    border-bottom-color: #000000;
}

.client-content {
    padding: 16px;
    background: #ffffff;
    min-height: 140px;
}

.tab-panel {
    display: none;
}

.tab-panel.active {
    display: block;
}

.tactic-info {
    background: #f9f9f9;
    border-left: 3px solid #000000;
    padding: 10px 12px;
    margin-bottom: 16px;
}

.tactic-info p {
    margin: 0;
    font-size: 11px;
    color: #333333;
    line-height: 1.5;
}

.input-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
}

.input-row label {
    font-size: 11px;
    color: #000000;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.color-picker {
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: none;
    transition: all 0.2s;
}

.color-picker:hover {
    transform: scale(1.1);
}

.color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
}

.color-picker::-webkit-color-swatch {
    border: 2px solid #e0e0e0;
    border-radius: 4px;
    transition: border-color 0.2s;
}

.color-picker:hover::-webkit-color-swatch {
    border-color: #000000;
}

.version-display {
    text-align: center;
    padding: 6px;
    font-size: 9px;
    color: #cccccc;
    background: #fafafa;
    border-top: 1px solid #e0e0e0;
}

.chess-tactics-highlight {
    pointer-events: none;
    transition: opacity 0.2s;
}
`;
