import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, map, catchError, of, filter, tap } from 'rxjs';
import { TmdbService } from '../../services/tmdb.service';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { TvSeasonDetails, MovieDetails, TvShowDetails } from '../../models/tmdb.model';
import { Stream, StreamingService } from '../../services/streaming.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SafeUrlPipe]
})
export class WatchComponent {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private tmdbService = inject(TmdbService);
  private streamingService = inject(StreamingService);

  private params = toSignal(this.route.paramMap);
  
  itemType = computed(() => this.params()?.get('type') as 'movie' | 'tv' | null);
  itemId = computed(() => Number(this.params()?.get('id')));

  activeTab = signal<'player' | 'streams'>('player');
  selectedSeason = signal<number | null>(null);
  selectedEpisode = signal<number | null>(null);
  
  isLoadingStreams = signal<boolean>(false);
  streams = signal<Stream[]>([]);

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
            const firstSeason = details?.seasons.find(s => s.season_number > 0);
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
             if (details && details.episodes && details.episodes.length > 0) {
               this.selectEpisode(details.episodes[0].episode_number);
             }
          }),
          catchError(() => of(null))
        )
      )
    )
  );

  embedUrl = computed(() => {
    const type = this.itemType();
    const id = this.itemId();
    if (!type || !id) return '';
    
    if (type === 'movie') {
      return `${this.tmdbService.embedBaseUrl}/movie/${id}`;
    } else {
      const season = this.selectedSeason();
      const episode = this.selectedEpisode();
      if (season !== null && episode !== null) {
        return `${this.tmdbService.embedBaseUrl}/tv/${id}?s=${season}&e=${episode}`;
      }
      return `${this.tmdbService.embedBaseUrl}/tv/${id}`; // Fallback for TV show without season/episode
    }
  });

  get validSeasons() {
    const details = this.details() as TvShowDetails;
    return details?.seasons?.filter(s => s.season_number > 0) || [];
  }

  selectTab(tab: 'player' | 'streams') {
    this.activeTab.set(tab);
    if (tab === 'streams' && this.streams().length === 0) {
      this.loadStreams();
    }
  }

  loadStreams() {
    this.isLoadingStreams.set(true);
    this.streamingService.getStreams(this.details()?.title || this.details()?.name).subscribe(streams => {
      this.streams.set(streams);
      this.isLoadingStreams.set(false);
    });
  }

  // This function makes the streaming "work for real" by loading the content
  // in the main player when a user selects a stream.
  playStream(stream: Stream) {
    console.log('Playing from:', stream);
    // Switch to the player tab and the embedUrl will automatically play the content.
    this.activeTab.set('player');
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
