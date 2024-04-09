import { App, Modal, Setting, Editor, MarkdownView, moment } from 'obsidian';
import BbsPlugin from '../main';
import Bbs from './bitcoin-block-stamp';


export class BbsModal extends Modal {
    unixTimestamp: string;
    plugin: BbsPlugin
    editor: Editor

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
                    
                    resp.textContent = moment(this.unixTimestamp, 'X').format('DD MMM YYYY @ HH:mm:ss [UTC]ZZ');
                })
            );
        
        const resp = contentEl.createEl('span');
        resp.textContent = moment(currentTime, 'YYYY-MM-DD HH:mm:ss').format('DD MMM YYYY @ HH:mm:ss [UTC]ZZ');

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText("Stamp")
                .setCta()
                .onClick(() => {                    
                    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
                    
                    if (view) {
                        new Bbs(this.plugin, view.editor).insertBlockHeightAtTimestamp(this.unixTimestamp);
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
