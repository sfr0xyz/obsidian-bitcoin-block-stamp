import { App, Modal, Setting, Editor, MarkdownView, moment, Notice } from 'obsidian';
import BbsPlugin from '../main';
import Bbs from './bitcoin-block-stamp';


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
        const datetimeOutputFormat = 'D MMM YYYY, h:mm:ss a [UTC]ZZ';
        const currentDatetime = moment().format(datetimeInputFormat);
        this.unixTimestamp = moment(currentDatetime, datetimeInputFormat).format('X');

        contentEl.createEl('h2', {text: 'Historical Bitcoin Block Stamp'});
        contentEl.createEl('p', {text: 'This is a paragraph'})
        
        new Setting(contentEl)
            .setName('Date & Time')
            .setDesc(`Date and time for which the closest block is stamped. Format: ${datetimeInputFormat}`)
            .addText(text => text
                .setPlaceholder(datetimeInputFormat)
                .setValue(currentDatetime)
                .onChange(value => {
                    this.unixTimestamp = moment(value, datetimeInputFormat).format('X');
                    datetimeOutput.innerHTML = moment(this.unixTimestamp, 'X').format(datetimeOutputFormat);
                })
            )
        
        const datetimeOutput = contentEl.createEl('div');
        datetimeOutput.setAttr('align', 'right');
        datetimeOutput.innerHTML = moment(currentDatetime, datetimeInputFormat).format(datetimeOutputFormat);

        new Setting(contentEl)
            .setName('Stamp Type')
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
                    
                    if (view) {
                        switch (this.stampType) {
                            case 'blockHeight': {
                                new Bbs(this.plugin, view.editor).insertBlockHeight(this.unixTimestamp);
                                break;
                            }
                            case 'moscowTime': {
                                new Bbs(this.plugin, view.editor).insertMoscowTime(this.unixTimestamp);
                                break;
                            }
                            case 'moscowTimeAtBlockHeight': {
                                new Bbs(this.plugin, view.editor).insertMoscowTimeAtBlockHeight(this.unixTimestamp);
                                break;
                            }
                            default: {
                                new Notice('No valid stamp selected!');
                                break;
                            }
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
