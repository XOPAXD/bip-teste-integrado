import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../models/beneficio.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-beneficio-list',
  templateUrl: './beneficio-list.component.html',
  styleUrls: ['./beneficio-list.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class BeneficioListComponent implements OnInit {
  showErrorModal = false;
  errorMessage = '';

  beneficios: Beneficio[] = [];

  fromId!: number;
  toId!: number;
  valorTransferencia: number = 0;

  constructor(private service: BeneficioService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.listar().subscribe({
      next: (dados) => {
        this.beneficios = dados;
        this.cdr.detectChanges();
        console.log('Saldos carregados com sucesso!');
      },
      error: (err) => {
        this.beneficios = [];
        console.error('Erro ao carregar saldos automaticamente', err);
      }
    });
  }

  executarTransferencia() {
    this.service.transferir(this.fromId, this.toId, this.valorTransferencia).subscribe({
      next: () => {
        alert('Transferência realizada com sucesso!');
        this.carregar();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.error || 'Erro inesperado na transação.';
        this.showErrorModal = true;
      }
    });
  }

  closeModal() {
    this.showErrorModal = false;
  }
}
