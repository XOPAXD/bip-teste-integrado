import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../models/beneficio.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgxMaskDirective} from 'ngx-mask';
import {BeneficioFormComponent} from '../beneficio-form/beneficio-form.component';

@Component({
  standalone: true,
  selector: 'app-beneficio-list',
  templateUrl: './beneficio-list.component.html',
  styleUrls: ['./beneficio-list.component.scss'],
  imports: [CommonModule, FormsModule, NgxMaskDirective, BeneficioFormComponent]
})
export class BeneficioListComponent implements OnInit {
  showErrorModal = false;
  showSuccessModal = false;
  errorMessage = '';
  successTitle: string = 'Sucesso!';
  successMessage: string = '';
  successDetail: string = '';

  beneficios: Beneficio[] = [];

  fromId!: number;
  toId!: number;
  valorTransferencia: number = 0;
  beneficioSelecionado: Beneficio | null = null;

  showDeleteModal: boolean = false;
  idParaExcluir: number | null = null;
  nomeParaExcluir: string = '';

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
        this.cdr.detectChanges();
        this.successTitle = 'Sucesso!';
        this.successMessage = 'A transferência foi processada e confirmada pelo sistema.';
        this.successDetail = 'Comprovante gerado com sucesso.';
        this.showSuccessModal = true;
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

  prepararEdicao(b: Beneficio) {
    this.beneficioSelecionado = b;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  tratarSucessoCadastro() {
    const isEdicao = !!this.beneficioSelecionado?.id;

    this.successTitle = isEdicao ? 'Alteração Realizada!' : 'Cadastro Concluído!';
    this.successMessage = isEdicao
      ? 'Os dados do benefício foram atualizados com sucesso.'
      : 'O novo benefício foi registrado na base de dados.';
    this.successDetail = 'As alterações já foram refletidas.';

    this.showSuccessModal = true;
    this.carregar();
    this.limparSelecao();
    this.cdr.detectChanges();
  }

  tratarErroCadastro(mensagem: string) {
    this.showErrorModal = false;
    this.errorMessage = '';

    setTimeout(() => {
      this.showErrorModal = true;
      this.errorMessage = mensagem;
      this.cdr.detectChanges();
    }, 10);
  }

  confirmarExclusao(beneficio: any) {
    this.idParaExcluir = beneficio.id;
    this.nomeParaExcluir = beneficio.nome;
    this.showDeleteModal = true;
    this.cdr.detectChanges();
  }

  cancelarExclusao() {
    this.showDeleteModal = false;
    this.idParaExcluir = null;
  }

  executarExclusao() {
    if (this.idParaExcluir) {
      this.service.excluir(this.idParaExcluir).subscribe({
        next: () => {
          this.showDeleteModal = false;

          this.successTitle = 'Excluído com Sucesso';
          this.successMessage = `O benefício "${this.nomeParaExcluir}" foi removido do sistema.`;
          this.successDetail = 'A lista de saldos foi atualizada.';
          this.showSuccessModal = true;

          this.carregar();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.cdr.detectChanges();
          this.showDeleteModal = false;
          this.errorMessage = err.error?.message || 'Erro ao tentar excluir o benefício.';
          this.showErrorModal = true;

        }
      });
    }
  }

  closeModal() {
    this.showErrorModal = false;
    this.showSuccessModal = false;
  }

  limparSelecao() {
    this.beneficioSelecionado = null;
  }

}
