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
import { BbsPluginSettings, DEFAULT_SETTINGS, BbsSettingTab } from './src/settings';
import { insertBlockHeight, insertMoscowTime, noteBlockHeight, noteMoscowTime } from './src/bbs';

export default class BbsPlugin extends Plugin {
	settings: BbsPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('bitcoin', 'Bitcoin Blockheight Stamp', (evt: MouseEvent) => {
			noteBlockHeight();
			noteMoscowTime();
		});

		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		this.addCommand({
			id: 'insert-block-height',
			name: 'Insert block height',
			editorCallback: (editor: Editor) => {
				insertBlockHeight(editor, this.settings.blockExplorer)
			}
		});

		this.addCommand({
			id: 'insert-moscow-time',
			name: 'Insert Moscow Time',
			editorCallback: (editor: Editor) => {
				insertMoscowTime(editor)
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
