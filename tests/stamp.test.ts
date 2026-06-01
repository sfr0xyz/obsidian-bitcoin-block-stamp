import test from 'node:test';
import { equal } from './helpers';
import { Stamp } from '../src/stamp';
import { StampSource, UnixTimestamp } from '../src/utils/types';

const source: StampSource = {
  getBlockId: async () => ({ height: 840000, hash: '000abc' }),
  getPrice: async () => 64000
};

test('Stamp formats a block height with an optional explorer link', async () => {
  const stamp = new Stamp(source);

  equal(await stamp.blockHeight('underscore'), '840_000');
  equal(await stamp.blockHeight('comma', 'mempool-space'), '[840,000](https://mempool.space/block/000abc)');
});

test('Stamp calculates Moscow time from fiat price', async () => {
  const stamp = new Stamp(source);

  equal(await stamp.moscowTime('colon'), '15:63');
});

test('Stamp passes timestamps to its source adapter', async () => {
  const timestamp = '1713571200' as UnixTimestamp;
  let blockTimestamp: UnixTimestamp | undefined;
  let priceTimestamp: UnixTimestamp | undefined;
  const timestampSource: StampSource = {
    getBlockId: async unixTimestamp => {
      blockTimestamp = unixTimestamp;
      return { height: 840000, hash: '000abc' };
    },
    getPrice: async unixTimestamp => {
      priceTimestamp = unixTimestamp;
      return 64000;
    }
  };

  const stamp = new Stamp(timestampSource, timestamp);
  await stamp.moscowTimeAtBlockHeight('colon', 'underscore');

  equal(blockTimestamp, timestamp);
  equal(priceTimestamp, timestamp);
});
