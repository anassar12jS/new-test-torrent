import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../services/tmdb.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { catchError, of, switchMap } from 'rxjs';
import { Movie } from '../../models/tmdb.model';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MovieCardComponent]
})
export class GenresComponent {
  private tmdbService = inject(TmdbService);

  genres = [
    { name: 'Action', id: 28, icon: 'fa-bolt' },
    { name: 'Comedy', id: 35, icon: 'fa-laugh' },
    { name: 'Drama', id: 18, icon: 'fa-masks-theater' },
    { name: 'Horror', id: 27, icon: 'fa-ghost' },
    { name: 'Sci-Fi', id: 878, icon: 'fa-rocket' },
    { name: 'Romance', id: 10749, icon: 'fa-heart' }
  ];

  selectedGenreId = signal<number>(this.genres[0].id);
  selectedGenreName = signal<string>(this.genres[0].name);

  private selectedGenreId$ = toObservable(this.selectedGenreId);

  moviesByGenre = toSignal(
    this.selectedGenreId$.pipe(
      switchMap(id => this.tmdbService.getMoviesByGenre(id).pipe(
        catchError(() => of({ results: [] as Movie[] }))
      ))
    ), { initialValue: { results: [] as Movie[] } }
  );
  
  selectGenre(genre: {id: number, name: string}): void {
    this.selectedGenreId.set(genre.id);
    this.selectedGenreName.set(genre.name);
  }
}
