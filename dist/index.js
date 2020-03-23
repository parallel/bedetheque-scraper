"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var scraper_1 = require("./lib/scraper");
exports.Scraper = scraper_1.Scraper;
var proxy_fetcher_1 = require("./lib/proxy-fetcher");
exports.ProxyFetcher = proxy_fetcher_1.ProxyFetcher;
var serie_1 = require("./lib/serie");
exports.Serie = serie_1.Serie;
var album_1 = require("./lib/album");
exports.Album = album_1.Album;
var author_1 = require("./lib/author");
exports.Author = author_1.Author;
__export(require("./lib/image"));
