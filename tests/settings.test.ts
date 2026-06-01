import test from 'node:test';
import { deepEqual, equal } from './helpers';
import { normalizeSettings } from '../src/settings-data';

test('normalizeSettings fills defaults for missing settings', () => {
  deepEqual(normalizeSettings(undefined), {
    blockExplorer: '',
    formats: {
      blockHeight: 'plain',
      moscowTime: 'plain'
    },
    placeholders: {
      blockHeight: '{{blockheight}}',
      moscowTime: '{{moscowtime}}',
      moscowTimeAtBlockHeight: '{{moscowtime@blockheight}}'
    }
  });
});

test('normalizeSettings migrates legacy top-level format settings', () => {
  deepEqual(normalizeSettings({
    blockExplorer: 'mempool-space',
    blockHeightFormat: 'comma',
    moscowTimeFormat: 'colon',
    placeholders: {
      blockHeight: '{{bh}}'
    }
  }), {
    blockExplorer: 'mempool-space',
    formats: {
      blockHeight: 'comma',
      moscowTime: 'colon'
    },
    placeholders: {
      blockHeight: '{{bh}}',
      moscowTime: '{{moscowtime}}',
      moscowTimeAtBlockHeight: '{{moscowtime@blockheight}}'
    }
  });
});

test('normalizeSettings prefers current nested format settings over legacy top-level settings', () => {
  equal(normalizeSettings({
    formats: {
      blockHeight: 'underscore',
      moscowTime: 'period'
    },
    blockHeightFormat: 'comma',
    moscowTimeFormat: 'colon'
  }).formats.blockHeight, 'underscore');
});
