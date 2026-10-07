import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { listaDeItens } from './listadeitens'
import { NgClass } from '../../../node_modules/@angular/common';


@Component({
  selector: 'app-lista-de-compras',
  imports: [FormsModule, NgClass],
  templateUrl: './lista-de-compras.component.html',
  styleUrl: './lista-de-compras.component.scss'
})
export class ListaDeComprasComponent {

  item: string = '';
  lista: listaDeItens[] = [];
  
  adicionarItensNaLista(){
    let listadeitens = new listaDeItens();
    listadeitens.nome = this.item;
    listadeitens.id = this.lista.length + 1;

    this.lista.push(listadeitens);

    this.item = '';
  }

  riscarItem(listaDeItens: listaDeItens){
    listaDeItens.comprado = !listaDeItens.comprado;
  }

  limparLista(){
    this.lista = [];
  }

}
