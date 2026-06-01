import { moment } from '@utils/moment';
import { isValidDatetime } from '@utils/datetime';
import { UnixTimestamp } from '@utils/types';
import { DATETIME_OUTPUT_FORMAT } from '@utils/constants';

export function updateDatetimeOutput (unixTimestamp: UnixTimestamp, datetimeOutput: HTMLDivElement, datetimeDate: HTMLDivElement, datetimeError: HTMLDivElement) {
  const { isValid, problemMessage } = isValidDatetime(unixTimestamp);

  datetimeOutput.toggleClass('datetimeOutput-error', !isValid);
  datetimeDate.toggleClass('strikethrough', !isValid);
  datetimeDate.setText(moment(unixTimestamp, 'X').format(DATETIME_OUTPUT_FORMAT));
  datetimeError.setText(problemMessage);
}
