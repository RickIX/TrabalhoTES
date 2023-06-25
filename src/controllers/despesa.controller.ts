import { Despesas } from '../models/despesa.model';
import { Request, Response } from "express";
import { UserController } from "./user.controller";
import prisma from '../prisma';

let despesas: Despesas[] = [];
const userController = new UserController();

export class DespesaController {
  async cadastrarDespesa(request: Request, response: Response): Promise<Response> {
    const { nome, valor, userId } = request.body;
  
    if (!nome || !valor || !userId) {
      return response.status(400).json({ message: "Dados inválidos" });
    }
  
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
  
      if (!user) {
        return response.status(404).json({ message: "Usuário não encontrado" });
      }
  
      const despesa = await prisma.despesa.create({
        data: {
          nome: nome,
          valor: valor,
          userId: userId,
        },
      });
  
      await prisma.user.update({
        where: { id: userId },
        data: {
          despesas: {
            connect: { id: despesa.id },
          },
          saldo: { decrement: despesa.valor },
        },
      });
  
      return response.status(201).json({ message: "Despesa cadastrada com sucesso" });
    } catch (error) {
      return response.status(500).json({ error: "Erro ao cadastrar despesa" });
    } finally {
      await prisma.$disconnect();
    }
  }
  
  async listarDespesas(request: Request, response: Response): Promise<Response> {
    try {
      const despesas = await prisma.despesa.findMany();
      return response.status(200).json(despesas);
    } catch (error) {
      return response.status(500).json({ error: "Erro ao listar despesas" });
    } finally {
      await prisma.$disconnect();
    }
  }
  

  async  buscarDespesaPorUsuario(request: Request, response: Response): Promise<Response> {
    const userId = Number(request.params.userId);
  
    try {
      const despesasDoUsuario = await prisma.despesa.findMany({
        where: {
          userId: userId,
        },
      });
  
      return response.status(200).json(despesasDoUsuario);
    } catch (error) {
      return response.status(500).json({ error: "Erro ao buscar despesas do usuário" });
    } finally {
      await prisma.$disconnect();
    }
  }
  

  async  atualizarDespesa(request: Request, response: Response): Promise<Response> {
    const despesaId = Number(request.params.despesaId);
    const { nome, valor } = request.body;
  
    try {
      const despesa = await prisma.despesa.update({
        where: {
          id: despesaId,
        },
        data: {
          nome: nome,
          valor: valor,
        },
      });
  
      if (!despesa) {
        return response.status(404).json({ message: "Despesa não encontrada" });
      }
  
      // Atualize o saldo do usuário, se necessário
  
      return response.status(200).json({ message: "Despesa atualizada com sucesso" });
    } catch (error) {
      return response.status(500).json({ error: "Erro ao atualizar a despesa" });
    } finally {
      await prisma.$disconnect();
    }
  }
  
  

  async deletarDespesa(request: Request, response: Response): Promise<Response> {
    const despesaId = Number(request.params.despesaId);
  
    try {
      const despesa = await prisma.despesa.delete({
        where: {
          id: despesaId,
        },
      });
  
      if (!despesa) {
        return response.status(404).json({ message: "Despesa não encontrada" });
      }
  
      // Atualize o saldo do usuário, se necessário
  
      return response.status(200).json({ message: "Despesa deletada com sucesso" });
    } catch (error) {
      return response.status(500).json({ error: "Erro ao deletar a despesa" });
    } finally {
      await prisma.$disconnect();
    }
  }
  

  getDespesas(): Despesas[] {
    return despesas;
  }

  
}   

