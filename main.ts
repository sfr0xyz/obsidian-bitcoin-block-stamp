import { Editor, Plugin, TAbstractFile, TFile, Notice } from 'obsidian';
import { BbsPluginSettings, DEFAULT_SETTINGS, BbsSettingTab } from '@src/settings';
import { CustomStampModal } from '@modals/custom-stamp';
import { Stamp } from '@src/stamp';
import { insertAtCursor, replacePlaceholders } from '@utils/functions';
import { Replacements } from '@utils/types';

export default class BbsPlugin extends Plugin {
  settings: BbsPluginSettings;

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new BbsSettingTab(this.app, this));

    this.addRibbonIcon('bitcoin', 'Insert Bitcoin block stamp', () => {
      try {
        new CustomStampModal(this.app, this).open();
      } catch (error) {
        console.error(error);
        new Notice('🛑 An error occurred while adding a custom stamp.');
      }
    });

    this.addCommand({
      id: 'insert-historical-block-stamp',
      name: 'Insert custom block stamp',
      editorCallback: () => {
        try {
          new CustomStampModal(this.app, this).open();
        } catch (error) {
          console.error(error);
          new Notice('🛑 An error occurred while adding a custom stamp.');
        }
      }
    });

    this.addCommand({
      id: 'insert-current-block-height',
      name: 'Insert current block height',
      editorCallback: async (editor: Editor) => {
        try {
          const blockHeight: string = await new Stamp().blockHeight(this.settings.formats.blockHeight, this.settings.blockExplorer);
          insertAtCursor(blockHeight, editor);
        } catch (error) {
          console.error(error);
          new Notice('🛑 An error occurred while adding the stamp.');
        }
      }
    });

    this.addCommand({
      id: 'insert-current-moscow-time',
      name: 'Insert current Moscow time',
      editorCallback: async (editor: Editor) => {
        try {
          const moscowTime: string = await new Stamp().moscowTime(this.settings.formats.moscowTime);
          insertAtCursor(moscowTime, editor);
        } catch (error) {
          console.error(error);
          new Notice('🛑 An error occurred while adding the stamp.');
        }	
      }
    });

    this.addCommand({
      id: 'insert-current-moscow-time-at-block-height',
      name: 'Insert current Moscow time @ block height',
      editorCallback: async (editor: Editor) => {
        try{
          const moscowTimeAtBlockHeight: string = await new Stamp().moscowTimeAtBlockHeight(this.settings.formats.moscowTime, this.settings.formats.blockHeight, this.settings.blockExplorer);
          insertAtCursor(moscowTimeAtBlockHeight, editor);
        } catch (error) {
          console.error(error);
          new Notice('🛑 An error occurred while adding the stamp.');
        }
      }
    });
    
    this.addCommand({
      id: 'replace-stamp-placeholders',
      name: 'Replace stamp placeholders',
      callback: async () => {
        try {
          const activeFile = this.app.workspace.getActiveFile();
          if (!activeFile) {
            new Notice('🛑 No active file to replace stamp placeholders in.');
            return;
          }

          await this.replaceStampPlaceholders(activeFile);
        } catch (error) {
          console.error(error);
          new Notice('🛑 An error occurred while replacing stamp placeholders.');
        }
      }
    });

    this.app.workspace.onLayoutReady(() => {
      this.registerEvent(
        this.app.vault.on('create', async (file: TAbstractFile) => {
          if (!(file instanceof TFile)) {
            return;
          }

          try {
            await this.replaceStampPlaceholders(file);
          } catch (error) {
            console.error(error);
            new Notice('🛑 An error occurred while replacing stamp placeholders.');
          }
        })
      );
    })
  }

  onunload() {

  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
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

    replacePlaceholders(this.app.vault, file, replacements);
  }
}
