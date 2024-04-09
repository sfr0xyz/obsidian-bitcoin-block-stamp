import { 
	//App, 
	Editor, 
	//Notice, 
	//MarkdownView, 
	//Modal, 
	//Notice, 
	Plugin, 
	//PluginSettingTab, 
	//Setting 
} from 'obsidian';
import Bbs from './src/bitcoin-block-stamp';
import { BbsPluginSettings, DEFAULT_SETTINGS, BbsSettingTab } from './src/settings';
import { BbsModal } from './src/modals';

export default class BbsPlugin extends Plugin {
	settings: BbsPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('bitcoin', 'Bitcoin Block Stamp', (evt: MouseEvent) => {
			//noteBlockHeight();
			//noteMoscowTime();
			new BbsModal(this.app, this).open();
		});

		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		this.addCommand({
			id: 'insert-block-height',
			name: 'Insert block height',
			editorCallback: (editor: Editor) => {
				new Bbs(this, editor).insertCurrentBlockHeight();
			}
		});

		this.addCommand({
			id: 'insert-moscow-time',
			name: 'Insert Moscow Time',
			editorCallback: (editor: Editor) => {
				new Bbs(this, editor).insertCurrentMoscowTime();
			}
		});
		
		this.addSettingTab(new BbsSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
