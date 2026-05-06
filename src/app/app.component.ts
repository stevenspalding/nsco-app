import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window { Telegram: any; }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen pb-10 bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)] font-sans">
      <!-- Angular will inject the matched component right here -->
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit {
  private tg = (window as any).Telegram?.WebApp;

  constructor(
    private router: Router,
    private zone: NgZone
  ) { }

  ngOnInit() {
    if (this.tg) {
      this.tg.ready();
      this.tg.expand();
      this.tg.setHeaderColor('bg_color');

      // Listen to Angular route changes to toggle the Telegram Back Button
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        // If we are on the home page, hide the back button
        if (event.url === '/' || event.urlAfterRedirects === '/') {
          this.tg.BackButton.hide();
        } else {
          // If we are on a details page, show the back button
          this.tg.BackButton.show();
        }
      });

      // 2. When the physical back button is pressed, navigate to home
      this.tg.BackButton.onClick(() => {
        // Run inside Angular's Zone so it knows to update the UI data!
        this.zone.run(() => {
          this.router.navigate(['/']);
        });
      });
    }
  }
}
