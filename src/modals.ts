import { App, Modal, Setting, Editor, MarkdownView, moment, Notice } from 'obsidian';
import BbsPlugin from '../main';
import BbsCore from './core';

export class BbsModal extends Modal {
    unixTimestamp: string;
    plugin: BbsPlugin;
    editor: Editor;
    stampType = 'blockHeight';

    constructor(app: App, plugin: BbsPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;

        const datetimeInputFormat = 'YYYY-MM-DD HH:mm:ss';
        const datetimeOutputFormat = 'D MMM YYYY, H:mm:ss [UTC]ZZ';
        const currentDatetime = moment().format(datetimeInputFormat);
        this.unixTimestamp = moment(currentDatetime, datetimeInputFormat).format('X');

        contentEl.createEl('h2', {text: 'Historical Bitcoin Block Stamp'});

        new Setting(contentEl)
            .setName('Date & time')
            .setDesc(`Date and time for which the closest block is stamped. Format: ${datetimeInputFormat}`)
            .addText(text => text
                .setPlaceholder(datetimeInputFormat)
                .setValue(currentDatetime)
                .onChange(value => {
                    this.unixTimestamp = moment(value, datetimeInputFormat).format('X')
                    const [isValidInput, problemMessage] = isValidDatetimeInput(this.unixTimestamp, datetimeOutputFormat);

                    if (!isValidInput) {
                        datetimeOutput.style.color = 'var(--text-error)';
                        datetimeOutput.setText(`Invalid input (${moment(this.unixTimestamp, 'X').format(datetimeOutputFormat)}): ${problemMessage}`);
                    } else {
                        datetimeOutput.style.color = 'var(--text-normal)';
                        datetimeOutput.setText(moment(this.unixTimestamp, 'X').format(datetimeOutputFormat));
                    }
                })
            )
        
        const datetimeOutput = contentEl.createEl('div');
        datetimeOutput.setAttr('align', 'right');
        datetimeOutput.setText(moment(currentDatetime, datetimeInputFormat).format(datetimeOutputFormat));

        new Setting(contentEl)
            .setName('Stamp type')
            .addDropdown(dd => dd
                .addOption('blockHeight', 'Block height')
                .addOption('moscowTime', 'Moscow time')
                .addOption('moscowTimeAtBlockHeight', 'Moscow time @ block height')
                .setValue(this.stampType)
                .onChange(value => {
                    this.stampType = value;
                })
            )
            .addButton(btn => btn
                .setButtonText("Stamp")
                .setCta()
                .onClick(() => {                    
                    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
                    const [isValidDatetime, problemMessage] = isValidDatetimeInput(this.unixTimestamp)
                    if (view && isValidDatetime) {
                        switch (this.stampType) {
                            case 'blockHeight': {
                                new BbsCore(this.plugin, view.editor).insertBlockHeight(this.unixTimestamp);
                                break;
                            }
                            case 'moscowTime': {
                                new BbsCore(this.plugin, view.editor).insertMoscowTime(this.unixTimestamp);
                                break;
                            }
                            case 'moscowTimeAtBlockHeight': {
                                new BbsCore(this.plugin, view.editor).insertMoscowTimeAtBlockHeight(this.unixTimestamp);
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
