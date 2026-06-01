import { Editor, Plugin, TAbstractFile, TFile, Notice } from 'obsidian';
import { BbsSettingTab } from '@src/settings';
import { BbsPluginSettings, normalizeSettings } from '@src/settings-data';
import { CustomStampModal } from '@modals/custom-stamp';
import { Stamp } from '@src/stamp';
import { insertAtCursor, replacePlaceholders } from '@utils/functions';
import { Replacements } from '@utils/types';

export default class BbsPlugin extends Plugin {
  settings!: BbsPluginSettings;

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new BbsSettingTab(this.app, this));

    this.addRibbonIcon('bitcoin', 'Insert Bitcoin block stamp', () => {
      try {
        new CustomStampModal(this.app, this).open();
      } catch (error) {
        this.showErrorNotice('Could not open the custom stamp modal', error);
      }
    });

    this.addCommand({
      id: 'insert-historical-block-stamp',
      name: 'Insert custom block stamp',
      editorCallback: () => {
        try {
          new CustomStampModal(this.app, this).open();
        } catch (error) {
          this.showErrorNotice('Could not open the custom stamp modal', error);
        }
      }
    });

    this.addCommand({
      id: 'insert-current-block-height',
      name: 'Insert current block height',
      editorCallback: (editor: Editor) => {
        this.runAsync('Could not insert current block height', async () => {
          const blockHeight: string = await new Stamp().blockHeight(this.settings.formats.blockHeight, this.settings.blockExplorer);
          insertAtCursor(blockHeight, editor);
        });
      }
    });

    this.addCommand({
      id: 'insert-current-moscow-time',
      name: 'Insert current Moscow time',
      editorCallback: (editor: Editor) => {
        this.runAsync('Could not insert current Moscow time', async () => {
          const moscowTime: string = await new Stamp().moscowTime(this.settings.formats.moscowTime);
          insertAtCursor(moscowTime, editor);
        });
      }
    });

    this.addCommand({
      id: 'insert-current-moscow-time-at-block-height',
      name: 'Insert current Moscow time @ block height',
      editorCallback: (editor: Editor) => {
        this.runAsync('Could not insert current Moscow time @ block height', async () => {
          const moscowTimeAtBlockHeight: string = await new Stamp().moscowTimeAtBlockHeight(this.settings.formats.moscowTime, this.settings.formats.blockHeight, this.settings.blockExplorer);
          insertAtCursor(moscowTimeAtBlockHeight, editor);
        });
      }
    });
    
    this.addCommand({
      id: 'replace-stamp-placeholders',
      name: 'Replace stamp placeholders',
      callback: () => {
        const activeFile = this.app.workspace.getActiveFile();
        if (!(activeFile instanceof TFile)) {
          new Notice('🛑 No active file to replace stamp placeholders in.');
          return;
        }

        this.runAsync('Could not replace stamp placeholders', async () => {
          await this.replaceStampPlaceholders(activeFile);
        });
      }
    });

    this.app.workspace.onLayoutReady(() => {
      this.registerEvent(
        this.app.vault.on('create', (file: TAbstractFile) => {
          if (!(file instanceof TFile)) {
            return;
          }

          this.runAsync('Could not replace stamp placeholders in the new file', async () => {
            await this.replaceStampPlaceholders(file);
          });
        })
      );
    })
  }

  onunload() {

  }

  async loadSettings() {
    this.settings = normalizeSettings(await this.loadData());
    await this.saveSettings();
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async replaceStampPlaceholders (file: TFile) {
    let replacements: Replacements = {};
    const stamp = new Stamp();
    replacements = {
      [this.settings.placeholders.blockHeight]: await stamp.blockHeight(this.settings.formats.blockHeight, this.settings.blockExplorer),
      [this.settings.placeholders.moscowTime]: await stamp.moscowTime(this.settings.formats.moscowTime),
      [this.settings.placeholders.moscowTimeAtBlockHeight]: await stamp.moscowTimeAtBlockHeight(this.settings.formats.moscowTime, this.settings.formats.blockHeight, this.settings.blockExplorer)
    }

    await replacePlaceholders(this.app.vault, file, replacements);
  }

  private runAsync (action: string, task: () => Promise<void>) {
    void task().catch(error => {
      this.showErrorNotice(action, error);
    });
  }

  private showErrorNotice (action: string, error: unknown) {
    console.error(error);
    new Notice(`🛑 ${action}: ${this.getErrorMessage(error)}`);
  }

  private getErrorMessage (error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
