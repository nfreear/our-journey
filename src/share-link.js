/*!
  Our Journeys - share-link | © 2018 The Open University (IET-OU).
*/

module.exports = {
  createLink: createShareLink,
  loadLink: loadShareLink
};

const CORE = require('./core');

function createShareLink (elements) {
  var share = document.getElementById('oj-share-link');

  share.setAttribute('href', '?j=base64:' + encodeURIComponent(b64EncodeUnicode(JSON.stringify(elements))) + '&z');

  console.warn('createShareLink');
}

function loadShareLink (elements) {
  console.warn('loadShareLink - start');

  // var OJ = window.our_journeys;

  var qm = window.location.search.match(/\?j=base64:(.+(%3D%3D|==))/);
  if (qm) {
    var decoded;
    try {
      decoded = JSON.parse(b64DecodeUnicode(decodeURIComponent(qm[ 1 ])));
    } catch (ex) {
      console.error('---- ! ERROR in "loadShareLink()" function ! ----');
      console.error(ex);
      window.alert('Sorry, the URL parameter "j" was wrongly encoded. I failed to load your Journey :(');
      return;
    }

    for (var i = 0; i < decoded.length; i++) {
      elements[ i ] = { eID: decoded[i].eID, description: decoded[i].description, emoticon: decoded[i].emoticon, icon: decoded[i].icon, postit: decoded[i].postit };
    }

    CORE.updateElements();

    console.warn('loadShareLink - load COMPLETE ;) !');
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem

function b64EncodeUnicode (str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes (match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
}

function b64DecodeUnicode (str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(window.atob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

// End.
