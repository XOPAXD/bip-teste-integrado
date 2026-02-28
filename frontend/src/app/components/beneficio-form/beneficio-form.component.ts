import { Component, EventEmitter, Output } from '@angular/core';
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

  @Output() salvoComSucesso = new EventEmitter<void>();
  @Output() erroAoSalvar = new EventEmitter<string>();

  constructor(private beneficioService: BeneficioService) {}

  salvar() {
    if (!this.novoBeneficio.nome || !this.novoBeneficio.descricao || this.novoBeneficio.valor <= 0) {
      this.erroAoSalvar.emit('Por favor, preencha todos os campos do novo benefício.');
      return;
    }

    this.beneficioService.salvar(this.novoBeneficio).subscribe({
      next: () => {
        this.limparForm();
        this.salvoComSucesso.emit();
      },
      error: (err) => {
        const msg = err.error?.message || err.error || 'Erro ao cadastrar benefício.';
        this.erroAoSalvar.emit(msg);
      }
    });
  }

  private limparForm() {
    this.novoBeneficio = { nome: '', descricao: '', valor: 0, ativo: true };
  }
}
