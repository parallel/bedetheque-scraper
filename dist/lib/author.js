"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var image_1 = require("./image");
var probe_image_size_1 = __importDefault(require("probe-image-size"));
// image: https://www.bedetheque.com/media/Photos/${image}
var Author = /** @class */ (function () {
    function Author($) {
        var info = $(".auteur-info").text();
        var match = info.match(/Identifiant :([0-9]+)/);
        this.authorId = match ? parseInt(match[1], 10) : null;
        this.name = $(".auteur-nom").text();
        this.image = Author.getImage($);
        match = info.match(/Naissance :le ([0-9]+\/[0-9]+\/[0-9]+)/);
        this.birthDate = match ? match[1] : null;
        match = info.match(/Décès :le ([0-9]+\/[0-9]+\/[0-9]+)/);
        this.deathDate = match ? match[1] : null;
        var series = $("table")
            .filter(function (i, e) {
            return $(e)
                .find("thead #tri0")
                .text() === "Séries principales";
        })
            .find("tbody tr")
            .filter(function (i, e) {
            return $(e)
                .find("img")
                .attr("src") === "https://www.bdgest.com/skin/flags/France.png";
        });
        this.seriesIdBoth = this.getSeriesId($, series, true, true);
        this.seriesIdScenario = this.getSeriesId($, series, true, false);
        this.seriesIdDrawing = this.getSeriesId($, series, false, true);
    }
    Author.getImage = function ($) {
        var image = $(".auteur-image img").attr("src");
        if (!image)
            return null;
        return new image_1.ImageDetails(image !== "https://www.bdgest.com/skin/nophoto.png" ? image : null, image !== "https://www.bdgest.com/skin/nophoto.png"
            ? image.replace("https://www.bedetheque.com/media/Photos/", "")
            : null);
    };
    Author.prototype.getSeriesId = function ($, series, isScen, isDraw) {
        return series
            .filter(function (i, e) {
            var icons = $(e).find(".parution i");
            var scen = isScen
                ? icons.hasClass("icon-scen")
                : !icons.hasClass("icon-scen");
            var draw = isDraw
                ? icons.hasClass("icon-dess")
                : !icons.hasClass("icon-dess");
            return scen && draw;
        })
            .map(function (i, e) {
            return $(e)
                .find(".serie a")
                .attr("href");
        })
            .get()
            .map(function (url) { return utils_1.Utils.urlToSerieID(url); });
    };
    Author.prototype.getImageDimensions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.image == null)
                    return [2 /*return*/];
                return [2 /*return*/, probe_image_size_1.default("https://www.bedetheque.com/media/Photos/" + this.image)
                        .then(function (dimension) {
                        _this.imageWidth = dimension.width;
                        _this.imageHeight = dimension.height;
                    })
                        .catch(function () {
                        // do nothing
                    })];
            });
        });
    };
    return Author;
}());
exports.Author = Author;
