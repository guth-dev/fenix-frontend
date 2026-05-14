import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models/client.model';
import { ClientDialog } from './client-dialog/client-dialog';

@Component({
  selector: 'app-clients',
  imports: [
    MatTableModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatCardModule, MatDialogModule, MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.scss'
})
export class Clients implements OnInit {
  private service = inject(ClientService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  dataSource = new MatTableDataSource<Client>();
  displayedColumns = ['name', 'email', 'phone', 'cpf', 'status', 'actions'];

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.findAll().subscribe(data => this.dataSource.data = data);
  }

  openCreate() {
    this.dialog.open(ClientDialog, { width: '480px', data: {} }).afterClosed().subscribe(result => {
      if (!result) return;
      this.service.create(result).subscribe({
        next: () => { this.snackBar.open('Cliente cadastrado!', '', { duration: 3000 }); this.load(); },
        error: (err) => this.snackBar.open(err.error?.message ?? 'Erro ao cadastrar.', 'Fechar', { duration: 4000 })
      });
    });
  }

  openEdit(client: Client) {
    this.dialog.open(ClientDialog, { width: '480px', data: { client } }).afterClosed().subscribe(result => {
      if (!result) return;
      this.service.update(client.id, result).subscribe({
        next: () => { this.snackBar.open('Cliente atualizado!', '', { duration: 3000 }); this.load(); },
        error: (err) => this.snackBar.open(err.error?.message ?? 'Erro ao atualizar.', 'Fechar', { duration: 4000 })
      });
    });
  }

  toggleStatus(client: Client) {
    const next = client.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.service.changeStatus(client.id, next).subscribe({
      next: () => { this.snackBar.open('Status atualizado!', '', { duration: 3000 }); this.load(); },
      error: () => this.snackBar.open('Erro ao alterar status.', 'Fechar', { duration: 4000 })
    });
  }
}
