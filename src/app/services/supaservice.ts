import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Planta } from '../plantes/planta';
import { environment } from '../../environments/environment';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class Supaservice {
  private http = inject(HttpClient);
  private supabase: SupabaseClient;
  private currentUser = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.initializeAuthState();
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

  private async initializeAuthState() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      this.currentUser.set(null);
      return;
    }
    this.currentUser.set(data.user ?? null);
  }

  getEcho(data: string) {
    return data;
  }

  getPlantes(): Observable<Planta[]> {
    return this.http.get<Planta[]>(environment.supabaseUrl + '/rest/v1/plantes?select=*', {
      headers: new HttpHeaders({
        apikey: environment.supabaseKey,
        Authorization: `Bearer ${environment.supabaseKey}`,
      }),
    });
  }

  async login(loginData: { email: string; password: string }) {
    let { data, error } = await this.supabase.auth.signInWithPassword(loginData);
    if (error) {
      throw error;
    }
    this.currentUser.set(data.user ?? null);
    return data;
  }

  async signup(signupData: { email: string; password: string; fullName?: string }) {
    const options = signupData.fullName ? { data: { full_name: signupData.fullName } } : undefined;
    const { data, error } = await this.supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options,
    });
    if (error) {
      throw error;
    }
    return data;
  }

  getCurrentUser() {
    return this.supabase.auth.getUser();
  }

  isLoggedIn() {
    return this.currentUser() !== null;
  }

  async logout() {
    const result = await this.supabase.auth.signOut();
    if (!result.error) {
      this.currentUser.set(null);
    }
    return result;
  }
}
