import { ButtonComponent, Modal, Setting, TextComponent, Notice } from 'obsidian';
import { KinopoiskSuggestItem } from 'Models/kinopoisk_response'
import { getByQuery } from 'APIProvider/provider'
import ObsidianKinopoiskPlugin from 'main';

export class SearchModal extends Modal {
    private isBusy = false;
    private okBtnRef?: ButtonComponent;
    private query: string = '';
    private token: string = '';
  
    constructor(
      plugin: ObsidianKinopoiskPlugin,
      private callback: (error: Error | null, result?: KinopoiskSuggestItem[]) => void,
    ) {
      super(plugin.app);
      this.token = plugin.settings.apiToken;
    }
  
    setBusy(busy: boolean) {
      this.isBusy = busy;
      this.okBtnRef?.setDisabled(busy);
      this.okBtnRef?.setButtonText(busy ? 'Requesting...' : 'Search');
    }
  
    async search() {
      if (!this.query) {
        throw new Error('No query entered.');
      }
  
      if (!this.isBusy) {
        try {
          this.setBusy(true);
          const searchResults = await getByQuery(this.query, this.token);
          this.setBusy(false);
  
          if (!searchResults?.length) {
            new Notice(`No results found for "${this.query}"`);
            return;
          }
  
          this.callback(null, searchResults);
        } catch (err) {
          this.callback(err as Error);
        }
        this.close();
      }
    }
  
    submitEnterCallback(event: KeyboardEvent) {
      if (event.key === 'Enter' && !event.isComposing) {
        this.search();
      }
    }
  
    onOpen() {
      const { contentEl } = this;
  
      contentEl.createEl('h2', { text: 'Search movie or tv show' });
  
      contentEl.createDiv({ cls: 'kinopoisk-plugin__search-modal--input' }, settingItem => {
        new TextComponent(settingItem)
          .setValue(this.query)
          .setPlaceholder('Search by keyword')
          .onChange(value => (this.query = value))
          .inputEl.addEventListener('keydown', this.submitEnterCallback.bind(this));
      });
  
      new Setting(contentEl).addButton(btn => {
        return (this.okBtnRef = btn
          .setButtonText('Search')
          .setCta()
          .onClick(() => {
            this.search();
          }));
      });
    }
  
    onClose() {
      this.contentEl.empty();
    }
  }