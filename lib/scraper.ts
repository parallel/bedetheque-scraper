import {ProxyFetcher} from './proxy-fetcher';
import {Utils} from './utils';
import {Serie} from './serie';
import {Album} from './album';

export class Scraper {

  static async getSeriesUrlFromLetter(letter) {
    console.log(`Searching all series beginning with the letter ${letter}`);

    const url = `https://www.bedetheque.com/bandes_dessinees_${letter}.html`;
    const promises = Array.from(Array(50)).map(() => ProxyFetcher.requestProxy(url, 10));

    const seriesUrl = await Utils.raceFirstSuccess(promises)
      .then(($) => $('.nav-liste li')
        .filter((index, element) => ($(element).find('img').attr('src').includes('France')))
        .map((index, element) => $(element).find('a').attr('href').replace('.html', '__10000.html'))
        .get()) as string[];

    console.log(`Found ${seriesUrl.length} series beginning with the letter ${letter}`);

    return seriesUrl;
  }

  static async getSerie(url: string, sleepTime: number) {
    let $: CheerioStatic;
    await Utils.setTimeoutPromise(sleepTime);

    const displayUrl = url
      .replace('https://www.bedetheque.com/', '')
      .replace('__10000.html', '');

    try {
      $ = await ProxyFetcher.requestProxy(url, 60);
    } catch (e) {
      console.log(`✗ url: ${displayUrl}`);
      return this.getSerie(url, 500);
    }

    const serie = new Serie($);
    const albums = $('.liste-albums > li')
      .map((index, elem) => new Album($(elem), $, serie.serieId, serie.serieTitle))
      .get() as unknown as Album[];

    serie.addAlbumsInfo(albums);

    console.log(`✓ url: ${displayUrl}`);

    return {serie, albums};
  }
}


