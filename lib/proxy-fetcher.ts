import * as cheerio from 'cheerio';
import lodash from 'lodash';
import axiosHttpsProxyFix from 'axios-https-proxy-fix';
import {Utils} from './utils';

export interface ProxyType {
  host: string;
  port: number;
}

export class ProxyFetcher {

  private static _list: ProxyType[] = [];

  static async getFreeProxyList(timeout: 5000 | 10000 = 5000) {
    console.log(`Searching for proxies with a timeout of ${timeout}ms`);

    this._list = await axiosHttpsProxyFix
      .get(`https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=${timeout}`)
      .then(response => response.data.trim().split('\r\n').map((p: string) => ({
        host: p.split(':')[0],
        port: parseInt(p.split(':')[1], 10)
      })));

    console.log(`Found ${this._list.length} proxies with a timeout of ${timeout}ms`);
  }

  static requestProxy(urlRaw: string, maxSeconds: number) {
    const url = encodeURI(urlRaw);
    const randomIndex = lodash.random(this._list.length - 1);
    const randomProxy = this._list[randomIndex];

    return Utils.timeoutRequest(maxSeconds, axiosHttpsProxyFix.get(url, {proxy: randomProxy}))
      .then((result: any) => cheerio.load(result.data));
  }
}
