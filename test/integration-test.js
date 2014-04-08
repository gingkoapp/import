var expect = require('chai').expect;
var gingkoImport = require('../index');

describe('real-world examples', function() {
  if (typeof window == 'undefined') {
    require.extensions['.md'] = function(module, name) {
      module.exports = require('fs').readFileSync(name, 'utf-8');
    };
  }

  // как загрузить фикстуры в js окружении?
  it('Alien 1979', function() {
    var text = require('./fixtures/alien-1979.md');
    var json = require('./fixtures/alien-1979.json');

    expect(gingkoImport(text)).eql(json);
  });

  it('GTD', function() {
    var text = require('./fixtures/gtd.md');
    var json = require('./fixtures/gtd.json');

    expect(gingkoImport(text)).eql(json);
  });

  it('reworkcss', function() {
    var text = require('./fixtures/reworkcss.md');
    var json = require('./fixtures/reworkcss.json');

    expect(gingkoImport(text)).eql(json);
  });
});
