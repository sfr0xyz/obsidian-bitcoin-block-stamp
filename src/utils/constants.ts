import { UnixTimestamp, BlockExplorer, BlockHeightFormat, MoscowTimeFormat } from '@utils/types';

export const BLOCK_EXPLORERS: Record<BlockExplorer, string> = {
  '': '',
  'mempool-space': 'https://mempool.space/block/{{hash}}',
  'blockstream-info': 'https://blockstream.info/block-height/{{height}}',
  'timechaincalendar-com': 'https://timechaincalendar.com/en/block/{{height}}'
}

export const GENESIS_BLOCK_TIMESTAMP = '1231006505' as UnixTimestamp;

export const DATETIME_INPUT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATETIME_OUTPUT_FORMAT = 'ddd, DD MMM YYYY HH:mm:ss ZZ';

export const SEPARATORS: Record<BlockHeightFormat|MoscowTimeFormat, string> = {
  'plain': '',
  'space': ' ',
  'comma': ',',
  'period': '.',
  'colon': ':',
  'apostrophe': '\'',
  'underscore': '_'
}
