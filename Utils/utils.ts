import { MoviewShow } from "Models/MovieShow.model";
import { App, normalizePath, Notice, TFile } from 'obsidian';

export function capitalizeFirstLetter(input: string): string {
    if (input.length === 0) {
        return input;
    }
    return input.charAt(0).toUpperCase() + input.slice(1);
}

export function replaceIllegalFileNameCharactersInString(text: string) {
    return text.replace(/[\\/:]/g, '.');
}

export function replaceVariableSyntax(movieShow: MoviewShow, text: string): string {
    if (!text?.trim()) {
      return '';
    }
  
    const entries = Object.entries(movieShow);
  
    return entries
      .reduce((result, [key, val = '']) => {
        return result.replace(new RegExp(`{{${key}}}`, 'ig'), val);
      }, text)
      .replace(/{{\w+}}/gi, '')
      .trim();
}

export function makeFileName(movieShow: MoviewShow, fileNameFormat?: string) {
    let result;
    if (fileNameFormat) {
      result = replaceVariableSyntax(movieShow, fileNameFormat);
    } else {
      result = `${movieShow.name} (${movieShow.year})`;
    }
    return replaceIllegalFileNameCharactersInString(result) + '.md';
}

export async function getTemplateContents(app: App, templatePath: string | undefined): Promise<string> {
    const { metadataCache, vault } = app;
    const normalizedTemplatePath = normalizePath(templatePath ?? '');
    if (templatePath === '/') {
      return Promise.resolve('');
    }
  
    try {
      const templateFile = metadataCache.getFirstLinkpathDest(normalizedTemplatePath, '');
      return templateFile ? vault.cachedRead(templateFile) : '';
    } catch (err) {
      console.error(`Failed to read the daily note template '${normalizedTemplatePath}'`, err);
      new Notice('Failed to read the daily note template');
      return '';
    }
  }