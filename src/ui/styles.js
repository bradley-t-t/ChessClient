var mainStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

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
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ffffff;
    color: #1a1a1a;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08);
    font-family: 'Inter', -apple-system, sans-serif;
    width: 320px;
    max-height: calc(100vh - 40px);
    border: 1px solid #e5e5e5;
    z-index: 999999;
    user-select: none;
    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.chess-client.minimized {
    animation: slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(100%);
    opacity: 0;
    pointer-events: none;
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.client-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px 16px 0 0;
    cursor: move;
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
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.minimize-hint {
    font-size: 11px;
    color: rgba(255,255,255,0.8);
    font-weight: 500;
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
    color: #9ca3af;
}

.status-text {
    font-size: 13px;
    color: #6b7280;
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
    background: #fafafa;
    border-bottom: 2px solid #ebebeb;
    overflow-x: auto;
}

.client-tabs::-webkit-scrollbar {
    height: 0;
}

.tab-btn {
    flex: 1;
    background: transparent;
    border: none;
    color: #888888;
    font-size: 13px;
    font-weight: 600;
    padding: 14px 12px;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 3px solid transparent;
    font-family: inherit;
    white-space: nowrap;
}

.tab-btn:hover {
    color: #555555;
    background: rgba(102, 126, 234, 0.05);
}

.tab-btn.active {
    color: #667eea;
    border-bottom-color: #667eea;
    background: rgba(102, 126, 234, 0.08);
}

.client-content {
    padding: 20px;
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
    background: #d4d4d4;
    border-radius: 3px;
}

.client-content::-webkit-scrollbar-thumb:hover {
    background: #a3a3a3;
}

.tab-panel {
    display: none;
    animation: fadeIn 0.3s ease;
}

.tab-panel.active {
    display: block;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.tactic-info {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 20px;
}

.tactic-info p {
    margin: 0;
    font-size: 13px;
    color: #555555;
    line-height: 1.6;
}

.input-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.input-row:last-child {
    border-bottom: none;
}

.input-row label {
    font-size: 13px;
    color: #333333;
    font-weight: 500;
}

.color-picker {
    width: 44px;
    height: 44px;
    padding: 0;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background: none;
    transition: transform 0.2s;
}

.color-picker:hover {
    transform: scale(1.05);
}

.color-picker::-webkit-color-swatch-wrapper {
    padding: 0;
}

.color-picker::-webkit-color-swatch {
    border: 3px solid #e0e0e0;
    border-radius: 10px;
    transition: border-color 0.2s;
}

.color-picker:hover::-webkit-color-swatch {
    border-color: #667eea;
}

.version-display {
    text-align: center;
    padding: 12px;
    font-size: 10px;
    color: #999999;
    background: #fafafa;
    border-top: 1px solid #ebebeb;
    border-radius: 0 0 16px 16px;
}

.chess-tactics-highlight {
    pointer-events: none;
}
`;
