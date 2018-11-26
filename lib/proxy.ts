import * as cheerio from 'cheerio';
import * as _ from 'lodash';
import axios from 'axios-https-proxy-fix';
import { Message } from './message';

export interface ProxyType{
  host: string;
  port: number;
}

export class Proxy {
  private proxyList!: ProxyType[];

  async getFreeProxyList(timeout : number) {
    Message.searchingFreeProxiesList(timeout);
    this.proxyList = await axios.get(`https://proxyscrape.com/proxies/HTTP_${timeout}ms_Timeout_Proxies.txt`)
      .then(response => response.data.trim().split('\r\n')
        .map((p: string) => ({ host: p.split(':')[0], port: parseInt(p.split(':')[1], 10) })));
    Message.foundFreeProxiesList(this.proxyList, timeout);
  }

  private getRandomProxy() {
    const indexProxy = _.random(this.proxyList.length - 1);
    return this.proxyList[indexProxy];
  }

  async requestProxy(url: string, nbrRetry = 5): Promise<any> {
    if (nbrRetry === 0) { return null; }
    url = encodeURI(url);
    const proxy = this.getRandomProxy();
    return this.timeoutRequest(60000, axios.get(url, { proxy }))
      .then((result: any) => cheerio.load(result.data))
      .catch((error) => {
        console.log(`retry ${nbrRetry}: ${url} ${error.message || error.code || error}`);
        return this.requestProxy(url, --nbrRetry);
      });
  }

  timeoutRequest(ms: number, promise: Promise<any>) {
    return new Promise(((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'));
      }, ms);
      promise.then(resolve, reject);
    }));
  }
}