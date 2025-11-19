
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../services/tmdb.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MovieCardComponent]
})
export class MoviesComponent {
  private tmdbService = inject(TmdbService);
  movies = toSignal(
    this.tmdbService.getTopRatedMovies().pipe(catchError(() => of({ results: [] }))),
    { initialValue: { results: [] } }
  );
}
