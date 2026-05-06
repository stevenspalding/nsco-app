import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meter-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">

      <!-- Dynamic Current Balance Card -->
      <div [ngClass]="getCardClasses()" class="bg-gradient-to-br p-5 rounded-2xl shadow-md text-white transition-all duration-300 relative overflow-hidden">

        <!-- Background loading pulse -->
        <div *ngIf="isLoading && info.remainingBalance == null" class="absolute inset-0 bg-white/10 animate-pulse"></div>

        <div class="flex justify-between items-start mb-1 relative z-10">
          <p class="text-white/90 text-sm font-semibold uppercase tracking-wider">Current Balance</p>

          <span *ngIf="getBalanceState() === 'low'" class="bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Low Balance
          </span>

          <span *ngIf="getBalanceState() === 'negative'" class="bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center shadow-sm animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Emergency / Loan
          </span>
        </div>

        <p class="text-4xl font-black mb-2 tracking-tight relative z-10">
          <span *ngIf="isLoading && info.remainingBalance == null" class="inline-block w-32 h-10 bg-white/20 rounded-lg animate-pulse mt-1"></span>
          <span *ngIf="info.remainingBalance != null">৳{{ info.remainingBalance }}</span>
        </p>

        <p class="text-xs text-white/80 flex items-center font-medium relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span *ngIf="isLoading && !info.balanceUpdateTime" class="inline-block w-24 h-3 bg-white/20 rounded animate-pulse ml-1"></span>
          <span *ngIf="!isLoading || info.balanceUpdateTime">Updated: {{ info.balanceUpdateTime || 'Unknown' }}</span>
        </p>
      </div>

      <!-- Customer Details (Itemized Skeletons) -->
      <div class="bg-[var(--tg-theme-bg-color,#ffffff)] p-5 rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-[var(--tg-theme-text-color,#111827)] border-b border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] pb-2 mb-3">Customer Info</h3>

        <div>
          <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">Customer Name</p>
          <div *ngIf="isLoading && !info.customerName" class="h-6 w-3/4 bg-black/10 dark:bg-white/10 rounded-md animate-pulse"></div>
          <p *ngIf="!isLoading || info.customerName" class="font-bold text-lg text-[var(--tg-theme-text-color,#111827)]">{{ info.customerName || 'N/A' }}</p>
        </div>

        <div class="flex justify-between">
          <div class="pr-2 w-1/2">
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">Father/Husband</p>
            <div *ngIf="isLoading && !info.fatherOrHusbandName" class="h-5 w-4/5 bg-black/10 dark:bg-white/10 rounded-md animate-pulse"></div>
            <p *ngIf="!isLoading || info.fatherOrHusbandName" class="font-semibold text-[var(--tg-theme-text-color,#111827)] truncate">{{ info.fatherOrHusbandName || 'N/A' }}</p>
          </div>
          <div class="text-right pl-2 w-1/2">
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">Mobile</p>
            <div *ngIf="isLoading && !info.mobile" class="h-5 w-3/4 ml-auto bg-black/10 dark:bg-white/10 rounded-md animate-pulse"></div>
            <p *ngIf="!isLoading || info.mobile" class="font-semibold text-[var(--tg-theme-text-color,#111827)]">{{ info.mobile || 'N/A' }}</p>
          </div>
        </div>

        <div>
          <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">Address</p>
          <div *ngIf="isLoading && !info.address" class="space-y-1.5 mt-1">
            <div class="h-4 w-full bg-black/10 dark:bg-white/10 rounded animate-pulse"></div>
            <div class="h-4 w-5/6 bg-black/10 dark:bg-white/10 rounded animate-pulse"></div>
          </div>
          <p *ngIf="!isLoading || info.address" class="font-medium text-sm leading-relaxed text-[var(--tg-theme-text-color,#111827)]">{{ info.address || 'N/A' }}</p>
        </div>
      </div>

      <!-- Meter Details Skeleton Card -->
      <div *ngIf="isLoading && !info.consumerNo" class="bg-[var(--tg-theme-bg-color,#ffffff)] p-5 rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm animate-pulse space-y-5">
        <div class="h-5 w-32 bg-black/10 dark:bg-white/10 rounded-md"></div>
        <div class="space-y-4">
          <div class="flex justify-between space-x-4">
            <div class="space-y-1.5 w-1/2"><div class="h-3 w-1/2 bg-black/10 dark:bg-white/10 rounded"></div><div class="h-5 w-3/4 bg-black/10 dark:bg-white/10 rounded-md"></div></div>
            <div class="space-y-1.5 w-1/2 flex flex-col items-end"><div class="h-3 w-1/2 bg-black/10 dark:bg-white/10 rounded"></div><div class="h-5 w-4/5 bg-black/10 dark:bg-white/10 rounded-md"></div></div>
          </div>
          <div class="flex justify-between space-x-4">
            <div class="space-y-1.5 w-1/2"><div class="h-3 w-1/2 bg-black/10 dark:bg-white/10 rounded"></div><div class="h-5 w-2/3 bg-black/10 dark:bg-white/10 rounded-md"></div></div>
            <div class="space-y-1.5 w-1/2 flex flex-col items-end"><div class="h-3 w-1/2 bg-black/10 dark:bg-white/10 rounded"></div><div class="h-5 w-3/4 bg-black/10 dark:bg-white/10 rounded-md"></div></div>
          </div>
          <div class="flex justify-between space-x-4">
            <div class="space-y-1.5 w-1/2"><div class="h-3 w-1/2 bg-black/10 dark:bg-white/10 rounded"></div><div class="h-5 w-1/2 bg-black/10 dark:bg-white/10 rounded-md"></div></div>
            <div class="space-y-1.5 w-1/2 flex flex-col items-end"><div class="h-3 w-1/2 bg-black/10 dark:bg-white/10 rounded"></div><div class="h-5 w-1/3 bg-black/10 dark:bg-white/10 rounded-md"></div></div>
          </div>
        </div>
      </div>

      <!-- Meter Details Loaded Card -->
      <div *ngIf="!isLoading || info.consumerNo" class="bg-[var(--tg-theme-bg-color,#ffffff)] p-5 rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-[var(--tg-theme-text-color,#111827)] border-b border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] pb-2 mb-3">Meter Info</h3>

        <div class="flex justify-between">
          <div class="w-1/2">
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">Consumer No</p>
            <p class="font-bold font-mono text-[var(--tg-theme-text-color,#111827)]">{{ info.consumerNo || 'N/A' }}</p>
          </div>
          <div class="text-right w-1/2">
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">Meter No</p>
            <p class="font-bold font-mono text-[var(--tg-theme-text-color,#111827)]">{{ info.meterNo || 'N/A' }}</p>
          </div>
        </div>

        <div class="flex justify-between">
          <div class="w-1/2">
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">Meter Status</p>
            <p class="font-bold" [ngClass]="(info.meterStatus || info.status) === 'Active' ? 'text-green-500' : 'text-red-500'">
              {{ info.meterStatus || info.status || 'N/A' }}
            </p>
          </div>
          <div class="text-right w-1/2">
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">Meter Type</p>
            <p class="font-semibold text-[var(--tg-theme-text-color,#111827)]">{{ info.meterType || 'N/A' }}</p>
          </div>
        </div>

        <div class="flex justify-between">
          <div class="w-1/2">
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">Tariff</p>
            <p class="font-semibold text-[var(--tg-theme-text-color,#111827)]">{{ info.tariff || 'N/A' }}</p>
          </div>
          <div class="text-right w-1/2">
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">Sanctioned Load</p>
            <p class="font-semibold text-[var(--tg-theme-text-color,#111827)]">{{ info.sanctionedLoadKw || info.sanctionedLoad || 'N/A' }}</p>
          </div>
        </div>

        <div class="flex justify-between">
          <div class="w-1/2">
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">Install Date</p>
            <p class="font-semibold text-[var(--tg-theme-text-color,#111827)]">{{ info.meterInstallDate || 'N/A' }}</p>
          </div>
          <div class="text-right w-1/2">
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">Min Recharge</p>
            <p class="font-bold text-[var(--tg-theme-button-color,#3b82f6)]">
              {{ info.minimumRechargeAmount !== undefined ? '৳' + info.minimumRechargeAmount : 'N/A' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Office Details Skeleton Card -->
      <div *ngIf="isLoading && !info.sndOffice" class="bg-[var(--tg-theme-bg-color,#ffffff)] p-5 rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm animate-pulse space-y-5">
        <div class="h-5 w-24 bg-black/10 dark:bg-white/10 rounded-md"></div>
        <div class="space-y-4">
          <div class="space-y-1.5"><div class="h-3 w-1/4 bg-black/10 dark:bg-white/10 rounded"></div><div class="h-5 w-3/4 bg-black/10 dark:bg-white/10 rounded-md"></div></div>
          <div class="space-y-1.5"><div class="h-3 w-1/4 bg-black/10 dark:bg-white/10 rounded"></div><div class="h-5 w-1/2 bg-black/10 dark:bg-white/10 rounded-md"></div></div>
        </div>
      </div>

      <!-- Office Details Loaded Card -->
      <div *ngIf="!isLoading || info.sndOffice" class="bg-[var(--tg-theme-bg-color,#ffffff)] p-5 rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm space-y-4">
        <h3 class="text-lg font-bold text-[var(--tg-theme-text-color,#111827)] border-b border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] pb-2 mb-3">Office Info</h3>

        <div>
          <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">SND Office</p>
          <p class="font-semibold text-[var(--tg-theme-text-color,#111827)]">{{ info.sndOffice || 'N/A' }}</p>
        </div>

        <div>
          <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider mb-1">Feeder Name</p>
          <p class="font-semibold text-[var(--tg-theme-text-color,#111827)]">{{ info.feederName || 'N/A' }}</p>
        </div>
      </div>

    </div>
  `
})
export class MeterInfoComponent {
  @Input() info: any = {};
  @Input() isLoading: boolean = false;

  getBalanceAmount(): number {
    return parseFloat(this.info?.remainingBalance) || 0;
  }

  getBalanceState(): 'normal' | 'low' | 'negative' {
    if (this.info?.remainingBalance === undefined || this.info?.remainingBalance === null) return 'normal';
    const bal = this.getBalanceAmount();
    if (bal < 0) return 'negative';
    if (bal <= 100) return 'low';
    return 'normal';
  }

  getCardClasses(): string {
    const state = this.getBalanceState();
    if (state === 'negative') {
      return 'from-red-500 to-red-600 shadow-red-500/30 ring-2 ring-red-300 dark:ring-red-900';
    }
    if (state === 'low') {
      return 'from-orange-500 to-orange-600 shadow-orange-500/30 ring-2 ring-orange-300 dark:ring-orange-900';
    }
    return 'from-[var(--tg-theme-button-color,#3b82f6)] to-blue-600 shadow-blue-500/30';
  }
}
