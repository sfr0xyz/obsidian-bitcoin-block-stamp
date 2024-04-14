import { Editor, Plugin } from 'obsidian';
import BbsCore from './src/core';
import { BbsPluginSettings, DEFAULT_SETTINGS, BbsSettingTab } from './src/settings';
import { BbsModal } from './src/modals';

export default class BbsPlugin extends Plugin {
	settings: BbsPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('bitcoin', 'Historical Bitcoin Block Stamp', (evt: MouseEvent) => {
			new BbsModal(this.app, this).open();
		});

		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		this.addCommand({
			id: 'insert-current-block-height',
			name: 'Insert current Block Height',
			editorCallback: (editor: Editor) => {
				new BbsCore(this, editor).insertBlockHeight();
			}
		});

		this.addCommand({
			id: 'insert-current-moscow-time',
			name: 'Insert current Moscow Time',
			editorCallback: (editor: Editor) => {
				new BbsCore(this, editor).insertMoscowTime();
			}
		});

		this.addCommand({
			id: 'insert-current-moscow-time-at-block-height',
			name: 'Insert current Moscow Time @ Block Height',
			editorCallback: (editor: Editor) => {
				new BbsCore(this, editor).insertMoscowTimeAtBlockHeight();
			}
		});

		this.addCommand({
			id: 'insert-historical-block-stamp',
			name: 'Insert historical block stamp',
			editorCallback: () => {
				new BbsModal(this.app, this).open();
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
