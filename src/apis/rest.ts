import { requestUrl, moment } from 'obsidian';
import { UnixTimestamp, FiatCurrency, BlockId } from '@utils/types';

export class RestApi {
  async getJson(url: string) { // TODO: make type string to type URL, define type URL
    const response = await requestUrl(url);
    const json = await response.json;
    return json;
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
    const data = (unixTimestamp) ? json.prices[0] : json;
    
    return data[fiat];
  }
  
  async getBlockId (unixTimestamp?: UnixTimestamp): Promise<BlockId> {
    unixTimestamp = (unixTimestamp) 
      ? unixTimestamp 
      : moment().format('X') as UnixTimestamp;

    const endpoint = `/api/v1/mining/blocks/timestamp/${unixTimestamp}`;

    const json = await this.getJson(this.baseApiUrl + endpoint);
    const data: BlockId = { ...json };
    
    return data;
  }
}
