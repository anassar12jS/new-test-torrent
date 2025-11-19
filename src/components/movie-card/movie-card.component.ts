
import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models/tmdb.model';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, RouterLink]
})
export class MovieCardComponent {
  item = input.required<Movie>();
  
  private tmdbService = inject(TmdbService);
  imageBaseUrl = this.tmdbService.imageBaseUrl;

  get itemType(): 'movie' | 'tv' {
    // Infer type if not provided by API (e.g., from 'movie/popular')
    return this.item().media_type || (this.item().title ? 'movie' : 'tv');
  }

  get posterUrl(): string {
    return this.item().poster_path
      ? `${this.imageBaseUrl}${this.item().poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image';
  }
}
