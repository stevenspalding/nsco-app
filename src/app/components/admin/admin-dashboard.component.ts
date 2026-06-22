import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-900 text-gray-100 font-sans pb-10">

      <!-- Top Navigation -->
      <nav class="bg-gray-800 shadow-sm border-b border-gray-700 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span class="text-xl font-black tracking-tight text-white">Admin Console</span>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm font-medium text-gray-400 hidden sm:block">Secure Session Active</span>
              <button (click)="logout()" class="px-4 py-2 bg-red-900/20 text-red-400 font-bold rounded-lg hover:bg-red-900/40 border border-red-500/20 transition-colors text-sm">
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Tab Selectors -->
        <div class="flex space-x-1 bg-gray-800 p-1 rounded-xl mb-8 w-fit border border-gray-700 shadow-sm">
          <button class="bg-gray-700 shadow-sm px-5 py-2.5 rounded-lg text-sm font-bold transition-all text-white cursor-default">
            System Overview
          </button>
          <button (click)="goToLiveCheck()" class="text-gray-400 hover:bg-gray-700 hover:text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center">
            <span class="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Full Diagnostic Check
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>

        <!-- TAB: SYSTEM OVERVIEW -->
        <div *ngIf="!isLoading" class="space-y-8 animate-fade-in">

          <!-- Quick Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Users</p>
              <p class="text-4xl font-black text-white">{{ subscribers.length }}</p>
            </div>
            <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Meters Tracked</p>
              <p class="text-4xl font-black text-white">{{ accounts.length }}</p>
            </div>
            <div class="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Alerts</p>
              <p class="text-4xl font-black text-blue-500">{{ getActiveAlertsCount() }}</p>
            </div>
          </div>

          <!-- User Management Cards -->
          <div class="bg-gray-800 rounded-2xl border border-gray-700 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-700 bg-gray-800/50">
              <h3 class="font-bold text-lg text-white">User Database</h3>
            </div>
            <div class="divide-y divide-gray-700">
              <div *ngFor="let sub of subscribers" class="p-6 hover:bg-gray-700/30 transition-colors">

                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div class="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div class="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-400">
                      {{ sub.first_name?.[0] || '?' }}
                    </div>
                    <div>
                      <p class="font-bold text-white">{{ sub.first_name }} {{ sub.last_name }}</p>
                      <p class="text-xs text-gray-400 font-mono">ID: {{ sub.id }} <span *ngIf="sub.username">| &#64;{{ sub.username }}</span></p>
                    </div>
                  </div>

                  <div class="flex space-x-2 w-full sm:w-auto">
                    <input type="text" placeholder="Add Meter ID" [(ngModel)]="newMeterMap[sub.id]"
                           class="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-sm w-full sm:w-32 focus:ring-1 focus:border-blue-500 focus:ring-blue-500 outline-none placeholder-gray-500 transition-colors">
                    <button (click)="adminAddMeter(sub.id)" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">Add</button>
                  </div>
                </div>

                <div class="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tracked Meters ({{ sub.tracked_ids?.length || 0 }})</p>

                  <div *ngIf="!sub.tracked_ids || sub.tracked_ids.length === 0" class="text-sm text-gray-500 italic">No meters tracked.</div>

                  <div class="space-y-3">
                    <div *ngFor="let mId of sub.tracked_ids" class="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-sm">
                      <div class="mb-2 sm:mb-0">
                        <span class="font-mono font-bold text-white mr-2">{{ mId }}</span>
                        <span class="text-sm font-medium" [ngClass]="getAccount(mId)?.lastBalance < 100 ? 'text-red-400' : 'text-green-400'">
                          ৳{{ getAccount(mId)?.lastBalance || '0.00' }}
                        </span>
                      </div>

                      <div class="flex space-x-2">
                        <input type="text" [ngModel]="getAccount(mId)?.displayName || getAccount(mId)?.customerName" (blur)="updateName(mId, $event)" placeholder="Display Name"
                               class="bg-gray-900 border border-gray-700 text-white rounded-md px-2 py-1 text-sm w-full sm:w-40 focus:ring-1 focus:border-blue-500 focus:ring-blue-500 outline-none placeholder-gray-500 transition-colors">
                        <button (click)="adminRemoveMeter(sub.id, mId)" class="text-red-400 hover:text-white hover:bg-red-500 border border-red-500/50 hover:border-red-500 px-3 py-1 rounded-md text-xs font-bold transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
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
export class AdminDashboardComponent implements OnInit {
  isLoading = true;

  subscribers: any[] = [];
  accounts: any[] = [];

  newMeterMap: { [chatId: string]: string } = {};

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.adminService.getAllData().subscribe({
      next: (res) => {
        this.subscribers = res.subscribers || [];
        this.accounts = res.accounts || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        if (err.status === 401 || err.status === 403) this.logout();
      }
    });
  }

  getAccount(id: string) {
    return this.accounts.find(a => a.id === id) || {};
  }

  getActiveAlertsCount() {
    let count = 0;
    this.subscribers.forEach(sub => { if (sub.daily_updates !== false) count++; });
    return count;
  }

  updateName(meterId: string, event: any) {
    const newName = event.target.value;
    const acc = this.getAccount(meterId);
    if (acc && acc.displayName !== newName) {
      this.adminService.updateDisplayName(meterId, newName).subscribe(() => {
        acc.displayName = newName; // update local instantly
      });
    }
  }

  adminRemoveMeter(chatId: string, meterId: string) {
    if (confirm(`Remove meter ${meterId} from user ${chatId}?`)) {
      this.adminService.removeMeter(chatId, meterId).subscribe(() => {
        const sub = this.subscribers.find(s => s.id === chatId);
        if (sub) sub.tracked_ids = sub.tracked_ids.filter((id: string) => id !== meterId);
      });
    }
  }

  adminAddMeter(chatId: string) {
    const meterId = this.newMeterMap[chatId]?.trim();
    if (!meterId) return;
    this.adminService.addMeter(chatId, meterId).subscribe(() => {
      const sub = this.subscribers.find(s => s.id === chatId);
      if (sub) {
        if (!sub.tracked_ids) sub.tracked_ids = [];
        if (!sub.tracked_ids.includes(meterId)) sub.tracked_ids.push(meterId);
      }
      this.newMeterMap[chatId] = '';
    });
  }

  goToLiveCheck() {
    this.router.navigate(['/admin/live-check']);
  }

  logout() {
    this.adminService.logout().subscribe(() => {
      this.router.navigate(['/admin/login']);
    });
  }
}
