import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meter-monthly',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-3 pb-20">

      <!-- Loading Skeletons -->
      <ng-container *ngIf="isLoading && monthlyUsage.length === 0">
        <div *ngFor="let i of [1, 2, 3, 4]" class="bg-[var(--tg-theme-bg-color,#ffffff)] p-4 rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm animate-pulse flex justify-between items-center">
          <div class="space-y-2 w-1/2">
            <div class="h-5 w-3/4 bg-black/10 dark:bg-white/10 rounded-md"></div>
            <div class="h-4 w-1/2 bg-black/10 dark:bg-white/10 rounded-md"></div>
          </div>
          <div class="space-y-2 w-1/3 flex flex-col items-end">
            <div class="h-5 w-full bg-black/10 dark:bg-white/10 rounded-md"></div>
            <div class="h-4 w-2/3 bg-black/10 dark:bg-white/10 rounded-md"></div>
          </div>
        </div>
      </ng-container>

      <!-- Empty State -->
      <div *ngIf="!isLoading && monthlyUsage.length === 0" class="text-center mt-10 p-6 bg-[var(--tg-theme-bg-color,#ffffff)] rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm">
        <p class="text-[var(--tg-theme-hint-color,#6b7280)] font-medium">No monthly data available.</p>
        <p class="text-sm mt-2 text-[var(--tg-theme-hint-color,#6b7280)] opacity-80">Check back later after the billing cycle completes.</p>
      </div>

      <!-- Monthly List -->
      <div *ngIf="monthlyUsage.length > 0" class="space-y-3">
        <div *ngFor="let month of monthlyUsage"
             (click)="openModal(month)"
             class="bg-[var(--tg-theme-bg-color,#ffffff)] p-4 rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm cursor-pointer hover:shadow-md active:scale-[0.98] transition-all flex justify-between items-center relative overflow-hidden">

          <div class="relative z-10">
            <p class="font-bold text-lg text-[var(--tg-theme-text-color,#111827)]">{{ month.month }}, {{ month.year }}</p>
            <p class="text-sm text-[var(--tg-theme-hint-color,#6b7280)] flex items-center mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {{ month.usedElectricityKwh }} kWh
            </p>
          </div>

          <div class="text-right relative z-10">
            <p class="font-black text-red-500 text-lg">-৳{{ month.totalUsageOrDeduction }}</p>
            <p *ngIf="month.totalRecharge > 0" class="text-xs font-bold text-green-500 mt-0.5">Recharge: +৳{{ month.totalRecharge }}</p>
            <p *ngIf="!month.totalRecharge || month.totalRecharge == 0" class="text-xs font-medium text-[var(--tg-theme-hint-color,#6b7280)] mt-0.5">No Recharge</p>
          </div>
        </div>
      </div>

      <!-- Monthly Detail Modal (Receipt Style) -->
      <div *ngIf="selectedMonth" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
        <div class="bg-[var(--tg-theme-bg-color,#ffffff)] rounded-t-3xl sm:rounded-3xl w-full max-w-sm shadow-2xl animate-slide-up sm:animate-fade-in pb-safe overflow-hidden flex flex-col max-h-[90vh]">

          <!-- Modal Header -->
          <div class="px-6 py-5 border-b border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)]/50 sticky top-0 flex justify-between items-center z-10 shrink-0">
            <div>
              <h3 class="text-2xl font-black text-[var(--tg-theme-text-color,#111827)]">{{ selectedMonth.month }}</h3>
              <p class="text-sm font-bold text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider">{{ selectedMonth.year }}</p>
            </div>
            <button (click)="closeModal()" class="p-2 bg-[var(--tg-theme-secondary-bg-color,#e5e7eb)] text-[var(--tg-theme-hint-color,#6b7280)] rounded-full hover:bg-gray-200 hover:text-gray-800 active:scale-95 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Body (Scrollable Breakdown) -->
          <div class="p-6 overflow-y-auto custom-scrollbar">

            <!-- Summary Metric -->
            <div class="flex justify-between items-center mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <div>
                <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase font-bold tracking-wider mb-0.5">Electricity Used</p>
                <p class="text-xl font-black text-[var(--tg-theme-button-color,#3b82f6)]">{{ selectedMonth.usedElectricityKwh }} kWh</p>
              </div>
              <div class="h-10 w-10 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center text-[var(--tg-theme-button-color,#3b82f6)]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            <!-- Receipt Breakdown -->
            <div class="space-y-3 text-[15px]">

              <div class="flex justify-between items-center">
                <span class="text-[var(--tg-theme-hint-color,#6b7280)]">Electricity Cost</span>
                <span class="font-semibold text-[var(--tg-theme-text-color,#111827)]">৳{{ selectedMonth.usedElectricityAmount || '0.00' }}</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-[var(--tg-theme-hint-color,#6b7280)]">Meter Rent</span>
                <span class="font-semibold text-[var(--tg-theme-text-color,#111827)]">৳{{ selectedMonth.meterRent || '0.00' }}</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-[var(--tg-theme-hint-color,#6b7280)]">Demand Charge</span>
                <span class="font-semibold text-[var(--tg-theme-text-color,#111827)]">৳{{ selectedMonth.demandCharge || '0.00' }}</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-[var(--tg-theme-hint-color,#6b7280)]">PFC Charge</span>
                <span class="font-semibold text-[var(--tg-theme-text-color,#111827)]">৳{{ selectedMonth.pfcCharge || '0.00' }}</span>
              </div>

              <div class="flex justify-between items-center" *ngIf="selectedMonth.arrearsOrFine && selectedMonth.arrearsOrFine != '0.00'">
                <span class="text-[var(--tg-theme-hint-color,#6b7280)]">Arrears/Fine</span>
                <span class="font-semibold text-red-500">৳{{ selectedMonth.arrearsOrFine }}</span>
              </div>

              <div class="flex justify-between items-center">
                <span class="text-[var(--tg-theme-hint-color,#6b7280)]">VAT (5%)</span>
                <span class="font-semibold text-[var(--tg-theme-text-color,#111827)]">৳{{ selectedMonth.vat || '0.00' }}</span>
              </div>

              <div class="flex justify-between items-center" *ngIf="selectedMonth.rebate && selectedMonth.rebate != '0.00'">
                <span class="text-[var(--tg-theme-hint-color,#6b7280)]">Rebate</span>
                <span class="font-bold text-green-500">-৳{{ selectedMonth.rebate }}</span>
              </div>

              <!-- Divider -->
              <div class="border-t-2 border-dashed border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] my-4"></div>

              <!-- Totals -->
              <div class="flex justify-between items-center">
                <span class="font-bold text-[var(--tg-theme-text-color,#111827)] uppercase text-sm tracking-wider">Total Deduction</span>
                <span class="font-black text-red-500 text-lg">৳{{ selectedMonth.totalUsageOrDeduction || '0.00' }}</span>
              </div>

              <div class="flex justify-between items-center mt-4">
                <span class="text-[var(--tg-theme-hint-color,#6b7280)] font-medium">Total Recharged</span>
                <span class="font-bold text-green-500">৳{{ selectedMonth.totalRecharge || '0.00' }}</span>
              </div>

            </div>

            <!-- Month End Balance Footer -->
            <div class="mt-6 p-4 bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] rounded-2xl flex justify-between items-center">
              <span class="font-bold text-[var(--tg-theme-hint-color,#6b7280)] text-sm uppercase tracking-wider">End Balance</span>
              <span class="font-black text-[var(--tg-theme-text-color,#111827)] text-xl" [ngClass]="{'text-red-500': selectedMonth.monthEndBalance < 0}">
                ৳{{ selectedMonth.monthEndBalance || '0.00' }}
              </span>
            </div>

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

    /* Hide scrollbar for clean look */
    .custom-scrollbar::-webkit-scrollbar { width: 0px; }
    .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class MeterMonthlyComponent {
  @Input() monthlyUsage: any[] = [];
  @Input() isLoading: boolean = false;

  selectedMonth: any = null;
  private tg = (window as any).Telegram?.WebApp;

  openModal(month: any) {
    if (this.tg?.HapticFeedback) {
      this.tg.HapticFeedback.selectionChanged();
    }
    this.selectedMonth = month;
  }

  closeModal() {
    this.selectedMonth = null;
  }
}
