import * as moment from 'moment';
import { Proxy } from './proxy';
import { Utils } from '../utils';
import { DataBase } from './database';
import { Album } from './album';
import { Message } from './message';

export class Scrapper {
  public nbrOfSeries = 0;

  public seriesDone = 0;

  public currentLetter = '?';

  public date = moment();

  constructor() {
    this.getAllSeries();
  }

  private async getAllSeries() {
    const letters = '0ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    for (const letter of letters) {
      const db = await DataBase.readDb(letter);
      const proxy = new Proxy();
      await proxy.getFreeProxyList(5000);

      await this.getSeriesFromLetter(proxy, letter, db);

      Message.letterDone(letter);
    }

    Message.databaseScraped();
  }

  private async getSeriesFromLetter(proxy: Proxy, letter, db) {
    Message.searchingSeriesFromLetter(letter);
    const uri = `https://www.bedetheque.com/bandes_dessinees_${letter}.html`;
    const $: CheerioAPI = await proxy.requestProxy(uri);

    if (!$) { return this.getSeriesFromLetter(proxy, letter, db); }

    const series = $('.nav-liste li')
      .filter((index, element) => ($(element).find('img').attr('src').includes('France')))
      .map((index, element) => $(element).find('a').attr('href').replace('.html', '__10000.html'))
      .get()
      .filter(sUri => !db[sUri.match(/serie-([0-9]*)-BD/)[1]]);

    this.nbrOfSeries += series.length;
    this.currentLetter = letter;
    Message.foundSeriesFromLetter(series, letter);
    return Promise.all(series.map((url, index) => this.getSerie(proxy, url, index * 500, db)));
  }

  private async getSerie(proxy : Proxy, uri, sleepTime, db) {
    await Utils.setTimeoutPromise(sleepTime);
    const $: CheerioAPI = await proxy.requestProxy(uri);
    if (!$) {
      Message.serieFail(++this.seriesDone, this.nbrOfSeries, uri);
      return null;
    }
    const serie = this.getSerieInfo($);

    db[serie.id] = serie;

    DataBase.writeDbSync(db, this.currentLetter);

    Message.serieAdded(++this.seriesDone, this.nbrOfSeries, serie);
    return serie;
  }

  private getSerieInfo($) {
    return {
      id: parseInt($('.idbel').text(), 10),
      titre: $('h1 a').text(),
      albums: this.getSerieAlbums($),
    };
  }

  private getSerieAlbums($) {
    const albums = {};
    $('.liste-albums > li')
      .each((index, elem) => {
        const album = new Album($(elem), $);
        albums[album.id] = album;
      });
    return albums;
  }

  public getDuration() {
    const now = moment();
    const then = this.date;
    const ms = moment(now, 'DD/MM/YYYY HH:mm:ss').diff(moment(then, 'DD/MM/YYYY HH:mm:ss'));
    const d = moment.duration(ms);
    return `${Math.floor(d.asHours())}h${moment.utc(ms).format(':mm[m]:ss[s]')}`;
  }
}
