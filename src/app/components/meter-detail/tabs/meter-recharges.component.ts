import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

declare global { interface Window { Telegram: any; } }

@Component({
  selector: 'app-meter-recharges',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-3">

      <!-- Loading State -->
      <div *ngIf="isLoading && recharges.length === 0" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--tg-theme-button-color,#3b82f6)]"></div>
      </div>

      <!-- Recharge List -->
      <div *ngFor="let row of recharges"
           (click)="openRechargeModal(row)"
           class="bg-[var(--tg-theme-bg-color,#ffffff)] p-3.5 rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] shadow-sm cursor-pointer hover:shadow-md active:scale-[0.98] transition-all">

        <div class="flex justify-between items-center border-b border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] pb-2 mb-2">
          <div class="flex items-center space-x-1.5" title="{{ row.remoteRechargeStatus || 'Unknown' }}">
            <span class="font-bold text-sm text-[var(--tg-theme-hint-color,#6b7280)]">{{ row.rechargeDate }}</span>
            <ng-container [ngSwitch]="getStatusType(row.remoteRechargeStatus)">
              <svg *ngSwitchCase="'success'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <svg *ngSwitchCase="'error'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <svg *ngSwitchCase="'executing'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <svg *ngSwitchCase="'unsend'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
              </svg>
              <svg *ngSwitchDefault xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[var(--tg-theme-hint-color,#6b7280)]" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
            </ng-container>
          </div>
          <span class="font-black text-green-500 text-lg">৳{{ row.rechargeAmount }}</span>
        </div>

        <div class="flex justify-between items-center text-sm">
          <span class="text-[var(--tg-theme-hint-color,#6b7280)]">Charges: <span class="font-bold text-red-500">-৳{{ getTotalCharges(row) | number:'1.2-2' }}</span></span>
          <span class="text-[var(--tg-theme-hint-color,#6b7280)]">Meter Added: <span class="font-bold text-[var(--tg-theme-text-color,#111827)]">৳{{ row.electricityCharge }}</span></span>
        </div>
      </div>

      <div *ngIf="!isLoading && recharges?.length === 0" class="text-center p-6 bg-[var(--tg-theme-bg-color,#ffffff)] rounded-2xl border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)]">
        <p class="text-sm text-[var(--tg-theme-hint-color,#6b7280)]">No recharges found.</p>
      </div>
    </div>

    <!-- Recharge Details Modal -->
    <div *ngIf="selectedRecharge" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div class="bg-[var(--tg-theme-bg-color,#ffffff)] w-full max-w-md sm:rounded-3xl rounded-t-3xl sm:m-4 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up sm:animate-fade-in">
        <div class="px-5 py-4 border-b border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] flex justify-between items-center bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)]/30">
          <h3 class="text-lg font-bold text-[var(--tg-theme-text-color,#111827)]">Recharge Details</h3>
          <button (click)="closeRechargeModal()" class="p-1.5 rounded-full bg-[var(--tg-theme-secondary-bg-color,#e5e7eb)] text-[var(--tg-theme-hint-color,#6b7280)] hover:text-red-500 active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div class="overflow-y-auto p-5 space-y-6">
          <div class="text-center space-y-1 mb-2">
            <p class="text-[var(--tg-theme-hint-color,#6b7280)] text-xs uppercase tracking-widest font-semibold">Total Paid</p>
            <p class="text-5xl font-black text-green-500 tracking-tight">৳{{ selectedRecharge.rechargeAmount }}</p>
          </div>
          <div class="flex justify-between items-center px-1">
            <p class="text-[10px] text-[var(--tg-theme-hint-color,#6b7280)] font-bold uppercase tracking-widest">Remote Recharge Status</p>
            <span [class]="'inline-flex items-center text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm ' + getBadgeColor(selectedRecharge.remoteRechargeStatus)">
               {{ selectedRecharge.remoteRechargeStatus || 'UNKNOWN' }}
            </span>
          </div>

          <div class="bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] rounded-2xl p-4 space-y-3 shadow-inner border border-[var(--tg-theme-secondary-bg-color,#e5e7eb)]">
            <div class="flex justify-between items-center">
              <span class="text-[var(--tg-theme-hint-color,#6b7280)] text-sm">Date</span>
              <span class="font-bold text-[var(--tg-theme-text-color,#111827)] text-sm">{{ selectedRecharge.rechargeDate }}</span>
            </div>
            <div *ngIf="selectedRecharge.tokenNo" class="mt-3 mb-2 p-3 bg-[var(--tg-theme-bg-color,#ffffff)] rounded-xl border border-[var(--tg-theme-button-color,#3b82f6)]/40 flex flex-col shadow-sm">
              <div class="flex items-center space-x-2 mb-1">
                <span class="text-[var(--tg-theme-button-color,#3b82f6)] text-[10px] uppercase tracking-wider font-bold">Token Number</span>
                <button (click)="copyToken(selectedRecharge.tokenNo)" class="text-[var(--tg-theme-button-color,#3b82f6)] p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded active:scale-95 transition-all" title="Copy Token">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <span class="font-mono font-black text-[var(--tg-theme-text-color,#111827)] text-lg tracking-widest">{{ selectedRecharge.tokenNo }}</span>
            </div>
            <div class="h-px w-full bg-[var(--tg-theme-bg-color,#ffffff)] opacity-50 my-1"></div>
            <div class="flex justify-between items-center" *ngIf="selectedRecharge.rechargeMedium">
              <span class="text-[var(--tg-theme-hint-color,#6b7280)] text-sm">Medium</span>
              <span class="font-medium text-[var(--tg-theme-text-color,#111827)] text-sm">{{ selectedRecharge.rechargeMedium }}</span>
            </div>
            <div class="flex justify-between items-center" *ngIf="selectedRecharge.seqNo">
              <span class="text-[var(--tg-theme-hint-color,#6b7280)] text-sm">Seq No.</span>
              <span class="font-medium text-[var(--tg-theme-text-color,#111827)] text-sm">{{ selectedRecharge.seqNo }}</span>
            </div>
            <div class="h-px w-full bg-[var(--tg-theme-bg-color,#ffffff)] opacity-50 my-1"></div>
            <div class="flex justify-between items-center">
              <span class="text-[var(--tg-theme-hint-color,#6b7280)] text-sm">Meter Rent</span>
              <span class="font-semibold text-red-500 text-sm">৳{{ selectedRecharge.meterRent || '0' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[var(--tg-theme-hint-color,#6b7280)] text-sm">Demand Charge</span>
              <span class="font-semibold text-red-500 text-sm">৳{{ selectedRecharge.demandCharge || '0' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[var(--tg-theme-hint-color,#6b7280)] text-sm">PFC Charge</span>
              <span class="font-semibold text-red-500 text-sm">৳{{ selectedRecharge.pfcCharge || '0' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[var(--tg-theme-hint-color,#6b7280)] text-sm">VAT</span>
              <span class="font-semibold text-red-500 text-sm">৳{{ selectedRecharge.vat || selectedRecharge.vatCharge || '0' }}</span>
            </div>
            <div class="flex justify-between items-center" *ngIf="selectedRecharge.arrearsOrFine && selectedRecharge.arrearsOrFine !== '0'">
              <span class="text-[var(--tg-theme-hint-color,#6b7280)] text-sm">Arrears/Fine</span>
              <span class="font-semibold text-red-500 text-sm">৳{{ selectedRecharge.arrearsOrFine }}</span>
            </div>
            <div class="flex justify-between items-center" *ngIf="selectedRecharge.rebate && selectedRecharge.rebate !== '0'">
              <span class="text-[var(--tg-theme-hint-color,#6b7280)] text-sm">Rebate</span>
              <span class="font-semibold text-green-500 text-sm">৳{{ selectedRecharge.rebate }}</span>
            </div>
            <div class="h-px w-full bg-[var(--tg-theme-bg-color,#ffffff)] opacity-50 my-1"></div>
            <div class="flex justify-between items-center" *ngIf="selectedRecharge.estimatedEnergyKwh">
              <span class="text-[var(--tg-theme-hint-color,#6b7280)] text-sm">Estimated Energy</span>
              <span class="font-bold text-[var(--tg-theme-button-color,#3b82f6)] text-sm">{{ selectedRecharge.estimatedEnergyKwh }} kWh</span>
            </div>
            <div class="flex justify-between items-center pt-1">
              <span class="font-bold text-[var(--tg-theme-text-color,#111827)] text-sm">Electricity Added</span>
              <span class="font-black text-green-500 text-xl">৳{{ selectedRecharge.electricityCharge || '0' }}</span>
            </div>
          </div>
        </div>

        <div class="p-4 bg-[var(--tg-theme-bg-color,#ffffff)] border-t border-[var(--tg-theme-secondary-bg-color,#e5e7eb)] pb-safe">
          <button (click)="closeRechargeModal()" class="w-full py-3.5 rounded-xl font-bold bg-[var(--tg-theme-secondary-bg-color,#f3f4f6)] text-[var(--tg-theme-text-color,#111827)] hover:opacity-80 active:scale-[0.98] transition-all">Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    .pb-safe { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
  `]
})
export class MeterRechargesComponent {
  @Input() recharges: any[] = [];
  @Input() isLoading: boolean = false;

  selectedRecharge: any = null;

  private tg = (window as any).Telegram?.WebApp;

  openRechargeModal(row: any) {
    if (this.tg?.HapticFeedback) this.tg.HapticFeedback.selectionChanged();
    this.selectedRecharge = row;
  }

  closeRechargeModal() {
    if (this.tg?.HapticFeedback) this.tg.HapticFeedback.selectionChanged();
    this.selectedRecharge = null;
  }

  copyToken(token: string) {
    if (!token) return;
    navigator.clipboard.writeText(token).then(() => {
      if (this.tg?.HapticFeedback) this.tg.HapticFeedback.notificationOccurred('success');
    }).catch(err => console.error('Could not copy text: ', err));
  }

  getTotalCharges(row: any): number {
    return (parseFloat(row.meterRent) || 0) + (parseFloat(row.demandCharge) || 0) + (parseFloat(row.vat || row.vatCharge) || 0);
  }

  getStatusType(status: string | undefined): string {
    if (!status) return 'unknown';
    const s = status.toLowerCase();
    if (s.includes('success')) return 'success';
    if (s.includes('fail') || s.includes('error')) return 'error';
    if (s.includes('execut')) return 'executing';
    if (s.includes('unsend')) return 'unsend';
    return 'unknown';
  }

  getBadgeColor(status: string | undefined): string {
    const type = this.getStatusType(status);
    switch (type) {
      case 'success': return 'bg-green-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      case 'executing': return 'bg-blue-500 text-white';
      case 'unsend': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }
}
