import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private initData = (window as any).Telegram?.WebApp?.initData || '';

  // Store the list in memory
  private cachedList: any[] | null = null;

  constructor(private http: HttpClient) { }

  getList(forceRefresh = false): Observable<any> {
    // Return cached data instantly if it exists and we are not forcing a refresh
    if (!forceRefresh && this.cachedList !== null) {
      return of({ accounts: this.cachedList });
    }

    // Otherwise, fetch from the server and cache it
    return this.http.post(this.apiUrl, { initData: this.initData, action: 'list' }).pipe(
      tap((res: any) => this.cachedList = res.accounts)
    );
  }

  // Used to clear the cache when data is modified (add/delete/sync)
  clearCache() {
    this.cachedList = null;
  }

  updateSettings(settings: any): Observable<any> {
    return this.http.post(this.apiUrl, { initData: this.initData, action: 'updateSettings', settings });
  }

  getDetails(targetId: string): Observable<any> {
    return this.http.post(this.apiUrl, { initData: this.initData, action: 'details', targetId });
  }

  getMonthlyUsage(targetId: string): Observable<any> {
    return this.http.post(this.apiUrl, { initData: this.initData, action: 'monthly', targetId });
  }

  addMeter(targetId: string): Observable<any> {
    return this.http.post(this.apiUrl, { initData: this.initData, action: 'add', targetId });
  }

  syncMeter(targetId: string): Observable<any> {
    return this.http.post(this.apiUrl, { initData: this.initData, action: 'sync', targetId });
  }

  updateDisplayName(targetId: string, displayName: string): Observable<any> {
    return this.http.post(this.apiUrl, { initData: this.initData, action: 'updateName', targetId, displayName });
  }

  deleteMeter(targetId: string): Observable<any> {
    return this.http.post(this.apiUrl, { initData: this.initData, action: 'delete', targetId });
  }
}
