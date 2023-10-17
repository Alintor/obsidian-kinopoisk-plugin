import { App, SuggestModal } from 'obsidian';
import { KinopoiskSuggestItem } from 'Models/kinopoisk_response';
import { MoviewShow } from 'Models/MovieShow.model';
import { getMovieShowById } from 'APIProvider/provider';

export class ItemsSuggestModal extends SuggestModal<KinopoiskSuggestItem> {
  constructor(
    app: App,
    private readonly suggestion: KinopoiskSuggestItem[],
    private onChoose: (error: Error | null, result?: MoviewShow) => void,
  ) {
    super(app);
  }

  // Returns all available suggestions.
  getSuggestions(query: string): KinopoiskSuggestItem[] {
    return this.suggestion.filter(item => {
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
    el.createEl('div', { text: title });
    el.createEl('small', { text: subtitle });
  }

  // Perform action on the selected suggestion.
  onChooseSuggestion(item: KinopoiskSuggestItem) {
    this.getItemDetails(item)
  }

  async getItemDetails(item: KinopoiskSuggestItem) {
    try {
        const movieShow = await getMovieShowById(item.id);
        this.onChoose(null, movieShow);
      } catch (error) {
        this.onChoose(error);
      }
  }
}