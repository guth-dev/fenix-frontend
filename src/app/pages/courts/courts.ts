import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { CurrencyPipe } from '@angular/common';
import { CourtService } from '../../core/services/court.service';
import { Court, CourtStatus } from '../../core/models/court.model';
import { CourtDialog } from './court-dialog/court-dialog';

@Component({
  selector: 'app-courts',
  imports: [
    MatTableModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatCardModule, MatDialogModule, MatSnackBarModule, MatTooltipModule,
    MatMenuModule, CurrencyPipe
  ],
  templateUrl: './courts.html',
  styleUrl: './courts.scss'
})
export class Courts implements OnInit {
  private service = inject(CourtService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  dataSource = new MatTableDataSource<Court>();
  displayedColumns = ['name', 'sportType', 'pricePerHour', 'status', 'actions'];

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.findAll().subscribe(data => this.dataSource.data = data);
  }

  openCreate() {
    this.dialog.open(CourtDialog, { width: '480px', data: {} }).afterClosed().subscribe(result => {
      if (!result) return;
      this.service.create(result).subscribe({
        next: () => { this.snackBar.open('Quadra cadastrada!', '', { duration: 3000 }); this.load(); },
        error: (err) => this.snackBar.open(err.error?.message ?? 'Erro ao cadastrar.', 'Fechar', { duration: 4000 })
      });
    });
  }

  openEdit(court: Court) {
    this.dialog.open(CourtDialog, { width: '480px', data: { court } }).afterClosed().subscribe(result => {
      if (!result) return;
      this.service.update(court.id, result).subscribe({
        next: () => { this.snackBar.open('Quadra atualizada!', '', { duration: 3000 }); this.load(); },
        error: (err) => this.snackBar.open(err.error?.message ?? 'Erro ao atualizar.', 'Fechar', { duration: 4000 })
      });
    });
  }

  changeStatus(court: Court, status: CourtStatus) {
    this.service.changeStatus(court.id, status).subscribe({
      next: () => { this.snackBar.open('Status atualizado!', '', { duration: 3000 }); this.load(); },
      error: () => this.snackBar.open('Erro ao alterar status.', 'Fechar', { duration: 4000 })
    });
  }

  statusLabel(s: CourtStatus): string {
    const labels: Record<CourtStatus, string> = { ACTIVE: 'Ativa', INACTIVE: 'Inativa', MAINTENANCE: 'Manutenção' };
    return labels[s];
  }
}
