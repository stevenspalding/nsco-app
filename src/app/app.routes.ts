import { Routes } from '@angular/router';
import { MeterListComponent } from './components/meter-list/meter-list.component';
import { MeterDetailComponent } from './components/meter-detail/meter-detail.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', component: MeterListComponent },
  { path: 'meter/:id', component: MeterDetailComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '**', redirectTo: '' } // Catch-all fallback
];
