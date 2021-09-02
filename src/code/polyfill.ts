// fix for ES compatibility
export default function polyfill() {
  // create Promise.allSettled if missing
  if (!Promise.allSettled) {
    Promise.allSettled = function (promises: Array<Promise<any>>) : Promise<Array<{status: 'fulfilled' | 'rejected', value?: any, reason?: any}>> {
      let mappedPromises = promises.map((p) => {
        return p
          .then((value) => {
            return {
              status: "fulfilled" as 'fulfilled',
              value,
            };
          })
          .catch((reason) => {
            return {
              status: "rejected" as 'rejected',
              reason,
            };
          });
      });
      return Promise.all(mappedPromises);
    };
  }
}
