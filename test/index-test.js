describe('gingko-import', function() {
  var expect = require('chai').expect;
  var readFile = require('fs').readFileSync;
  var gingkoImport = require('..');

  it('returns an array', function() {
    expect(gingkoImport('# H1')).an('array');
  });

  it('converts empty string to empty tree', function() {
    expect(gingkoImport('')).eql([{ content: '' }]);
  });

  it('converts canonical tree by headers', function() {
    var text = readFile(__dirname + '/fixtures/alien-1979.txt', 'utf-8');
    var json = readFile(__dirname + '/fixtures/alien-1979.json', 'utf-8');
    var result = gingkoImport(text);

    expect(result.length).equal(json.length);
    expect(result).equal(json);
  });

  // not all trees are sturcutred with headers as
  // h1 - first level
  // h2 - second, and etc
  //
  // many of them start with plain text, and don't care about headers at all.
  it('works with any plain text markdown');
});
