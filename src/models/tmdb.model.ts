
export interface Movie {
  id: number;
  title: string;
  name?: string; // For TV shows
  poster_path: string;
  overview: string;
  vote_average: number;
  media_type?: 'movie' | 'tv';
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  release_date: string;
}

export interface TvShowDetails extends Movie {
  name: string;
  seasons: {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
  }[];
  number_of_seasons: number;
  first_air_date: string;
}

export interface TvSeasonDetails {
  episodes: {
    id: number;
    name: string;
    episode_number: number;
    overview: string;
  }[];
}
