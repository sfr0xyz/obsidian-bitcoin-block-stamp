import { Replacements } from '@utils/types';

export function replacePlaceholderText (text: string, replacements: Replacements): string {
  let replacedText = text;

  for (const find in replacements) {
    const replace: string = replacements[find];
    replacedText = replacedText.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

  return replacedText;
}

function escapeRegExp (str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
