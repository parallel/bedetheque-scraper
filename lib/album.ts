// imageCoverLarge: https://www.bedetheque.com/media/Couvertures/${imageCover}
// imageCoverSmall: https://www.bedetheque.com/cache/thb_couv/${imageCover}
// imageExtractLarge: https://www.bedetheque.com/media/Planches/${imageExtract}
// imageExtractSmall: https://www.bedetheque.com/cache/thb_planches/${imageExtract}
// imageReverseLarge: https://www.bedetheque.com/media/Versos/${imageReverse}
// imageReverseSmall: https://www.bedetheque.com/cache/thb_versos/${imageReverse}

export class Album {
  public serieId: number;
  public albumId: number;
  public serieTitle: string;
  public albumTitle: string | null;
  public scenario!: string | null;
  public drawing!: string | null;
  public colors!: string | null;
  public date!: string | null;
  public editor!: string | null;
  public nbrOfPages!: number | null;
  public imageCover: string | null;
  public imageExtract: string | null;
  public imageReverse: string | null;
  // voteAverage /100
  public voteAverage: number;
  public voteCount: number;

  constructor(page: Cheerio, $: CheerioStatic, serieId: number, serieTitle: string) {
    this.serieId = serieId;
    this.serieTitle = serieTitle;
    this.albumId = parseInt(page.children().first().attr('name'), 10);
    this.albumTitle = page.find('.album-main .titre').attr('title');
    this.imageCover = this.findImage(page, 'browse-couvertures', 'Couvertures');
    this.imageExtract = this.findImage(page, 'browse-planches', 'Planches');
    this.imageReverse = this.findImage(page, 'browse-versos', 'Versos');
    this.voteAverage = this.findVoteAverage(page, $);
    this.voteCount = this.findVoteCount(page, $);
    this.addDetails(page, $);
  }

  private findVoteAverage(page: Cheerio, $: CheerioStatic) {
    const voteAverage = page.find('.ratingblock  strong').text();
    return voteAverage ? 20 * parseFloat(voteAverage) : 0;
  }

  private findVoteCount(page: Cheerio, $: CheerioStatic) {
    if (this.voteAverage === null) {
      return 0;
    }
    const voteCount = page.find('.ratingblock p').text();
    if (!voteCount) {
      return 0;
    }
    return parseInt(voteCount.match(/\(([0-9]+) vote/)![1], 10);
  }

  private findImage(page: Cheerio, className: string, path: string) {
    const image = page.find(`.sous-couv .${className}`).attr('href');
    return image
      ? image.replace(`https://www.bedetheque.com/media/${path}/`, '')
      : null;
  }

  private addDetails(page: Cheerio, $: CheerioStatic) {
    page.find('.infos > li')
      .each((index, info) => {
        const pageInfo = $(info);
        this.addDetail(pageInfo);
      });
  }

  private addDetail(pageInfo: Cheerio) {
    const key = pageInfo.find('label').text().trim()
      .toLowerCase()
      .replace(' :', '');

    const value = pageInfo.text().split(':')[1]
      ? pageInfo.text().split(':')[1].trim()
      : null;

    if (!value) {
      return;
    }

    switch (key) {
      case 'scénario':
        this.scenario = value;
        break;
      case 'dessin':
        this.drawing = value;
        break;
      case 'couleurs':
        this.colors = value;
        break;
      case 'dépot légal':
        this.date = value.slice(0, 7);
        break;
      case 'editeur':
        this.editor = value;
        break;
      case 'planches':
        this.nbrOfPages = parseInt(value, 10);
        break;
      default:
        break;
    }
  }
}
