import { Notice, Plugin } from "obsidian";
import { SearchModal } from "Views/search_modal";
import { ItemsSuggestModal } from "Views/suggest_modal";
import { KinopoiskSuggestItem } from "Models/kinopoisk_response";
import { MoviewShow } from "Models/MovieShow.model";
import {
	ObsidianKinopoiskPluginSettings,
	DEFAULT_SETTINGS,
	ObsidianKinopoiskSettingTab,
} from "Settings/settings";
import {
	makeFileName,
	getTemplateContents,
	replaceVariableSyntax,
} from "Utils/utils";
import { CursorJumper } from "Utils/cursor_jumper";

export default class ObsidianKinopoiskPlugin extends Plugin {
	settings: ObsidianKinopoiskPluginSettings;

	async onload() {
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon(
			"film",
			"Search in Kinopoisk",
			() => {
				this.createNewNote();
			}
		);
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		this.addCommand({
			id: "open-search-kinopoisk-modal",
			name: "Search in Kinopoisk",
			callback: () => {
				this.createNewNote();
			},
		});

		this.addSettingTab(new ObsidianKinopoiskSettingTab(this.app, this));
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
			console.log(movieShow);

			const {
				movieFileNameFormat,
				movieFolder,
				seriesFileNameFormat,
				seriesFolder,
			} = this.settings;

			const renderedContents = await this.getRenderedContents(movieShow);
			const fileNameFormat = movieShow.isSeries
				? seriesFileNameFormat
				: movieFileNameFormat;
			const folderPath = movieShow.isSeries ? seriesFolder : movieFolder;
			const fileName = makeFileName(movieShow, fileNameFormat);
			const filePath = `${folderPath}/${fileName}`;
			const targetFile = await this.app.vault.create(
				filePath,
				renderedContents
			);
			const newLeaf = this.app.workspace.getLeaf(true);
			if (!newLeaf) {
				console.warn("No new leaf");
				return;
			}
			await newLeaf.openFile(targetFile, { state: { mode: "source" } });
			newLeaf.setEphemeralState({ rename: "all" });
			// cursor focus
			await new CursorJumper(this.app).jumpToNextCursorLocation();
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
			return new ItemsSuggestModal(this, items, (error, selectedItem) => {
				return error ? reject(error) : resolve(selectedItem!);
			}).open();
		});
	}

	async getRenderedContents(movieShow: MoviewShow) {
		const { movieTemplateFile, seriesTemplateFile } = this.settings;
		const templateFile = movieShow.isSeries
			? seriesTemplateFile
			: movieTemplateFile;
		if (templateFile) {
			const templateContents = await getTemplateContents(
				this.app,
				templateFile
			);
			const replacedVariable = replaceVariableSyntax(
				movieShow,
				templateContents
			);
			return replacedVariable;
		}
		return "";
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
