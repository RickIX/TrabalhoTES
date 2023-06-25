import { Despesa } from "./despesa.model";
import { Objetivo } from "./objetivo.model";

export class User {
   id!: number;
   nome!: string;
   saldo!: number;
   despesas!: Despesa[];
   objetivos!: Objetivo[];
}