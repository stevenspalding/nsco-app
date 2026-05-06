import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

import { MeterInfoComponent } from './tabs/meter-info.component';
import { MeterDailyComponent } from './tabs/meter-daily.component';
import { MeterRechargesComponent } from './tabs/meter-recharges.component';
import { MeterMonthlyComponent } from './tabs/meter-monthly.component';

declare global { interface Window { Telegram: any; } }

@Component({
  selector: 'app-meter-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MeterInfoComponent, MeterDailyComponent, MeterRechargesComponent, MeterMonthlyComponent],
  template: `
    <div class="fixed inset-0 flex flex-col bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)] font-sans overflow-hidden">

      <!-- 1. FIXED HEADER -->
      <div class="shrink-0 p-4 bg-[var(--tg-theme-bg-color,#ffffff)] border-b border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] flex items-center justify-between shadow-sm z-20 relative">

        <div class="flex items-center space-x-3 overflow-hidden">
          <button (click)="goBack()" class="shrink-0 p-2 -ml-2 text-[var(--tg-theme-button-color,#3b82f6)] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div class="flex flex-col min-w-0">
            <h2 class="text-lg font-bold leading-tight truncate text-[var(--tg-theme-text-color,#111827)] max-w-[180px]">
              {{ deepData.displayName || deepData.info.customerName || meterId }}
            </h2>
            <span class="text-[10px] text-[var(--tg-theme-hint-color,#6b7280)] font-mono uppercase tracking-widest truncate">
              {{ meterId }}
            </span>
          </div>
        </div>

        <div class="flex items-center shrink-0 space-x-1 relative">
          <!-- Refresh Button is hidden while Syncing to prevent duplicate clicks -->
          <button *ngIf="!loadingLive && !isSyncing" (click)="syncData()" class="p-2 text-[var(--tg-theme-button-color,#3b82f6)] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <button (click)="toggleMenu()" class="p-2 text-[var(--tg-theme-text-color,#111827)] hover:bg-[var(--tg-theme-secondary-bg-color,#e5e7eb)] rounded-full transition-colors active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div *ngIf="showMenu" class="absolute right-0 top-full mt-2 w-48 bg-[var(--tg-theme-bg-color,#ffffff)] border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] rounded-2xl shadow-xl overflow-hidden z-50 py-1">
            <button (click)="openEditNameModal()" class="w-full text-left px-4 py-3 text-sm font-semibold flex items-center space-x-2 text-[var(--tg-theme-text-color,#111827)] hover:bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] active:bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[var(--tg-theme-button-color,#3b82f6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Display Name</span>
            </button>
            <div class="h-px bg-[var(--tg-theme-secondary-bg-color,#e5e7eb)] w-full"></div>
            <button (click)="syncData()" class="w-full text-left px-4 py-3 text-sm font-semibold flex items-center space-x-2 text-[var(--tg-theme-text-color,#111827)] hover:bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] active:bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[var(--tg-theme-button-color,#3b82f6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span>Sync Live Data</span>
            </button>
            <div class="h-px bg-[var(--tg-theme-secondary-bg-color,#e5e7eb)] w-full"></div>
            <button (click)="openDeleteModal()" class="w-full text-left px-4 py-3 text-sm font-semibold flex items-center space-x-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 active:bg-red-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Stop Tracking</span>
            </button>
          </div>
        </div>

        <!-- Live Sync Progress Bar attached to Header Bottom -->
        <div *ngIf="loadingLive" class="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--tg-theme-button-color,#3b82f6)]/20 overflow-hidden">
          <div class="h-full bg-[var(--tg-theme-button-color,#3b82f6)] w-1/2 rounded-r-full animate-[slide_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <div *ngIf="showMenu" (click)="showMenu = false" class="fixed inset-0 z-10"></div>

      <!-- 2. FIXED TABS -->
      <div class="shrink-0 flex overflow-x-auto bg-[var(--tg-theme-bg-color,#ffffff)] border-b border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] hide-scrollbar z-0 relative">
        <button *ngFor="let tab of ['info', 'daily', 'recharges', 'monthly']"
                (click)="switchTab(tab)"
                class="flex-1 min-w-[100px] py-3 text-sm font-bold border-b-2 transition-colors capitalize"
                [ngClass]="activeTab === tab ? 'border-[var(--tg-theme-button-color,#3b82f6)] text-[var(--tg-theme-button-color,#3b82f6)]' : 'border-transparent text-[var(--tg-theme-hint-color,#6b7280)] hover:text-[var(--tg-theme-text-color,#111827)]'">
          {{ tab }}
        </button>
      </div>

      <!-- 3. SCROLLABLE CONTENT WITH CHILD COMPONENTS -->
      <div class="flex-1 overflow-y-auto p-4 pb-12 z-0 relative">
        <app-meter-info *ngIf="activeTab === 'info'" [info]="deepData.info" [isLoading]="loadingLive"></app-meter-info>
        <app-meter-daily *ngIf="activeTab === 'daily'" [dailyHistory]="deepData.dailyHistory" [isLoading]="loadingLive"></app-meter-daily>
        <app-meter-recharges *ngIf="activeTab === 'recharges'" [recharges]="deepData.recharges" [isLoading]="loadingLive"></app-meter-recharges>
        <app-meter-monthly *ngIf="activeTab === 'monthly'" [monthlyData]="monthlyUsageData" [loading]="loadingMonthly"></app-meter-monthly>
      </div>
    </div>

    <!-- Edit Name & Delete Modals Remain Unchanged -->
    <div *ngIf="showEditNameModal" class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div class="bg-[var(--tg-theme-bg-color,#ffffff)] rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <h3 class="text-2xl font-bold text-[var(--tg-theme-text-color,#111827)] mb-2">Edit Display Name</h3>
        <p class="text-sm text-[var(--tg-theme-hint-color,#6b7280)] mb-5">Set a custom name to easily identify this meter (e.g., Home, Office).</p>
        <div class="mb-6">
          <input type="text" placeholder="e.g. My Home Meter" [(ngModel)]="newDisplayName" (keyup.enter)="saveDisplayName()" [disabled]="isSavingName" maxlength="30" class="w-full bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)] border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--tg-theme-button-color,#3b82f6)] transition-shadow">
          <p class="text-xs text-right mt-1 text-[var(--tg-theme-hint-color,#6b7280)]">Leave blank to use original name.</p>
        </div>
        <div class="flex space-x-3">
          <button (click)="closeEditNameModal()" [disabled]="isSavingName" class="flex-1 py-3 rounded-xl font-bold bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)] hover:opacity-80 active:scale-95 transition-all">Cancel</button>
          <button (click)="saveDisplayName()" [disabled]="isSavingName" class="flex-1 py-3 rounded-xl font-bold bg-[var(--tg-theme-button-color,#3b82f6)] text-[var(--tg-theme-button-text-color,#ffffff)] disabled:opacity-50 flex justify-center items-center active:scale-95 transition-all shadow-md">
            <span *ngIf="!isSavingName">Save Name</span>
            <svg *ngIf="isSavingName" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <div *ngIf="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-[var(--tg-theme-bg-color,#ffffff)] rounded-3xl p-6 w-full max-w-sm shadow-2xl">
        <h3 class="text-2xl font-bold text-[var(--tg-theme-text-color,#111827)] mb-3">Stop Tracking?</h3>
        <p class="text-[var(--tg-theme-hint-color,#6b7280)] mb-6 leading-relaxed">Are you sure you want to remove <span class="font-bold text-[var(--tg-theme-text-color,#111827)]">{{ deepData.displayName || deepData.info.customerName || meterId }}</span>?</p>
        <div class="flex space-x-3">
          <button (click)="showDeleteModal = false" class="flex-1 py-3 rounded-xl font-bold bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)] hover:opacity-80 active:scale-95 transition-transform">Cancel</button>
          <button (click)="confirmDelete()" [disabled]="isDeleting" class="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 flex justify-center items-center active:scale-95 transition-transform">
            <span *ngIf="!isDeleting">Delete</span>
            <span *ngIf="isDeleting" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes slide {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
  `]
})
export class MeterDetailComponent implements OnInit {
  meterId!: string;

  // Initialize with basic structure
  deepData: any = { info: {}, dailyHistory: [], recharges: [], displayName: '' };
  monthlyUsageData: any[] = [];

  loadingLive = true;
  loadingMonthly = false;
  isSyncing = false;

  showMenu = false;
  activeTab: string = 'info';

  showDeleteModal = false;
  isDeleting = false;

  showEditNameModal = false;
  newDisplayName = '';
  isSavingName = false;

  private tg = (window as any).Telegram?.WebApp;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.meterId = this.route.snapshot.paramMap.get('id') || '';

    // Read the passed state from the router navigation
    const state = history.state;
    if (state && state.meterData) {
      const m = state.meterData;
      // Pre-fill Skeleton UI data instantly
      this.deepData = {
        displayName: m.displayName || '',
        info: {
          customerName: m.customerName,
          remainingBalance: m.lastBalance,
          balanceUpdateTime: m.lastUpdateTime
        },
        dailyHistory: [], // Full history array will load with the API
        recharges: []
      };
    }

    if (this.meterId) {
      this.fetchData();
    } else {
      this.goBack();
    }
  }

  fetchData() {
    this.loadingLive = true;

    // Single API call fetches all deep NESCO scraped data
    this.apiService.getDetails(this.meterId).subscribe({
      next: (res) => {
        this.loadingLive = false;
        // Merge the rich scraped data over the initial Skeleton data
        this.deepData.info = res.info;
        this.deepData.recharges = res.recharges;
        this.deepData.dailyHistory = res.dailyHistory;
        if (res.displayName !== undefined) this.deepData.displayName = res.displayName;
      },
      error: () => {
        this.loadingLive = false;
        if (this.tg?.showAlert) this.tg.showAlert('Failed to load complete meter details.');
      }
    });
  }

  syncData() {
    this.showMenu = false;
    if (this.isSyncing || this.loadingLive) return;
    if (this.tg?.HapticFeedback) this.tg.HapticFeedback.selectionChanged();

    this.isSyncing = true;
    this.loadingLive = true;

    this.apiService.syncMeter(this.meterId).subscribe({
      next: (res) => {
        this.deepData.info = res.info;
        this.deepData.recharges = res.recharges;
        this.deepData.dailyHistory = res.dailyHistory;
        if (res.displayName !== undefined) this.deepData.displayName = res.displayName;

        this.isSyncing = false;
        this.loadingLive = false;
        this.apiService.clearCache(); // Force list refresh on go back

        if (this.activeTab === 'monthly') {
          this.monthlyUsageData = [];
          this.switchTab('monthly');
        }

        if (this.tg?.HapticFeedback) this.tg.HapticFeedback.notificationOccurred('success');
      },
      error: () => {
        this.isSyncing = false;
        this.loadingLive = false;
        if (this.tg?.showAlert) this.tg.showAlert('Sync failed. NESCO might be busy.');
      }
    });
  }

  toggleMenu() {
    if (this.tg?.HapticFeedback) this.tg.HapticFeedback.selectionChanged();
    this.showMenu = !this.showMenu;
  }

  openDeleteModal() {
    this.showMenu = false;
    this.showDeleteModal = true;
  }

  openEditNameModal() {
    this.showMenu = false;
    if (this.tg?.HapticFeedback) this.tg.HapticFeedback.selectionChanged();
    this.newDisplayName = this.deepData.displayName || '';
    this.showEditNameModal = true;
  }

  closeEditNameModal() {
    this.showEditNameModal = false;
  }

  saveDisplayName() {
    const nameToSave = this.newDisplayName.trim();
    this.isSavingName = true;

    this.apiService.updateDisplayName(this.meterId, nameToSave).subscribe({
      next: () => {
        this.isSavingName = false;
        this.showEditNameModal = false;

        this.deepData.displayName = nameToSave;
        this.apiService.clearCache();

        if (this.tg?.HapticFeedback) this.tg.HapticFeedback.notificationOccurred('success');
      },
      error: () => {
        this.isSavingName = false;
        if (this.tg?.showAlert) this.tg.showAlert('Failed to save display name.');
      }
    });
  }

  switchTab(tab: string) {
    if (this.activeTab === tab) return;
    if (this.tg?.HapticFeedback) this.tg.HapticFeedback.selectionChanged();
    this.activeTab = tab;

    if (tab === 'monthly' && this.monthlyUsageData.length === 0 && !this.loadingMonthly) {
      this.loadingMonthly = true;
      this.apiService.getMonthlyUsage(this.meterId).subscribe({
        next: (res) => {
          this.monthlyUsageData = res.monthlyUsage;
          this.loadingMonthly = false;
        },
        error: () => {
          this.loadingMonthly = false;
        }
      });
    }
  }

  goBack() {
    if (this.tg?.HapticFeedback) this.tg.HapticFeedback.selectionChanged();
    this.router.navigate(['/']);
  }

  confirmDelete() {
    this.isDeleting = true;
    this.apiService.deleteMeter(this.meterId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        if (this.tg?.HapticFeedback) this.tg.HapticFeedback.notificationOccurred('success');
        this.apiService.clearCache();
        this.goBack();
      },
      error: () => {
        this.isDeleting = false;
      }
    });
  }
}
