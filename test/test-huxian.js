/* globals assert, huxian, searchPool, __html__,
   verbAddons:true, searchPool:true, initVerbsMapping, defaultVerbStore */
'use strict';
suite('moonbar', function() {

  setup(function() {
    document.body.innerHTML = __html__['index.html'];
    verbAddons = defaultVerbStore;
    initVerbsMapping();
  });

  teardown(function() {
    verbAddons = [];
    searchPool = [];
  });

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
        verb: 'op',
        restTerm: '',
        results: ['open', 'sharedrop']
      },
      huxian.parse('op', searchPool));

      assert.deepEqual({
        verb: 'open',
        restTerm: '',
        results: ['open']
      },
      huxian.parse('open', searchPool));

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

    test('parses config verb correctly', function() {
      assert.deepEqual({
        verb: 'con',
        restTerm: '',
        results: ['config']
      },
      huxian.parse('con', searchPool));

      assert.deepEqual({
        verb: 'config',
        restTerm: '',
        results: ['config']
      },
      huxian.parse('config', searchPool));
    });

    test('parses default search string correctly', function() {
      assert.deepEqual({
        verb: 'ooo',
        restTerm: '',
        results: []
      },
      huxian.parse('ooo', searchPool));
    });

    test('parses default long search string correctly', function() {
      assert.deepEqual({
        verb: 'ooo',
        restTerm: 'kaiju rangers',
        results: []
      },
      huxian.parse('ooo kaiju rangers', searchPool));
    });
  });
});
