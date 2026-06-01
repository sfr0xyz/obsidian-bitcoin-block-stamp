import test from 'node:test';
import { deepEqual, equal } from './helpers';
import { parseBlockResponse, parseCurrentPriceResponse, parseHistoricalPriceResponse } from '../src/apis/mempool-space-responses';
import { UnixTimestamp } from '../src/utils/types';

const timestamp = '1713571200' as UnixTimestamp;

test('parseCurrentPriceResponse extracts a valid fiat price', () => {
  equal(parseCurrentPriceResponse({ USD: 64000 }, 'USD'), 64000);
});

test('parseHistoricalPriceResponse extracts the first historical fiat price', () => {
  equal(parseHistoricalPriceResponse({ prices: [{ USD: 63849 }] }, 'USD', timestamp), 63849);
});

test('parseHistoricalPriceResponse rejects empty historical prices', () => {
  throwsMessage(() => parseHistoricalPriceResponse({ prices: [] }, 'USD', timestamp), 'historical price data');
});

test('parseBlockResponse extracts a valid block id', () => {
  deepEqual(parseBlockResponse({ height: 840000, hash: '000abc' }, timestamp), {
    height: 840000,
    hash: '000abc'
  });
});

test('parseBlockResponse rejects malformed block ids', () => {
  throwsMessage(() => parseBlockResponse({ height: '840000', hash: '000abc' }, timestamp), 'valid block height');
  throwsMessage(() => parseBlockResponse({ height: 840000, hash: '' }, timestamp), 'valid block hash');
});

function throwsMessage (fn: () => unknown, messagePart: string): void {
  try {
    fn();
  } catch (error) {
    if (error instanceof Error && error.message.includes(messagePart)) {
      return;
    }
    throw error;
  }

  throw new Error(`Expected function to throw an error containing ${messagePart}`);
}
