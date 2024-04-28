import { UnixTimestamp } from '@utils/types';

export interface BlockExplorers {
  'mempool-space': string;
  'blockstream-info': string;
  'timechaincalendar-com': string;
}
export const BLOCK_EXPLORERS: BlockExplorers = {
  'mempool-space': 'https://mempool.space/block/{{hash}}',
  'blockstream-info': 'https://blockstream.info/block-height/{{height}}',
  'timechaincalendar-com': 'https://timechaincalendar.com/en/block/{{height}}'
}

export const GENESIS_BLOCK_TIMESTAMP = '1231006505' as UnixTimestamp;

export const DATETIME_INPUT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATETIME_OUTPUT_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss ZZ';