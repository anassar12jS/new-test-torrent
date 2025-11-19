
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Movie, MovieDetails, TvSeasonDetails, TvShowDetails } from '../models/tmdb.model';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private http = inject(HttpClient);
  
  // In a real-world app, this should be in environment variables
  private readonly apiKey = '123d3ef011d8c74c8d91a7a6a868ebfd'; 
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  public readonly imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  public readonly embedBaseUrl = 'https://vidsrc.to/embed'; // Using a popular embed source

  private get<T>(endpoint: string, params: Record<string, string | number> = {}): Observable<T> {
    const queryParams = new URLSearchParams({
      api_key: this.apiKey,
      language: 'en-US',
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    }).toString();
    return this.http.get<T>(`${this.baseUrl}/${endpoint}?${queryParams}`);
  }

  getTrending(mediaType: 'all' | 'movie' | 'tv' = 'movie', timeWindow: 'day' | 'week' = 'week'): Observable<ApiResponse<Movie>> {
    return this.get<ApiResponse<Movie>>(`trending/${mediaType}/${timeWindow}`);
  }
  
  getUpcomingMovies(): Observable<ApiResponse<Movie>> {
    return this.get<ApiResponse<Movie>>('movie/upcoming');
  }

  getPopularMovies(page = 1): Observable<ApiResponse<Movie>> {
    return this.get<ApiResponse<Movie>>('movie/popular', { page });
  }

  getTopRatedMovies(page = 1): Observable<ApiResponse<Movie>> {
    return this.get<ApiResponse<Movie>>('movie/top_rated', { page });
  }

  getPopularTvShows(page = 1): Observable<ApiResponse<Movie>> {
    return this.get<ApiResponse<Movie>>('tv/popular', { page });
  }

  getMoviesByGenre(genreId: number, page = 1): Observable<ApiResponse<Movie>> {
    return this.get<ApiResponse<Movie>>('discover/movie', { with_genres: genreId, page });
  }

  search(query: string, page = 1): Observable<ApiResponse<Movie>> {
    return this.get<ApiResponse<Movie>>('search/multi', { query, page });
  }

  getMovieDetails(id: number): Observable<MovieDetails> {
    return this.get<MovieDetails>(`movie/${id}`);
  }

  getTvShowDetails(id: number): Observable<TvShowDetails> {
    return this.get<TvShowDetails>(`tv/${id}`);
  }

  getTvSeasonDetails(tvId: number, seasonNumber: number): Observable<TvSeasonDetails> {
    return this.get<TvSeasonDetails>(`tv/${tvId}/season/${seasonNumber}`);
  }
}
