import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../models/beneficio.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgxMaskDirective} from 'ngx-mask';

@Component({
  selector: 'app-beneficio-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './beneficio-form.component.html',
  styleUrls: ['./beneficio-form.component.scss']
})
export class BeneficioFormComponent {

  novoBeneficio: Beneficio = {
    nome: '',
    descricao: '',
    valor: 0,
    ativo: true
  };

  @Input() beneficioParaEdicao: Beneficio | null = null;
  @Output() salvoComSucesso = new EventEmitter<void>();
  @Output() erroAoSalvar = new EventEmitter<string>();
  @Output() cancelarEdicao = new EventEmitter<void>();

  constructor(private beneficioService: BeneficioService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['beneficioParaEdicao'] && this.beneficioParaEdicao) {
      this.novoBeneficio = { ...this.beneficioParaEdicao };
    }
  }

  salvar() {
    if (!this.novoBeneficio.nome || !this.novoBeneficio.descricao || this.novoBeneficio.valor <= 0) {
      this.erroAoSalvar.emit('Por favor, preencha todos os campos do novo benefício.');
      return;
    }

    const dadosParaEnviar = { ...this.novoBeneficio, valor: Number(this.novoBeneficio.valor) };

    this.beneficioService.salvar(dadosParaEnviar).subscribe({
      next: () => {
        this.limparForm();
        this.salvoComSucesso.emit();
      },
      error: (err) => {
        const msg = err.error?.message || err.error || 'Erro ao processar benefício.';
        this.erroAoSalvar.emit(msg);
      }
    });
  }

  limparForm() {
    this.novoBeneficio = this.inicializarNovoBeneficio();
    this.beneficioParaEdicao = null;
    this.cancelarEdicao.emit();
  }

  private inicializarNovoBeneficio(): Beneficio {
    return { nome: '', descricao: '', valor: 0, ativo: true };
  }
}
