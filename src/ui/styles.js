var mainStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.minimized-tab {
    display: none !important;
}

.chess-client {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ffffff;
    color: #000000;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    font-family: 'Inter', -apple-system, sans-serif;
    width: 300px;
    max-height: calc(100vh - 40px);
    border: 1px solid #d0d0d0;
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
    background: #000000;
    border-bottom: 1px solid #d0d0d0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.client-title {
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
}

.minimize-hint {
    font-size: 10px;
    color: #999999;
    font-weight: 400;
    cursor: pointer;
    user-select: none;
    transition: color 0.15s;
}

.minimize-hint:hover {
    color: #ffffff;
}

.page-status {
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
    gap: 12px;
}

.page-status.visible {
    display: flex;
}

.status-icon {
    color: #666666;
}

.status-text {
    font-size: 12px;
    color: #666666;
    line-height: 1.5;
}

.client-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}

.client-body.hidden {
    display: none;
}

.client-tabs {
    display: flex;
    background: #f5f5f5;
    border-bottom: 1px solid #d0d0d0;
    overflow-x: auto;
}

.client-tabs::-webkit-scrollbar {
    height: 0;
}

.tab-btn {
    flex: 1;
    background: transparent;
    border: none;
    color: #666666;
    font-size: 11px;
    font-weight: 500;
    padding: 10px 8px;
    cursor: pointer;
    transition: all 0.15s;
    border-bottom: 2px solid transparent;
    font-family: inherit;
    white-space: nowrap;
}

.tab-btn:hover {
    color: #000000;
    background: #ebebeb;
}

.tab-btn.active {
    color: #000000;
    border-bottom-color: #000000;
    background: #ffffff;
}

.client-content {
    padding: 16px;
    background: #ffffff;
    overflow-y: auto;
    flex: 1;
}

.client-content::-webkit-scrollbar {
    width: 6px;
}

.client-content::-webkit-scrollbar-track {
    background: transparent;
}

.client-content::-webkit-scrollbar-thumb {
    background: #d0d0d0;
    border-radius: 3px;
}

.client-content::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
}

.tab-panel {
    display: none;
}

.tab-panel.active {
    display: block;
}

.tactic-info {
    background: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 16px;
}

.tactic-info p {
    margin: 0;
    font-size: 12px;
    color: #333333;
    line-height: 1.5;
}

.input-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
}

.input-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.input-row label {
    font-size: 12px;
    color: #000000;
    font-weight: 500;
}

.color-picker {
    width: 36px;
    height: 36px;
    padding: 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: none;
    transition: transform 0.15s;
}

.color-picker:hover {
    transform: scale(1.05);
}

.color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
}

.color-picker::-webkit-color-swatch {
    border: 2px solid #d0d0d0;
    border-radius: 4px;
    transition: border-color 0.15s;
}

.color-picker:hover::-webkit-color-swatch {
    border-color: #000000;
}

.version-display {
    text-align: center;
    padding: 8px;
    font-size: 9px;
    color: #999999;
    background: #fafafa;
    border-top: 1px solid #e0e0e0;
}

.chess-tactics-highlight {
    pointer-events: none;
}
`;
