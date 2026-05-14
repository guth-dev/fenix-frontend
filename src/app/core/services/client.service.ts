import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Client, ClientRequest, ClientStatus } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/clients`;

  findAll() {
    return this.http.get<Client[]>(this.base);
  }

  findById(id: number) {
    return this.http.get<Client>(`${this.base}/${id}`);
  }

  create(request: ClientRequest) {
    return this.http.post<Client>(this.base, request);
  }

  update(id: number, request: ClientRequest) {
    return this.http.put<Client>(`${this.base}/${id}`, request);
  }

  changeStatus(id: number, status: ClientStatus) {
    return this.http.patch<Client>(
      `${this.base}/${id}/status`,
      JSON.stringify(status),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
}
