import _ from 'underscore';

/*eslint no-use-before-define:0*/
const modelsEqual = function(obj1, obj2) {
  if (!obj1 && !obj2)
    return true;
  if (obj1.id && !obj2)
    return false;
  if (obj2.id && !obj1)
    return false;
  return obj1.id === obj2.id;
};

const arrayIsEqual = function(arr, other, deep) {
  // if the other array is a falsy value, return
  if (!arr && !other) {
    return true;
  }

  if (!arr || !other) {
    return false;
  }

  // compare lengths - can save a lot of time
  if (arr.length != other.length) {
    return false;
  }

  for (let i = 0, l = Math.max(arr.length, other.length); i < l; i++) {
    return valueIsEqual(arr[i], other[i], deep);
  }
};

const valueIsEqual = function(value, other, deep) {
  if (value === other) {
    return true;
  } else if (_.isArray(value) || _.isArray(other)) {
    if (arrayIsEqual(value, other, deep)) {
      return true;
    }
  } else if (_.isObject(value) || _.isObject(other)) {
    if (objectMatchesSubset(value, other, deep)) {
      return true;
    }
  }
  return false;
};

const objectMatchesSubset = function(obj, other, deep){
  let k;

  if (obj === other) {
    return true;
  }

  if (!obj || !other) {
    return false;
  }

  if (deep !== true) {
    for (k in other) {
      if (obj[k] != other[k]) {
        return false;
      }
    }
    return true;
  }

  for (k in other) {
    if (!valueIsEqual(obj[k], other[k], deep)) {
      return false;
    }
  }
  return true;
};

// XXX(dcramer): the previous mechanism of using _.map here failed
// miserably if a param was named 'length'
const objectToArray = function(obj) {
  let result = [];
  for (let key in obj) {
    result.push([key, obj[key]]);
  }
  return result;
};

const compareArrays = function(arr1, arr2, compFunc) {
  if (arr1 === arr2) {
    return true;
  }
  if (!arr1) {
    arr1 = [];
  }
  if (!arr2) {
    arr2 = [];
  }

  if (arr1.length != arr2.length) {
    return false;
  }

  for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
    if (!arr1[i]) {
      return false;
    }
    if (!arr2[i]) {
      return false;
    }
    if (!compFunc(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
};

const intcomma = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default {
  getQueryParams() {
    let hashes, hash;
    let vars = {}, href = window.location.href;

    if (href.indexOf('?') == -1)
      return vars;

    hashes = href.slice(
      href.indexOf('?') + 1,
      (href.indexOf('#') != -1 ? href.indexOf('#') : href.length)
    ).split('&');

    hashes.forEach((chunk) => {
      hash = chunk.split('=');
      if (!hash[0] && !hash[1]) {
        return;
      }

      vars[decodeURIComponent(hash[0])] = (hash[1] ? decodeURIComponent(hash[1]).replace(/\+/, ' ') : '');
    });

    return vars;
  },

  sortArray(arr, score_fn) {
    arr.sort((a, b) => {
      let a_score = score_fn(a), b_score = score_fn(b);

      for (let i = 0; i < a_score.length; i++) {
        if (a_score[i] > b_score[i]) {
          return 1;
        }
        if (a_score[i] < b_score[i]) {
          return -1;
        }
      }
      return 0;
    });

    return arr;
  },

  objectIsEmpty(obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return true;
  },

  trim(str) {
    return str.replace(/^\s+|\s+$/g,'');
  },

  defined(item) {
    return !_.isUndefined(item) && item !== null;
  },

  nl2br(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
  },

  isUrl(str) {
    return !!str && _.isString(str) && (str.indexOf('http://') === 0 || str.indexOf('https://') === 0);
  },

  isOwnersTag(str) {
    return str == 'owner(s)';
  },

  getOwnershipServiceUrl(str) {
    var url = 'https://sauron.zncloud.net/metadata/resources/dashboard/name=/type=all/owners_emails=';
    var regex = /\w+@zenefits.com/gi;
    var m = str.match(regex);
    if (m && m.length == 1) {
      var email = m[0];
      return url + email;
    }

    return null;
  },

  escape(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },

  percent(value, totalValue, precise) {
    return value / totalValue * 100;
  },

  urlize(str) {
    // TODO
    return str;
  },

  toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },

  arrayIsEqual: arrayIsEqual,
  objectMatchesSubset: objectMatchesSubset,
  compareArrays: compareArrays,
  intcomma: intcomma,
  modelsEqual: modelsEqual,
  valueIsEqual: valueIsEqual,
  parseLinkHeader: require('./utils/parseLinkHeader'),
  deviceNameMapper: require('./utils/deviceNameMapper'),
  objectToArray: objectToArray,

  Collection: require('./utils/collection'),
  PendingChangeQueue: require('./utils/pendingChangeQueue'),
  StreamManager: require('./utils/streamManager'),
  CursorPoller: require('./utils/cursorPoller'),
};
