import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../../core/services/client.service';
import { CourtService } from '../../../core/services/court.service';
import { Client } from '../../../core/models/client.model';
import { Court } from '../../../core/models/court.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-booking-dialog',
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule
  ],
  templateUrl: './booking-dialog.html'
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

  form = this.fb.group({
    clientId: [null as number | null, Validators.required],
    courtId: [null as number | null, Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
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
  }

  save() {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.dialogRef.close({
      ...value,
      startTime: this.toIso(value.startTime!),
      endTime: this.toIso(value.endTime!)
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  private toIso(dt: string): string {
    return dt.length === 16 ? dt + ':00' : dt;
  }
}
