import { Routes } from '@angular/router';
import { MeterListComponent } from './components/meter-list/meter-list.component';
import { MeterDetailComponent } from './components/meter-detail/meter-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminLoginComponent } from './components/admin/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { AdminLiveCheckComponent } from './components/admin/admin-live-check.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: MeterListComponent },
  { path: 'meter/:id', component: MeterDetailComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/live-check', component: AdminLiveCheckComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' } // Catch-all fallback
];
