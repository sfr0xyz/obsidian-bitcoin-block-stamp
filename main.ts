import { Editor, Plugin, TFile, Notice } from 'obsidian';
import { BbsPluginSettings, DEFAULT_SETTINGS, BbsSettingTab } from '@src/settings';
import { CustomStampModal } from '@modals/custom-stamp';
import { Stamp } from '@src/stamp';
import { insertAtCursor, replacePlaceholders } from '@utils/utils';
import { Replacements } from '@utils/types';

export default class BbsPlugin extends Plugin {
	settings: BbsPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('bitcoin', 'Insert custom Bitcoin block stamp', () => {
			new CustomStampModal(this.app, this).open();
		});

		this.addCommand({
			id: 'insert-current-block-height',
			name: 'Insert current block height',
			editorCallback: async (editor: Editor) => {
				try {
					const blockHeight: string = await new Stamp().blockHeight(this.settings.formats.blockHeight, this.settings.blockExplorer);
					insertAtCursor(blockHeight, editor);
				} catch (error) {
					console.error(error);
					new Notice('An error occured', error.message);
				}
			}
		});

		this.addCommand({
			id: 'insert-current-moscow-time',
			name: 'Insert current Moscow time',
			editorCallback: async (editor: Editor) => {
				try {
					const moscowTime: string = await new Stamp().moscowTime(this.settings.formats.moscowTime);
					insertAtCursor(moscowTime, editor);
				} catch (error) {
					console.error(error);
					new Notice('An error occured', error.message);
				}	
			}
		});

		this.addCommand({
			id: 'insert-current-moscow-time-at-block-height',
			name: 'Insert current Moscow time @ block height',
			editorCallback: async (editor: Editor) => {
				try{
					const moscowTimeAtBlockHeight: string = await new Stamp().moscowTimeAtBlockHeight(this.settings.formats.moscowTime, this.settings.formats.blockHeight, this.settings.blockExplorer);
					insertAtCursor(moscowTimeAtBlockHeight, editor);
				} catch (error) {
					console.error(error);
					new Notice('An error occured', error.message);
				}
			}
		});

		this.addCommand({
			id: 'insert-historical-block-stamp',
			name: 'Insert custom block stamp',
			editorCallback: () => {
				new CustomStampModal(this.app, this).open();
			}
		});
		
		this.addCommand({
			id: 'replace-stamp-placeholders',
			name: 'Replace stamp placeholders',
			callback: () => {
				console.log('replace-command')
				const activeFile = this.app.workspace.getActiveFile();
				console.log('active file', activeFile)
				this.replaceStampPlaceholders(activeFile as TFile);
			}
		});

		this.addSettingTab(new BbsSettingTab(this.app, this));

		this.app.workspace.onLayoutReady(() => {
			console.log('on layout ready')
			this.app.vault.on('create', (file: TFile) => {
				console.log('on create')
				this.replaceStampPlaceholders(file);
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

	async replaceStampPlaceholders (file: TFile) {
		let replacements: Replacements = {};
		const stamp = new Stamp();
		replacements = {
			[this.settings.placeholders.blockHeight]: await stamp.blockHeight(this.settings.formats.blockHeight, this.settings.blockExplorer),
			[this.settings.placeholders.blockHeight]: await stamp.moscowTime(this.settings.formats.moscowTime),
			[this.settings.placeholders.blockHeight]: await stamp.moscowTimeAtBlockHeight(this.settings.formats.moscowTime, this.settings.formats.blockHeight, this.settings.blockExplorer)
		}

		replacePlaceholders(this.app.vault, file, replacements);
	}
}
