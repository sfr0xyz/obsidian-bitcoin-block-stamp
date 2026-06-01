import { TFile, Vault } from 'obsidian';
import { Replacements } from '@utils/types';
import { replacePlaceholderText } from '@utils/placeholders';

export async function replacePlaceholders (vault: Vault, file: TFile, replacements: Replacements) {
  let fileContent = await vault.read(file);

  fileContent = replacePlaceholderText(fileContent, replacements);

  await vault.modify(file, fileContent);
}
