import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  // Show success message (green)
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Show for 3 seconds
      panelClass: ['snackbar-success'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  // Show error message (red)
  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Show for 5 seconds
      panelClass: ['snackbar-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  // Show info message (blue)
  showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-info'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
