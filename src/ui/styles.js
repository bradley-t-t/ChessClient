var mainStyles = `
* {
    box-sizing: border-box;
}

.minimized-tab {
    display: none !important;
}

.chess-client {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    width: 320px;
    border: 1px solid #e5e5e5;
    z-index: 999999;
    overflow: hidden;
}

.chess-client.minimized {
    display: none;
}

.client-header {
    padding: 16px 20px;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.client-title {
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.5px;
}

.minimize-hint {
    font-size: 11px;
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    transition: color 0.2s;
    font-weight: 500;
}

.minimize-hint:hover {
    color: rgba(255,255,255,0.9);
}

.page-status {
    display: none;
    padding: 48px 24px;
    text-align: center;
}

.page-status.visible {
    display: block;
}

.status-icon {
    color: #a0a0a0;
    margin-bottom: 12px;
}

.status-text {
    font-size: 13px;
    color: #666666;
    line-height: 1.6;
}

.client-body {
    display: flex;
    flex-direction: column;
}

.client-body.hidden {
    display: none;
}

.client-content {
    padding: 20px;
    background: #ffffff;
    max-height: 500px;
    overflow-y: auto;
}

.client-content::-webkit-scrollbar {
    width: 6px;
}

.client-content::-webkit-scrollbar-track {
    background: transparent;
}

.client-content::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 3px;
}

.client-content::-webkit-scrollbar-thumb:hover {
    background: #c0c0c0;
}

.tactic-section {
    margin-bottom: 24px;
}

.tactic-section:last-child {
    margin-bottom: 0;
}

.tactic-header {
    font-size: 12px;
    font-weight: 700;
    color: #1a1a1a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
}

.tactic-info {
    background: linear-gradient(135deg, #f8f8f8 0%, #fafafa 100%);
    border-left: 4px solid #1a1a1a;
    padding: 10px 12px;
    margin-bottom: 12px;
    border-radius: 0 6px 6px 0;
}

.tactic-info p {
    margin: 0;
    font-size: 11px;
    color: #444444;
    line-height: 1.5;
    font-weight: 500;
}

.input-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fafafa;
    padding: 12px 14px;
    border-radius: 8px;
    transition: background 0.2s;
}

.input-row:hover {
    background: #f5f5f5;
}

.input-row label {
    font-size: 11px;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: 0.3px;
}

.color-picker {
    width: 36px;
    height: 36px;
    padding: 0;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.color-picker:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
}

.color-picker::-webkit-color-swatch {
    border: 3px solid #ffffff;
    border-radius: 8px;
}

.version-display {
    text-align: center;
    padding: 10px;
    font-size: 10px;
    color: #aaaaaa;
    background: #fafafa;
    border-top: 1px solid #e5e5e5;
    font-weight: 500;
}

.chess-tactics-highlight {
    pointer-events: none;
    transition: opacity 0.2s;
}
`;
