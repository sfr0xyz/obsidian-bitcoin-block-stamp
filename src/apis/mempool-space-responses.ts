import { UnixTimestamp, FiatCurrency, BlockId } from '@utils/types';

export function parseCurrentPriceResponse (json: unknown, fiat: FiatCurrency): number {
  assertRecord(json, 'current price response');

  const price = json[fiat];
  if (!isValidPrice(price)) {
    throw new Error(`mempool.space did not return a valid current ${fiat} price.`);
  }

  return price;
}

export function parseHistoricalPriceResponse (json: unknown, fiat: FiatCurrency, unixTimestamp: UnixTimestamp): number {
  assertRecord(json, 'historical price response');

  const prices = json.prices;
  if (!Array.isArray(prices) || prices.length === 0) {
    throw new Error(`mempool.space did not return historical price data for timestamp ${unixTimestamp}.`);
  }

  const firstPrice = prices[0];
  assertRecord(firstPrice, 'historical price entry');

  const price = firstPrice[fiat];
  if (!isValidPrice(price)) {
    throw new Error(`mempool.space did not return a valid historical ${fiat} price for timestamp ${unixTimestamp}.`);
  }

  return price;
}

export function parseBlockResponse (json: unknown, unixTimestamp: UnixTimestamp): BlockId {
  assertRecord(json, 'block response');

  const { height, hash } = json;
  if (typeof height !== 'number' || !Number.isFinite(height)) {
    throw new Error(`mempool.space did not return a valid block height for timestamp ${unixTimestamp}.`);
  }
  if (typeof hash !== 'string' || hash.length === 0) {
    throw new Error(`mempool.space did not return a valid block hash for timestamp ${unixTimestamp}.`);
  }

  return { height, hash };
}

function assertRecord (value: unknown, label: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`mempool.space returned an invalid ${label}.`);
  }
}

function isValidPrice (value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}
