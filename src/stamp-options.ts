import { BlockExplorer, BlockHeightFormat, MoscowTimeFormat, StampKind } from '@utils/types';

export interface StampOption<T extends string> {
  value: T;
  label: string;
}

export const BLOCK_EXPLORER_OPTIONS: Array<StampOption<BlockExplorer>> = [
  { value: '', label: 'None' },
  { value: 'mempool-space', label: 'Mempool.space' },
  { value: 'blockstream-info', label: 'Blockstream.info' },
  { value: 'timechaincalendar-com', label: 'TimechainCalendar.com' }
];

export const BLOCK_HEIGHT_FORMAT_OPTIONS: Array<StampOption<BlockHeightFormat>> = [
  { value: 'plain', label: 'Plain (840000)' },
  { value: 'comma', label: 'Comma (840,000)' },
  { value: 'period', label: 'Period (840.000)' },
  { value: 'space', label: 'Space (840 000)' },
  { value: 'apostrophe', label: "Apostrophe (840'000)" },
  { value: 'underscore', label: 'Underscore (840_000)' }
];

export const MOSCOW_TIME_FORMAT_OPTIONS: Array<StampOption<MoscowTimeFormat>> = [
  { value: 'plain', label: 'Plain (1566)' },
  { value: 'colon', label: 'Colon (15:66)' },
  { value: 'period', label: 'Period (15.66)' }
];

export const STAMP_KIND_OPTIONS: Array<StampOption<StampKind>> = [
  { value: 'block-height', label: 'Block height' },
  { value: 'moscow-time', label: 'Moscow time' },
  { value: 'moscow-time_at_block-height', label: 'Moscow time @ block height' }
];
