import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';
import { CourtService } from '../../core/services/court.service';
import { BookingService } from '../../core/services/booking.service';
import { Booking, BookingStatus } from '../../core/models/booking.model';

@Component({
  selector: 'app-dashboard',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatCardModule, MatIconModule, MatTableModule, MatChipsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule,
    MatButtonModule, MatTooltipModule, DatePipe, CurrencyPipe, FormsModule,
  ],
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

  private allBookings: Booking[] = [];
  recentBookings = new MatTableDataSource<Booking>();
  displayedColumns = ['client', 'court', 'startTime', 'totalPrice', 'status'];

  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;
  filterStatus: BookingStatus | '' = '';

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
        this.allBookings = bookings;
        this.applyFilter();
      }
    });
  }

  applyFilter() {
    let filtered = this.allBookings;

    if (this.filterStartDate) {
      const start = new Date(this.filterStartDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(b => new Date(b.startTime) >= start);
    }

    if (this.filterEndDate) {
      const end = new Date(this.filterEndDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(b => new Date(b.startTime) <= end);
    }

    if (this.filterStatus) {
      filtered = filtered.filter(b => b.status === this.filterStatus);
    }

    this.recentBookings.data = this.hasActiveFilter ? filtered : this.allBookings.slice(0, 5);
  }

  clearFilters() {
    this.filterStartDate = null;
    this.filterEndDate = null;
    this.filterStatus = '';
    this.applyFilter();
  }

  get hasActiveFilter(): boolean {
    return !!this.filterStartDate || !!this.filterEndDate || !!this.filterStatus;
  }

  statusLabel(s: string): string {
    const labels: Record<string, string> = { CONFIRMED: 'Confirmada', CANCELLED: 'Cancelada', COMPLETED: 'Concluída' };
    return labels[s] ?? s;
  }
}
