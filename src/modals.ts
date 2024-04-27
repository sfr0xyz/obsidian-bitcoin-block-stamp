import { App, Modal, Setting, Editor, MarkdownView, moment, Notice } from 'obsidian';
import BbsPlugin from 'main';
import BbsCore from 'src/core';

export class BbsModal extends Modal {
  unixTimestamp: string;
  plugin: BbsPlugin;
  editor: Editor;
  stampType: string;
  blockHeightFormat: string;
  moscowTimeFormat: string;
  
  constructor(app: App, plugin: BbsPlugin) {
    super(app);
    this.plugin = plugin;
    this.stampType = 'block-height';
    this.blockHeightFormat = this.plugin.settings.blockHeightFormat;
    this.moscowTimeFormat = this.plugin.settings.moscowTimeFormat;
  }
  
  onOpen() {
    const { contentEl } = this;
    
    const datetimeInputFormat = 'YYYY-MM-DD HH:mm:ss';
    const datetimeOutputFormat = 'D MMM YYYY, H:mm:ss [UTC]ZZ';
    const currentDatetime = moment().format(datetimeInputFormat);
    this.unixTimestamp = moment(currentDatetime, datetimeInputFormat).format('X');
    
    contentEl.createEl('h2', {text: 'Custom block stamp'});

    new Setting(contentEl)
      .setName('Date & time')
      .setDesc(`Date and time for which the closest block is stamped`)
      .addMomentFormat(momentFormat => momentFormat
        .setPlaceholder(datetimeInputFormat)
        .setDefaultFormat(datetimeInputFormat)
        .setValue(currentDatetime)
        .onChange(datetime => {
          this.unixTimestamp = moment(datetime, datetimeInputFormat).format('X')
          const [isValidInput, problemMessage] = isValidDatetimeInput(this.unixTimestamp, datetimeOutputFormat);
          
          datetimeOutput.toggleClass('datetimeOutput-error', !isValidInput);
          datetimeOutput.setText( (!isValidInput)
            ? `Invalid input (${moment(this.unixTimestamp, 'X').format(datetimeOutputFormat)}): ${problemMessage}`
            : moment(this.unixTimestamp, 'X').format(datetimeOutputFormat)
          );
        })
      )
  
  const datetimeOutput = contentEl.createEl('div', { cls: 'datetimeOutput' });
  datetimeOutput.setText(moment(currentDatetime, datetimeInputFormat).format(datetimeOutputFormat));
  
  new Setting(contentEl)
    .setName('Stamp type')
    .addDropdown(dd => dd
      .addOption('block-height', 'Block height')
      .addOption('moscow-time', 'Moscow time')
      .addOption('moscow-time-at-block-height', 'Moscow time @ block height')
      .setValue(this.stampType)
      .onChange(stampType => {
        this.stampType = stampType;
      })
    );
  
  new Setting(contentEl)
    .setName('Block height format')
    .addDropdown(dropdown => dropdown
      .addOption('plain', 'Plain (840000)')
      .addOption('comma', 'Comma (840,000)')
      .addOption('period', 'Period (840.000)')
      .addOption('space', 'Space (840 000)')
      .addOption('apostrophe', 'Apostrophe (840\'000)')
      .addOption('underscore', 'Underscore (840_000)')
      .setValue(this.blockHeightFormat)
      .onChange(blockHeightFormat => {
        this.blockHeightFormat = blockHeightFormat;
      })
    );
  
  new Setting(contentEl)
    .setName('Moscow time format')
    .addDropdown(dropdown => dropdown
      .addOption('plain', 'Plain (1566)')
      .addOption('colon', 'Colon (15:66)')
      .addOption('period', 'Period (15.66)')
      .setValue(this.moscowTimeFormat)
      .onChange(moscowTimeFormat => {
        this.moscowTimeFormat = moscowTimeFormat;
      })
    );

  new Setting(contentEl)
    .addButton(btn => btn
      .setButtonText("Stamp")
      .setCta()
      .onClick(() => {                    
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        const [isValidDatetime, problemMessage] = isValidDatetimeInput(this.unixTimestamp)
        if (view && isValidDatetime) {
          switch (this.stampType) {
            case 'block-height': {
              new BbsCore(this.plugin, view.editor).insertBlockHeight(this.unixTimestamp, this.blockHeightFormat);
              break;
            }
            case 'moscow-time': {
              new BbsCore(this.plugin, view.editor).insertMoscowTime(this.unixTimestamp, this.moscowTimeFormat);
              break;
            }
            case 'moscow-time-at-block-height': {
              new BbsCore(this.plugin, view.editor).insertMoscowTimeAtBlockHeight(this.unixTimestamp, this.moscowTimeFormat, this.blockHeightFormat);
              break;
            }
            default: {
              new Notice('No valid stamp selected!');
              break;
            }
          }
        } else {
          if (problemMessage) {
            new Notice(`Couldn't add stamp: Invalid date: ${problemMessage}`);
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

function isValidDatetimeInput (unixTimestamp: string, datetimeOutputFormat = 'YYYY-MM-DD HH:mm:ss [UTC]ZZ') {
  const genesisBlockTimestamp = '1231006505';
  let isValid = true;
  let problemMessage = '';
  if (unixTimestamp < genesisBlockTimestamp) {
    isValid = false;
    problemMessage = `Date lies before the Genesis block (${moment(genesisBlockTimestamp, 'X').format(datetimeOutputFormat)})`;
  }
  if (unixTimestamp > moment().format('X')) {
    isValid = false;
    problemMessage = `Date lies in the future`;
  }
  if (unixTimestamp.length !== 10) {
    isValid = false;
    problemMessage = `Not a date`;
  }
  return [isValid, problemMessage];
}
