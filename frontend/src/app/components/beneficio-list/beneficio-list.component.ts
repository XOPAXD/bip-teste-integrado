import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../models/beneficio.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgxMaskDirective} from 'ngx-mask';

@Component({
  standalone: true,
  selector: 'app-beneficio-list',
  templateUrl: './beneficio-list.component.html',
  styleUrls: ['./beneficio-list.component.scss'],
  imports: [CommonModule, FormsModule, NgxMaskDirective]
})
export class BeneficioListComponent implements OnInit {
  showErrorModal = false;
  showSuccessModal = false;
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
    if (!this.fromId || !this.toId || !this.valorTransferencia || this.valorTransferencia <= 0) {
      this.showErrorModal = true;
      this.errorMessage = 'Por favor, preencha todos os campos de transferência com valores válidos.';
      this.cdr.detectChanges();
      return;
    }

    const valorNumerico = Number(this.valorTransferencia);

    this.service.transferir(this.fromId, this.toId, valorNumerico).subscribe({
      next: () => {
        this.showSuccessModal = true;
        this.cdr.detectChanges();
        this.carregar();

      },
      error: (err) => {
        this.showErrorModal = false;
        this.errorMessage = '';

        setTimeout(() => {
          this.showErrorModal = true;
          this.errorMessage = err.error?.message || err.error || 'Erro inesperado na transação.';
          this.cdr.detectChanges();
        }, 10);
      }
    });
  }

  closeModal() {
    this.showErrorModal = false;
    this.showSuccessModal = false;
  }

}
