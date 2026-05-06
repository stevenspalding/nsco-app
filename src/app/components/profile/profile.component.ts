import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

declare global { interface Window { Telegram: any; } }

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 overflow-y-auto p-4 pb-20 bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)] font-sans">

      <!-- Header -->
      <div class="flex items-center mb-8 mt-2 relative">
        <button (click)="goBack()" class="absolute left-0 p-2 -ml-2 text-[var(--tg-theme-button-color,#3b82f6)] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-2xl font-bold w-full text-center">My Profile</h1>
      </div>

      <!-- Profile Identity Card -->
      <div class="bg-[var(--tg-theme-bg-color,#ffffff)] rounded-3xl p-8 shadow-sm border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] flex flex-col items-center text-center mb-8 relative overflow-hidden">

        <!-- Decorative background blobs -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-[var(--tg-theme-button-color,#3b82f6)] opacity-10 rounded-full blur-2xl"></div>
        <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--tg-theme-button-color,#3b82f6)] opacity-10 rounded-full blur-2xl"></div>

        <!-- Avatar -->
        <div class="w-28 h-28 rounded-full bg-gradient-to-tr from-[var(--tg-theme-button-color,#3b82f6)] to-blue-400 p-1 mb-4 shadow-lg relative z-10">
          <div class="w-full h-full rounded-full border-4 border-[var(--tg-theme-bg-color,#ffffff)] bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] flex items-center justify-center text-[var(--tg-theme-button-color,#3b82f6)] text-4xl font-black overflow-hidden">
            <img *ngIf="tgUser?.photo_url" [src]="tgUser.photo_url" class="w-full h-full object-cover">
            <span *ngIf="!tgUser?.photo_url">{{ initials || '👤' }}</span>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-[var(--tg-theme-text-color,#111827)] relative z-10">
          {{ tgUser?.first_name }} {{ tgUser?.last_name }}
        </h2>

        <p *ngIf="tgUser?.username" class="text-[var(--tg-theme-hint-color,#6b7280)] font-medium mt-1 relative z-10">
          &#64;{{ tgUser?.username }}
        </p>

        <!-- Stats Badge -->
        <div class="mt-6 flex items-center justify-center space-x-2 bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] px-5 py-2.5 rounded-2xl relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[var(--tg-theme-button-color,#3b82f6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span class="font-black text-xl text-[var(--tg-theme-text-color,#111827)]">{{ accountsCount }}</span>
          <span class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-widest font-bold ml-1">Meters Tracked</span>
        </div>
      </div>

      <!-- Preferences Section -->
      <h3 class="text-[var(--tg-theme-hint-color,#6b7280)] font-bold uppercase tracking-wider text-xs ml-4 mb-3">Alert Preferences</h3>

      <div class="bg-[var(--tg-theme-bg-color,#ffffff)] rounded-3xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm overflow-hidden mb-6">

        <!-- Daily Notifications Toggle -->
        <div class="flex items-center justify-between p-5 border-b border-[var(--tg-theme-secondary-bg-color,#e5e7eb)]">
          <div class="pr-4">
            <p class="font-bold text-[var(--tg-theme-text-color,#111827)] text-[15px]">Daily Notifications</p>
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] mt-1 leading-relaxed">Receive Telegram messages when balance updates.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" [checked]="settings.dailyUpdates" (change)="toggleSetting('dailyUpdates', $event)" [disabled]="isSavingSettings" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--tg-theme-button-color,#3b82f6)]"></div>
          </label>
        </div>

        <!-- Low Balance Alerts Toggle -->
        <div class="flex items-center justify-between p-5">
          <div class="pr-4">
            <p class="font-bold text-[var(--tg-theme-text-color,#111827)] text-[15px]">Low Balance Alerts</p>
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] mt-1 leading-relaxed">Get emergency pings when balance is critically low.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" [checked]="settings.lowBalanceAlerts" (change)="toggleSetting('lowBalanceAlerts', $event)" [disabled]="isSavingSettings" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--tg-theme-button-color,#3b82f6)]"></div>
          </label>
        </div>

      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit, OnDestroy {
  tg = (window as any).Telegram?.WebApp;
  tgUser = this.tg?.initDataUnsafe?.user || {};
  initials = (this.tgUser.first_name?.[0] || '') + (this.tgUser.last_name?.[0] || '');

  settings: any = { dailyUpdates: true, lowBalanceAlerts: true };
  accountsCount: number = 0;
  isSavingSettings = false;
  loading = false;

  private backButtonHandler = () => this.goBack();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    // Show Telegram Native Back Button
    if (this.tg?.BackButton) {
      this.tg.BackButton.show();
      this.tg.BackButton.onClick(this.backButtonHandler);
    }

    // Load state passed from MeterList, or fetch if refreshed
    const state = history.state;
    if (state && state.settings) {
      this.settings = state.settings;
      this.accountsCount = state.count || 0;
    } else {
      this.loading = true;
      this.apiService.getList().subscribe({
        next: (res: any) => {
          if (res.settings) this.settings = res.settings;
          this.accountsCount = res.accounts?.length || 0;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  ngOnDestroy() {
    if (this.tg?.BackButton) {
      this.tg.BackButton.offClick(this.backButtonHandler);
      this.tg.BackButton.hide();
    }
  }

  toggleSetting(key: string, event: any) {
    const originalValue = this.settings[key];
    this.settings[key] = event.target.checked;
    this.isSavingSettings = true;

    this.apiService.updateSettings(this.settings).subscribe({
      next: () => {
        this.isSavingSettings = false;
        this.apiService.clearCache();
        if (this.tg?.HapticFeedback) this.tg.HapticFeedback.notificationOccurred('success');
      },
      error: () => {
        this.isSavingSettings = false;
        this.settings[key] = originalValue; // Revert UI visually
        if (this.tg?.showAlert) this.tg.showAlert('Failed to save settings.');
      }
    });
  }

  goBack() {
    if (this.tg?.HapticFeedback) this.tg.HapticFeedback.selectionChanged();
    this.router.navigate(['/']);
  }
}
