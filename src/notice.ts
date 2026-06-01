import { Notice } from 'obsidian';

export function showErrorNotice (action: string, error: unknown): void {
  console.error(error);
  new Notice(`🛑 ${action}: ${getErrorMessage(error)}`);
}

export function getErrorMessage (error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
