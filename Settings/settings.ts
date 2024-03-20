import { App, PluginSettingTab, Setting } from "obsidian";
import ObsidianKinopoiskPlugin from "main";
import { FolderSuggest } from "./Suggesters/FolderSuggester";
import { FileSuggest } from "./Suggesters/FileSuggester";

const docUrl = "https://github.com/Alintor/obsidian-kinopoisk-plugin";
const apiSite = "https://kinopoisk.dev/";

export interface ObsidianKinopoiskPluginSettings {
	apiToken: string; // Token for api requests
	movieFileNameFormat: string; // movie file name format
	movieFolder: string; // movie file location
	movieTemplateFile: string; // movie template
	seriesFileNameFormat: string; // tv series file name format
	seriesFolder: string; // tv series file location
	seriesTemplateFile: string; // tv series template
}

export const DEFAULT_SETTINGS: ObsidianKinopoiskPluginSettings = {
	apiToken: "",
	movieFileNameFormat: "",
	movieFolder: "",
	movieTemplateFile: "",
	seriesFileNameFormat: "",
	seriesFolder: "",
	seriesTemplateFile: "",
};

export class ObsidianKinopoiskSettingTab extends PluginSettingTab {
	constructor(app: App, private plugin: ObsidianKinopoiskPlugin) {
		super(app, plugin);
	}

	get settings() {
		return this.plugin.settings;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.classList.add("obsidian-kinopoisk-plugin__settings");

		// Api key
		const apiKeyDesc = document.createDocumentFragment();
		apiKeyDesc.createDiv({
			text: "You need to get API token to use this plugin. Choose free plan and follow steps.",
		});
		apiKeyDesc.createEl("a", {
			text: "Get API Token",
			href: `${apiSite}`,
		});
		new Setting(containerEl)
			.setName("API Token")
			.setDesc(apiKeyDesc)
			.addText((text) =>
				text
					.setPlaceholder("Enter your API Token")
					.setValue(this.plugin.settings.apiToken)
					.onChange(async (value) => {
						this.plugin.settings.apiToken = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl).setName("Movies").setHeading();
		// Movie file name
		new Setting(containerEl)
			.setName("Movie file name")
			.setDesc("Enter the movie file name format.")
			.addText((text) =>
				text
					.setPlaceholder("Example: {{name}} ({{year}})")
					.setValue(this.plugin.settings.movieFileNameFormat)
					.onChange(async (value) => {
						this.plugin.settings.movieFileNameFormat = value;
						await this.plugin.saveSettings();
					})
			);
		// Movie file location
		new Setting(containerEl)
			.setName("Movie file location")
			.setDesc("New movie notes will be placed here.")
			.addSearch((cb) => {
				try {
					new FolderSuggest(this.app, cb.inputEl);
				} catch {
					// eslint-disable
				}
				cb.setPlaceholder("Example: folder1/folder2")
					.setValue(this.plugin.settings.movieFolder)
					.onChange((newFolder) => {
						this.plugin.settings.movieFolder = newFolder;
						this.plugin.saveSettings();
					});
			});

		// Movie template file
		const movieTemplateFileDesc = document.createDocumentFragment();
		movieTemplateFileDesc.createDiv({
			text: "Files will be available as templates.",
		});
		movieTemplateFileDesc.createEl("a", {
			text: "Example Template",
			href: `${docUrl}#example-template`,
		});
		new Setting(containerEl)
			.setName("Movie template file")
			.setDesc(movieTemplateFileDesc)
			.addSearch((cb) => {
				try {
					new FileSuggest(this.app, cb.inputEl);
				} catch {
					// eslint-disable
				}
				cb.setPlaceholder("Example: templates/template-file")
					.setValue(this.plugin.settings.movieTemplateFile)
					.onChange((newTemplateFile) => {
						this.plugin.settings.movieTemplateFile =
							newTemplateFile;
						this.plugin.saveSettings();
					});
			});

		new Setting(containerEl).setName("TV series").setHeading();

		// TV series file name
		new Setting(containerEl)
			.setName("TV series file name")
			.setDesc("Enter the tv series file name format.")
			.addText((text) =>
				text
					.setPlaceholder("Example: {{name}} ({{year}})")
					.setValue(this.plugin.settings.seriesFileNameFormat)
					.onChange(async (value) => {
						this.plugin.settings.seriesFileNameFormat = value;
						await this.plugin.saveSettings();
					})
			);
		// TV series file location
		new Setting(containerEl)
			.setName("TV series file location")
			.setDesc("New tv series notes will be placed here.")
			.addSearch((cb) => {
				try {
					new FolderSuggest(this.app, cb.inputEl);
				} catch {
					// eslint-disable
				}
				cb.setPlaceholder("Example: folder1/folder2")
					.setValue(this.plugin.settings.seriesFolder)
					.onChange((newFolder) => {
						this.plugin.settings.seriesFolder = newFolder;
						this.plugin.saveSettings();
					});
			});

		// TTV series template file
		const seriesTemplateFileDesc = document.createDocumentFragment();
		seriesTemplateFileDesc.createDiv({
			text: "Files will be available as templates.",
		});
		seriesTemplateFileDesc.createEl("a", {
			text: "Example Template",
			href: `${docUrl}#example-template`,
		});
		new Setting(containerEl)
			.setName("TV series template file")
			.setDesc(seriesTemplateFileDesc)
			.addSearch((cb) => {
				try {
					new FileSuggest(this.app, cb.inputEl);
				} catch {
					// eslint-disable
				}
				cb.setPlaceholder("Example: templates/template-file")
					.setValue(this.plugin.settings.seriesTemplateFile)
					.onChange((newTemplateFile) => {
						this.plugin.settings.seriesTemplateFile =
							newTemplateFile;
						this.plugin.saveSettings();
					});
			});
	}
}
