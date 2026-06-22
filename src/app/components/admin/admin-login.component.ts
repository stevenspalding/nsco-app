import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4 font-sans text-white">
      <div class="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700">

        <div class="flex justify-center mb-6">
          <div class="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h2 class="text-3xl font-black text-center mb-2 tracking-tight">Admin Portal</h2>
        <p class="text-center text-gray-400 text-sm mb-8">Secure login required.</p>

        <div *ngIf="error" class="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm font-medium text-center">
          {{ error }}
        </div>

        <form (ngSubmit)="onLogin()" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
                   class="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required
                   class="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
          </div>

          <button type="submit" [disabled]="isLoading"
                  class="w-full py-3.5 rounded-xl font-bold bg-blue-600 text-white mt-4 disabled:opacity-50 hover:bg-blue-500 active:scale-[0.98] transition-all flex justify-center items-center">
            <span *ngIf="!isLoading">Secure Login</span>
            <svg *ngIf="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </button>
        </form>

      </div>
    </div>
  `
})
export class AdminLoginComponent {
  email = '';
  password = '';
  isLoading = false;
  error = '';

  constructor(private adminService: AdminService, private router: Router) { }

  onLogin() {
    if (!this.email || !this.password) return;
    this.isLoading = true;
    this.error = '';

    this.adminService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Authentication failed. Invalid credentials or no access.';
        console.error(err);
      }
    });
  }
}
