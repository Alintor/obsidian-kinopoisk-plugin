import { requestUrl } from 'obsidian';
import { KinopoiskSuggestItem, KinopoiskSuggestItemsResponse, KinopoiskFullInfo} from 'Models/kinopoisk_response'
import { MoviewShow } from 'Models/MovieShow.model'

export async function apiGet<T>(
    url: string,
    token: string,
    params: Record<string, string | number> = {},
    headers?: Record<string, string>,
): Promise<T> {
  const apiURL = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    apiURL.searchParams.append(key, value?.toString());
  });
  if (token === '') {
    throw new Error('You need enter API Token');
  }
  const res = await requestUrl({
    url: apiURL.href,
    method: 'GET',
    headers: {
      Accept: '*/*',
      'X-API-KEY': token,
      ...headers,
    },
  });
  return res.json as T;
}

export async function getByQuery(query: string, token: string): Promise<KinopoiskSuggestItem[]> {
  try {
    const params = {
      query: query
    };
    const searchResults = await apiGet<KinopoiskSuggestItemsResponse>('https://api.kinopoisk.dev/v1.2/movie/search', token, params);
    return searchResults.docs;
  } catch (error) {
    console.warn(error);
    throw error;
  }
}

export async function getMovieShowById(id: number, token: string): Promise<MoviewShow> {
  try {
    const searchResul = await apiGet<KinopoiskFullInfo>(`https://api.kinopoisk.dev/v1.3/movie/${id}`, token);
    return createMovieShowFrom(searchResul);
  } catch (error) {
    console.warn(error);
    throw error;
  }
}

function createMovieShowFrom(fullInfo: KinopoiskFullInfo): MoviewShow {
  const seasonsCount = fullInfo.seasonsInfo?.length ?? 0;
  let seriesInSeasonCount = 0;
  if (seasonsCount > 0) {
    const seasonInfo = fullInfo.seasonsInfo ?? [];
    const totalEpisodesCount = seasonInfo.reduce((total, season) => total + season.episodesCount, 0);
    const averageEpisodesCount = totalEpisodesCount / seasonsCount;
    seriesInSeasonCount = Math.ceil(averageEpisodesCount);
  }
  const item: MoviewShow = {
    id: fullInfo.id,
    name: fullInfo.name,
    alternativeName: fullInfo.alternativeName,
    year: fullInfo.year,
    description: fullInfo.description,
    posterUrl: fullInfo.poster.url,
    genres: fullInfo.genres.map((genre) => capitalizeFirstLetter(genre.name)).join(", "),
    countries: fullInfo.countries.map((country) => country.name).join(", "),
    director: fullInfo.persons.find(person => person.enProfession === "director")?.name ?? '',
    movieLength: fullInfo.movieLength ?? 0,
    coverUrl: fullInfo.backdrop.url,
    logoUrl: fullInfo.logo.url,
    isSeries: fullInfo.isSeries,
    seriesLength: fullInfo.seriesLength ?? 0,
    isComplete: (fullInfo.status ?? '') == "completed",
    seasonsCount: seasonsCount,
    seriesInSeasonCount: seriesInSeasonCount,
    kinopoiskUrl: `https://www.kinopoisk.ru/film/${fullInfo.id}/`
  }

  return item;
}

function capitalizeFirstLetter(input: string): string {
  if (input.length === 0) {
      return input;
  }
  return input.charAt(0).toUpperCase() + input.slice(1);
}