// ==UserScript==
// @name         Chess Client
// @namespace    chess-client-trent
// @version      2.2.5
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
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/init.js?t=20251224038
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/engine.js?t=20251224038
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/html.js?t=20251224038
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/styles.js?t=20251224038
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/ui.js?t=20251224038
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/events.js?t=20251224038
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/parser.js?t=20251224038
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/utilities.js?t=20251224038
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/main.js?t=20251224038
// @run-at      document-start
// ==/UserScript==