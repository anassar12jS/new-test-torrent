
import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, tap, catchError, of, filter } from 'rxjs';
import { TmdbService } from '../../services/tmdb.service';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { TvShowDetails } from '../../models/tmdb.model';

@Component({
  selector: 'app-watch',
  standalone: true,
  templateUrl: './watch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SafeUrlPipe]
})
export class WatchComponent {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private tmdbService = inject(TmdbService);

  private params = toSignal(this.route.paramMap);
  
  itemType = computed(() => this.params()?.get('type') as 'movie' | 'tv' | null);
  itemId = computed(() => Number(this.params()?.get('id')));

  selectedSeason = signal<number | null>(null);
  selectedEpisode = signal<number | null>(null);

  details = toSignal(this.route.paramMap.pipe(
    switchMap(params => {
      const type = params.get('type');
      const id = Number(params.get('id'));
      if (!type || !id) return of(null);

      if (type === 'movie') {
        return this.tmdbService.getMovieDetails(id).pipe(catchError(() => of(null)));
      } else {
        return this.tmdbService.getTvShowDetails(id).pipe(
          tap(details => {
            const firstSeason = details?.seasons?.find(s => s.season_number > 0);
            if (firstSeason) {
              this.selectSeason(firstSeason.season_number);
            }
          }),
          catchError(() => of(null))
        );
      }
    })
  ));
  
  private selectedSeason$ = toObservable(this.selectedSeason);

  seasonDetails = toSignal(
    this.selectedSeason$.pipe(
      filter((season): season is number => season !== null && this.itemType() === 'tv'),
      switchMap(seasonNumber => 
        this.tmdbService.getTvSeasonDetails(this.itemId(), seasonNumber).pipe(
          tap(details => {
             if (details?.episodes?.length > 0) {
               this.selectEpisode(details.episodes[0].episode_number);
             }
          }),
          catchError(() => of(null))
        )
      )
    )
  );

  embedUrl = computed(() => {
    const itemDetails = this.details();
    const imdbId = itemDetails?.external_ids?.imdb_id;
    if (!imdbId) return '';
    
    const type = this.itemType();

    if (type === 'movie') {
      return `${this.tmdbService.embedBaseUrl}/movie/${imdbId}`;
    } else {
      const season = this.selectedSeason();
      const episode = this.selectedEpisode();
      if (season !== null && episode !== null) {
        return `${this.tmdbService.embedBaseUrl}/tv/${imdbId}/${season}/${episode}`;
      }
      return `${this.tmdbService.embedBaseUrl}/tv/${imdbId}`; // Fallback for TV show
    }
  });

  get validSeasons() {
    const details = this.details() as TvShowDetails;
    return details?.seasons?.filter(s => s.season_number > 0) || [];
  }

  selectSeason(seasonNumber: number) {
    this.selectedSeason.set(seasonNumber);
  }

  onSeasonChange(event: Event) {
    const season = Number((event.target as HTMLSelectElement).value);
    this.selectSeason(season);
  }

  selectEpisode(episodeNumber: number) {
    this.selectedEpisode.set(episodeNumber);
  }

  onEpisodeChange(event: Event) {
    const episode = Number((event.target as HTMLSelectElement).value);
    this.selectEpisode(episode);
  }

  goBack(): void {
    this.location.back();
  }
}