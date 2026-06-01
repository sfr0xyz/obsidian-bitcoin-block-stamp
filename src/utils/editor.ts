import { Editor } from 'obsidian';

export function insertAtCursor (str: string, editor: Editor) {
  editor.replaceSelection(str);
}
