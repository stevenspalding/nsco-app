import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-meter-monthly',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4 pb-20">
      
      <!-- Loading Skeletons -->
      <ng-container *ngIf="isLoading && monthlyUsage.length === 0">
        <!-- Button Skeleton -->
        <div class="bg-[var(--tg-theme-bg-color,#ffffff)] h-20 rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm animate-pulse mb-4"></div>
        <!-- List Skeletons -->
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

      <!-- Open Chart Modal Button -->
      <div *ngIf="monthlyUsage.length > 0" 
           (click)="openChartModal()" 
           class="bg-[var(--tg-theme-button-color,#3b82f6)]/10 p-4 rounded-2xl border border-[var(--tg-theme-button-color,#3b82f6)]/20 shadow-sm flex justify-between items-center cursor-pointer active:scale-[0.98] transition-transform animate-fade-in">
        <div class="flex items-center space-x-3">
          <div class="p-2.5 bg-[var(--tg-theme-button-color,#3b82f6)] text-white rounded-xl shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-[var(--tg-theme-text-color,#111827)] text-base">6-Month Trend</h3>
            <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] mt-0.5">Tap to view cost & usage analysis</p>
          </div>
        </div>
        <div class="text-[var(--tg-theme-button-color,#3b82f6)] bg-[var(--tg-theme-button-color,#3b82f6)]/10 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <!-- Monthly List -->
      <div *ngIf="monthlyUsage.length > 0" class="space-y-3">
        <div *ngFor="let month of monthlyUsage" 
             (click)="openModal(month)" 
             class="bg-[var(--tg-theme-bg-color,#ffffff)] p-4 rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm cursor-pointer hover:shadow-md active:scale-[0.98] transition-all flex justify-between items-center relative overflow-hidden animate-fade-in">
          
          <div class="relative z-10">
            <p class="font-bold text-lg text-[var(--tg-theme-text-color,#111827)]">{{ month.month }}, {{ month.year }}</p>
            <p class="text-sm text-[var(--tg-theme-hint-color,#6b7280)] flex items-center mt-0.5 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-[var(--tg-theme-button-color,#3b82f6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {{ month.usedElectricityKwh }} kWh Used
            </p>
          </div>
          
          <div class="text-right relative z-10">
            <p class="font-black text-red-500 text-lg">-৳{{ getDisplayTotal(month) }}</p>
            <p *ngIf="month.totalRecharge > 0" class="text-xs font-bold text-green-500 mt-0.5">Recharge: +৳{{ month.totalRecharge }}</p>
            <p *ngIf="!month.totalRecharge || month.totalRecharge == 0" class="text-xs font-medium text-[var(--tg-theme-hint-color,#6b7280)] mt-0.5">No Recharge</p>
          </div>
        </div>
      </div>

      <!-- Chart Detail Modal -->
      <div *ngIf="showChartModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
        <div class="bg-[var(--tg-theme-bg-color,#ffffff)] rounded-3xl w-full max-w-md shadow-2xl animate-fade-in overflow-hidden flex flex-col border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)]">
          
          <div class="px-5 py-4 border-b border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)]/50 flex justify-between items-center">
            <h3 class="text-xl font-bold text-[var(--tg-theme-text-color,#111827)]">Trend Analysis</h3>
            <button (click)="closeChartModal()" class="p-1.5 bg-[var(--tg-theme-secondary-bg-color,#e5e7eb)] text-[var(--tg-theme-hint-color,#6b7280)] rounded-full hover:text-red-500 active:scale-95 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-5 bg-[var(--tg-theme-bg-color,#ffffff)]">
            <div class="mb-2">
              <p class="text-sm font-bold text-[var(--tg-theme-hint-color,#6b7280)] uppercase tracking-wider">Cost vs Usage (Last 6 Months)</p>
            </div>

            <div class="relative h-72 w-full mt-2">
              <canvas #trendChart></canvas>
            </div>
          </div>
          
          <div class="p-4 border-t border-[var(--tg-theme-secondary-bg-color,#e5e7eb)]">
            <button (click)="closeChartModal()" class="w-full py-3 rounded-xl font-bold bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)] hover:opacity-80 active:scale-[0.98] transition-all">
              Close Chart
            </button>
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
            <div class="flex justify-between items-center mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
              <div>
                <p class="text-xs text-[var(--tg-theme-hint-color,#6b7280)] uppercase font-bold tracking-wider mb-0.5">Electricity Used</p>
                <p class="text-xl font-black text-emerald-600 dark:text-emerald-500">{{ selectedMonth.usedElectricityKwh }} kWh</p>
              </div>
              <div class="h-10 w-10 bg-emerald-100 dark:bg-emerald-800/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-500">
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
                <span class="font-black text-red-500 text-lg">৳{{ getDisplayTotal(selectedMonth) }}</span>
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
    .custom-scrollbar::-webkit-scrollbar { width: 0px; }
    .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class MeterMonthlyComponent {
  @Input() monthlyUsage: any[] = [];
  @Input() isLoading: boolean = false;

  @ViewChild('trendChart') chartCanvas!: ElementRef;
  chartInstance: any;

  selectedMonth: any = null;
  showChartModal: boolean = false;

  private tg = (window as any).Telegram?.WebApp;

  // Safely parse numbers from strings that might contain commas
  private parseAmount(val: any): number {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    return parseFloat(val.toString().replace(/,/g, '')) || 0;
  }

  // Fallback math in case NESCO returns 0 for the total
  getCalculatedTotal(month: any): number {
    if (!month) return 0;
    const elec = this.parseAmount(month.usedElectricityAmount);
    const rent = this.parseAmount(month.meterRent);
    const demand = this.parseAmount(month.demandCharge);
    const pfc = this.parseAmount(month.pfcCharge);
    const arrears = this.parseAmount(month.arrearsOrFine);
    const vat = this.parseAmount(month.vat || month.vatCharge);
    const rebate = this.parseAmount(month.rebate);

    const calc = (elec + rent + demand + pfc + arrears + vat);
    return calc > 0 ? calc : 0;
  }

  getDisplayTotal(month: any): string {
    if (!month) return '0.00';
    let total = this.parseAmount(month.totalUsageOrDeduction);
    if (total === 0) total = this.getCalculatedTotal(month);
    return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  get monthlyChartData() {
    if (!this.monthlyUsage || this.monthlyUsage.length === 0) return [];
    const data = this.monthlyUsage.slice(0, 6).reverse();

    return data.map(d => {
      let total = this.parseAmount(d.totalUsageOrDeduction);
      if (total === 0) total = this.getCalculatedTotal(d);

      return {
        label: d.month.substring(0, 3), // e.g., 'Jan', 'Feb'
        cost: total,
        kwh: this.parseAmount(d.usedElectricityKwh)
      };
    });
  }

  openChartModal() {
    if (this.tg?.HapticFeedback) {
      this.tg.HapticFeedback.selectionChanged();
    }
    this.showChartModal = true;

    // Allow Angular to render the canvas element before initializing Chart.js
    setTimeout(() => {
      this.renderChart();
    }, 50);
  }

  closeChartModal() {
    this.showChartModal = false;
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  renderChart() {
    if (!this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (this.chartInstance) this.chartInstance.destroy();

    const dataPoints = this.monthlyChartData;

    this.chartInstance = new Chart(ctx, {
      data: {
        labels: dataPoints.map(d => d.label),
        datasets: [
          {
            type: 'bar',
            label: 'Cost (৳)',
            data: dataPoints.map(d => d.cost),
            backgroundColor: '#3b82f6', // Telegram Theme Blue fallback
            borderRadius: 6,
            barPercentage: 0.6,
            yAxisID: 'y' // Left axis
          },
          {
            type: 'line',
            label: 'Usage (kWh)',
            data: dataPoints.map(d => d.kwh),
            borderColor: '#10b981', // Emerald Green
            backgroundColor: '#10b981',
            borderWidth: 2,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#10b981',
            pointBorderWidth: 2,
            pointRadius: 4,
            tension: 0.3, // Smooth curve
            yAxisID: 'y1' // Right axis
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              font: { family: 'sans-serif', size: 12 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleFont: { size: 13, family: 'sans-serif' },
            bodyFont: { size: 14, weight: 'bold', family: 'sans-serif' },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context: any) => {
                if (context.datasetIndex === 0) {
                  return ` Cost: ৳ ${context.parsed.y.toLocaleString()}`;
                } else {
                  return ` Usage: ${context.parsed.y.toLocaleString()} kWh`;
                }
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              font: { family: 'sans-serif', size: 12, weight: 'bold' },
              color: '#9ca3af'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            grid: { display: true, color: 'rgba(156, 163, 175, 0.1)' },
            border: { display: false },
            ticks: {
              font: { family: 'sans-serif', size: 10 },
              color: '#6b7280',
              callback: (value: any) => '৳' + value
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            grid: { drawOnChartArea: false }, // Prevent overlapping grid lines
            border: { display: false },
            ticks: {
              font: { family: 'sans-serif', size: 10 },
              color: '#10b981', // Match line color
              callback: (value: any) => value + ' kWh'
            }
          }
        }
      }
    });
  }

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