import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // This makes it available everywhere without importing
})
export class LoadingService {
  // BehaviorSubject holds the current loading state and emits changes to subscribers
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Expose as observable for components to subscribe to
  loading$ = this.loadingSubject.asObservable();

  // Show the loading spinner
  show(): void {
    this.loadingSubject.next(true);
  }

  // Hide the loading spinner
  hide(): void {
    this.loadingSubject.next(false);
  }
}
