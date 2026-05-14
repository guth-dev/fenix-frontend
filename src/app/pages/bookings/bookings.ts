import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';
import { BookingDialog } from './booking-dialog/booking-dialog';

@Component({
  selector: 'app-bookings',
  imports: [
    MatTableModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatCardModule, MatDialogModule, MatSnackBarModule, MatTooltipModule,
    DatePipe, CurrencyPipe
  ],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss'
})
export class Bookings implements OnInit {
  private service = inject(BookingService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  dataSource = new MatTableDataSource<Booking>();
  displayedColumns = ['client', 'court', 'startTime', 'endTime', 'totalPrice', 'paymentMethod', 'status', 'actions'];

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.findAll().subscribe(data => this.dataSource.data = data);
  }

  openCreate() {
    this.dialog.open(BookingDialog, { width: '520px' }).afterClosed().subscribe(result => {
      if (!result) return;
      this.service.create(result).subscribe({
        next: () => { this.snackBar.open('Reserva criada!', '', { duration: 3000 }); this.load(); },
        error: (err) => this.snackBar.open(err.error?.message ?? 'Erro ao criar reserva.', 'Fechar', { duration: 4000 })
      });
    });
  }

  cancel(booking: Booking) {
    this.service.cancel(booking.id).subscribe({
      next: () => { this.snackBar.open('Reserva cancelada.', '', { duration: 3000 }); this.load(); },
      error: (err) => this.snackBar.open(err.error?.message ?? 'Erro ao cancelar.', 'Fechar', { duration: 4000 })
    });
  }

  complete(booking: Booking) {
    this.service.complete(booking.id).subscribe({
      next: () => { this.snackBar.open('Reserva concluída!', '', { duration: 3000 }); this.load(); },
      error: (err) => this.snackBar.open(err.error?.message ?? 'Erro ao concluir.', 'Fechar', { duration: 4000 })
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
