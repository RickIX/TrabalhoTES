// user.model.ts

import { Despesas } from "./despesa.model";
import { Objetivo } from "./objetivo.model";

export class User {
   id!: number;
   nome!: string;
   saldo!: number;
   despesas!: Despesas[];
   objetivos!: Objetivo[];

   constructor() {
      this.id = 0;
      this.nome = "";
      this.saldo = 0;
      this.despesas = []; 
      this.objetivos = []; 
    }
  
 
   atualizarSaldo(valor: number): void {
      this.saldo += valor;
    }
  
 }
 
  
  