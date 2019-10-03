export class Utils {

  static raceFirstSuccess(promises) {
    return Promise.all(promises.map(p => p.then(val => Promise.reject(val), err => Promise.resolve(err))))
      .then(errors => Promise.reject(errors), val => Promise.resolve(val));
  }

  static timeoutRequest(maxSeconds: number, promise: Promise<any>) {
    return new Promise(((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'));
      }, maxSeconds * 1000);
      promise.then(resolve, reject);
    }));
  }

  static setTimeoutPromise(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
}
