import { requestUrl } from 'obsidian';
import { moment } from '@utils/moment';
import { UnixTimestamp, FiatCurrency, BlockId } from '@utils/types';

export class RestApi {
  async getJson(url: string): Promise<unknown> {
    let response;

    try {
      response = await requestUrl(url);
    } catch (error) {
      throw new Error(`Could not reach mempool.space. Check your internet connection and try again. ${getErrorMessage(error)}`);
    }

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`mempool.space returned HTTP ${response.status} for ${url}.`);
    }

    return response.json;
  }
}

export class MempoolSpaceApi extends RestApi {
  readonly baseApiUrl: string

  constructor () {
    super();
    this.baseApiUrl = 'https://mempool.space';
  }
  
  async getPrice (unixTimestamp?: UnixTimestamp, fiat: FiatCurrency='USD'): Promise<number> {
    const endpoint = (unixTimestamp) 
      ? `/api/v1/historical-price?currency=${fiat}&timestamp=${unixTimestamp}` 
      : '/api/v1/prices';

    const apiUrl = this.baseApiUrl + endpoint;
    const json = await this.getJson(apiUrl);
    const price = unixTimestamp
      ? this.getHistoricalPrice(json, fiat, unixTimestamp)
      : this.getCurrentPrice(json, fiat);

    return price;
  }
  
  async getBlockId (unixTimestamp?: UnixTimestamp): Promise<BlockId> {
    unixTimestamp = (unixTimestamp) 
      ? unixTimestamp 
      : moment().format('X') as UnixTimestamp;

    const endpoint = `/api/v1/mining/blocks/timestamp/${unixTimestamp}`;
    const json = await this.getJson(this.baseApiUrl + endpoint);
    const block = this.getBlockFromResponse(json, unixTimestamp);
    
    return block;
  }

  private getCurrentPrice (json: unknown, fiat: FiatCurrency): number {
    assertRecord(json, 'current price response');

    const price = json[fiat];
    if (!isValidPrice(price)) {
      throw new Error(`mempool.space did not return a valid current ${fiat} price.`);
    }

    return price;
  }

  private getHistoricalPrice (json: unknown, fiat: FiatCurrency, unixTimestamp: UnixTimestamp): number {
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

  private getBlockFromResponse (json: unknown, unixTimestamp: UnixTimestamp): BlockId {
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
}

function assertRecord (value: unknown, label: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`mempool.space returned an invalid ${label}.`);
  }
}

function isValidPrice (value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function getErrorMessage (error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
