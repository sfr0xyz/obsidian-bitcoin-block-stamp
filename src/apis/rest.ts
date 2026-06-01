import { requestUrl } from 'obsidian';
import { moment } from '@utils/moment';
import { UnixTimestamp, FiatCurrency, BlockId, StampSource } from '@utils/types';
import { parseBlockResponse, parseCurrentPriceResponse, parseHistoricalPriceResponse } from '@apis/mempool-space-responses';

export class MempoolSpaceApi implements StampSource {
  readonly baseApiUrl: string

  constructor () {
    this.baseApiUrl = 'https://mempool.space';
  }
  
  async getPrice (unixTimestamp?: UnixTimestamp, fiat: FiatCurrency='USD'): Promise<number> {
    const endpoint = (unixTimestamp) 
      ? `/api/v1/historical-price?currency=${fiat}&timestamp=${unixTimestamp}` 
      : '/api/v1/prices';

    const apiUrl = this.baseApiUrl + endpoint;
    const json = await getJson(apiUrl);
    const price = unixTimestamp
      ? parseHistoricalPriceResponse(json, fiat, unixTimestamp)
      : parseCurrentPriceResponse(json, fiat);

    return price;
  }
  
  async getBlockId (unixTimestamp?: UnixTimestamp): Promise<BlockId> {
    const timestamp = unixTimestamp ?? moment().format('X') as UnixTimestamp;
    const endpoint = `/api/v1/mining/blocks/timestamp/${timestamp}`;
    const json = await getJson(this.baseApiUrl + endpoint);
    const block = parseBlockResponse(json, timestamp);
    
    return block;
  }
}

async function getJson (url: string): Promise<unknown> {
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

function getErrorMessage (error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
