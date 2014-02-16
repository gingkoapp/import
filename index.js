/**
 * Expose `gingkoImport()`.
 */

module.exports = gingkoImport;

var _ = require('underscore');

//var EXAMPLE = [
//  { type: 'heading', depth: 1, text: 'Alien' },
//  { type: 'paragraph', text: 'The small crew of a deep space ...' },
//  { type: 'heading', depth: 3, text: 'Final Image' }
//]


function token_to_text(t) {
  if (t.type == 'heading') {
    return (new Array(t.depth + 1)).join('#') + ' ' + t.text;
  }
  return t.text;
}

function as_blocks(tokens) {
  var acc = [];
  _.each(tokens, function(t) {
    var txt = token_to_text(t);
    if (t.depth) {
      acc.push({depth: t.depth, content: txt, paragraphs: []});
    } else {
      if (!acc.length) {
        acc.push({depth: 1, content: "", paragraphs: []})
      }
      _.last(acc).paragraphs.push(txt);
    }
  });
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
        acc.push({depth: depth, content: '', paragraphs: []});
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

function nested_blocks(blocks) {
  var acc = [];
  var depth = 1;
  _nested_blocks(blocks, acc, depth);
  return acc;
}

function paragraphs_as_blocks(paragraphs) {
  return _.map(paragraphs, function(p) {
    return {content: p}
  })
}
function nested_blocks_to_gingko(n_blocks) {
  return _.map(n_blocks, function(block) {
    var content = block.content;
    var inline_paragraphs = block.children && block.children.length || (block.paragraphs && block.paragraphs.length <= 1);
    if (inline_paragraphs) {
      if (content && block.paragraphs.length) {
        content += '\n\n';
      }
      content += block.paragraphs.join("\n\n");
    } else {
      block.children = paragraphs_as_blocks(block.paragraphs);
    }
    var o = {content: content};
    if (block.children && block.children.length) {
      o.children = nested_blocks_to_gingko(block.children);
    }
    return o;
  })
}

function gingko_from_marked_tokens(tokens) {

  var blocks = as_blocks(tokens);
  var n_blocks = nested_blocks(blocks);
  return nested_blocks_to_gingko(n_blocks)
}


/**
 * Convert markdown `text` to gingko tree json represenation.
 *
 * @param {String} text - markdown text
 * @return {Array} - json represenation of gingko tree
 * @api public
 */

function gingkoImport(text) {
  var marked = require('marked');

  var marked_options = {};

  var tokens = marked.lexer(text, marked_options);

  var g = gingko_from_marked_tokens(tokens);
  if (!g.length) {
    return [
      { content: '' }
    ];
  }
  return g;
}

gingkoImport._as_blocks = as_blocks;
