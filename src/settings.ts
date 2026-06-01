import { BlockExplorer, BlockHeightFormat, MoscowTimeFormat } from '@utils/types';
import type BbsPlugin from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';
import { DEFAULT_SETTINGS } from '@src/settings-data';
import { BLOCK_EXPLORER_OPTIONS, BLOCK_HEIGHT_FORMAT_OPTIONS, MOSCOW_TIME_FORMAT_OPTIONS } from '@src/stamp-options';
export { DEFAULT_SETTINGS, normalizeSettings } from '@src/settings-data';
export type { BbsPluginSettings, StampFormats, StampPlaceholders } from '@src/settings-data';

export class BbsSettingTab extends PluginSettingTab {
  plugin: BbsPlugin;

  constructor(app: App, plugin: BbsPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl} = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Block explorer')
      .setDesc('Default block explorer for block height links.')
      .addDropdown(dropdown => {
        BLOCK_EXPLORER_OPTIONS.forEach(option => dropdown.addOption(option.value, option.label));
        dropdown
          .setValue(this.plugin.settings.blockExplorer)
          .onChange(value => {
            this.plugin.settings.blockExplorer = value as BlockExplorer;
            this.saveSettingsSafely();
          });
      })
    
    new Setting(containerEl).setName('Formats').setHeading();

    new Setting(containerEl)
      .setName('Block height format')
      .setDesc('Thousands separator.')
      .addDropdown(dropdown => {
        BLOCK_HEIGHT_FORMAT_OPTIONS.forEach(option => dropdown.addOption(option.value, option.label));
        dropdown
          .setValue(this.plugin.settings.formats.blockHeight)
          .onChange(value => {
            this.plugin.settings.formats.blockHeight = value as BlockHeightFormat;
            this.saveSettingsSafely();
          });
      })
    
    new Setting(containerEl)
      .setName('Moscow time format')
      .setDesc('Time format separator.')
      .addDropdown(dropdown => {
        MOSCOW_TIME_FORMAT_OPTIONS.forEach(option => dropdown.addOption(option.value, option.label));
        dropdown
          .setValue(this.plugin.settings.formats.moscowTime)
          .onChange(value => {
            this.plugin.settings.formats.moscowTime = value as MoscowTimeFormat;
            this.saveSettingsSafely();
          });
      })
    
    new Setting(containerEl)
      .setName('Stamp placeholders').setHeading()
      .setDesc('Placeholders are replaced with the current stamp when you create a new note or when you use the "Replace stamp placeholder" command.');

    new Setting(containerEl)
      .setName('Block height placeholder')
      .setDesc(`Default: ${DEFAULT_SETTINGS.placeholders.blockHeight}`)
      .addText(text => text
        //.setPlaceholder('{{blockheight}}')
        .setValue(this.plugin.settings.placeholders.blockHeight)
        .onChange(blockHeightPlaceholder => {
          this.plugin.settings.placeholders.blockHeight = blockHeightPlaceholder;
          this.saveSettingsSafely();
        })
      )
    new Setting(containerEl)
      .setName('Moscow time placeholder')
      .setDesc(`Default: ${DEFAULT_SETTINGS.placeholders.moscowTime}`)
      .addText(text => text
        //.setPlaceholder('{{moscowtime}}')
        .setValue(this.plugin.settings.placeholders.moscowTime)
        .onChange(moscowTimePlaceholder => {
          this.plugin.settings.placeholders.moscowTime = moscowTimePlaceholder;
          this.saveSettingsSafely();
        })
      )
    new Setting(containerEl)
      .setName('Moscow time @ block height placeholder')
      .setDesc(`Default: ${DEFAULT_SETTINGS.placeholders.moscowTimeAtBlockHeight}`)
      .addText(text => text
        //.setPlaceholder('{{moscowtime@blockheight}}')
        .setValue(this.plugin.settings.placeholders.moscowTimeAtBlockHeight)
        .onChange(moscowTimeAtBlockHeightPlaceholder => {
          this.plugin.settings.placeholders.moscowTimeAtBlockHeight = moscowTimeAtBlockHeightPlaceholder;
          this.saveSettingsSafely();
        })
      )
  }

  private saveSettingsSafely () {
    void this.plugin.saveSettings().catch(error => {
      console.error(error);
    });
  }
}
