<!--
Displays the expanded input of the parse tree nodes in a canvas element.
-->

<template>
  <div class="outer">
    <div class="sizer"></div>
    <canvas width="1" height="1"></canvas>
  </div>
</template>

<style scoped>
  .sizer::before {
    content: '\00a0';  /* &nbsp; */
  }

  /*
    The sizer serves as a stand-in for the text that will be rendered in the canvas
    element; the style must be consistent with what is actually rendered.
   */
  .sizer {
    font-family: Menlo, Monaco, sans-serif;
    font-size: 100%;
  }

  .outer {
    border-bottom: 1px solid #ddd;
    padding: 8px 0;
    position: relative;  /* For positioning the canvas. */
  }

  canvas {
    position: absolute;
    left: 0;
    top: 8px;
  }
</style>

<script>
  var ArrayProto = Array.prototype;

  function isRectInViewport(rect) {
    return rect.right > 0 && rect.left < window.innerWidth;
  }

  module.exports = {
    computed: {
      canvasEl: function() {
        return this.$el.querySelector('canvas');
      },
      inputCtx: function() {
        return this.canvasEl.getContext('2d');
      }
    },
    mounted: function() {
      this.update();
    },
    methods: {
      getPixelRatio: function() {
        return window.devicePixelRatio || 1;
      },

      // Updates the size of the canvas to exactly cover the #sizer element.
      // As a side effect, the contents of the canvas are cleared.
      updateCanvasSize: function() {
        var el = this.canvasEl;
        var sizer = this.$el.querySelector('.sizer');
        var pixelRatio = this.getPixelRatio();
        el.width = sizer.offsetWidth * pixelRatio;
        el.height = sizer.offsetHeight * pixelRatio;
        el.style.width = sizer.offsetWidth + 'px';
        el.style.height = sizer.offsetHeight + 'px';
      },

      update: function(optAnimatingEl, isCollapsing, t) {
        var $ = window.domUtil.$;

        this.updateCanvasSize();

        // If a parse tree node is currently being hovered, highlight it. If not, highlight
        // the node that has .zoomBorder, if one exists.
        var hovered = $('.pexpr > .self:hover');
        var highlightEl = hovered ? hovered.parentNode : $('.zoomBorder');

        // If there is an animating element, crossfade its input with the input of its
        // descendents -- fade in when collapsing, fade out when expanding.
        var animatingElAlpha = 0;
        if (optAnimatingEl) {
          animatingElAlpha = isCollapsing ? t : 1 - t;
        }

        var root = $('.pexpr');
        var firstFailedEl = domUtil.$('#parseResults > .pexpr > .children > .pexpr.failed');

        var self = this;
        (function renderInput(el, isAncestorAnimating) {
          var rect = el.getBoundingClientRect();

          // Skip anything that falls outside the viewport, and any failed nodes apart
          // from the first top-level failure.
          if (!isRectInViewport(rect) ||
              (el.classList.contains('failed') && el !== firstFailedEl)) {
            return;
          }

          if (el === highlightEl) {
            self.renderHighlight(el);
          }

          if (el.classList.contains('leaf') || el.classList.contains('collapsed')) {
            if (el === firstFailedEl) {
              self.renderFailedInputText(el, rect);
            } else {
              var alpha = isAncestorAnimating ? 1 - animatingElAlpha : 1;
              self.renderInputText(self.getConsumedInput(el), rect, alpha);
            }
          } else {
            // Is `el` currently animating?
            var isAnimating = el === optAnimatingEl;

            // Render the input of the animating element, even though it's not a leaf.
            if (isAnimating) {
              self.renderInputText(self.getConsumedInput(el), rect, animatingElAlpha);
            }

            // Ask the subtrees to render.
            var children = el.lastChild.childNodes;
            ArrayProto.forEach.call(children, function(childEl) {
              renderInput(childEl, isAnimating || isAncestorAnimating);
            });
          }
        })(root, false);
      },

      measureText: function(text) {
        // Always update the font before measuring -- devicePixelRatio may have changed.
        this.inputCtx.font = 16 * this.getPixelRatio() + 'px Menlo, Monaco, monospace';
        return this.inputCtx.measureText(text).width / this.getPixelRatio();
      },

      renderInputText: function(text, rect, optAlpha) {
        var textWidth = this.measureText(text);
        var letterPadding = (rect.right - rect.left - textWidth) / text.length / 2;
        var charWidth = textWidth / text.length;

        this.inputCtx.fillStyle = 'rgba(51, 51, 51, ' + (optAlpha == null ? 1 : optAlpha) + ')';
        this.inputCtx.textBaseline = 'top';

        var x = rect.left;
        for (var i = 0; i < text.length; i++) {
          x += letterPadding;
          this.inputCtx.fillText(text[i], x * this.getPixelRatio(), 0);
          x += charWidth + letterPadding;
        }
        return x <= window.innerWidth;
      },

      renderFailedInputText: function(el, rect) {
        var text = el._traceNode.inputStream.sourceSlice(el._traceNode.pos);
        var renderRect = {
          bottom: rect.bottom,
          left: rect.left,
          right: rect.left + this.measureText(text),
          top: rect.top
        };
        this.renderInputText(text, renderRect, 0.5);
      },

      renderHighlight: function(el) {
        var elBounds = el.getBoundingClientRect();
        var pixelRatio = this.getPixelRatio();
        var rect = {
          x: elBounds.left * pixelRatio,
          y: 0,
          width: (elBounds.right - elBounds.left) * pixelRatio,
          height: this.canvasEl.height
        };
        this.inputCtx.fillStyle = '#B5D5FF';
        this.inputCtx.fillRect(rect.x, rect.y, rect.width, rect.height);
      },

      getConsumedInput: function(el) {
        if (el._traceNode) {
          return el._traceNode.source.contents;
        }
      }
    }
  };
</script>
