import { Request, Response } from "express";
import { Objetivo } from './../models/objetivo.model';
import prisma from '../prisma';

let objetivos: Objetivo[] = [];

export class ObjetivosController {
  async cadastrarObjetivo(request: Request, response: Response): Promise<Response> {
    const { nome, valor, userId } = request.body;

    if (!nome || !valor || !userId) {
      return response.status(400).json({ message: "Dados inválidos" });
    }

    try {
      const objetivo = await prisma.objetivo.create({
        data: {
          nome,
          valor,
          userId,
        },
      });

      return response.status(201).json({ message: "Objetivo cadastrado com sucesso", objetivo });
    } catch (error) {
      return response.status(500).json({ error: "Erro ao cadastrar o objetivo" });
    } finally {
      await prisma.$disconnect();
    }
  }


  async listarObjetivos(request: Request, response: Response): Promise<Response> {
    try {
      const objetivos = await prisma.objetivo.findMany();

      return response.status(200).json(objetivos);
    } catch (error) {
      return response.status(500).json({ error: "Erro ao listar os objetivos" });
    } finally {
      await prisma.$disconnect();
    }
  }


  async buscarObjetivoPorUsuario(request: Request, response: Response): Promise<Response> {
    const userId = Number(request.params.userId);
  
    try {
      const objetivosDoUsuario = await prisma.objetivo.findMany({
        where: {
          userId: userId,
        },
      });
  
      return response.status(200).json(objetivosDoUsuario);
    } catch (error) {
      return response.status(500).json({ error: "Erro ao buscar os objetivos do usuário" });
    } finally {
      await prisma.$disconnect();
    }
  }
  

  async atualizarObjetivo(request: Request, response: Response): Promise<Response> {
    const objetivoId = Number(request.params.id);
    const { nome, valor } = request.body;
  
    try {
      const objetivo = await prisma.objetivo.update({
        where: {
          id: objetivoId,
        },
        data: {
          nome: nome,
          valor: valor,
        },
      });
  
      return response.status(200).json({ message: "Objetivo atualizado com sucesso" });
    } catch (error) {
      return response.status(500).json({ error: "Erro ao atualizar o objetivo" });
    } finally {
      await prisma.$disconnect();
    }
  }
  
  
  async deletarObjetivo(request: Request, response: Response): Promise<Response> {
    const objetivoId = Number(request.params.id);
  
    try {
      const objetivo = await prisma.objetivo.delete({
        where: {
          id: objetivoId,
        },
      });
  
      if (!objetivo) {
        return response.status(404).json({ message: "Objetivo não encontrado" });
      }
  
      return response.status(200).json({ message: "Objetivo deletado com sucesso" });
    } catch (error) {
      return response.status(500).json({ error: "Erro ao deletar o objetivo" });
    } finally {
      await prisma.$disconnect();
    }
  }
  

  getObjetivos(): Objetivo[] {
    return objetivos;
  }
}
