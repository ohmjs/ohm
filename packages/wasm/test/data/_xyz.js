(function(window, document) {
  const version = '3.7.3';
  const options = window.html5 || {};
  const reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
  const saveClones =
    /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
  let supportsHtml5Styles;
  const expando = '_html5shiv';
  let expanID = 0;
  const expandoData = {};
  let supportsUnknownElements;
  (function() {
    try {
      const a = document.createElement('a');
      a.innerHTML = '<xyz></xyz>';
      supportsHtml5Styles = 'hidden' in a;
      supportsUnknownElements =
        a.childNodes.length == 1 ||
        (function() {
          document.createElement('a');
          const frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode === 'undefined' ||
            typeof frag.createDocumentFragment === 'undefined' ||
            typeof frag.createElement === 'undefined'
          );
        })();
    } catch (e) {
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }
  })();
  function addStyleSheet(ownerDocument, cssText) {
    const p = ownerDocument.createElement('p');
    const parent =
      ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;
    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }
  function getElements() {
    const {elements} = html5;
    return typeof elements === 'string' ? elements.split(' ') : elements;
  }
  function addElements(newElements, ownerDocument) {
    let {elements} = html5;
    if (typeof elements !== 'string') {
      elements = elements.join(' ');
    }
    if (typeof newElements !== 'string') {
      newElements = newElements.join(' ');
    }
    html5.elements = elements + ' ' + newElements;
    shivDocument(ownerDocument);
  }
  function getExpandoData(ownerDocument) {
    let data = expandoData[ownerDocument[expando]];
    if (!data) {
      data = {};
      expanID++;
      ownerDocument[expando] = expanID;
      expandoData[expanID] = data;
    }
    return data;
  }
  function createElement(nodeName, ownerDocument, data) {
    if (!ownerDocument) {
      ownerDocument = document;
    }
    if (supportsUnknownElements) {
      return ownerDocument.createElement(nodeName);
    }
    if (!data) {
      data = getExpandoData(ownerDocument);
    }
    let node;
    if (data.cache[nodeName]) {
      node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
      node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
      node = data.createElem(nodeName);
    }
    return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ?
      data.frag.appendChild(node) :
      node;
  }
  function createDocumentFragment(ownerDocument, data) {
    if (!ownerDocument) {
      ownerDocument = document;
    }
    if (supportsUnknownElements) {
      return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    const clone = data.frag.cloneNode();
    let i = 0;
    const elems = getElements();
    const l = elems.length;
    for (; i < l; i++) {
      clone.createElement(elems[i]);
    }
    return clone;
  }
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
      data.cache = {};
      data.createElem = ownerDocument.createElement;
      data.createFrag = ownerDocument.createDocumentFragment;
      data.frag = data.createFrag();
    }
    ownerDocument.createElement = function(nodeName) {
      if (!html5.shivMethods) {
        return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };
    ownerDocument.createDocumentFragment = Function(
        'h,f',
        'return function(){' +
        'var n=f.cloneNode(),c=n.createElement;' +
        'h.shivMethods&&(' +
        getElements()
            .join()
            .replace(/[\w\-:]+/g, nodeName => {
              data.createElem(nodeName);
              data.frag.createElement(nodeName);
              return 'c("' + nodeName + '")';
            }) +
        ');return n}',
    )(html5, data.frag);
  }
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
      ownerDocument = document;
    }
    const data = getExpandoData(ownerDocument);
    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(
          ownerDocument,
          'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
          'mark{background:#FF0;color:#000}' +
          'template{display:none}',
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }
  var html5 = {
    elements:
      options.elements ||
      'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',
    version,
    shivCSS: options.shivCSS !== false,
    supportsUnknownElements,
    shivMethods: options.shivMethods !== false,
    type: 'default',
    shivDocument,
    createElement,
    createDocumentFragment,
    addElements,
  };
  window.html5 = html5;
  shivDocument(document);
  if (typeof module === 'object' && module.exports) {
    module.exports = html5;
  }
})(typeof window !== 'undefined' ? window : this, document);
