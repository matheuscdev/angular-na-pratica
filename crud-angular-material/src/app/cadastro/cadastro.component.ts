import { Component, OnInit, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatCardModule } from '@angular/material/card'
import { FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service'
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import { MatSnackBar } from '@angular/material/snack-bar'
import { BrasilapiService } from '../brasilapi.service';
import { Estado, Municipio } from '../brasilapi.models';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '../../../node_modules/@angular/common';

@Component({
  selector: 'app-cadastro',
  imports: [
    FlexLayoutModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgxMaskDirective,
    MatSelectModule,
    CommonModule
],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
  providers: [
    provideNgxMask()
  ]
})
export class CadastroComponent implements OnInit {

  cliente: Cliente = Cliente.newCliente();
  atualizando: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  listaDeEstados: Estado[] = [];
  listaDeMunicipios: Municipio[] = [];

  constructor (
    private service: ClienteService,
    private route: ActivatedRoute,
    private router: Router,
    private brasilApiService: BrasilapiService
  ){

  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe( (query: any) => {
      const params = query['params']
      console.log("Paramentos: ", params);
      const id = params['id']

      if(id){
        let clienteEncontrado = this.service.buscarClienteId(id);

        if(clienteEncontrado){
          this.atualizando = true;
          this.cliente = clienteEncontrado;
          if(this.cliente.estado){
            const event = { value: this.cliente.estado };
            this.carregarMunicipios(event as MatSelectChange)
          }
        }
      }
    })

    this.carregarEstados();

  }

  salvar(){
    if(!this.atualizando){
      this.service.salvar(this.cliente);
      this.cliente = Cliente.newCliente();
      this.mostrarMensagem('Cliente salvo com sucesso!')
    } else {
      this.service.atualizar(this.cliente);
      this.router.navigate(['/consulta'])
      this.mostrarMensagem('O cliente foi atualizado com sucesso!')
    }

  }

  mostrarMensagem(mensagem: string){
    this.snack.open(mensagem, "Ok")
  }

  carregarEstados() {
    this.brasilApiService.listarEstados().subscribe({
      next: listaEstados => 
        this.listaDeEstados = listaEstados.sort((a,b) =>
          a.sigla.localeCompare(b.sigla)
        ),
      error: erro => console.log("Aconteceu um erro: ", erro)
    })
  }

  carregarMunicipios(event : MatSelectChange) {
    const estadoSelecionado = event.value;
    this.brasilApiService.listarMunicipios(estadoSelecionado).subscribe({
      next: listaMunicipios => this.listaDeMunicipios = listaMunicipios,
      error: erro => console.log("Aconteceu um erro: ", erro)
    })
  }

}
