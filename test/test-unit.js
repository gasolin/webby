'use strict';
suite('moonbar', function() {

  setup(function() {
    document.body.innerHTML = __html__['index.html'];
  });

  /*
  teardown(function() {
  });
  */

  suite('Huxian parser >', function() {
    test('parses search verb correctly', function() {
      assert.deepEqual([
          'w',
          'firefox',
          ['wikipedia', 'twitter']
        ],
        huxian.parse('w firefox', searchPool));

      assert.deepEqual([
          'wikipedia',
          'firefox',
          ['wikipedia']
        ],
        huxian.parse('wikipedia firefox', searchPool));
    });

    test('parses open verb correctly', function() {
      assert.deepEqual([
          'fa',
          '',
          ['facebook']
        ],
        huxian.parse('fa', searchPool));

      assert.deepEqual([
          'facebook',
          '',
          ['facebook']
        ],
        huxian.parse('facebook', searchPool));
    });
  });
});
