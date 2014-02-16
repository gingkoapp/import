var gingkoImport = require('..');
var expect = require('chai').expect;

function it_should_import_lines_as(name, input_md_lines, expected_gingko_json) {
  it(name, function() {
    expect(gingkoImport(input_md_lines.join('\n'))).eql(
      expected_gingko_json
    );
  });
}

describe('Functional tests', function() {

  it_should_import_lines_as('converts empty string to empty tree', [
    ''
  ], [
    { content: '' }
  ]);

  it_should_import_lines_as('creates block for a header', [
    '# H1'
  ], [
    { content: '# H1' }
  ]);


  it_should_import_lines_as('two headers make two blocks', [
    '# h1',
    '# h1'
  ], [
    { content: "# h1" },
    { content: "# h1" }
  ]);

  it_should_import_lines_as('sub-header makes child block', [
    '# h1',
    '## h2'
  ], [
    { content: "# h1", children: [
      {content: '## h2'}
    ] }
  ]);

  it_should_import_lines_as('headers move depth in and out', [
    '# h1',
    '## h2',
    '# h1'
  ], [
    { content: "# h1", children: [
      {content: '## h2'}
    ] },
    { content: "# h1" }
  ]);

  it_should_import_lines_as('skipping header levels creates empty block in between', [
    '# h',
    '### h'
  ], [
    { content: "# h", children: [
      {content: '', children: [
        {content: '### h'}
      ]}
    ] }
  ]);

  it_should_import_lines_as('paragraph separator double newline is kept', [
    '# h1',
    'p1\n',
    'p2\n',
    '## h2'
  ], [
    {
      "content": "# h1\n\np1\n\np2",
      "children": [
        {
          "content": "## h2"
        }
      ]
    }
  ]);

  it_should_import_lines_as('multiple paragraphs after header are split into child blocks', [
    '# h',
    'p1\n',
    'p2\n'
  ], [
    { content: "# h", children: [
      { content: "p1"},
      { content: "p2"}
    ]
    }
  ]);

  it_should_import_lines_as('single paragraph after header is kept in the same block', [
    '# h',
    'p1'
  ], [
    { content: "# h\n\np1"}
  ]);

  it_should_import_lines_as('paragraphs are kept in block if there are child header-blocks', [
    '# h',
    'p1',
    '## h'
  ], [
    {
      "content": "# h\n\np1",
      "children": [
        {
          "content": "## h"
        }
      ]
    }
  ]);

  it_should_import_lines_as('lists imported inline', [
    '  * a',
    '  * b',
    '  * c'
  ], [
    { "content": "  * a\n  * b\n  * c" }
  ]);

  it_should_import_lines_as('nested lists are kept in one block', [
    '  * a',
    '    1. b',
    '    2. c',
    '  * d'
  ], [
    { "content": "  * a\n    1. b\n    2. c\n  * d" }
  ]);

  it_should_import_lines_as('blockquote in leaf is kept as one block', [
    'with node:',
    '',
    '    $ npm install rework',
    '    $ echo foo'
  ], [
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

  it_should_import_lines_as('code in leaf is kept as one block', [
    "```css",
    "",
    "button {}",
    "```"
  ], [
    { "content": "```css\n\nbutton {}\n```" }
  ]);


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
