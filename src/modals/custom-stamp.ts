import { App, Modal, Setting, MarkdownView, Notice } from 'obsidian';
import { moment } from '@utils/moment';
import type BbsPlugin from 'main';
import { BlockExplorer, BlockHeightFormat, MoscowTimeFormat, StampKind, UnixTimestamp } from '@utils/types';
import { StampGenerator, CustomStampRequest } from '@src/stamp-generator';
import { insertAtCursor } from '@utils/editor';
import { isValidDatetime, currentUnixtime } from '@utils/datetime';
import { updateDatetimeOutput } from '@utils/datetime-output';
import { DATETIME_INPUT_FORMAT, DATETIME_OUTPUT_FORMAT } from '@utils/constants';
import { BLOCK_EXPLORER_OPTIONS, BLOCK_HEIGHT_FORMAT_OPTIONS, MOSCOW_TIME_FORMAT_OPTIONS, STAMP_KIND_OPTIONS } from '@src/stamp-options';
import { showErrorNotice } from '@src/notice';

export class CustomStampModal extends Modal {
  plugin: BbsPlugin
  unixTimestamp!: UnixTimestamp
  stampKind!: StampKind
  blockHeightFormat!: BlockHeightFormat
  moscowTimeFormat!: MoscowTimeFormat
  blockExplorer!: BlockExplorer
  private stamps: StampGenerator
  
  constructor(app: App, plugin: BbsPlugin, stamps: StampGenerator) {
    super(app);
    this.plugin = plugin;
    this.stamps = stamps;
  }
  
  onOpen() {
    const { contentEl } = this;
    this.unixTimestamp = currentUnixtime();
    this.stampKind = 'block-height' as StampKind;
    this.blockHeightFormat = this.plugin.settings.formats.blockHeight;
    this.moscowTimeFormat = this.plugin.settings.formats.moscowTime;
    this.blockExplorer = this.plugin.settings.blockExplorer;

    const setDatetimeSetting = () => {
      datetimeSetting
        .addMomentFormat(momentFormat => momentFormat
          .setPlaceholder(DATETIME_INPUT_FORMAT)
          .setDefaultFormat(DATETIME_INPUT_FORMAT)
          .setValue(moment(this.unixTimestamp, 'X').format(DATETIME_INPUT_FORMAT))
          .onChange(datetime => {
            this.unixTimestamp = moment(datetime, DATETIME_INPUT_FORMAT).format('X') as UnixTimestamp;
            updateDatetimeOutput(this.unixTimestamp, datetimeOutput, datetimeDate, datetimeError);
          })
        )
        .addButton(button => button
          .setButtonText('Now')
          .setCta()
          .onClick(() => {
            datetimeSetting.clear();
            this.unixTimestamp = currentUnixtime();
            setDatetimeSetting();
            updateDatetimeOutput(this.unixTimestamp, datetimeOutput, datetimeDate, datetimeError);
          })
        );
    };

    const setSettings = () => {
      new Setting(settingsEl)
        .setName('Stamp kind')
        .addDropdown(dropdown => {
          STAMP_KIND_OPTIONS.forEach(option => dropdown.addOption(option.value, option.label));
          dropdown
            .setValue(this.stampKind)
            .onChange(value => {
              this.stampKind = value as StampKind;
              settingsEl.empty();
              setSettings();
            });
        });

      if (this.stampKind.includes('moscow-time')) {
        new Setting(settingsEl)
          .setName('Moscow time format')
          .addDropdown(dropdown => {
            MOSCOW_TIME_FORMAT_OPTIONS.forEach(option => dropdown.addOption(option.value, option.label));
            dropdown
              .setValue(this.moscowTimeFormat)
              .onChange(value => {
                this.moscowTimeFormat = value as MoscowTimeFormat;
              });
          });
      }
      if (this.stampKind.includes('block-height')) {
        new Setting(settingsEl)
          .setName('Block height format')
          .addDropdown(dropdown => {
            BLOCK_HEIGHT_FORMAT_OPTIONS.forEach(option => dropdown.addOption(option.value, option.label));
            dropdown
              .setValue(this.blockHeightFormat)
              .onChange(value => {
                this.blockHeightFormat = value as BlockHeightFormat;
              });
          });
        
        new Setting(settingsEl)
          .setName('Block explorer')
          .addDropdown(dropdown => {
            BLOCK_EXPLORER_OPTIONS.forEach(option => dropdown.addOption(option.value, option.label));
            dropdown
              .setValue(this.blockExplorer)
              .onChange(value => {
                this.blockExplorer = value as BlockExplorer;
              });
          });
      }
    };

    contentEl.createEl('h3', {text: 'Bitcoin block stamp'});

    const datetimeSetting = new Setting(contentEl)
      .setName('Date & time')
      .setDesc('Date and time of your stamp. The block closest to the time stamp entered will be stamped.');
    setDatetimeSetting();

    const datetimeOutput = contentEl.createDiv({ cls: 'datetimeOutput' });
    const datetimeDate = datetimeOutput.createDiv();
    const datetimeError = datetimeOutput.createDiv();
    datetimeDate.setText(moment(this.unixTimestamp, 'X').format(DATETIME_OUTPUT_FORMAT));

    const settingsEl = contentEl.createDiv({ cls: 'custom-stamp-settings' });
    setSettings();
    
    new Setting(contentEl)
      .addButton(btn => btn
        .setButtonText('Stamp')
        .setCta()
        .onClick(() => {
          void this.insertCustomStamp()
            .catch(error => {
              showErrorNotice('Could not insert custom stamp', error);
            })
            .finally(() => {
              this.close();
            });
        })
      );
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }

  private async insertCustomStamp () {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const { isValid, problemMessage } = isValidDatetime(this.unixTimestamp);
    if (view && isValid) {
      const request: CustomStampRequest = {
        unixTimestamp: this.unixTimestamp,
        stampKind: this.stampKind,
        blockHeightFormat: this.blockHeightFormat,
        moscowTimeFormat: this.moscowTimeFormat,
        blockExplorer: this.blockExplorer
      };
      const stampText = await this.stamps.customStamp(request);
      insertAtCursor(stampText, view.editor);
    } else {
      if (problemMessage) {
        new Notice(`Couldn't add stamp: Invalid date`);
      } else {
        new Notice(`Couldn't add stamp: Not in editor view`);
      }
    }
  }

}
