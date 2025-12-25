const AppState = {
    thinking: false,
    canAnalyze: true,
    isPlayerTurn: false,
    board: null,
    lastAnalyzedFen: null,
    lastAnalysisStartTime: null,
    watchdogChecks: 0,
    moveInProgress: false,

    reset() {
        this.canAnalyze = true;
        this.lastAnalyzedFen = null;
        this.watchdogChecks = 0;
    },

    resetProgress() {
        const elements = {
            bar: document.getElementById("depthBarFill"),
            value: document.getElementById("currentDepthValue")
        };

        if (elements.bar) elements.bar.style.width = "0%";
        if (elements.value) elements.value.textContent = "0%";
    },

    startAnalysis() {
        this.canAnalyze = false;
        this.lastAnalysisStartTime = Date.now();
        this.watchdogChecks = 0;
    },

    completeAnalysis() {
        this.thinking = false;
        this.canAnalyze = true;
    }
};

window.AppState = AppState;

try {
    Object.defineProperty(window, 'isThinking', {
        get() {
            return AppState.thinking;
        },
        set(value) {
            AppState.thinking = value;
        },
        configurable: true
    });
} catch (e) {}

try {
    Object.defineProperty(window, 'canGo', {
        get() {
            return AppState.canAnalyze;
        },
        set(value) {
            AppState.canAnalyze = value;
        },
        configurable: true
    });
} catch (e) {}

try {
    Object.defineProperty(window, 'myTurn', {
        get() {
            return AppState.isPlayerTurn;
        },
        set(value) {
            AppState.isPlayerTurn = value;
        },
        configurable: true
    });
} catch (e) {}

try {
    Object.defineProperty(window, 'board', {
        get() {
            return AppState.board;
        },
        set(value) {
            AppState.board = value;
        },
        configurable: true
    });
} catch (e) {}

try {
    Object.defineProperty(window, 'lastAnalyzedFen', {
        get() {
            return AppState.lastAnalyzedFen;
        },
        set(value) {
            AppState.lastAnalyzedFen = value;
        },
        configurable: true
    });
} catch (e) {}

try {
    Object.defineProperty(window, 'lastAnalysisStartTime', {
        get() {
            return AppState.lastAnalysisStartTime;
        },
        set(value) {
            AppState.lastAnalysisStartTime = value;
        },
        configurable: true
    });
} catch (e) {}

try {
    Object.defineProperty(window, 'watchdogChecks', {
        get() {
            return AppState.watchdogChecks;
        },
        set(value) {
            AppState.watchdogChecks = value;
        },
        configurable: true
    });
} catch (e) {}

try {
    Object.defineProperty(window, 'moveInProgress', {
        get() {
            return AppState.moveInProgress;
        },
        set(value) {
            AppState.moveInProgress = value;
        },
        configurable: true
    });
} catch (e) {}
