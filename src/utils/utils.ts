import { Editor, TFile, Vault, moment } from 'obsidian';
import { Replacements, UnixTimestamp } from '@utils/types';
import { DATETIME_OUTPUT_FORMAT, GENESIS_BLOCK_TIMESTAMP } from '@utils/constants';

export function insertAtCursor (str: string, editor: Editor) {
  editor.replaceSelection(str);
}

export async function replacePlaceholders (vault: Vault, file: TFile, replacements: Replacements) {
  console.log('replace placeholders', replacements);
  let fileContent = await vault.read(file);

  for (const find in replacements) {
    const replace: string = replacements[find];
    fileContent = fileContent.replace(new RegExp(find, 'g'), replace);
  }

  vault.modify(file, fileContent);
}

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

export function updateDateTimeOutput (unixTimestamp: UnixTimestamp, datetimeOutput: HTMLDivElement, datetimeDate: HTMLDivElement, datetimeError: HTMLDivElement) {
  const { isValid, problemMessage } = isValidDatetime(unixTimestamp);
            
  datetimeOutput.toggleClass('datetimeOutput-error', !isValid);
  datetimeDate.toggleClass('strikethrough', !isValid);
  datetimeDate.setText(moment(unixTimestamp, 'X').format(DATETIME_OUTPUT_FORMAT));
  datetimeError.setText(problemMessage);
}
