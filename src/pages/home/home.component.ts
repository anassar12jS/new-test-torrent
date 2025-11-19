
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../services/tmdb.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MovieCardComponent, HeroComponent]
})
export class HomeComponent {
  private tmdbService = inject(TmdbService);

  trending = toSignal(
    this.tmdbService.getTrending('all', 'week').pipe(catchError(() => of({ results: [] }))),
    { initialValue: { results: [] } }
  );

  upcoming = toSignal(
    this.tmdbService.getUpcomingMovies().pipe(catchError(() => of({ results: [] }))),
    { initialValue: { results: [] } }
  );
}
