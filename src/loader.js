// ==UserScript==
// @name         Chess Tactics Analyzer
// @namespace    chess-tactics-trent
// @version      3.3.1
// @description  Real-time chess tactics detection (Forks, Skewers, Pins, Discovered Attacks)
// @author       Trent
// @match       https://www.chess.com/play/*
// @match       https://www.chess.com/game/*
// @icon         data:image/gif;base64,R0lGODlhAQABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/core.js?t=20251231019
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/lib/constants.js?t=20251231019
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/lib/events.js?t=20251231019
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/html.js?t=20251231019
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/styles.js?t=20251231019
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/ui/ui.js?t=20251231019
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/util/utilities.js?t=20251231019
// @require     https://raw.githubusercontent.com/bradley-t-t/ChessClient/main/src/main.js?t=20251231019
// @run-at      document-start
// ==/UserScript==