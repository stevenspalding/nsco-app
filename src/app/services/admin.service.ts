import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { environment } from '../../environments/environment';

// Initialize Firebase App
const app = initializeApp(environment.firebaseConfig);
const auth = getAuth(app);

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl.replace('/api', '/api/admin');
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    onAuthStateChanged(auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  login(email: string, pass: string): Observable<any> {
    return from(signInWithEmailAndPassword(auth, email, pass));
  }

  logout(): Observable<void> {
    return from(signOut(auth));
  }

  get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Helper to attach secure token to every request
  private async createPayload(action: string, data: any = {}) {
    const user = auth.currentUser;
    if (!user) throw new Error('Not logged in');
    const idToken = await user.getIdToken(true);
    return { ...data, action, idToken };
  }

  getAllData(): Observable<any> {
    return from(this.createPayload('get_all_data')).pipe(
      switchMap(payload => this.http.post(this.apiUrl, payload))
    );
  }

  liveCheck(targetId: string): Observable<any> {
    return from(this.createPayload('live_check', { targetId })).pipe(
      switchMap(payload => this.http.post(this.apiUrl, payload))
    );
  }

  updateDisplayName(targetId: string, displayName: string): Observable<any> {
    return from(this.createPayload('update_name', { targetId, displayName })).pipe(
      switchMap(payload => this.http.post(this.apiUrl, payload))
    );
  }

  removeMeter(chatId: string, targetId: string): Observable<any> {
    return from(this.createPayload('remove_meter', { chatId, targetId })).pipe(
      switchMap(payload => this.http.post(this.apiUrl, payload))
    );
  }

  addMeter(chatId: string, targetId: string): Observable<any> {
    return from(this.createPayload('add_meter', { chatId, targetId })).pipe(
      switchMap(payload => this.http.post(this.apiUrl, payload))
    );
  }
}
