import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Planta } from '../plantes/planta';
import { environment } from '../../environments/environment';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';

type PlantaInsertInput = Omit<Planta, 'id' | 'user'>;
type DbPlanta = Omit<Planta, 'user'> & { usuari: string };

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

  async getPlantesFromCurrentUser() {
    const { data: authData, error: authError } = await this.supabase.auth.getUser();
    if (authError || !authData.user) {
      throw new Error(authError?.message ?? 'No authenticated user');
    }

    const userEmail = authData.user.email ?? authData.user.id;

    const { data, error } = await this.supabase
      .from('plantes')
      .select('*')
      .eq('usuari', authData.user.id)
      .order('id', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return ((data ?? []) as DbPlanta[]).map((planta) => ({
      id: planta.id,
      created_at: planta.created_at,
      nom: planta.nom,
      ubicacio: planta.ubicacio,
      capacitat: planta.capacitat,
      user: userEmail,
      foto: planta.foto,
      favorite: planta.favorite,
    }));
  }

  async insertPlantaForCurrentUser(planta: PlantaInsertInput) {
    const { data: authData, error: authError } = await this.supabase.auth.getUser();
    if (authError || !authData.user) {
      throw new Error(authError?.message ?? 'No authenticated user');
    }

    const userEmail = authData.user.email ?? authData.user.id;

    const createdAtValue =
      typeof planta.created_at === 'number'
        ? new Date(planta.created_at * 1000).toISOString()
        : planta.created_at;

    const payload = {
      ...planta,
      created_at: createdAtValue,
      usuari: authData.user.id,
    };

    const { data, error } = await this.supabase
      .from('plantes')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const dbRow = data as DbPlanta;
    return {
      id: dbRow.id,
      created_at: dbRow.created_at,
      nom: dbRow.nom,
      ubicacio: dbRow.ubicacio,
      capacitat: dbRow.capacitat,
      user: userEmail,
      foto: dbRow.foto,
      favorite: dbRow.favorite,
    };
  }

  async updatePlantaForCurrentUser(id: number, planta: PlantaInsertInput) {
    const { data: authData, error: authError } = await this.supabase.auth.getUser();
    if (authError || !authData.user) {
      throw new Error(authError?.message ?? 'No authenticated user');
    }

    const userEmail = authData.user.email ?? authData.user.id;
    const createdAtValue =
      typeof planta.created_at === 'number'
        ? new Date(planta.created_at * 1000).toISOString()
        : planta.created_at;

    const payload = {
      ...planta,
      created_at: createdAtValue,
    };

    const { data, error } = await this.supabase
      .from('plantes')
      .update(payload)
      .eq('id', id)
      .eq('usuari', authData.user.id)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const dbRow = data as DbPlanta;
    return {
      id: dbRow.id,
      created_at: dbRow.created_at,
      nom: dbRow.nom,
      ubicacio: dbRow.ubicacio,
      capacitat: dbRow.capacitat,
      user: userEmail,
      foto: dbRow.foto,
      favorite: dbRow.favorite,
    };
  }

  async deletePlantaForCurrentUser(id: number) {
    const { data: authData, error: authError } = await this.supabase.auth.getUser();
    if (authError || !authData.user) {
      throw new Error(authError?.message ?? 'No authenticated user');
    }

    const { error } = await this.supabase
      .from('plantes')
      .delete()
      .eq('id', id)
      .eq('usuari', authData.user.id);

    if (error) {
      throw new Error(error.message);
    }
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
