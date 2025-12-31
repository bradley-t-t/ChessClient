// ==UserScript==
// @name         Chess Client
// @namespace    chess-client-trent
// @version      2.5.6
// @description  Chess.com assistant with local Stockfish engine
// @author       Trent
// @match       https://www.chess.com/play/*
// @match       https://www.chess.com/game/*
// @match       https://www.chess.com/puzzles/*
// @match       https://www.chess.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @resource    stockfish.js        https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/core.js?t=20251224054
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/lib/constants.js?t=20251224054
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/lib/helpers.js?t=20251224054
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/lib/state.js?t=20251224054
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/lib/events.js?t=20251224054
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/html.js?t=20251224054
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/styles.js?t=20251224054
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/ui.js?t=20251224054
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/util/utilities.js?t=20251224054
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/main.js?t=20251224054
// @run-at      document-start
// ==/UserScript==