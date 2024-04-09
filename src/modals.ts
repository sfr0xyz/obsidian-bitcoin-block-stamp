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
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

        contentEl.createEl('h2', {text: 'Bitcoin Block Stamp'});
        
        new Setting(contentEl)
            .setName('Date and time')
            .setDesc('Date & time for which the closest block is stamped')
            .addText(text => text
                .setPlaceholder('YYYY-MM-DD HH:mm:ss')
                .setValue(currentTime)
                .onChange(value => {
                    this.unixTimestamp = moment(value).format('X');
                    
                    resp.textContent = moment(this.unixTimestamp, 'X').format('DD MMM YYYY [at] HH:mm:ss [UTC]ZZ');
                })
            )
        
        const resp = contentEl.createEl('span');
        resp.textContent = moment(currentTime, 'YYYY-MM-DD HH:mm:ss').format('DD MMM YYYY [at] HH:mm:ss [UTC]ZZ');

        new Setting(contentEl)
            .addDropdown(dd => dd
                .addOption('blockHeight', 'Block height')
                .addOption('moscowTime', 'Moscow time')
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
                                new Bbs(this.plugin, view.editor).insertBlockHeightAtTimestamp(this.unixTimestamp);
                                break;
                            }
                            case 'moscowTime': {
                                new Bbs(this.plugin, view.editor).insertMoscowTimeAtTimestamp(this.unixTimestamp);
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
