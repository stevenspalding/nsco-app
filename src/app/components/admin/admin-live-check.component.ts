import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-live-check',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 text-gray-900 font-sans pb-10">

      <!-- Top Navigation -->
      <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center h-16">
            <button (click)="goBack()" class="mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div class="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center mr-3 shadow-sm shadow-green-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span class="text-xl font-black tracking-tight">Full Diagnostic Check</span>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        <!-- Search Box -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 items-center">
          <input type="number" [(ngModel)]="liveCheckId" placeholder="Enter Consumer ID (e.g., 11223344)" (keyup.enter)="runLiveCheck()"
                 class="flex-1 w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 transition-colors font-mono font-bold text-lg">
          <button (click)="runLiveCheck()" [disabled]="isChecking || !liveCheckId"
                  class="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px]">
            <span *ngIf="!isChecking">Run Check</span>
            <svg *ngIf="isChecking" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
          </button>
        </div>

        <div *ngIf="liveCheckError" class="text-sm font-bold text-red-500 bg-red-50 py-3 px-4 rounded-xl border border-red-100">
          {{ liveCheckError }}
        </div>

        <!-- Results Area -->
        <div *ngIf="liveResult" class="space-y-6 animate-fade-in">

          <!-- Customer Info -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 class="font-bold text-lg text-gray-900">Customer & Meter Info</h3>
              <span class="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded-md">Updated: {{ liveResult.customerInfo?.balanceUpdateTime || 'N/A' }}</span>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Customer Name</p>
                <p class="font-bold text-gray-900 text-lg">{{ liveResult.customerInfo?.customerName || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Balance</p>
                <p class="font-black text-blue-600 text-2xl">৳{{ liveResult.customerInfo?.remainingBalance || '0.00' }}</p>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Meter Number</p>
                <p class="font-mono font-bold text-gray-900">{{ liveResult.customerInfo?.meterNo || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <p class="font-bold" [ngClass]="liveResult.customerInfo?.meterStatus === 'Active' ? 'text-green-600' : 'text-red-500'">{{ liveResult.customerInfo?.meterStatus || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mobile</p>
                <p class="font-bold text-gray-900">{{ liveResult.customerInfo?.mobile || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">SND Office</p>
                <p class="font-bold text-gray-900">{{ liveResult.customerInfo?.sndOffice || 'N/A' }}</p>
              </div>
              <div class="col-span-1 md:col-span-2 lg:col-span-3">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Address</p>
                <p class="font-medium text-gray-900">{{ liveResult.customerInfo?.address || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- History Tables Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Recharge History -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
              <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 sticky top-0">
                <h3 class="font-bold text-lg text-gray-900">Recharge History</h3>
              </div>
              <div class="overflow-y-auto p-0">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50 sticky top-0">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200 text-sm">
                    <tr *ngFor="let row of liveResult.rechargeHistory" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ row.rechargeDate }}</td>
                      <td class="px-6 py-4 whitespace-nowrap font-black text-green-600">৳{{ row.rechargeAmount }}</td>
                      <td class="px-6 py-4 whitespace-nowrap font-bold text-gray-900">৳{{ row.electricityCharge }}</td>
                      <td class="px-6 py-4 whitespace-nowrap font-mono text-gray-500 text-xs">{{ row.tokenNo || 'N/A' }}</td>
                    </tr>
                    <tr *ngIf="!liveResult.rechargeHistory || liveResult.rechargeHistory.length === 0">
                      <td colspan="4" class="px-6 py-8 text-center text-gray-500">No recharge data available.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Monthly Usage -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
              <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 sticky top-0">
                <h3 class="font-bold text-lg text-gray-900">Monthly Usage</h3>
              </div>
              <div class="overflow-y-auto p-0">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50 sticky top-0">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage (KWh)</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deduction</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Balance</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200 text-sm">
                    <tr *ngFor="let row of liveResult.monthlyUsage" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{{ row.month }}, {{ row.year }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-gray-900">{{ row.usedElectricityKwh }}</td>
                      <td class="px-6 py-4 whitespace-nowrap font-bold text-red-500">-৳{{ row.totalUsageOrDeduction }}</td>
                      <td class="px-6 py-4 whitespace-nowrap font-black" [ngClass]="getParseAmount(row.monthEndBalance) < 0 ? 'text-red-500' : 'text-gray-900'">৳{{ row.monthEndBalance }}</td>
                    </tr>
                    <tr *ngIf="!liveResult.monthlyUsage || liveResult.monthlyUsage.length === 0">
                      <td colspan="4" class="px-6 py-8 text-center text-gray-500">No monthly data available.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <!-- Firebase Daily Usage History -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col max-h-[600px] mt-6">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 sticky top-0 flex justify-between items-center">
              <h3 class="font-bold text-lg text-gray-900">Recorded Daily Usage (Firebase)</h3>
              <span class="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg">{{ liveResult.firebaseHistory?.length || 0 }} Records</span>
            </div>
            <div class="overflow-y-auto p-0">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 sticky top-0">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Deduction</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recharge Added</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Balance</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Notified</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 text-sm">
                  <tr *ngFor="let row of liveResult.firebaseHistory" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ row.date }}</td>
                    <td class="px-6 py-4 whitespace-nowrap font-bold" [ngClass]="row.usage > 0 ? 'text-red-500' : 'text-gray-400'">
                      {{ row.usage > 0 ? '-৳' + row.usage : 'No Change' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap font-bold" [ngClass]="row.rechargeAdded > 0 ? 'text-green-600' : 'text-gray-400'">
                      {{ row.rechargeAdded > 0 ? '+৳' + row.rechargeAdded : '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap font-black text-gray-900">৳{{ row.balance }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <span *ngIf="row.notified" class="inline-flex items-center justify-center bg-green-100 text-green-600 rounded-full h-6 w-6" title="User Notified">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                      </span>
                      <span *ngIf="!row.notified" class="inline-flex items-center justify-center bg-gray-100 text-gray-400 rounded-full h-6 w-6" title="Silent Sync (Not Notified)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                      </span>
                    </td>
                  </tr>
                  <tr *ngIf="!liveResult.firebaseHistory || liveResult.firebaseHistory.length === 0">
                    <td colspan="5" class="px-6 py-8 text-center text-gray-500">No daily history recorded in Firebase.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class AdminLiveCheckComponent {
  liveCheckId = '';
  isChecking = false;
  liveResult: any = null;
  liveCheckError = '';

  constructor(private adminService: AdminService, private router: Router) { }

  runLiveCheck() {
    if (!this.liveCheckId) return;
    this.isChecking = true;
    this.liveCheckError = '';
    this.liveResult = null;

    this.adminService.liveCheck(this.liveCheckId.toString()).subscribe({
      next: (res) => {
        this.liveResult = res.data;
        this.isChecking = false;
      },
      error: (err) => {
        this.liveCheckError = err.error?.error || 'Invalid ID or Server Offline';
        this.isChecking = false;
      }
    });
  }

  getParseAmount(val: any): number {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    return parseFloat(val.toString().replace(/,/g, '')) || 0;
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
}
