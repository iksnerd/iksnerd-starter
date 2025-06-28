/**
 * Converts an image URL to a Blob
 *
 * Because of https://github.com/expo/expo/issues/2402#issuecomment-443726662
 *
 * @param {string} imageUrl
 *
 * @returns {Promise<Blob>}
 */
export async function imageUrlToBlob(imageUrl: string): Promise<Blob> {
  return await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', imageUrl, true);
    xhr.send(null);
  });
}
