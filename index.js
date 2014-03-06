var _ = require('underscore');
var marked = require('marked');

/**
 * Expose `gingkoImport()`.
 */

module.exports = gingkoImport;

/**
 * Convert markdown `text` to gingko tree json represenation.
 *
 * @param {String|Array} text - markdown text, or splitted by line array
 * @return {Array} - json represenation of gingko tree
 */

function gingkoImport(text) {
  if (Array.isArray(text)) text = text.join('\n');

  var tokens = marked.lexer(text);
  var blocks = tokensToBlocks(tokens);
  var nestedBlocks = blocksToNestedBlocks(blocks);
  var json = nestedBlocksToJson(nestedBlocks);

  return json.length ? json : [{ content: '' }];
}

/**
 * Creates reasonable chunks from the md tokens
 * containing the md text and depth information.
 *
 * @param {Array} tokens
 * @return {Array} of {content, paragraphs, [depth]} objects
 */

function tokensToBlocks(tokens) {
  var blocks = [];

  tokens.forEach(function(t) {
    if (t.type == 'heading') {
      blocks.push({ depth: t.depth, header: t.src, paragraphs: [] });
    } else if (t.src) {
      if (!blocks.length) blocks.push({ depth: 1, header: '', paragraphs: [] });
      _.last(blocks).paragraphs.push(t.src);
    }
  });

  return blocks;
}

/**
 * Creates a ginkgo-tree-like nested structure
 * from the flat block array.
 *
 * @param {Array} blocks
 * @return {Array}
 */

function blocksToNestedBlocks(blocks) {
  var acc = [];

  function _blocksToNestedBlocks(blocks, acc, depth) {
    while (blocks.length) {
      var block = _.head(blocks);
      if (block.depth == depth) {
        acc.push(block);
        blocks = _.tail(blocks);
      } else if (block.depth > depth) {
        // go in
        if (!acc.length) {
          acc.push({depth: depth, header: '', paragraphs: []});
        }
        var last = _.last(acc);
        last.children = [];
        blocks = _blocksToNestedBlocks(blocks, last.children, depth + 1);
      } else {
        // go out
        return blocks;
      }
    }
    return blocks; //empty by now
  }

  _blocksToNestedBlocks(blocks, acc, 1);
  return acc;
}

/**
 * Creates the final gingko json structure from the nestedBlocks
 *
 * Decides on which paragraphs to include inline
 * (eg one paragraph after header) and what to render as sub-nodes.
 *
 * @param {Array} nestedBlocks
 * @return {Array} - gingko JSON
 */

function nestedBlocksToJson(nestedBlocks) {
  return nestedBlocks.map(function(block) {
    var content = block.header;
    var inlineParagraphs = block.children && block.children.length
      || (block.paragraphs && block.paragraphs.length <= 1);

    if (inlineParagraphs) {
      content += block.paragraphs.join('');
    } else if (block.paragraphs) {
      block.children = block.paragraphs.map(function(p) {
        return { header: p.trimRight() };
      });
    }

    var o = { content: content.trimRight() };
    if (block.children && block.children.length) {
      o.children = nestedBlocksToJson(block.children);
    }
    return o;
  });
}
