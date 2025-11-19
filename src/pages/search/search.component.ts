
import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, catchError, of } from 'rxjs';
import { TmdbService } from '../../services/tmdb.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { Movie } from '../../models/tmdb.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MovieCardComponent]
})
export class SearchComponent {
  private route = inject(ActivatedRoute);
  private tmdbService = inject(TmdbService);

  private query$ = this.route.paramMap.pipe(map(params => params.get('query') || ''));
  
  query = toSignal(this.query$, { initialValue: '' });

  searchResults = toSignal(
    this.query$.pipe(
      switchMap(query => {
        if (!query) return of({ results: [] as Movie[] });
        return this.tmdbService.search(query).pipe(
          map(response => ({
            ...response,
            // Filter out persons from search results
            results: response.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv')
          })),
          catchError(() => of({ results: [] as Movie[] }))
        );
      })
    ),
    { initialValue: { results: [] as Movie[] } }
  );
}
