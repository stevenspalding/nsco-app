import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meter-monthly',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2.5">
      <div *ngIf="loading" class="flex justify-center p-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--tg-theme-button-color,#3b82f6)]"></div>
      </div>

      <div *ngIf="!loading && monthlyData.length > 0">
        <div *ngFor="let row of monthlyData" class="bg-[var(--tg-theme-bg-color,#ffffff)] p-3.5 rounded-xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] flex justify-between shadow-sm items-center mb-2.5">
          <div>
            <p class="font-bold text-base mb-0.5">{{ row.month }} {{ row.year }}</p>
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] font-semibold">{{ row.usedElectricityKwh }} kWh</p>
          </div>
          <div class="text-right font-black text-red-500 text-lg bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded-lg">
            -৳{{ row.totalUsageOrDeduction }}
          </div>
        </div>
      </div>

      <div *ngIf="!loading && monthlyData.length === 0" class="text-center p-6 bg-[var(--tg-theme-bg-color,#ffffff)] rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)]">
        <p class="text-sm text-[var(--tg-theme-hint-color,#6b7280)]">No monthly data found.</p>
      </div>
    </div>
  `
})
export class MeterMonthlyComponent {
  @Input() monthlyData: any[] = [];
  @Input() loading: boolean = false;
}
