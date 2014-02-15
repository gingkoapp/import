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

function gingko_from_marked_tokens(tokens, acc) {
  acc = acc || [
    { content: '' }
  ]; //gingko result accumulator

  if (!tokens.length) {
    return acc;
  } else {
    var i = item(tokens);
    if (i.cont) {
      // continue last block
      _.last(acc).content += ('\n' + i.content);
    } else {
      // start a new block
      acc.push({ content: i.content })
    }
    return gingko_from_marked_tokens(i.tail, acc);
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

gingkoImport._gingko_from_marked_tokens = gingko_from_marked_tokens;


