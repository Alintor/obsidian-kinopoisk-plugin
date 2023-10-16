import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { SearchModal } from 'Views/search_modal';
// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class ObsidianKinopoiskPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon('film', 'Search in Kinopoisk', () => {
			this.createNewNote();
		});
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		this.addCommand({
			id: 'open-search-kinopoisk-modal',
			name: 'Search in Kinopoisk',
			callback: () => {
				this.createNewNote();
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	async createNewNote(): Promise<void> {
		new SearchModal(this, '').open();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class SampleSettingTab extends PluginSettingTab {
	plugin: ObsidianKinopoiskPlugin;

	constructor(app: App, plugin: ObsidianKinopoiskPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
