import { Component, inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { BookingService } from '../../core/services/booking.service';
import { CourtService } from '../../core/services/court.service';
import { Booking, BookingStatus } from '../../core/models/booking.model';
import { Court } from '../../core/models/court.model';
import { BookingDialog } from './booking-dialog/booking-dialog';

const STATUS_COLORS: Record<BookingStatus, string> = {
  CONFIRMED: '#2e7d32',
  CANCELLED: '#c62828',
  COMPLETED: '#1565c0',
};

@Component({
  selector: 'app-bookings',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatTableModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatCardModule, MatDialogModule, MatSnackBarModule, MatTooltipModule,
    MatButtonToggleModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, DatePipe, CurrencyPipe, FormsModule, FullCalendarModule,
  ],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss',
})
export class Bookings implements OnInit {
  private service = inject(BookingService);
  private courtService = inject(CourtService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private eventDialogRef: MatDialogRef<unknown> | null = null;

  @ViewChild('eventDetailTpl') eventDetailTpl!: TemplateRef<unknown>;

  private allBookings: Booking[] = [];
  dataSource = new MatTableDataSource<Booking>();
  displayedColumns = ['client', 'court', 'startTime', 'endTime', 'totalPrice', 'paymentMethod', 'status', 'actions'];
  activeView: 'list' | 'calendar' = 'list';

  courts: Court[] = [];
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;
  filterStatus: BookingStatus | '' = '';
  filterCourtId: number | '' = '';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    locale: ptBrLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    buttonText: { today: 'Hoje', month: 'Mês', week: 'Semana' },
    events: [],
    eventClick: (arg: EventClickArg) => this.onEventClick(arg),
    height: 'auto',
  };

  ngOnInit() {
    this.courtService.findAll().subscribe(courts => this.courts = courts);
    this.load();
  }

  load() {
    this.service.findAll().subscribe(data => {
      this.allBookings = data;
      this.applyFilter();
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

    if (this.filterCourtId) {
      filtered = filtered.filter(b => b.courtId === this.filterCourtId);
    }

    this.dataSource.data = filtered;
    this.calendarOptions = {
      ...this.calendarOptions,
      events: filtered.map(b => ({
        id: String(b.id),
        title: `${b.clientName} — ${b.courtName}`,
        start: b.startTime,
        end: b.endTime,
        color: STATUS_COLORS[b.status],
        extendedProps: { booking: b },
      })),
    };
  }

  clearFilters() {
    this.filterStartDate = null;
    this.filterEndDate = null;
    this.filterStatus = '';
    this.filterCourtId = '';
    this.applyFilter();
  }

  get hasActiveFilter(): boolean {
    return !!this.filterStartDate || !!this.filterEndDate || !!this.filterStatus || !!this.filterCourtId;
  }

  onEventClick(arg: EventClickArg) {
    const booking = arg.event.extendedProps['booking'] as Booking;
    this.eventDialogRef = this.dialog.open(this.eventDetailTpl, { data: booking, width: '420px' });
  }

  openCreate() {
    this.dialog.open(BookingDialog, { width: '520px' }).afterClosed().subscribe(result => {
      if (!result) return;
      this.service.create(result).subscribe({
        next: () => { this.snackBar.open('Reserva criada!', '', { duration: 3000 }); this.load(); },
        error: (err) => this.snackBar.open(err.error?.error ?? 'Erro ao criar reserva.', 'Fechar', { duration: 4000 }),
      });
    });
  }

  cancel(booking: Booking) {
    this.eventDialogRef?.close();
    this.service.cancel(booking.id).subscribe({
      next: () => { this.snackBar.open('Reserva cancelada.', '', { duration: 3000 }); this.load(); },
      error: (err) => this.snackBar.open(err.error?.error ?? 'Erro ao cancelar.', 'Fechar', { duration: 4000 }),
    });
  }

  complete(booking: Booking) {
    this.eventDialogRef?.close();
    this.service.complete(booking.id).subscribe({
      next: () => { this.snackBar.open('Reserva concluída!', '', { duration: 3000 }); this.load(); },
      error: (err) => this.snackBar.open(err.error?.error ?? 'Erro ao concluir.', 'Fechar', { duration: 4000 }),
    });
  }

  paymentLabel(p: string): string {
    const labels: Record<string, string> = { PIX: 'PIX', CARD: 'Cartão', CASH: 'Dinheiro' };
    return labels[p] ?? p;
  }

  statusLabel(s: string): string {
    const labels: Record<string, string> = { CONFIRMED: 'Confirmada', CANCELLED: 'Cancelada', COMPLETED: 'Concluída' };
    return labels[s] ?? s;
  }
}
