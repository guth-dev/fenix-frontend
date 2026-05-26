import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ClientService } from '../../../core/services/client.service';
import { CourtService } from '../../../core/services/court.service';
import { Client } from '../../../core/models/client.model';
import { Court } from '../../../core/models/court.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-booking-dialog',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule
  ],
  templateUrl: './booking-dialog.html',
  styles: [`
    .dialog-form { display: flex; flex-direction: column; gap: 4px; min-width: 400px; }
    .full-width { width: 100%; }
    .date-time-row { display: flex; gap: 12px; }
    .date-field { flex: 1; }
    .time-field { width: 130px; }
  `]
})
export class BookingDialog implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<BookingDialog>);
  private clientService = inject(ClientService);
  private courtService = inject(CourtService);

  clients: Client[] = [];
  courts: Court[] = [];
  paymentMethods = [
    { value: 'PIX', label: 'PIX' },
    { value: 'CARD', label: 'Cartão' },
    { value: 'CASH', label: 'Dinheiro' }
  ];

  minDate = new Date();
  timeSlots = this.generateTimeSlots();

  form = this.fb.group({
    clientId: [null as number | null, Validators.required],
    courtId: [null as number | null, Validators.required],
    startDate: [null as Date | null, Validators.required],
    startHour: ['', Validators.required],
    endDate: [null as Date | null, Validators.required],
    endHour: ['', Validators.required],
    paymentMethod: ['', Validators.required]
  });

  ngOnInit() {
    forkJoin({
      clients: this.clientService.findAll(),
      courts: this.courtService.findAll()
    }).subscribe(({ clients, courts }) => {
      this.clients = clients.filter(c => c.status === 'ACTIVE');
      this.courts = courts.filter(c => c.status === 'ACTIVE');
    });

    this.form.get('startDate')!.valueChanges.subscribe(startDate => {
      const endDateCtrl = this.form.get('endDate')!;
      if (endDateCtrl.value && startDate && endDateCtrl.value < startDate) {
        endDateCtrl.setValue(null);
        this.form.get('endHour')!.setValue('');
      }
    });

    this.form.get('startHour')!.valueChanges.subscribe(() => {
      const endHourCtrl = this.form.get('endHour')!;
      if (endHourCtrl.value && !this.availableEndTimes.find(s => s.value === endHourCtrl.value)) {
        endHourCtrl.setValue('');
      }
    });
  }

  get minEndDate(): Date {
    return this.form.get('startDate')?.value ?? this.minDate;
  }

  get availableEndTimes(): { value: string; label: string }[] {
    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;
    const startHour = this.form.get('startHour')?.value;

    if (startDate && endDate && this.isSameDay(startDate, endDate) && startHour) {
      return this.timeSlots.filter(slot => slot.value > startHour);
    }
    return this.timeSlots;
  }

  save() {
    if (this.form.invalid) return;
    const { clientId, courtId, startDate, startHour, endDate, endHour, paymentMethod } = this.form.value;
    this.dialogRef.close({
      clientId,
      courtId,
      paymentMethod,
      startTime: this.combineDateTime(startDate!, startHour!),
      endTime: this.combineDateTime(endDate!, endHour!)
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  private generateTimeSlots(): { value: string; label: string }[] {
    const slots = [];
    for (let h = 6; h < 24; h++) {
      for (const m of [0, 30]) {
        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        slots.push({ value: `${hh}:${mm}`, label: `${hh}:${mm}` });
      }
    }
    return slots;
  }

  private combineDateTime(date: Date, time: string): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${time}:00`;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }
}
