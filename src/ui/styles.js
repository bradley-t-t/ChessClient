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
    position: relative;
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
    margin-left: auto;
}

.minimize-hint {
    font-size: 12px;
    color: #666666;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
    transition: color 0.15s;
    flex-shrink: 0;
}

.minimize-hint:hover {
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
    padding: 4px 10px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    flex-shrink: 0;
}

.thinking-indicator.active {
    display: flex;
}

.thinking-indicator.reloading {
    background: #fef2f2;
    border: 1px solid #fecaca;
    animation: flash-red 1.5s ease-in-out 3;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
}

@keyframes flash-red {
    0%, 100% { 
        background: #f0fdf4; 
        border-color: #bbf7d0; 
    }
    50% { 
        background: #fef2f2; 
        border-color: #fecaca; 
    }
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

.version-display {
    text-align: center;
    margin-top: 12px;
    font-size: 11px;
    color: #999999;
}

@keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.tab-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-direction: column;
}

.tab-spinner {
    width: 12px;
    height: 12px;
    border: 2px solid #e0e0e0;
    border-top-color: #1a1a1a;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    opacity: 0;
    transition: opacity 0.2s;
}

.tab-spinner.active {
    opacity: 1;
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