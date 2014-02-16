var gingkoImport = require('..');
var expect = require('chai').expect;

function md_import_lines() {
  var args = Array.prototype.slice.call(arguments);
  return gingkoImport(args.join('\n'));
}

describe('Functional tests', function() {

  it('converts empty string to empty tree', function() {
    expect(gingkoImport('')).eql([
      { content: '' }
    ]);
  });

  it('creates block for a header', function() {
    expect(gingkoImport('# H1')).eql([
      { content: '# H1' }
    ]);
  });


  it('two headers make two blocks', function() {
    expect(md_import_lines(
      '# h1',
      '# h1'
    )).eql([
        { content: "# h1" },
        { content: "# h1" }
      ]);
  });

  it('sub-header makes child block', function() {
    expect(md_import_lines(
      '# h1',
      '## h2'
    )).eql([
        { content: "# h1", children: [
          {content: '## h2'}
        ] }
      ]);
  });

  it('headers move depth in and out', function() {
    expect(md_import_lines(
      '# h1',
      '## h2',
      '# h1'
    )).eql([
        { content: "# h1", children: [
          {content: '## h2'}
        ] },
        { content: "# h1" }
      ]);
  });

  it('skipping header levels creates empty block in between', function() {
    expect(md_import_lines(
      '# h',
      '### h'
    )).eql([
        { content: "# h", children: [
          {content: '', children: [
            {content: '### h'}
          ]}
        ] }
      ]);
  });

  it('paragraph separator double newline is kept', function() {
    expect(md_import_lines(
      '# h1',
      'p1\n',
      'p2\n',
      '## h2'
    )).eql([
        {
          "content": "# h1\n\np1\n\np2",
          "children": [
            {
              "content": "## h2"
            }
          ]
        }
      ]);
  });

  it('multiple paragraphs after header are split into child blocks', function() {
    expect(md_import_lines(
      '# h',
      'p1\n',
      'p2\n'
    )).eql([
        { content: "# h", children: [
          { content: "p1"},
          { content: "p2"}
        ]
        }
      ]);
  });

  it('single paragraph after header is kept in the same block', function() {
    expect(md_import_lines(
      '# h',
      'p1'
    )).eql([
        { content: "# h\n\np1"}
      ]);
  });

  it('paragraphs are kept in block if there are child header-blocks', function() {
    expect(md_import_lines(
      '# h',
      'p1',
      '## h'
    )).eql([
        {
          "content": "# h\n\np1",
          "children": [
            {
              "content": "## h"
            }
          ]
        }
      ]);
  });

  it('lists imported inline', function() {
    expect(md_import_lines(
      '  * a',
      '  * b',
      '  * c'
    )).eql([
        { "content": "  * a\n  * b\n  * c" }
      ]);
  });
  it('numbered lists');
  it('nested-mixed lists');

  it('code in leaf is kept as one block', function() {
    expect(md_import_lines(
      'with node:',
      '',
      '    $ npm install rework',
      '    $ echo foo'
    )).eql([
        {
          "content": "",
          "children": [
            {
              "content": "with node:"
            },
            {
              "content": "    $ npm install rework\n    $ echo foo"
            }
          ]
        }
      ]);
  });


});

describe('Real-world examples', function() {
  var expect = require('chai').expect;
  var readFile = require('fs').readFileSync;
  var gingkoImport = require('..');

  it('Alien', function() {
    var text = readFile(__dirname + '/fixtures/alien-1979.md', 'utf-8');
    var json = JSON.parse(readFile(__dirname + '/fixtures/alien-1979.json', 'utf-8'));
    var result = gingkoImport(text);

    expect(result).eql(json);
  });

  it('GTD', function() {
    var text = readFile(__dirname + '/fixtures/gtd.md', 'utf-8');
    var json = JSON.parse(readFile(__dirname + '/fixtures/gtd.json', 'utf-8'));
    var result = gingkoImport(text);

    expect(result).eql(json);
  });

  it('reworkcss', function() {
    var text = readFile(__dirname + '/fixtures/reworkcss.md', 'utf-8');
    var json = JSON.parse(readFile(__dirname + '/fixtures/reworkcss.json', 'utf-8'));
    var result = gingkoImport(text);

    expect(result).eql(json);
  });
});
