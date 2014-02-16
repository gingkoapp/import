describe('gingko-import', function() {
  var expect = require('chai').expect;
  var readFile = require('fs').readFileSync;
  var gingkoImport = require('..');

  it('converts empty string to empty tree', function() {
    expect(gingkoImport('')).eql([
      { content: '' }
    ]);
  });

  it('creates block for a header', function() {
    expect(gingkoImport('#H1')).eql([
      { content: '# H1' }
    ]);
  });


  it('keeps header and following text in one block', function() {
    expect(gingkoImport('' +
      '# h1\n' +
      'text\n'
    )).eql([
        { content: "# h1\ntext" }
      ]);
  });

  it('two headers make two blocks', function() {
    expect(gingkoImport('' +
      '# h1\n' +
      '# h1\n'
    )).eql([
        { content: "# h1" },
        { content: "# h1" }
      ]);
  });

  it('sub-header makes child block', function() {
    expect(gingkoImport('' +
      '# h1\n' +
      '## h2\n'
    )).eql([
        { content: "# h1", children: [
          {content: '# h2'}
        ] }
      ]);
  });

  it.skip('headers move depth in and out', function() {
    expect(gingkoImport('' +
      '# h1\n' +
      '## h2\n',
      '# h1\n'
    )).eql([
        { content: "# h1", children: [
          {content: '# h2'}
        ] },
        { content: "# h1" }
      ]);
  });


  it.skip('converts canonical tree by headers', function() {
    var text = readFile(__dirname + '/fixtures/alien-1979.txt', 'utf-8');
    var json = readFile(__dirname + '/fixtures/alien-1979.json', 'utf-8');
    var result = gingkoImport(text);

    expect(result).equal(json);
  });

  // not all trees are sturcutred with headers as
  // h1 - first level
  // h2 - second, and etc
  //
  // many of them start with plain text, and don't care about headers at all.
  it('works with any plain text markdown');

});
