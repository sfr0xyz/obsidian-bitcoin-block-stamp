import { BlockExplorer, BlockHeightFormat, MoscowTimeFormat } from '@utils/types';
import BbsPlugin from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export interface StampFormats {
	blockHeight: BlockHeightFormat,
	moscowTime: MoscowTimeFormat
}

export interface StampPlaceholders {
	blockHeight: string,
	moscowTime: string,
	moscowTimeAtBlockHeight: string
}

export interface BbsPluginSettings {
	blockExplorer: BlockExplorer
	formats: StampFormats
	placeholders: StampPlaceholders
}

export const DEFAULT_SETTINGS: BbsPluginSettings = {
	blockExplorer: '',
	formats: {
		blockHeight: 'plain',
		moscowTime: 'plain'
	},
	placeholders: {
		blockHeight: '{{blockheight}}',
		moscowTime: '{{moscowtime}}',
		moscowTimeAtBlockHeight: '{{moscowtime@blockheight}}'
	}
}

export class BbsSettingTab extends PluginSettingTab {
	plugin: BbsPlugin;

	constructor(app: App, plugin: BbsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Block explorer')
			.setDesc('Set block explorer for block height links')
			.addDropdown(dropdown => dropdown
        .addOption('', 'None')
				.addOption('mempool-space', 'Mempool.space')
				.addOption('blockstream-info', 'Blockstream.info')
				.addOption('timechaincalendar-com', 'TimechainCalendar.com')
				.setValue(this.plugin.settings.blockExplorer)
				.onChange(async value => {
					this.plugin.settings.blockExplorer = value as BlockExplorer;
					await this.plugin.saveSettings()
				})
			)
		
		new Setting(containerEl).setName('Formats').setHeading();

		new Setting(containerEl)
			.setName('Block height format')
			.setDesc('Set thousands separator')
			.addDropdown(dropdown => dropdown
				.addOption('plain', 'Plain (840000)')
				.addOption('comma', 'Comma (840,000)')
				.addOption('period', 'Period (840.000)')
				.addOption('space', 'Space (840 000)')
				.addOption('apostrophe', 'Apostrophe (840\'000)')
				.addOption('underscore', 'Underscore (840_000)')
				.setValue(this.plugin.settings.formats.blockHeight)
				.onChange(async value => {
					this.plugin.settings.formats.blockHeight = value as BlockHeightFormat;
					await this.plugin.saveSettings();
				})
			)
		
		new Setting(containerEl)
			.setName('Moscow time format')
			.setDesc('Set time format separator')
			.addDropdown(dropdown => dropdown
				.addOption('plain', 'Plain (1566)')
				.addOption('colon', 'Colon (15:66)')
				.addOption('period', 'Period (15.66)')
				.setValue(this.plugin.settings.formats.moscowTime)
				.onChange(async value => {
					this.plugin.settings.formats.moscowTime = value as MoscowTimeFormat;
					await this.plugin.saveSettings();
				})
			)
		
		new Setting(containerEl).setName('Stamp Placeholders').setHeading()
			.setDesc('');
		new Setting(containerEl)
			.setName('Block height placeholder')
			.setDesc('')
			.addText(text => text
				.setPlaceholder('{{blockheight}}')
				.setValue(this.plugin.settings.placeholders.blockHeight)
				.onChange(async blockHeightPlaceholder => {
					this.plugin.settings.placeholders.blockHeight = blockHeightPlaceholder;
					await this.plugin.saveSettings();
				})
			)
		new Setting(containerEl)
			.setName('Moscow time placeholder')
			.setDesc('')
			.addText(text => text
				.setPlaceholder('{{moscowtime}}')
				.setValue(this.plugin.settings.placeholders.moscowTime)
				.onChange(async moscowTimePlaceholder => {
					this.plugin.settings.placeholders.moscowTime = moscowTimePlaceholder;
					await this.plugin.saveSettings();
				})
			)
		new Setting(containerEl)
			.setName('Moscow time @ block height placeholder')
			.setDesc('')
			.addText(text => text
				.setPlaceholder('{{moscowtime@blockheight}}')
				.setValue(this.plugin.settings.placeholders.moscowTimeAtBlockHeight)
				.onChange(async moscowTimeAtBlockHeightPlaceholder => {
					this.plugin.settings.placeholders.moscowTimeAtBlockHeight = moscowTimeAtBlockHeightPlaceholder;
					await this.plugin.saveSettings();
				})
			)
	}
}
