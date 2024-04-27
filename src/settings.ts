import BbsPlugin from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export interface BbsPluginSettings {
	blockExplorer: '_NONE_' | 'mempool_space' | 'blockstream_info' | 'timechaincalendar_com';
	blockHeightFormat: 'plain' | 'comma' | 'period' | 'space' | 'underscore' | 'apostrophe';
	moscowTimeFormat: 'plain' | 'colon' | 'period';
}

export const DEFAULT_SETTINGS: BbsPluginSettings = {
	blockExplorer: '_NONE_',
	blockHeightFormat: 'plain',
	moscowTimeFormat: 'plain'
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
			.setDesc('Block explorer for block height links')
			.addDropdown(dropdown => dropdown
        .addOption('_NONE_', 'None')
				.addOption('mempool_space', 'Mempool.space')
				.addOption('blockstream_info', 'Blockstream.info')
				.addOption('timechaincalendar_com', 'TimechainCalendar.com')
				.setValue(this.plugin.settings.blockExplorer)
				.onChange(async value => {
					this.plugin.settings.blockExplorer = value as '_NONE_' | 'mempool_space' | 'blockstream_info' | 'timechaincalendar_com';
					await this.plugin.saveSettings()
				})
			)

		new Setting(containerEl)
			.setName('Block height format')
			.setDesc('Thousands separator')
			.addDropdown(dropdown => dropdown
				.addOption('plain', 'Plain (840000)')
				.addOption('comma', 'Comma (840,000)')
				.addOption('period', 'Period (840.000)')
				.addOption('space', 'Space (840 000)')
				.addOption('apostrophe', 'Apostrophe (840\'000)')
				.addOption('underscore', 'Underscore (840_000)')
				.setValue(this.plugin.settings.blockHeightFormat)
				.onChange(async value => {
					this.plugin.settings.blockHeightFormat = value as 'plain' | 'comma' | 'period' | 'space' | 'underscore' | 'apostrophe';
					await this.plugin.saveSettings();
				})
			)
		
		new Setting(containerEl)
			.setName('Moscow time format')
			.setDesc('Time format separator')
			.addDropdown(dropdown => dropdown
				.addOption('plain', 'Plain (1566)')
				.addOption('colon', 'Colon (15:66)')
				.addOption('period', 'Period (15.66)')
				.setValue(this.plugin.settings.moscowTimeFormat)
				.onChange(async value => {
					this.plugin.settings.moscowTimeFormat = value as 'plain' | 'colon' | 'period';
					await this.plugin.saveSettings();
				})
			)
	}
}
