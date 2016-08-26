/* eslint-env browser */
'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    root.httpUtil = initModule(root.Promise);
  }
})(this, function(Promise) {
  return {
    $http: function(url) {
      var core = {
        ajax: function(method, url, args) {
          var promise = new Promise(function(resolve, reject) {
            var client = new XMLHttpRequest();
            var uri = url;

            if (typeof args === 'object' && (method === 'POST' || method === 'PUT')) {
              uri += '?';
              var argcount = 0;
              for (var key in args) {
                if (args.hasOwnProperty(key)) {
                  if (argcount++) {
                    uri += '&';
                  }
                  uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                }
              }
            }

            client.open(method, uri);
            if (typeof args === 'string' && (method === 'POST' || method === 'PUT')) {
              client.send(args);
            } else {
              client.send();
            }

            client.onload = function() {
              if (this.status >= 200 && this.status < 300) {
                resolve(this.response);
              } else {
                reject(this.statusText);
              }
            };
            client.onerror = function() {
              reject(this.statusText);
            };
          });

          return promise;
        }
      };

      return { // eslint-disable quote-props
        get: function(args) {
          return core.ajax('GET', url, args);
        },
        post: function(args) {
          return core.ajax('POST', url, args);
        },
        put: function(args) {
          return core.ajax('PUT', url, args);
        },
        'delete': function(args) {
          return core.ajax('DELETE', url, args);
        }
      };
    }
  };
});
