/* eslint-env browser */
'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    root.httpUtil = initModule();
  }
})(this, function() {
  var MAX_REQUESTS = 100;
  var queue = [];
  var activeRequests = 0;

  return {
    $http: function(url) {
      function bufferedAjax() {
        if (activeRequests >= MAX_REQUESTS) {
          queue.push(Array.prototype.slice.call(arguments));
        } else {
          activeRequests++;
          ajax.apply(this, arguments);
        }
      }

      function dequeue() {
        if (queue.length > 0) {
          var next = queue.shift();
          next.unshift(ajax, 0);
          setTimeout.apply(this, next);
        } else {
          activeRequests--;
        }
      }

      function ajax(method, url, args, cb) {
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
          dequeue();
          if (this.status >= 200 && this.status < 300) {
            cb(null, this.response);
          } else {
            cb(this.statusText);
          }
        };
        client.onerror = function() {
          dequeue();
          cb(this.statusText);
        };
      }

      return {
        get: function(args, cb) {
          bufferedAjax('GET', url, args, cb);
        },
        post: function(args, cb) {
          bufferedAjax('POST', url, args, cb);
        },
        put: function(args, cb) {
          bufferedAjax('PUT', url, args, cb);
        },
        delete: function(args, cb) {
          bufferedAjax('DELETE', url, args, cb);
        }
      };
    }
  };
});
