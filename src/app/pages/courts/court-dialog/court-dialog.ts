import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Court } from '../../../core/models/court.model';

export interface CourtDialogData {
  court?: Court;
}

@Component({
  selector: 'app-court-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './court-dialog.html'
})
export class CourtDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CourtDialog>);
  data: CourtDialogData = inject(MAT_DIALOG_DATA);

  isEdit = !!this.data?.court;

  form = this.fb.group({
    name: [this.data?.court?.name ?? '', Validators.required],
    description: [this.data?.court?.description ?? '', Validators.required],
    sportType: [this.data?.court?.sportType ?? '', Validators.required],
    pricePerHour: [this.data?.court?.pricePerHour ?? null, [Validators.required, Validators.min(0.01)]]
  });

  save() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel() {
    this.dialogRef.close();
  }
}
