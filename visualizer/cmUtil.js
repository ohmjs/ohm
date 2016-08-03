'use strict';

var cmUtil = (function() {  // eslint-disable-line no-unused-vars

  // Private helpers
  // ---------------

  function countLeadingWhitespace(str) {
    return str.match(/^\s*/)[0].length;
  }

  function countTrailingWhitespace(str) {
    return str.match(/\s*$/)[0].length;
  }

  function indexToHeight(cm, index) {
    var pos = cm.posFromIndex(index);
    return cm.heightAtLine(pos.line, 'local');
  }

  function isBlockSelectable(cm, startPos, endPos) {
    var lastLine = cm.getLine(endPos.line);
    return countLeadingWhitespace(cm.getLine(startPos.line)) === startPos.ch &&
           (lastLine.length - countTrailingWhitespace(lastLine)) === endPos.ch;
  }

  // Mark a block of text with `className` by marking entire lines.
  function markBlock(cm, startLine, endLine, className) {
    for (var i = startLine; i <= endLine; ++i) {
      cm.addLineClass(i, 'wrap', className);
    }
    return {
      clear: function() {
        for (var i = startLine; i <= endLine; ++i) {
          cm.removeLineClass(i, 'wrap', className);
        }
      }
    };
  }

  // Exports
  // -------

  return {
    markInterval: function(cm, interval, className, canHighlightBlocks) {
      var startPos = cm.posFromIndex(interval.startIdx);
      var endPos = cm.posFromIndex(interval.endIdx);

      // See if the selection can be expanded to a block selection.
      if (canHighlightBlocks && isBlockSelectable(cm, startPos, endPos)) {
        return markBlock(cm, startPos.line, endPos.line, className);
      }
      return cm.markText(startPos, endPos, {className: className});
    },

    clearMark: function(mark) {
      if (mark) {
        mark.clear();
      }
    },

    scrollToInterval: function(cm, interval) {
      var startHeight = indexToHeight(cm, interval.startIdx);
      var endHeight = indexToHeight(cm, interval.endIdx);
      var scrollInfo = cm.getScrollInfo();
      var margin = scrollInfo.clientHeight - (endHeight - startHeight);
      if (startHeight < scrollInfo.top ||
          endHeight > (scrollInfo.top + scrollInfo.clientHeight)) {
        cm.scrollIntoView({left: 0, top: startHeight,
                           right: 0, bottom: endHeight},
                          margin > 0 ? margin / 2 : undefined);
      }
    }
  };
})();
