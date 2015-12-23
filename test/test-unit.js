'use strict';
suite('moonbar', function() {

  setup(function() {
    document.body.innerHTML = __html__['index.html'];
  });

  /*
  teardown(function() {
  });
  */

  test('Huxian parses correctly', function() {
    assert.deepEqual([
      'w',
      ' firefox', //is the space intended?
      ['wikipedia', 'twitter']
    ],
    huxian.parse('w firefox', searchPool));
  });
});
