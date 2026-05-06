import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meter-daily',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-3">

      <!-- Controls Header -->
      <div *ngIf="dailyHistory.length > 0" class="flex justify-between items-center bg-[var(--tg-theme-bg-color,#ffffff)] p-2.5 rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm">

        <!-- Month Selector -->
        <div class="flex-1 mr-2 relative">
          <select
            [value]="selectedMonth"
            (change)="onMonthChange($event)"
            class="w-full appearance-none bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)] text-sm font-bold py-2.5 pl-4 pr-10 rounded-xl outline-none focus:ring-2 focus:ring-[var(--tg-theme-button-color,#3b82f6)]/50 cursor-pointer">
            <option *ngFor="let month of availableMonths" [value]="month.value">{{ month.label }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--tg-theme-hint-color,#6b7280)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Sort Toggle Button -->
        <button
          (click)="toggleSort()"
          class="shrink-0 bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] hover:bg-gray-200 dark:hover:bg-gray-700 text-[var(--tg-theme-text-color,#111827)] py-2.5 px-4 rounded-xl flex items-center justify-center font-bold text-sm transition-colors active:scale-95">
          <span class="mr-1.5">{{ sortOrder === 'desc' ? 'Newest' : 'Oldest' }}</span>
          <svg *ngIf="sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <svg *ngIf="sortOrder === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading && dailyHistory.length === 0" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--tg-theme-button-color,#3b82f6)]"></div>
      </div>

      <!-- Data List -->
      <div *ngIf="displayData.length > 0" class="space-y-2">
        <div *ngFor="let row of displayData" class="bg-[var(--tg-theme-bg-color,#ffffff)] p-4 rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] flex justify-between items-center shadow-sm relative overflow-hidden transition-all hover:shadow-md">

          <!-- Subtle Left Border Highlight if Recharged -->
          <div *ngIf="row.rechargeAdded > 0" class="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div>

          <!-- Left Side: Date & Usage/Recharge Badges -->
          <div class="flex flex-col gap-1 z-10" [ngClass]="{'pl-1.5': row.rechargeAdded > 0}">

            <!-- Date with Icon -->
            <div class="flex items-center text-[var(--tg-theme-text-color,#111827)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-[var(--tg-theme-button-color,#3b82f6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="font-bold text-[15px] tracking-wide">{{ getUsageDate(row.date) | date:'dd MMM yyyy' }}</span>
            </div>

            <!-- Badges (Usage & Recharge) -->
            <div class="flex items-center flex-wrap gap-2">

              <!-- Usage Pill -->
              <span *ngIf="row.usage > 0" class="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-red-500 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                -৳{{ row.usage }}
              </span>

              <!-- <span *ngIf="row.usage === 0" class="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-hint-color,#6b7280)] border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm">
                No Change
              </span> -->

              <!-- Recharge Pill (High Contrast Solid Color) -->
              <span *ngIf="row.rechargeAdded > 0" class="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-green-500 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                +৳{{ row.rechargeAdded }}
              </span>
            </div>
          </div>

          <!-- Right Side: HIGHLIGHTED BALANCE -->
          <div class="text-right z-10 pl-2">
            <p class="text-[var(--tg-theme-hint-color,#6b7280)] text-[10px] uppercase tracking-widest font-bold">Balance</p>
            <div class="font-black text-2xl text-[var(--tg-theme-text-color,#111827)] tracking-tight">৳{{ row.balance }}</div>
          </div>

        </div>
      </div>

      <!-- Empty States -->
      <div *ngIf="!isLoading && dailyHistory.length === 0" class="text-center p-6 bg-[var(--tg-theme-bg-color,#ffffff)] rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)]">
        <p class="text-sm text-[var(--tg-theme-hint-color,#6b7280)] font-medium">No daily history recorded yet.</p>
      </div>

      <div *ngIf="!isLoading && dailyHistory.length > 0 && displayData.length === 0" class="text-center p-6 bg-[var(--tg-theme-bg-color,#ffffff)] rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)]">
        <p class="text-sm text-[var(--tg-theme-hint-color,#6b7280)] font-medium">No records found for {{ getSelectedMonthLabel() }}.</p>
      </div>

    </div>
  `
})
export class MeterDailyComponent implements OnChanges {
  @Input() dailyHistory: any[] = [];
  @Input() isLoading: boolean = false;

  availableMonths: { label: string, value: string }[] = [];
  selectedMonth: string = '';
  sortOrder: 'asc' | 'desc' = 'desc';
  displayData: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dailyHistory'] && this.dailyHistory) {
      this.processData();
    }
  }

  getValidDate(dateStr: string): Date {
    if (!dateStr) return new Date();
    const firstChunk = dateStr.split(' ')[0];
    if (firstChunk.includes('-')) {
      const parts = firstChunk.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        let hours = 0, minutes = 0, seconds = 0;
        const timeMatch = dateStr.match(/(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)?/i);
        if (timeMatch) {
          hours = parseInt(timeMatch[1], 10);
          minutes = parseInt(timeMatch[2], 10);
          seconds = parseInt(timeMatch[3], 10);
          const ampm = timeMatch[4]?.toUpperCase();
          if (ampm === 'PM' && hours < 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
        }
        const d = new Date(year, month, day, hours, minutes, seconds);
        if (!isNaN(d.getTime())) return d;
      }
    }
    const fallbackDate = new Date(dateStr);
    return !isNaN(fallbackDate.getTime()) ? fallbackDate : new Date();
  }

  getUsageDate(dateStr: string): Date {
    const d = this.getValidDate(dateStr);
    if (d.getHours() === 0) return new Date(d.getTime() - (24 * 60 * 60 * 1000));
    return d;
  }

  processData() {
    if (!this.dailyHistory || this.dailyHistory.length === 0) {
      this.availableMonths = [];
      this.displayData = [];
      return;
    }

    const monthSet = new Map<string, string>();
    this.dailyHistory.forEach(row => {
      const d = this.getUsageDate(row.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const val = `${year}-${month}`;
      const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      if (!monthSet.has(val)) monthSet.set(val, label);
    });

    this.availableMonths = Array.from(monthSet.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => b.value.localeCompare(a.value));

    if (!this.selectedMonth || !monthSet.has(this.selectedMonth)) {
      this.selectedMonth = this.availableMonths.length > 0 ? this.availableMonths[0].value : '';
    }
    this.applyFilterAndSort();
  }

  applyFilterAndSort() {
    if (!this.selectedMonth) {
      this.displayData = [];
      return;
    }
    let filtered = this.dailyHistory.filter(row => {
      const d = this.getUsageDate(row.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const val = `${year}-${month}`;
      return val === this.selectedMonth;
    });

    filtered.sort((a, b) => {
      const timeA = this.getUsageDate(a.date).getTime();
      const timeB = this.getUsageDate(b.date).getTime();
      return this.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    this.displayData = filtered;
  }

  onMonthChange(event: any) {
    this.selectedMonth = event.target.value;
    this.applyFilterAndSort();
    if ((window as any).Telegram?.WebApp?.HapticFeedback) (window as any).Telegram.WebApp.HapticFeedback.selectionChanged();
  }

  toggleSort() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilterAndSort();
    if ((window as any).Telegram?.WebApp?.HapticFeedback) (window as any).Telegram.WebApp.HapticFeedback.selectionChanged();
  }

  getSelectedMonthLabel(): string {
    const found = this.availableMonths.find(m => m.value === this.selectedMonth);
    return found ? found.label : 'this month';
  }
}
