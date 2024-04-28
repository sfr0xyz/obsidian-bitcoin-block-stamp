import { BlockExplorer, BlockHeightFormat, MoscowTimeFormat } from '@utils/types';
import BbsPlugin from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export interface BbsPluginSettings {
	blockExplorer: BlockExplorer;
	blockHeightFormat: BlockHeightFormat;
	moscowTimeFormat: MoscowTimeFormat;
}

export const DEFAULT_SETTINGS: BbsPluginSettings = {
	blockExplorer: '',
	blockHeightFormat: '',
	moscowTimeFormat: ''
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

		new Setting(containerEl)
			.setName('Block height format')
			.setDesc('Set thousands separator')
			.addDropdown(dropdown => dropdown
				.addOption('', 'Plain (840000)')
				.addOption(',', 'Comma (840,000)')
				.addOption('.', 'Period (840.000)')
				.addOption(' ', 'Space (840 000)')
				.addOption('\'', 'Apostrophe (840\'000)')
				.addOption('_', 'Underscore (840_000)')
				.setValue(this.plugin.settings.blockHeightFormat)
				.onChange(async value => {
					this.plugin.settings.blockHeightFormat = value as BlockHeightFormat;
					await this.plugin.saveSettings();
				})
			)
		
		new Setting(containerEl)
			.setName('Moscow time format')
			.setDesc('Set time format separator')
			.addDropdown(dropdown => dropdown
				.addOption('', 'Plain (1566)')
				.addOption(':', 'Colon (15:66)')
				.addOption('.', 'Period (15.66)')
				.setValue(this.plugin.settings.moscowTimeFormat)
				.onChange(async value => {
					this.plugin.settings.moscowTimeFormat = value as MoscowTimeFormat;
					await this.plugin.saveSettings();
				})
			)
	}
}
