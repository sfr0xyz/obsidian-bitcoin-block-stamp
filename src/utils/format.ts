import { SEPARATORS } from '@utils/constants';
import { BlockHeightFormat, MoscowTimeFormat } from '@utils/types';

export function formatBlockHeight (blockHeight: number, format: BlockHeightFormat = 'plain'): string {
  return blockHeight.toLocaleString('en-US')
    .replace(/,/g, SEPARATORS[format]);
}

export function formatMoscowTime (moscowTime: number, format: MoscowTimeFormat = 'plain'): string {
  const separator = SEPARATORS[format];

  return moscowTime.toString()
    .padStart((separator) ? 4 : 0, '0')
    .split('').reverse().join('')
    .split(/(\d{2})/g)
    .filter((v: string) => v !== '')
    .join(separator)
    .split('').reverse().join('');
}
