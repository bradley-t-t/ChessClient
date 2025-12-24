// ==UserScript==
// @name         Chess Client by Trent
// @namespace    chess-client-trent
// @version      1.1.6
// @description  Chess.com assistant with move suggestions and customizable features
// @author       Trent
// @match       https://www.chess.com/play/*
// @match       https://www.chess.com/game/*
// @match       https://www.chess.com/puzzles/*
// @match       https://www.chess.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @resource    stockfish.js        https://raw.githubusercontent.com/nicm34/nicm/main/stockfish-16.1-lite-single.js
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/config.js?v=1.1.6
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/variables.js?v=1.1.6
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/engine.js?v=1.1.6
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/html.js?v=1.1.6
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/styles.js?v=1.1.6
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/ui.js?v=1.1.6
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/events.js?v=1.1.6
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/parser.js?v=1.1.6
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/utilities.js?v=1.1.6
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/main.js?v=1.1.6
// @run-at      document-start
// ==/UserScript==
