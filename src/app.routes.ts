
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { TvComponent } from './pages/tv/tv.component';
import { GenresComponent } from './pages/genres/genres.component';
import { WatchComponent } from './pages/watch/watch.component';
import { SearchComponent } from './pages/search/search.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, title: 'MovieStream - Home' },
  { path: 'movies', component: MoviesComponent, title: 'MovieStream - Movies' },
  { path: 'tv', component: TvComponent, title: 'MovieStream - TV Shows' },
  { path: 'genres', component: GenresComponent, title: 'MovieStream - Genres' },
  { path: 'watch/:type/:id', component: WatchComponent, title: 'MovieStream - Watch' },
  { path: 'search/:query', component: SearchComponent, title: 'MovieStream - Search' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
