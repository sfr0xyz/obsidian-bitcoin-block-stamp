import BbsPlugin from '../main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export interface BbsPluginSettings {
	blockExplorer: '_NONE_' | 'mempool_space' | 'blockstream_info' | 'timechaincalendar_com';
	blockHeightFormat: string;
	moscowTimeFormat: string;
}

export const DEFAULT_SETTINGS: BbsPluginSettings = {
	blockExplorer: '_NONE_',
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
			.setDesc('Block explorer for block height links')
			.addDropdown(dropdown => dropdown
                .addOption('_NONE_', 'None')
				.addOption('mempool_space', 'Mempool.space')
				.addOption('blockstream_info', 'Blockstream.info')
				.addOption('timechaincalendar_com', 'TimechainCalendar.com')
				.setValue(this.plugin.settings.blockExplorer)
				.onChange(async value => {
					this.plugin.settings.blockExplorer = value as 'mempool_space' | 'blockstream_info' | 'timechaincalendar_com';
					await this.plugin.saveSettings()
				})
			)
	}
}
