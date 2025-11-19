import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Stream {
  source: string;
  quality: string;
  size: string;
  peers: number;
  provider: 'Torrent' | 'Direct';
}

@Injectable({ providedIn: 'root' })
export class StreamingService {

  // This service simulates fetching a list of available streams for a given title.
  // In a real-world scenario, this would involve complex APIs, but for this
  // educational project, we return a realistic-looking mock list.
  getStreams(title: string | undefined): Observable<Stream[]> {
    if (!title) {
      return of([]);
    }

    // FIX: The array of stream objects is now explicitly typed as Stream[]
    // to ensure the 'provider' property conforms to the '"Torrent" | "Direct"' literal type.
    const mockStreams: Stream[] = [
      { source: 'Stremio-TPB', quality: '1080p', size: '2.5 GB', peers: 1254, provider: 'Torrent' },
      { source: 'RARBG Mirror', quality: '1080p', size: '2.4 GB', peers: 1198, provider: 'Torrent' },
      { source: 'YTS.MX', quality: '720p', size: '1.2 GB', peers: 987, provider: 'Torrent' },
      { source: '1337x', quality: '2160p', size: '5.1 GB', peers: 812, provider: 'Torrent' },
      { source: 'Public Stream', quality: '480p', size: '700 MB', peers: 753, provider: 'Direct' },
    ];

    // Simulate network delay
    return of(mockStreams).pipe(delay(500)); // Short delay to simulate an API call
  }
}
