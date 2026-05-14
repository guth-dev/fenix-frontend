import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { ClientService } from '../../core/services/client.service';
import { CourtService } from '../../core/services/court.service';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, MatTableModule, MatChipsModule, DatePipe, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private clientService = inject(ClientService);
  private courtService = inject(CourtService);
  private bookingService = inject(BookingService);

  totalActiveClients = 0;
  totalCourts = 0;
  confirmedBookings = 0;
  recentBookings = new MatTableDataSource<Booking>();
  displayedColumns = ['client', 'court', 'startTime', 'totalPrice', 'status'];

  ngOnInit() {
    this.clientService.findAll().subscribe({
      next: clients => this.totalActiveClients = clients.filter(c => c.status === 'ACTIVE').length
    });

    this.courtService.findAll().subscribe({
      next: courts => this.totalCourts = courts.length
    });

    this.bookingService.findAll().subscribe({
      next: bookings => {
        this.confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
        this.recentBookings.data = bookings.slice(0, 5);
      }
    });
  }
}
