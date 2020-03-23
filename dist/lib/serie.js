"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Serie = /** @class */ (function () {
    function Serie($) {
        this.html = $.html();
        this.serieId = parseInt($(".idbel").text(), 10);
        this.serieTitle = $("h1 a").text();
        this.serieUrl = $('link[rel="canonical"]').attr("href");
        var statusMatch = $(".serie-info")
            .text()
            .match(/Parution? :(.*)/);
        var serieStatus = statusMatch[1].trim();
        this.type = serieStatus.includes("One shot") ? "One shot" : "Serie";
        this.status = serieStatus.includes("en cours") ? "In progress" : "Done";
        var genreMatch = $(".serie-info")
            .text()
            .match(/Genre? :(.*)/);
        this.genres = genreMatch[1].split(",");
        var numberOfAlbumsMatch = $(".serie-info")
            .text()
            .match(/Tomes? :([0-9]+)/);
        this.numberOfAlbums = numberOfAlbumsMatch
            ? parseInt(numberOfAlbumsMatch[1], 10)
            : 0;
        var langMatch = $(".serie-info")
            .text()
            .match(/Langue? :(.*)/);
        this.lang = langMatch[1].trim();
        this.recommendationsId = this.getRecommendationsId($);
        this.tags = this.getTags($);
        this.summary = $("article.single-block p").text();
    }
    Serie.prototype.addAlbumsInfo = function (albums) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.albumsId = albums.map(function (album) { return album.albumId; });
                        _a = this.getVoteAverage(albums), this.voteAverage = _a[0], this.voteCount = _a[1];
                        return [4 /*yield*/, Promise.all(albums.map(function (a) { return a.getImageDimensions(); }))];
                    case 1:
                        _b.sent();
                        if (albums.length == 0)
                            return [2 /*return*/];
                        this.serieCover = albums[0].imageCover;
                        this.serieCoverWidth = albums[0].imageCoverWidth;
                        this.serieCoverHeight = albums[0].imageCoverHeight;
                        this.dateBegin = albums[0].date;
                        this.dateEnd = this.status !== "In progress" ? albums[albums.length - 1].date : null;
                        return [2 /*return*/];
                }
            });
        });
    };
    Serie.prototype.getVoteAverage = function (albums) {
        var voteAverage = 0;
        var voteCount = 0;
        albums.forEach(function (album) {
            voteAverage += album.voteAverage * album.voteCount;
            voteCount += album.voteCount;
        });
        if (voteCount === 0) {
            return [0, 0];
        }
        return [Math.floor((voteAverage / voteCount) * 10) / 10, voteCount];
    };
    Serie.prototype.getRecommendationsId = function ($) {
        return $(".alire li a")
            .map(function (_index, elem) { return $(elem).attr("href"); })
            .get()
            .map(function (url) { return utils_1.Utils.urlToSerieID(url); });
    };
    Serie.prototype.getTags = function ($) {
        return $(".mot-cle")
            .map(function (_index, elem) { return $(elem).text(); })
            .get();
    };
    return Serie;
}());
exports.Serie = Serie;
