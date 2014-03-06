describe('gingko-import', function() {
  var expect = require('chai').expect;
  var gingkoImport;

  try {
    gingkoImport = require('..');
  } catch (err) {
    gingkoImport = require('gingko-import');
  }

  it('converts empty string to empty tree', function() {
    expect(gingkoImport('')).eql([{ content: '' }]);
  });

  it('creates block for a header', function() {
    expect(gingkoImport('# H1')).eql([{ content: '# H1' }]);
  });

  it('two headers make two blocks', function() {
    expect(gingkoImport([
      '# h1',
      '# h1'
    ])).eql([
      { content: '# h1' },
      { content: '# h1' }
    ]);
  });

  it('sub-header makes child block', function() {
    expect(gingkoImport([
      '# h1',
      '## h2'
    ])).eql([
      { content: '# h1', children: [{ content: '## h2' }] }
    ]);
  });

  it('headers move depth in and out', function() {
    expect(gingkoImport([
      '# h1',
      '## h2',
      '# h1'
    ])).eql([
      { content: '# h1', children: [{ content: '## h2' }] },
      { content: '# h1' }
    ]);
  });

  it('skipping header levels creates empty block in between', function() {
    expect(gingkoImport([
      '# h1',
      '### h3'
    ])).eql([
      { content: '# h1', children: [
        { content: '', children: [{ content: '### h3' }] }
      ]}
    ]);
  });

  it('paragraph separator double newline is kept', function() {
    expect(gingkoImport([
      '# h1\n',
      'p1\n',
      'p2\n',
      '## h2'
    ])).eql([
      { content: '# h1\n\np1\n\np2', children: [{ content: '## h2' }] }
    ]);
  });

  it('multiple paragraphs after header are split into child blocks', function() {
    expect(gingkoImport([
      '# h',
      'p1\n',
      'p2\n'
    ])).eql([
      { content: '# h', children: [ { content: 'p1' }, { content: 'p2'} ]}
    ]);
  });

  it('single paragraph after header is kept in the same block', function() {
    expect(gingkoImport([
      '# h',
      'p1'
    ])).eql([
      { content: '# h\np1' }
    ]);
  });

  it('paragraphs are kept in block if there are child header-blocks', function() {
    expect(gingkoImport([
      '# h',
      'p1',
      '## h'
    ])).eql([
      { content: '# h\np1', children: [{ content: '## h' }] }
    ]);
  });

  it('lists imported inline', function() {
    expect(gingkoImport([
      '  * a',
      '  * b',
      '  * c'
    ])).eql([
      { content: '  * a\n  * b\n  * c' }
    ]);
  });

  it('nested lists are kept in one block', function() {
    expect(gingkoImport([
      '  * a',
      '    1. b',
      '    2. c',
      '  * d'
    ])).eql([
      { content: '  * a\n    1. b\n    2. c\n  * d' }
    ]);
  });

  it('blockquote in leaf is kept as one block', function() {
    expect(gingkoImport([
      'with node:',
      '',
      '    $ npm install rework',
      '    $ echo foo'
    ])).eql([
      {
        content: '',
        children: [
          { content: 'with node:' },
          { content: '    $ npm install rework\n    $ echo foo' }
        ]
      }
    ]);
  });

  it('code in leaf is kept as one block', function() {
    expect(gingkoImport([
      '```css',
      '',
      'button {}',
      '```'
    ])).eql([
      { content: '```css\n\nbutton {}\n```' }
    ]);
  });
});
