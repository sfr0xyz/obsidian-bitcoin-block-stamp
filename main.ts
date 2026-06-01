import { Editor, Plugin, TAbstractFile, TFile, Notice } from 'obsidian';
import { BbsSettingTab } from '@src/settings';
import { BbsPluginSettings, normalizeSettings } from '@src/settings-data';
import { CustomStampModal } from '@modals/custom-stamp';
import { MempoolSpaceStampSource } from '@apis/mempool-space';
import { StampGenerator } from '@src/stamp-generator';
import { insertAtCursor } from '@utils/editor';
import { replacePlaceholders } from '@utils/vault-placeholders';
import { showErrorNotice } from '@src/notice';

export default class BbsPlugin extends Plugin {
  settings!: BbsPluginSettings;
  private stamps = new StampGenerator(new MempoolSpaceStampSource());

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new BbsSettingTab(this.app, this));

    this.addRibbonIcon('bitcoin', 'Insert Bitcoin block stamp', () => {
      try {
        this.openCustomStampModal();
      } catch (error) {
        showErrorNotice('Could not open the custom stamp modal', error);
      }
    });

    this.addCommand({
      id: 'insert-historical-block-stamp',
      name: 'Insert custom block stamp',
      editorCallback: () => {
        try {
          this.openCustomStampModal();
        } catch (error) {
          showErrorNotice('Could not open the custom stamp modal', error);
        }
      }
    });

    this.addCommand({
      id: 'insert-current-block-height',
      name: 'Insert current block height',
      editorCallback: (editor: Editor) => {
        this.runAsync('Could not insert current block height', async () => {
          const blockHeight: string = await this.stamps.currentBlockHeight(this.settings);
          insertAtCursor(blockHeight, editor);
        });
      }
    });

    this.addCommand({
      id: 'insert-current-moscow-time',
      name: 'Insert current Moscow time',
      editorCallback: (editor: Editor) => {
        this.runAsync('Could not insert current Moscow time', async () => {
          const moscowTime: string = await this.stamps.currentMoscowTime(this.settings);
          insertAtCursor(moscowTime, editor);
        });
      }
    });

    this.addCommand({
      id: 'insert-current-moscow-time-at-block-height',
      name: 'Insert current Moscow time @ block height',
      editorCallback: (editor: Editor) => {
        this.runAsync('Could not insert current Moscow time @ block height', async () => {
          const moscowTimeAtBlockHeight: string = await this.stamps.currentMoscowTimeAtBlockHeight(this.settings);
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
    const replacements = await this.stamps.placeholderReplacements(this.settings);

    await replacePlaceholders(this.app.vault, file, replacements);
  }

  private openCustomStampModal () {
    new CustomStampModal(this.app, this, this.stamps).open();
  }

  private runAsync (action: string, task: () => Promise<void>) {
    void task().catch(error => {
      showErrorNotice(action, error);
    });
  }

}
