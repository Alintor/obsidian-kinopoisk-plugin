import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { SearchModal } from 'Views/search_modal';
import { ItemsSuggestModal } from 'Views/suggest_modal';
import { KinopoiskSuggestItem } from 'Models/kinopoisk_response'
import { MoviewShow } from 'Models/MovieShow.model';

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

	showNotice(error: Error) {
		try {
		  new Notice(error.message);
		} catch {
		  // eslint-disable
		}
	  }

	async createNewNote(): Promise<void> {
		try {
			const movieShow = await this.searchMovieShow();
			console.log(movieShow)
	  
			// open file
			const activeLeaf = this.app.workspace.getLeaf();
			if (!activeLeaf) {
			  console.warn('No active leaf');
			  return;
			}
		  } catch (err) {
			console.warn(err);
			this.showNotice(err);
		  }
	}

	async searchMovieShow(): Promise<MoviewShow> {
		const searchedItems = await this.openSearchModal();
		return await this.openSuggestModal(searchedItems);
	}

	async openSearchModal(): Promise<KinopoiskSuggestItem[]> {
		return new Promise((resolve, reject) => {
		  return new SearchModal(this, (error, results) => {
			return error ? reject(error) : resolve(results ?? []);
		  }).open();
		});
	}

	async openSuggestModal(items: KinopoiskSuggestItem[]): Promise<MoviewShow> {
		return new Promise((resolve, reject) => {
		  return new ItemsSuggestModal(this.app, items, (error, selectedItem) => {
			return error ? reject(error) : resolve(selectedItem!);
		  }).open();
		});
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
