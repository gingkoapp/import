/**
 * Expose `gingkoImport()`.
 */

module.exports = gingkoImport;

var _ = require('underscore');

/**
 * Creates reasonable chunks from the md tokens containing the md text and depth information
 *
 * @param tokens
 * @returns {Array} of {content, paragraphs, [depth]} objects
 */
function as_blocks(tokens) {
  var blocks = [];

  /**
   * Get or create the last block and append text as a new paragraph (will be processed at a later step)
   * @param text
   */
  function add_paragraph_to_block(text) {
    if (!blocks.length) {
      blocks.push({depth: 1, header: "", paragraphs: []})
    }
    _.last(blocks).paragraphs.push(text);
  }


  _.each(tokens, function(t) {
    switch (t.type) {
      case 'heading':
        blocks.push({depth: t.depth, header: t.src, paragraphs: []});
        break;

      case 'paragraph':
      case 'code':
      case 'list_end':
        if (!t.src) {
          console.warn("Empty src for token: " + t.type);
        }
        add_paragraph_to_block(t.src);
        break;

      case 'list_item_start':
      case 'loose_item_start':
      case 'text':
      case 'list_item_end':
      case 'list_start':
        if (t.src) {
          console.warn("Non-empty src for ignored token: " + t.type);
        }
        break;

      default:
        console.warn("Unknown marked token: " + t.type);
        if (t.text) {
          add_paragraph_to_block(t.text)
        }
    }
  });
  return blocks;
}

/**
 * Creates a ginkgo-tree-like nested structure from the flat block array
 * @param {Array} blocks
 * @returns {Array}
 */
function nested_blocks(blocks) {
  var acc = [];
  var depth = 1;
  _nested_blocks(blocks, acc, depth);
  return acc;
}

function _nested_blocks(blocks, acc, depth) {
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
      blocks = _nested_blocks(blocks, last.children, depth + 1);
    } else {
      // go out
      return blocks;
    }
  }
  return blocks; //empty by now
}

/**
 * Creates the final gingko json structure from the nested_blocks
 *
 * Decides on which paragraphs to include inline (eg one paragraph after header) and what to render as sub-nodes.
 *
 * @param nested_blocks
 * @returns {Array} - gingko JSON
 */
function nested_blocks_to_gingko(nested_blocks) {
  return _.map(nested_blocks, function(block) {
    var content = block.header;
    var inline_paragraphs = block.children && block.children.length || (block.paragraphs && block.paragraphs.length <= 1);
    if (inline_paragraphs) {
      content += block.paragraphs.join("");
    } else {
      block.children = paragraphs_as_blocks(block.paragraphs);
    }
    var o = {content: content.trimRight()};
    if (block.children && block.children.length) {
      o.children = nested_blocks_to_gingko(block.children);
    }
    return o;
  })
}

function paragraphs_as_blocks(paragraphs) {
  return _.map(paragraphs, function(p) {
    return {header: p.trimRight()}
  })
}


gingko_from_marked_tokens = _.compose(nested_blocks_to_gingko, nested_blocks, as_blocks);


/**
 * Convert markdown `text` to gingko tree json represenation.
 *
 * @param {String} text - markdown text
 * @return {Array} - json represenation of gingko tree
 * @api public
 */

function gingkoImport(text) {
  var marked = require('./lib/marked');

  var marked_options = {
    gfm: true
  };

  var tokens = marked.lexer(text, marked_options);

// Token list example = [
//  { type: 'heading', depth: 1, text: 'Alien' },
//  { type: 'paragraph', text: 'The small crew of a deep space ...' },
//  { type: 'heading', depth: 3, text: 'Final Image' }
//]

  var gingko_json = gingko_from_marked_tokens(tokens);

  if (!gingko_json.length) {
    // special case - an empty gingko tree should have an empty block
    return [
      { content: '' }
    ];
  }
  return gingko_json;
}
