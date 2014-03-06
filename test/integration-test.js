describe('real-world examples', function() {
  if (typeof window !== 'undefined') return; // do not run in browser

  var readFile = require('fs').readFileSync;
  var expect = require('chai').expect;
  var gingkoImport = require('..');

  // как загрузить фикстуры в js окружении?
  it('Alien 1979', function() {
    var text = readFile(__dirname + '/fixtures/alien-1979.md', 'utf-8');
    var json = JSON.parse(readFile(__dirname + '/fixtures/alien-1979.json', 'utf-8'));

    expect(gingkoImport(text)).eql(json);
  });

  it('GTD', function() {
    var text = readFile(__dirname + '/fixtures/gtd.md', 'utf-8');
    var json = JSON.parse(readFile(__dirname + '/fixtures/gtd.json', 'utf-8'));

    expect(gingkoImport(text)).eql(json);
  });

  it('reworkcss', function() {
    var text = readFile(__dirname + '/fixtures/reworkcss.md', 'utf-8');
    var json = JSON.parse(readFile(__dirname + '/fixtures/reworkcss.json', 'utf-8'));

    expect(gingkoImport(text)).eql(json);
  });
});
