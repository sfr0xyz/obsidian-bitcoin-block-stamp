import { Editor, Plugin, TFile } from 'obsidian';
import BbsCore from 'src/core';
import { BbsPluginSettings, DEFAULT_SETTINGS, BbsSettingTab } from 'src/settings';
import { BbsModal } from 'src/modals';

export default class BbsPlugin extends Plugin {
	settings: BbsPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('bitcoin', 'Insert custom Bitcoin block stamp', (evt: MouseEvent) => {
			new BbsModal(this.app, this).open();
		});

		this.addCommand({
			id: 'insert-current-block-height',
			name: 'Insert current block height',
			editorCallback: (editor: Editor) => {
				new BbsCore(this, editor).insertBlockHeight();
			}
		});

		this.addCommand({
			id: 'insert-current-moscow-time',
			name: 'Insert current Moscow time',
			editorCallback: (editor: Editor) => {
				new BbsCore(this, editor).insertMoscowTime();
			}
		});

		this.addCommand({
			id: 'insert-current-moscow-time-at-block-height',
			name: 'Insert current Moscow time @ block height',
			editorCallback: (editor: Editor) => {
				new BbsCore(this, editor).insertMoscowTimeAtBlockHeight();
			}
		});

		this.addCommand({
			id: 'insert-historical-block-stamp',
			name: 'Insert custom block stamp',
			editorCallback: () => {
				new BbsModal(this.app, this).open();
			}
		});
		
		this.addSettingTab(new BbsSettingTab(this.app, this));

		this.app.workspace.onLayoutReady(() => {
			this.app.vault.on('create', (file: TFile) => {
				new BbsCore(this).replacePlaceholders(file);
			})
		})
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
