
import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, signal, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../services/tmdb.service';
import { Movie } from '../../models/tmdb.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, RouterLink]
})
export class HeroComponent implements OnInit, OnDestroy {
  private tmdbService = inject(TmdbService);
  
  slides = toSignal(
    this.tmdbService.getTrending('movie', 'day').pipe(
      catchError(() => of({ results: [] }))
    ), 
    { initialValue: { results: [] } }
  );

  topSlides = computed(() => this.slides().results.slice(0, 5));

  currentSlide = signal(0);
  private slideInterval: any;
  imageBaseUrl = this.tmdbService.imageBaseUrl;
  
  ngOnInit(): void {
    this.startSlideShow();
  }

  ngOnDestroy(): void {
    clearInterval(this.slideInterval);
  }

  startSlideShow(): void {
    clearInterval(this.slideInterval);
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide.update(prev => (prev + 1) % this.topSlides().length);
  }

  prevSlide(): void {
    this.currentSlide.update(prev => (prev - 1 + this.topSlides().length) % this.topSlides().length);
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.startSlideShow(); // Reset interval
  }
}