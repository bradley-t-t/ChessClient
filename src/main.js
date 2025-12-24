const GameLoop = {
    vars: null,
    functions: null,
    engine: null,

    init() {
        this.vars = initializeVariables();
        this.functions = setupUtilities(this.vars);
        this.functions.loadSettings();
        this.engine = setupEngine(this.vars, this.functions);
        
        document.engine = this.engine;
        document.myVars = this.vars;
        document.myFunctions = this.functions;
        
        setupUI(this.vars, this.functions, this.engine);
        setupEventHandlers(this.vars, this.functions, this.engine);
    },

    checkTurnChange() {
        const board = DOMHelpers.getBoard();
        const wasPlayerTurn = AppState.isPlayerTurn;
        
        AppState.isPlayerTurn = DOMHelpers.isPlayerTurn(board);
        
        if (wasPlayerTurn && !AppState.isPlayerTurn) {
            this.functions.clearHighlights(true);
            AppState.lastAnalyzedFen = null;
            AppState.resetProgress();
        }
    },

    tryAnalyze() {
        if (!this.vars.onGamePage || !AppState.canAnalyze || AppState.thinking || !AppState.isPlayerTurn) {
            return;
        }

        const board = DOMHelpers.getBoard();
        const currentFen = DOMHelpers.getCurrentFEN(board);
        
        if (currentFen && currentFen !== AppState.lastAnalyzedFen) {
            AppState.lastAnalyzedFen = currentFen;
            AppState.startAnalysis();
            this.functions.autoRun(this.vars.lastValue);
        }
    },

    checkWatchdog() {
        if (!this.vars.onGamePage || !AppState.isPlayerTurn || AppState.canAnalyze) {
            AppState.watchdogChecks = 0;
            return;
        }

        AppState.watchdogChecks++;
        
        if (AppState.watchdogChecks > CONSTANTS.TIMING.WATCHDOG_CHECK_THRESHOLD && 
            AppState.lastAnalysisStartTime) {
            const elapsed = Date.now() - AppState.lastAnalysisStartTime;
            
            if (elapsed > CONSTANTS.TIMING.WATCHDOG_TIMEOUT && !AppState.thinking) {
                console.log("Watchdog: Detected hung state, resetting...");
                AppState.reset();
            }
        }
    },

    tick() {
        if (!this.vars || !this.functions) return;

        if (this.vars.loaded) {
            AppState.board = DOMHelpers.getBoard();
            this.functions.checkPageStatus();

            if (!this.vars.onGamePage) return;

            const autoMoveCheckbox = DOMHelpers.getElement(CONSTANTS.SELECTORS.AUTO_MOVE);
            if (autoMoveCheckbox) {
                this.vars.autoMove = autoMoveCheckbox.checked;
            }

            this.checkTurnChange();
            
            const depthText = DOMHelpers.getElement(CONSTANTS.SELECTORS.DEPTH_TEXT);
            if (depthText) {
                depthText.innerHTML = `Current Depth: <strong>${this.vars.lastValue}</strong>`;
            }
        } else {
            this.functions.loadEx();
        }

        if (!this.engine.engine) {
            this.functions.loadChessEngine();
        }

        this.tryAnalyze();
        this.checkWatchdog();
    }
};

window.addEventListener("load", () => GameLoop.init());

setInterval(() => GameLoop.tick(), CONSTANTS.TIMING.MAIN_LOOP_INTERVAL);