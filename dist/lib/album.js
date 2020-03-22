"use strict";
// imageCoverLarge: https://www.bedetheque.com/media/Couvertures/${imageCover}
// imageCoverSmall: https://www.bedetheque.com/cache/thb_couv/${imageCover}
// imageExtractLarge: https://www.bedetheque.com/media/Planches/${imageExtract}
// imageExtractSmall: https://www.bedetheque.com/cache/thb_planches/${imageExtract}
// imageReverseLarge: https://www.bedetheque.com/media/Versos/${imageReverse}
// imageReverseSmall: https://www.bedetheque.com/cache/thb_versos/${imageReverse}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var image_1 = require("./image");
var moment_1 = __importDefault(require("moment"));
var probe_image_size_1 = __importDefault(require("probe-image-size"));
var AuthorDetails = /** @class */ (function () {
    function AuthorDetails(pseudo, url) {
        this.pseudo = pseudo;
        this.url = url;
        this.authorId = utils_1.Utils.urlToAuthorID(url);
    }
    return AuthorDetails;
}());
var Album = /** @class */ (function () {
    function Album(page, $, serieId, serieTitle) {
        this.serieId = serieId;
        this.serieTitle = serieTitle;
        this.albumNumber = Album.findAlbumNumber(page);
        this.albumId = parseInt(page
            .children()
            .first()
            .attr("name"), 10);
        this.albumTitle = page.find(".album-main .titre").attr("title");
        this.albumUrl = page.find(".album-main .titre").attr("href");
        this.imageCover = Album.findCover(page);
        this.imageExtract = Album.findImage(page, "browse-planches", "Planches");
        this.imageReverse = Album.findImage(page, "browse-versos", "Versos");
        this.voteAverage = Album.findVoteAverage(page, $);
        this.voteCount = this.findVoteCount(page, $);
        this.addDetails(page, $);
    }
    Album.findAlbumNumber = function (page) {
        var match = page
            .find(".album-main .titre > span")
            .text()
            .trim()
            .match(/^([0-9]+)/);
        return parseInt((match && match[1]) || "1", 10);
    };
    Album.findVoteAverage = function (page, $) {
        var voteAverage = page.find(".ratingblock  strong").text();
        return voteAverage ? 20 * parseFloat(voteAverage) : 0;
    };
    Album.prototype.findVoteCount = function (page, $) {
        if (this.voteAverage === null) {
            return 0;
        }
        var voteCount = page.find(".ratingblock p").text();
        if (!voteCount) {
            return 0;
        }
        return parseInt(voteCount.match(/\(([0-9]+) vote/)[1], 10);
    };
    Album.findCover = function (page) {
        var image = page.find(".couv .titre img").attr("src");
        return new image_1.ImageDetails(image, image
            ? image.replace("https://www.bedetheque.com/cache/thb_couv/", "")
            : null);
    };
    Album.findImage = function (page, className, path) {
        var image = page.find(".sous-couv ." + className).attr("href");
        return new image_1.ImageDetails(image, image
            ? image.replace("https://www.bedetheque.com/media/" + path + "/", "")
            : null);
    };
    Album.prototype.addDetails = function (page, $) {
        var _this = this;
        page.find(".infos > li").each(function (index, info) {
            var pageInfo = $(info);
            _this.addDetail(pageInfo);
        });
    };
    Album.prototype.addDetail = function (pageInfo) {
        var key = pageInfo
            .find("label")
            .text()
            .trim()
            .toLowerCase()
            .replace(" :", "");
        var link = pageInfo.find("a").attr("href");
        var value = pageInfo
            .text()
            .split(":")[1]
            .trim();
        if (!value) {
            return;
        }
        switch (key) {
            case "scénario":
                this.scenario = new AuthorDetails(value, link);
                break;
            case "dessin":
                this.drawing = new AuthorDetails(value, link);
                break;
            case "couleurs":
                this.colors = new AuthorDetails(value, link);
                break;
            case "dépot légal":
                var date = value.slice(0, 7);
                this.date = moment_1.default(date, "MM/YYYY").toDate();
                break;
            case "editeur":
                this.editor = value;
                break;
            case "planches":
                this.nbrOfPages = parseInt(value, 10);
                break;
            case "isbn":
                this.isbn = value;
                break;
            case "créé le":
                var matches = value.match(/(\d{2})\/(\d{2})\/(\d{4})/g);
                this.createdAt = moment_1.default(matches[0], "DD/MM/YYYY").toDate();
                this.updatedAt = moment_1.default(matches[1], "DD/MM/YYYY").toDate();
            default:
                break;
        }
    };
    Album.prototype.getImageDimensions = function () {
        var _this = this;
        if (this.imageCover == null)
            return;
        return probe_image_size_1.default("https://www.bedetheque.com/media/Couvertures/" + this.imageCover.path)
            .then(function (dimension) {
            _this.imageCoverWidth = dimension.width;
            _this.imageCoverHeight = dimension.height;
        })
            .catch(function () {
            // do nothing
        });
    };
    Album.formatAlbumsFromSerie = function ($, serie) {
        return $(".liste-albums > li")
            .filter(function (_index, elem) {
            return $(elem)
                .find(".numa")
                .text() === "";
        })
            .map(function (_index, elem) { return new Album($(elem), $, serie.serieId, serie.serieTitle); })
            .get();
    };
    return Album;
}());
exports.Album = Album;
