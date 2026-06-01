import { moment } from '@utils/moment';
import { UnixTimestamp } from '@utils/types';
import { DATETIME_OUTPUT_FORMAT, GENESIS_BLOCK_TIMESTAMP } from '@utils/constants';

export function isValidDatetime (unixTimestamp: UnixTimestamp) {
  let isValid = true;
  let problemMessage = '';
  if (unixTimestamp < GENESIS_BLOCK_TIMESTAMP) {
    isValid = false;
    problemMessage = `Date lies before the Genesis block (${moment(GENESIS_BLOCK_TIMESTAMP, 'X').format(DATETIME_OUTPUT_FORMAT)})`;
  }
  if (unixTimestamp > moment().format('X')) {
    isValid = false;
    problemMessage = `Date lies in the future`;
  }
  if (unixTimestamp.length !== 10) {
    isValid = false;
    problemMessage = `Not a date`;
  }
  return {isValid, problemMessage};
}

export function currentUnixtime (): UnixTimestamp {
  return moment().format('X') as UnixTimestamp;
}
