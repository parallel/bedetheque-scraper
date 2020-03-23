import { Utils } from "./utils";
import { ImageDetails } from "./image";

import probe from "probe-image-size";

// image: https://www.bedetheque.com/media/Photos/${image}
export class Author {
  html: string;
  authorId: number;
  image?: ImageDetails;
  imageWidth?: number;
  imageHeight?: number;
  name: string;
  birthDate?: string;
  deathDate?: string;
  seriesIdScenario: number[];
  seriesIdDrawing: number[];
  seriesIdBoth: number[];

  constructor($: CheerioStatic) {
    this.html = $.html();
    
    const info = $(".auteur-info").text();

    let match = info.match(/Identifiant :([0-9]+)/);
    this.authorId = match ? parseInt(match[1], 10) : null;

    this.name = $(".auteur-nom").text();
    this.image = Author.getImage($);

    match = info.match(/Naissance :le ([0-9]+\/[0-9]+\/[0-9]+)/);
    this.birthDate = match ? match[1] : null;

    match = info.match(/Décès :le ([0-9]+\/[0-9]+\/[0-9]+)/);
    this.deathDate = match ? match[1] : null;

    const series = $("table")
      .filter(
        (i, e) =>
          $(e)
            .find("thead #tri0")
            .text() === "Séries principales"
      )
      .find("tbody tr")
      .filter(
        (i, e) =>
          $(e)
            .find("img")
            .attr("src") === "https://www.bdgest.com/skin/flags/France.png"
      );

    this.seriesIdBoth = this.getSeriesId($, series, true, true);
    this.seriesIdScenario = this.getSeriesId($, series, true, false);
    this.seriesIdDrawing = this.getSeriesId($, series, false, true);
  }

  private static getImage($: CheerioStatic): ImageDetails {
    const image = $(".auteur-image img").attr("src");
    return image && image !== "https://www.bdgest.com/skin/nophoto.png" 
      ? new ImageDetails(image, image.replace("https://www.bedetheque.com/media/Photos/", ""))
      : null;
  }

  private getSeriesId(
    $: CheerioStatic,
    series: Cheerio,
    isScen: boolean,
    isDraw: boolean
  ) {
    return series
      .filter((i, e) => {
        const icons = $(e).find(".parution i");
        const scen = isScen
          ? icons.hasClass("icon-scen")
          : !icons.hasClass("icon-scen");
        const draw = isDraw
          ? icons.hasClass("icon-dess")
          : !icons.hasClass("icon-dess");
        return scen && draw;
      })
      .map((i, e) =>
        $(e)
          .find(".serie a")
          .attr("href")
      )
      .get()
      .map(url => Utils.urlToSerieID(url));
  }

  async getImageDimensions() {
    if (this.image == null) return;

    return probe(`https://www.bedetheque.com/media/Photos/${this.image}`)
      .then(dimension => {
        this.imageWidth = dimension.width;
        this.imageHeight = dimension.height;
      })
      .catch(() => {
        // do nothing
      });
  }
}
