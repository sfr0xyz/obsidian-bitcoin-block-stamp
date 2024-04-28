import { MempoolSpaceApi } from '@apis/rest';

export type FiatCurrency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'CHF' | 'AUD' | 'JPY';
export type UnixTimestamp = `${`${number}`}` & { length: 10 };
export type BlockId = { height: number, hash: string };
export type BlockExplorer = '' | 'mempool-space' | 'blockstream-info' | 'timechaincalendar-com';
export type Api = MempoolSpaceApi;
export type StampKind = 'block-height' | 'moscow-time' | 'moscow-time_at_block-height';
export type MoscowTimeFormat = '' | ':' | '.';
export type BlockHeightFormat = '' | ',' | '.' | ' ' | '_' | '\'';
export type Replacements = { [key: string]: string };