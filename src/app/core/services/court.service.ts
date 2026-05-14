import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Court, CourtRequest, CourtStatus } from '../models/court.model';

@Injectable({ providedIn: 'root' })
export class CourtService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/courts`;

  findAll() {
    return this.http.get<Court[]>(this.base);
  }

  findById(id: number) {
    return this.http.get<Court>(`${this.base}/${id}`);
  }

  create(request: CourtRequest) {
    return this.http.post<Court>(this.base, request);
  }

  update(id: number, request: CourtRequest) {
    return this.http.put<Court>(`${this.base}/${id}`, request);
  }

  changeStatus(id: number, status: CourtStatus) {
    return this.http.patch<Court>(
      `${this.base}/${id}/status`,
      JSON.stringify(status),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
}
