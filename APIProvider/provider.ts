import { requestUrl } from 'obsidian';
import { KinopoiskSuggestItem, KinopoiskSuggestItemsResponse} from 'Models/kinopoisk_response'

export async function apiGet<T>(
    url: string,
    params: Record<string, string | number> = {},
    headers?: Record<string, string>,
): Promise<T> {
  const apiURL = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    apiURL.searchParams.append(key, value?.toString());
  });
  const res = await requestUrl({
    url: apiURL.href,
    method: 'GET',
    headers: {
      Accept: '*/*',
      'X-API-KEY': '',
      ...headers,
    },
  });
  return res.json as T;
}

export async function getByQuery(query: string): Promise<KinopoiskSuggestItem[]> {
  try {
    const params = {
      query: query
    };
    const searchResults = await apiGet<KinopoiskSuggestItemsResponse>('https://api.kinopoisk.dev/v1.2/movie/search', params);
    return searchResults.docs;
  } catch (error) {
    console.warn(error);
    throw error;
  }
}