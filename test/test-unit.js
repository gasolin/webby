/* globals assert, huxian, searchPool, __html__ */
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
    test('parse shortcut correctly', function() {
      assert.deepEqual({
        verb: 'g',
        restTerm: 'moz',
        results: ['google']
      },
      huxian.parse('g moz', searchPool));
    });
    test('parses search verb correctly', function() {
      assert.deepEqual({
        verb: 'w',
        restTerm: 'firefox',
        results: ['wikipedia']
      },
      huxian.parse('w firefox', searchPool));

      assert.deepEqual({
        verb: 'wikipedia',
        restTerm: 'firefox',
        results: ['wikipedia']
      },
      huxian.parse('wikipedia firefox', searchPool));
    });

    test('parses open verb correctly', function() {
      assert.deepEqual({
        verb: 'fa',
        restTerm: '',
        results: ['facebook']
      },
      huxian.parse('fa', searchPool));

      assert.deepEqual({
        verb: 'facebook',
        restTerm: '',
        results: ['facebook']
      },
      huxian.parse('facebook', searchPool));
    });
  });
});
