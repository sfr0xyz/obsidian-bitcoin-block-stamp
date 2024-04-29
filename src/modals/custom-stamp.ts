import { App, Modal, Setting, MarkdownView, moment, Notice } from 'obsidian';
import BbsPlugin from 'main';
import { BlockExplorer, BlockHeightFormat, MoscowTimeFormat, StampKind, UnixTimestamp } from '@utils/types';
import { Stamp } from '@src/stamp';
import { insertAtCursor, isValidDatetime, updateDateTimeOutput } from '@utils/utils';
import { DATETIME_INPUT_FORMAT, DATETIME_OUTPUT_FORMAT } from '@utils/constants';

export class CustomStampModal extends Modal {
  unixTimestamp: UnixTimestamp
  plugin: BbsPlugin
  stampKind: StampKind
  blockHeightFormat: BlockHeightFormat
  moscowTimeFormat: MoscowTimeFormat
  blockExplorer: BlockExplorer
  
  constructor(app: App, plugin: BbsPlugin) {
    super(app);
    this.plugin = plugin;
    this.stampKind = 'block-height';
    this.blockHeightFormat = this.plugin.settings.formats.blockHeight;
    this.moscowTimeFormat = this.plugin.settings.formats.moscowTime;
    this.blockExplorer = this.plugin.settings.blockExplorer;
  }
  
  onOpen() {
    const { contentEl } = this;
    
    const currentDatetime = () => { 
      const current = moment().format(DATETIME_INPUT_FORMAT);
      this.unixTimestamp = moment(current, DATETIME_INPUT_FORMAT).format('X') as UnixTimestamp;
      return current;
    };

    const setDateTimeSetting = () => {
      dateTimeSetting
        .addMomentFormat(momentFormat => momentFormat
          .setPlaceholder(DATETIME_INPUT_FORMAT)
          .setDefaultFormat(DATETIME_INPUT_FORMAT)
          .setValue(currentDatetime())
          .onChange(datetime => {
            this.unixTimestamp = moment(datetime, DATETIME_INPUT_FORMAT).format('X') as UnixTimestamp;
            updateDateTimeOutput(this.unixTimestamp, datetimeOutput, datetimeDate, datetimeError);
          })
        )
        .addButton(button => button
          .setButtonText('Now')
          .setCta()
          .onClick(() => {
            dateTimeSetting.clear();
            setDateTimeSetting();
            updateDateTimeOutput(this.unixTimestamp, datetimeOutput, datetimeDate, datetimeError);
          })
        );
    }

    contentEl.createEl('h2', {text: 'Custom block stamp'});

    const dateTimeSetting = new Setting(contentEl)
      .setName('Date & time')
      .setDesc(`Date and time for which the closest block is stamped`);
    setDateTimeSetting();
  
    const datetimeOutput = contentEl.createEl('div', { cls: 'datetimeOutput' });
    const datetimeDate = datetimeOutput.createEl('div');
    const datetimeError = datetimeOutput.createEl('div');
    datetimeDate.setText(moment(this.unixTimestamp, 'X').format(DATETIME_OUTPUT_FORMAT));
    
    new Setting(contentEl)
      .setName('Stamp kind')
      .addDropdown(dropdown => dropdown
        .addOption('block-height', 'Block height')
        .addOption('moscow-time', 'Moscow time')
        .addOption('moscow-time_at_block-height', 'Moscow time @ block height')
        .setValue(this.stampKind)
        .onChange((stampKind: StampKind) => {
          this.stampKind = stampKind;
          if (this.stampKind == 'block-height') { moscowTimeFormatSetting.setDisabled }
        })
      );

    const moscowTimeFormatSetting = new Setting(contentEl)
      .setName('Moscow time format')
      .addDropdown(dropdown => dropdown
        .addOption('', 'Plain (1566)')
        .addOption(':', 'Colon (15:66)')
        .addOption('.', 'Period (15.66)')
        .setValue(this.moscowTimeFormat)
        .onChange((moscowTimeFormat: MoscowTimeFormat) => {
          this.moscowTimeFormat = moscowTimeFormat;
        })
      );

    new Setting(contentEl)
      .setName('Block height format')
      .addDropdown(dropdown => dropdown
        .addOption('', 'Plain (840000)')
        .addOption(',', 'Comma (840,000)')
        .addOption('.', 'Period (840.000)')
        .addOption(' ', 'Space (840 000)')
        .addOption('\'', 'Apostrophe (840\'000)')
        .addOption('_', 'Underscore (840_000)')
        .setValue(this.blockHeightFormat)
        .onChange((blockHeightFormat: BlockHeightFormat) => {
          this.blockHeightFormat = blockHeightFormat;
        })
      );
    
    new Setting(contentEl)
      .setName('Block explorer')
      .addDropdown(dropdown => dropdown
        .addOption('', 'None')
				.addOption('mempool-space', 'Mempool.space')
				.addOption('blockstream-info', 'Blockstream.info')
				.addOption('timechaincalendar-com', 'TimechainCalendar.com')
				.setValue(this.blockExplorer)
        .onChange((blockExplorer: BlockExplorer) => {
          this.blockExplorer = blockExplorer;
        })
      );

    new Setting(contentEl)
      .addButton(btn => btn
        .setButtonText('Stamp')
        .setCta()
        .onClick(async () => {                    
          const view = this.app.workspace.getActiveViewOfType(MarkdownView);
          const { isValid, problemMessage } = isValidDatetime(this.unixTimestamp);
          if (view && isValid) {
            switch (this.stampKind) {
              case 'block-height': {
                const blockHeight = await new Stamp(this.unixTimestamp).blockHeight(this.blockHeightFormat, this.blockExplorer);
                insertAtCursor(blockHeight, view.editor);
                break;
              }
              case 'moscow-time': {
                const moscowTime: string = await new Stamp(this.unixTimestamp).moscowTime(this.moscowTimeFormat);
                insertAtCursor(moscowTime, view.editor);
                break;
              }
              case 'moscow-time_at_block-height': {
                const moscowTimeAtBlockHeight: string = await new Stamp(this.unixTimestamp).moscowTimeAtBlockHeight(this.moscowTimeFormat, this.blockHeightFormat, this.blockExplorer);
                insertAtCursor(moscowTimeAtBlockHeight, view.editor);
                break;
              }
              default: {
                new Notice('No valid stamp selected!');
                break;
              }
            }
          } else {
            if (problemMessage) {
              new Notice(`Couldn't add stamp: Invalid date`);
            } else {
              new Notice(`Couldn't add stamp: Not in editor view`);
            }
          }
          
          this.close();
        })
      );
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
