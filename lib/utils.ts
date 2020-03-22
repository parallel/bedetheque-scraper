import axiosHttpsProxyFix, { AxiosResponse } from "axios-https-proxy-fix";
import { Proxy } from "./proxy-fetcher";
import * as cheerio from "cheerio";

export class Utils {
  static async requestWithProxy(urlRaw: string, proxy: Proxy) {
    const url = encodeURI(urlRaw);
    const result = await Utils.promiseWithTimeout(
      axiosHttpsProxyFix.get(url, { proxy }),
      60000
    );
    const $ = cheerio.load(result.data);
    if ($("title").text() == "") {
      throw new Error("IP is blacklisted");
    }
    return $;
  }

  static promiseWithTimeout(promise: Promise<any>, ms: number): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("timeout"));
      }, ms);
      promise.then(resolve, reject);
    });
  }

  static urlToSerieID(url: string) {
    const match = url.match(/serie-([0-9]+)-/);
    return match ? parseInt(match[1], 10) : 0;
  }

  static urlToAuthorID(url: string) {
    const match = url.match(/auteur-([0-9]+)-/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
