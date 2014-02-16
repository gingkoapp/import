describe('gingko-import Functional', function() {
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
          {content: '## h2'}
        ] }
      ]);
  });

  it('headers move depth in and out', function() {
    expect(gingkoImport('' +
      '# h1\n' +
      '## h2\n' +
      '# h1\n'
    )).eql([
        { content: "# h1", children: [
          {content: '## h2'}
        ] },
        { content: "# h1" }
      ]);
  });

  it('skipping header levels creates empty block in between', function() {
    expect(gingkoImport('' +
      '# h\n' +
      '### h\n'
    )).eql([
        { content: "# h", children: [
          {content: '', children: [
            {content: '### h'}
          ]}
        ] }
      ]);
  });

  it('paragraph separator double newline is kept', function() {
    expect(gingkoImport('' +
      '# h1\n' +
      'p1\n\n' +
      'p2\n\n' +
      '## h2\n'
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
    expect(gingkoImport('' +
      '# h\n' +
      'p1\n\n' +
      'p2\n\n'
    )).eql([
        { content: "# h", children: [
          { content: "p1"},
          { content: "p2"}
        ]
        }
      ]);
  });

  it('single paragraph after header is kept in the same block', function() {
    expect(gingkoImport('' +
      '# h\n' +
      'p1'
    )).eql([
        { content: "# h\n\np1"}
      ]);
  });

  it('paragraphs are kept in block if there are child header-blocks', function() {
    expect(gingkoImport('' +
      '# h\n' +
      'p1\n' +
      '## h\n'
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


  it('converts canonical tree by headers', function() {
    var text = readFile(__dirname + '/fixtures/alien-1979.txt', 'utf-8');
    var json = JSON.parse(readFile(__dirname + '/fixtures/alien-1979.json', 'utf-8'));
    var result = gingkoImport(text);

    expect(result).eql(json);
  });

  it('GTD fixture', function() {
    var text = readFile(__dirname + '/fixtures/gtd.txt', 'utf-8');
    var json = JSON.parse(readFile(__dirname + '/fixtures/gtd.json', 'utf-8'));
    var result = gingkoImport(text);

    expect(result).eql(json);
  });

// not all trees are sturcutred with headers as
// h1 - first level
// h2 - second, and etc
//
// many of them start with plain text, and don't care about headers at all.
  it('works with any plain text markdown');


})
;

describe("gingko-import Unit", function() {
  var expect = require('chai').expect;
  var gingkoImport = require('..');

  it("as_blocks", function() {
    var a = [
      { type: 'heading', depth: 1, text: 'Alien' },
      { type: 'paragraph', text: 'The small crew of a deep space ...' },
      { type: 'heading', depth: 3, text: 'Final Image' },
      { type: 'paragraph', text: 'foo' }
    ];
    expect(gingkoImport._as_blocks(a)).eql([
      {
        "depth": 1,
        "content": "# Alien",
        "paragraphs": [
          "The small crew of a deep space ..."
        ]
      },
      {
        "depth": 3,
        "content": "### Final Image",
        "paragraphs": [
          "foo"
        ]
      }
    ])
  })
});
