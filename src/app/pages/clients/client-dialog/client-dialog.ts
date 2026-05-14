import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Client } from '../../../core/models/client.model';

export interface ClientDialogData {
  client?: Client;
}

@Component({
  selector: 'app-client-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './client-dialog.html'
})
export class ClientDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ClientDialog>);
  data: ClientDialogData = inject(MAT_DIALOG_DATA);

  isEdit = !!this.data?.client;

  form = this.fb.group({
    name: [this.data?.client?.name ?? '', Validators.required],
    email: [this.data?.client?.email ?? '', [Validators.required, Validators.email]],
    phone: [this.data?.client?.phone ?? '', Validators.required],
    cpf: [this.data?.client?.cpf ?? '', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]]
  });

  save() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel() {
    this.dialogRef.close();
  }
}
