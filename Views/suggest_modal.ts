import { SuggestModal } from "obsidian";
import { KinopoiskSuggestItem } from "Models/kinopoisk_response";
import { MoviewShow } from "Models/MovieShow.model";
import { getMovieShowById } from "APIProvider/provider";
import ObsidianKinopoiskPlugin from "main";

export class ItemsSuggestModal extends SuggestModal<KinopoiskSuggestItem> {
	private token = "";

	constructor(
		plugin: ObsidianKinopoiskPlugin,
		private readonly suggestion: KinopoiskSuggestItem[],
		private onChoose: (error: Error | null, result?: MoviewShow) => void
	) {
		super(plugin.app);
		this.token = plugin.settings.apiToken;
	}

	// Returns all available suggestions.
	getSuggestions(query: string): KinopoiskSuggestItem[] {
		return this.suggestion.filter((item) => {
			const searchQuery = query?.toLowerCase();
			return (
				item.name.toLowerCase().includes(searchQuery) ||
				item.alternativeName.toLowerCase().includes(searchQuery)
			);
		});
	}

	// Renders each suggestion item.
	renderSuggestion(item: KinopoiskSuggestItem, el: HTMLElement) {
		const title = item.name;
		const subtitle = `${item.year}, ${item.alternativeName} (${item.type})`;
		const textInfo = el.createEl("div", {
			attr: { style: "padding-left: 1em;" },
		});
		textInfo.appendChild(el.createEl("div", { text: title }));
		textInfo.appendChild(el.createEl("small", { text: subtitle }));
		const container = el.createEl("div", {
			attr: { style: "display: flex; align-items: center;" },
		});
		container.appendChild(
			el.createEl("img", { attr: { src: item.poster ?? "", width: 100 } })
		);
		container.appendChild(textInfo);
	}

	// Perform action on the selected suggestion.
	onChooseSuggestion(item: KinopoiskSuggestItem) {
		this.getItemDetails(item);
	}

	async getItemDetails(item: KinopoiskSuggestItem) {
		try {
			const movieShow = await getMovieShowById(item.id, this.token);
			this.onChoose(null, movieShow);
		} catch (error) {
			this.onChoose(error);
		}
	}
}
