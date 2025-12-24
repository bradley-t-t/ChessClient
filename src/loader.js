// ==UserScript==
// @name         Chess Client by Trent
// @namespace    chess-client-trent
// @version      1.1.4
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
// @resource    stockfish.js        https://cdn.jsdelivr.net/npm/stockfish@16.0.0/src/stockfish-nnue-16.js
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://cdn.jsdelivr.net/gh/bradley-t-t/ChessClient@main/src/config.js
// @require     https://cdn.jsdelivr.net/gh/bradley-t-t/ChessClient@main/src/variables.js
// @require     https://cdn.jsdelivr.net/gh/bradley-t-t/ChessClient@main/src/engine.js
// @require     https://cdn.jsdelivr.net/gh/bradley-t-t/ChessClient@main/src/ui/html.js
// @require     https://cdn.jsdelivr.net/gh/bradley-t-t/ChessClient@main/src/ui/styles.js
// @require     https://cdn.jsdelivr.net/gh/bradley-t-t/ChessClient@main/src/ui/ui.js
// @require     https://cdn.jsdelivr.net/gh/bradley-t-t/ChessClient@main/src/events.js
// @require     https://cdn.jsdelivr.net/gh/bradley-t-t/ChessClient@main/src/parser.js
// @require     https://cdn.jsdelivr.net/gh/bradley-t-t/ChessClient@main/src/utilities.js
// @require     https://cdn.jsdelivr.net/gh/bradley-t-t/ChessClient@main/src/main.js
// @run-at      document-start
// ==/UserScript==
