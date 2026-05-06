import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

declare global { interface Window { Telegram: any; } }

@Component({
  selector: 'app-meter-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 overflow-y-auto p-4 pb-20 bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)] font-sans">

      <!-- Header -->
      <div class="flex justify-between items-center mb-6 mt-2">
        <h1 class="text-3xl font-bold">My Meters</h1>
        <div class="flex items-center space-x-3">

          <!-- Refresh Button -->
          <button (click)="fetchList(true)" [disabled]="loading" class="p-2 text-[var(--tg-theme-button-color,#3b82f6)] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors active:scale-95 disabled:opacity-50">
            <svg [class.animate-spin]="loading" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <!-- Profile Button (Dynamic Avatar) -->
          <button (click)="openProfile()" class="h-10 w-10 rounded-full bg-gradient-to-tr from-[var(--tg-theme-button-color,#3b82f6)] to-blue-400 p-[2px] transition-transform active:scale-95 shadow-sm">
            <div class="w-full h-full rounded-full border-2 border-[var(--tg-theme-bg-color,#ffffff)] bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] flex items-center justify-center text-[var(--tg-theme-button-color,#3b82f6)] text-sm font-bold overflow-hidden">
              <img *ngIf="tgUser?.photo_url" [src]="tgUser.photo_url" class="w-full h-full object-cover">
              <span *ngIf="!tgUser?.photo_url">{{ initials || '👤' }}</span>
            </div>
          </button>

        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading && accounts.length === 0" class="flex justify-center mt-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--tg-theme-button-color,#3b82f6)]"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && accounts.length === 0" class="text-center mt-10 p-6 bg-[var(--tg-theme-bg-color,#ffffff)] rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm">
        <p class="text-[var(--tg-theme-hint-color,#6b7280)] font-medium">You aren't tracking any IDs.</p>
        <p class="text-sm mt-2 text-[var(--tg-theme-hint-color,#6b7280)] opacity-80">Tap the + button below to get started.</p>
      </div>

      <!-- Meter List -->
      <div *ngIf="accounts.length > 0" class="space-y-4">
        <div *ngFor="let acc of accounts"
             (click)="selectMeter(acc)"
             class="rounded-2xl p-5 shadow-sm bg-[var(--tg-theme-bg-color,#ffffff)] border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] cursor-pointer hover:shadow-md active:scale-[0.98] transition-all">
          <div class="flex justify-between items-center mb-1">
            <p class="text-xl font-bold font-mono tracking-tight text-[var(--tg-theme-text-color,#111827)]">
              {{ acc.id }}
            </p>
            <div class="text-right whitespace-nowrap">
              <p class="text-2xl font-black" [ngClass]="acc.lastBalance < 100 ? 'text-red-500' : 'text-green-500'">
                ৳{{ acc.lastBalance | number:'1.2-2' }}
              </p>
            </div>
          </div>

          <div class="flex justify-between items-center text-sm">
            <p class="text-[var(--tg-theme-hint-color,#6b7280)] font-medium truncate pr-4">
              {{ acc.displayName ? acc.displayName : (acc.customerName && acc.customerName !== 'N/A' ? acc.customerName : 'Unnamed Meter') }}
            </p>
            <p class="text-[var(--tg-theme-hint-color,#6b7280)] text-xs flex items-center whitespace-nowrap">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               {{ acc.lastUpdateMs ? (acc.lastUpdateMs | date:'dd MMM yyyy') : (acc.lastUpdateTime?.split(' ')[0] || 'Unknown') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Floating Action Button (FAB) -->
      <button (click)="openAddModal()"
              class="fixed bottom-6 right-6 w-14 h-14 bg-[var(--tg-theme-button-color,#3b82f6)] text-[var(--tg-theme-button-text-color,#ffffff)] rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center hover:opacity-90 active:scale-90 transition-all z-40">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <!-- Add Meter Modal -->
      <div *ngIf="showAddModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
        <div class="bg-[var(--tg-theme-bg-color,#ffffff)] rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-slide-up sm:animate-fade-in pb-safe">
          <h3 class="text-2xl font-bold text-[var(--tg-theme-text-color,#111827)] mb-2">Add Meter</h3>
          <p class="text-sm text-[var(--tg-theme-hint-color,#6b7280)] mb-5">Enter your NESCO Consumer ID to start tracking.</p>

          <div *ngIf="addError" class="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
            {{ addError }}
          </div>

          <div class="mb-6">
            <input #meterInput
                   type="number"
                   inputmode="numeric"
                   placeholder="e.g. 11223344"
                   [value]="newMeterId"
                   (input)="newMeterId = meterInput.value"
                   (keyup.enter)="confirmAdd()"
                   [disabled]="isAdding"
                   class="w-full bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)] border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--tg-theme-button-color,#3b82f6)] transition-shadow">
          </div>

          <div class="flex space-x-3">
            <button (click)="closeAddModal()" [disabled]="isAdding" class="flex-1 py-3 rounded-xl font-bold bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)] hover:opacity-80 active:scale-95 transition-all">
              Cancel
            </button>
            <button (click)="confirmAdd()" [disabled]="isAdding || !newMeterId" class="flex-1 py-3 rounded-xl font-bold bg-[var(--tg-theme-button-color,#3b82f6)] text-[var(--tg-theme-button-text-color,#ffffff)] disabled:opacity-50 flex justify-center items-center active:scale-95 transition-all shadow-md">
              <span *ngIf="!isAdding">Add</span>
              <svg *ngIf="isAdding" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    .pb-safe { padding-bottom: max(1.5rem, env(safe-area-inset-bottom)); }
  `]
})
export class MeterListComponent implements OnInit {
  accounts: any[] = [];
  settings: any = { dailyUpdates: true, lowBalanceAlerts: true };
  loading = true;

  showAddModal = false;
  newMeterId = '';
  isAdding = false;
  addError = '';

  private tg = (window as any).Telegram?.WebApp;
  tgUser = this.tg?.initDataUnsafe?.user || {};
  initials = (this.tgUser.first_name?.[0] || '') + (this.tgUser.last_name?.[0] || '');

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchList(false);
  }

  fetchList(forceRefresh = false) {
    if (this.accounts.length === 0 || forceRefresh) {
      this.loading = true;
    }

    this.apiService.getList(forceRefresh).subscribe({
      next: (res: any) => {
        this.accounts = res.accounts;
        if (res.settings) this.settings = res.settings;

        this.loading = false;
        if (forceRefresh && this.tg?.HapticFeedback) {
          this.tg.HapticFeedback.impactOccurred('light');
        }
      },
      error: () => {
        this.loading = false;
        if (this.tg?.showAlert) this.tg.showAlert('Network error. Please try again.');
      }
    });
  }

  selectMeter(acc: any) {
    if (this.tg?.HapticFeedback) this.tg.HapticFeedback.selectionChanged();
    this.router.navigate(['/meter', acc.id], { state: { meterData: acc } });
  }

  openProfile() {
    if (this.tg?.HapticFeedback) this.tg.HapticFeedback.selectionChanged();
    this.router.navigate(['/profile'], { state: { settings: this.settings, count: this.accounts.length } });
  }

  openAddModal() {
    if (this.tg?.HapticFeedback) this.tg.HapticFeedback.selectionChanged();
    this.showAddModal = true;
    this.newMeterId = '';
    this.addError = '';
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  confirmAdd() {
    if (!this.newMeterId || this.newMeterId.trim() === '') return;
    this.isAdding = true;
    this.addError = '';

    this.apiService.addMeter(this.newMeterId.trim()).subscribe({
      next: () => {
        this.isAdding = false;
        this.showAddModal = false;
        if (this.tg?.HapticFeedback) this.tg.HapticFeedback.notificationOccurred('success');

        this.apiService.clearCache();
        this.fetchList(true);
      },
      error: (err) => {
        this.isAdding = false;
        this.addError = err.error?.error || 'Failed to verify meter ID.';
        if (this.tg?.HapticFeedback) this.tg.HapticFeedback.notificationOccurred('error');
      }
    });
  }
}
