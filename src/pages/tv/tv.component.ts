
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../services/tmdb.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-tv',
  standalone: true,
  templateUrl: './tv.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MovieCardComponent]
})
export class TvComponent {
  private tmdbService = inject(TmdbService);
  tvShows = toSignal(
    this.tmdbService.getPopularTvShows().pipe(catchError(() => of({ results: [] }))),
    { initialValue: { results: [] } }
  );
}