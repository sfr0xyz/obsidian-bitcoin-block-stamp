import test from 'node:test';
import { deepEqual, equal } from './helpers';
import { StampGenerator } from '../src/stamp-generator';
import { BbsPluginSettings } from '../src/settings-data';
import { StampSource, UnixTimestamp } from '../src/utils/types';

const source: StampSource = {
  getBlockId: async () => ({ height: 840000, hash: '000abc' }),
  getPrice: async () => 64000
};

const settings: BbsPluginSettings = {
  blockExplorer: '',
  formats: {
    blockHeight: 'underscore',
    moscowTime: 'colon'
  },
  placeholders: {
    blockHeight: '{{blockheight}}',
    moscowTime: '{{moscowtime}}',
    moscowTimeAtBlockHeight: '{{moscowtime@blockheight}}'
  }
};

test('StampGenerator creates placeholder replacements from settings', async () => {
  const generator = new StampGenerator(source);

  deepEqual(await generator.placeholderReplacements(settings), {
    '{{blockheight}}': '840_000',
    '{{moscowtime}}': '15:63',
    '{{moscowtime@blockheight}}': '15:63 @ 840_000'
  });
});

test('StampGenerator creates custom stamps from a request', async () => {
  const generator = new StampGenerator(source);

  equal(await generator.customStamp({
    unixTimestamp: '1713571200' as UnixTimestamp,
    stampKind: 'moscow-time_at_block-height',
    blockHeightFormat: 'comma',
    moscowTimeFormat: 'period',
    blockExplorer: ''
  }), '15.63 @ 840,000');
});
