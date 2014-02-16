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
    var content = token_to_text(t);
    if (t.depth) {
      acc.push({depth: t.depth, content: content});
    } else {
      if (!acc.length) {
        acc.push({depth: 1, content: ""})
      }
      _.last(acc).content += ('\n' + content);
    }
  });
  return acc;
}


function final_block(block) {
  var o = _.clone(block);
  delete o['depth'];
  return o;
}

function _gingko_from_blocks(blocks, acc, depth) {
  while (blocks.length) {
    var block = _.head(blocks);
    if (block.depth == depth) {
      acc.push(final_block(block));
      blocks = _.tail(blocks);
    } else if (block.depth > depth) {
      // go in
      if (!acc.length) {
        acc.push({content: ''});
      }
      var last = _.last(acc);
      last.children = [];
      blocks = _gingko_from_blocks(blocks, last.children, depth + 1);
    } else {
      // go out
      return blocks;
    }
  }
  return blocks; //empty by now
}

function gingko_from_blocks(blocks) {
  var acc = [];
  var depth = 1;
  _gingko_from_blocks(blocks, acc, depth);
  return acc;
}

function gingko_from_marked_tokens(tokens) {

  var blocks = as_blocks(tokens);
  return gingko_from_blocks(blocks);
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
