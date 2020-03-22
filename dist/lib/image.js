"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ImageDetails = /** @class */ (function () {
    function ImageDetails(url, path) {
        this.path = path;
        this.url = url;
    }
    return ImageDetails;
}());
exports.ImageDetails = ImageDetails;
exports.getAuthorPhoto = function (imagePath) {
    return imagePath && "https://www.bedetheque.com/media/Photos/" + imagePath;
};
exports.getSerieCover = function (imagePath) {
    return imagePath && "https://www.bedetheque.com/media/Couvertures/" + imagePath;
};
exports.getAlbumCover = function (imagePath) {
    return imagePath && "https://www.bedetheque.com/media/Couvertures/" + imagePath;
};
exports.getAlbumImageExtract = function (imagePath) {
    return imagePath && "https://www.bedetheque.com/media/Planches/" + imagePath;
};
exports.getAlbumCoverVerso = function (imagePath) {
    return imagePath && "https://www.bedetheque.com/media/Versos/" + imagePath;
};
