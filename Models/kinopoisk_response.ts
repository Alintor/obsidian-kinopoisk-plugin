
export interface KinopoiskSuggestItem {
    id: number;
    name: string;
    alternativeName: string;
    type: string;
    year: number;
    poster?: string;
  }

export interface KinopoiskSuggestItemsResponse {
    docs: KinopoiskSuggestItem[];
}

export interface KinopoiskFullInfo {
    id: number;
    name: string;
    alternativeName: string;
    type: string;
    year: number;
    description?: string;
    poster?: KinopoisImageUrl;
    genres: KinopoiskSimpleItem[];
    countries: KinopoiskSimpleItem[];
    persons: KinopoiskPerson[];
    movieLength?: number;
    backdrop?: KinopoisImageUrl;
    logo?: KinopoisImageUrl;
    isSeries: boolean;
    seriesLength?: number;
    status?: string;
    seasonsInfo?: KinopoiskSeasonInfo[];
}

export interface KinopoisImageUrl {
    url?: string;
}

export interface KinopoiskSimpleItem {
    name: string;
}

export interface KinopoiskPerson {
    name: string;
    enProfession: string;
}

export interface KinopoiskSeasonInfo {
    number: number;
    episodesCount: number;
}