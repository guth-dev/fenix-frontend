import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Booking, BookingRequest } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/api/bookings`;

  findAll() {
    return this.http.get<Booking[]>(this.base);
  }

  findByClient(clientId: number) {
    return this.http.get<Booking[]>(`${this.base}/client/${clientId}`);
  }

  findByCourt(courtId: number) {
    return this.http.get<Booking[]>(`${this.base}/court/${courtId}`);
  }

  create(request: BookingRequest) {
    return this.http.post<Booking>(this.base, request);
  }

  cancel(id: number) {
    return this.http.patch<Booking>(`${this.base}/${id}/cancel`, null);
  }

  complete(id: number) {
    return this.http.patch<Booking>(`${this.base}/${id}/complete`, null);
  }
}
