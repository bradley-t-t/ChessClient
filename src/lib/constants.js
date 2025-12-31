const CONSTANTS = {
    SELECTORS: {
        BOARD: "chess-board, wc-chess-board",
        AUTO_MOVE: "#autoMove",
        DEPTH_TEXT: "#depthText",
        DEPTH_BAR: "#depthBarFill",
        DEPTH_VALUE: "#currentDepthValue",
        TIME_DELAY_MIN: "#timeDelayMin",
        TIME_DELAY_MAX: "#timeDelayMax"
    },

    TIMING: {
        MAIN_LOOP_INTERVAL: 100,
        WATCHDOG_TIMEOUT: 30000,
        WATCHDOG_CHECK_THRESHOLD: 300,
        MOVE_ANIMATION_DELAY: 2000
    },

    COLORS: {
        BEST_MOVE: "#5b8c5a",
        INTERMEDIATE_MOVE: "#ffa500",
        SAFE_MOVE: "#ff6b6b",
        CHECK_CHECKMATE: "#9b59b6"
    },

    DEFAULTS: {
        DEPTH: 7,
        BLUNDER_RATE: 0.1,
        MIN_DELAY: 0.1,
        MAX_DELAY: 1.0
    }
};

window.CONSTANTS = CONSTANTS;
