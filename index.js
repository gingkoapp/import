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

function item(tokens) {

  var head = _.head(tokens);
  var tail = _.tail(tokens);

  var o = {
    content: head.text,
    children: [],
    tail: tail,
    cont: true
  };

  switch (head.type) {
    case 'heading':
      o.content = '# ' + head.text;
      o.cont = false;
      o.depth = head.depth;
      break;
  }
  return o;
}

function gingko_from_marked_tokens(tokens) {
  var acc = [
    { content: '' }
  ]; //gingko result accumulator
  var depth = 1; // Top level paragraphs and H1 has depth 1

  return _gingko_from_marked_tokens(tokens, acc, depth)
}

function _gingko_from_marked_tokens(tokens, acc, depth) {

  if (!tokens.length) {
    return acc;
  } else {
    var i = item(tokens);
    var last_block = _.last(acc);
    if (i.cont) {
      // continue last block
      last_block.content += ('\n' + i.content);
    } else {
      if (i.depth && i.depth != depth) { // Different level header
        if (i.depth > depth) {
          last_block.children = last_block.children || [];
          _gingko_from_marked_tokens(tokens, last_block.children, depth + 1);
        }
        if (i.depth < depth) {
          return _gingko_from_marked_tokens(tokens, acc, depth - 1 );
        }
      } else {
        // start a new block
        acc.push({ content: i.content })

      }
    }
    return _gingko_from_marked_tokens(i.tail, acc, depth);
  }
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
  var head = _.head(g);
  var tail = _.tail(g);
  if (!head.content && tail.length) {
    return tail;
  }
  return g
}
