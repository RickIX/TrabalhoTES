
import prisma from '../prisma';
import { ObjetivosController } from './objetivos.controller';
import { DespesaController } from './despesa.controller';
import { User } from './../models/user.model';
import { Request, Response } from "express";





let usuarios: User[] = [];

export class UserController {
  async cadastrarUsuario(request: Request, response: Response): Promise<Response> {
    const { nome, saldo } = request.body;

    if (!nome) {
      return response.status(400).json({ message: 'Dados inválidos' });
    }

    try {
      const user = await prisma.user.create({
        data: {
          nome: String(nome),
          saldo: Number(saldo), 
        }
      });
      return response.status(201).json({ message: 'Usuário cadastrado com sucesso' });
    } catch (error) {
      return response.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
  }

  async listarUsuarios(request: Request, response: Response): Promise<Response> {
    try {
      const usuarios = await prisma.user.findMany();
      return response.status(200).json(usuarios);
    } catch (error) {
      console.error('Ocorreu um erro ao listar os usuários:', error);
      return response.status(500).json({ error: 'Erro ao listar os usuários' });
    } finally {
      await prisma.$disconnect();
    }
  }
  
   async  buscarUsuarioPorNome(request: Request, response: Response): Promise<Response> {
    const nome = request.params.nome;
  
    try {
      const user = await prisma.user.findFirst({
        where: {
          nome: nome,
        },
      });
  
      if (!user) {
        return response.status(404).json({ message: "Usuário não encontrado" });
      }
  
      return response.status(200).json(user);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar o usuário por nome' });
    } finally {
      await prisma.$disconnect();
    }
  }
  

  async atualizarUsuarioPorId(request: Request, response: Response): Promise<Response> {
    const userId = Number(request.params.id);
    const { nome, saldo, despesas, objetivos } = request.body;
  
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          nome: nome,
          saldo: saldo,
          despesas: { create: despesas },
          objetivos: { create: objetivos },
        },
      });
  
      if (!user) {
        return response.status(404).json({ message: "Usuário não encontrado" });
      }
  
      return response.status(200).json({ message: "Usuário atualizado com sucesso" });
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao atualizar o usuário' });
    } finally {
      await prisma.$disconnect();
    }
  }
  
  
  async deletarUsuarioPorNome(request: Request, response: Response): Promise<Response> {
    const nome = request.params.nome;
  
    try {
      const user = await prisma.user.deleteMany({
        where: { nome: nome },
      });
  
      if (user.count === 0) {
        return response.status(404).json({ message: "Usuário não encontrado" });
      }
  
      return response.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao deletar o usuário' });
    } finally {
      await prisma.$disconnect();
    }
  }
  
  
  buscarUsuarioPorId(userId: number): User | undefined {
    return usuarios.find((user) => user.id === userId);
  }


  async gerarRelatorioFinanceiro(request: Request, response: Response): Promise<Response> {
    const userId = Number(request.params.id);
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          despesas: true,
          objetivos: true,
        },
      });
  
      if (!user) {
        return response.status(404).json({ message: "Usuário não encontrado" });
      }
  
      // Cálculo do Imposto de Renda (IR)
      let impostoRenda = "isento";
      let valorImpostoRenda = 0;
      if (user.saldo > 2112 && user.saldo <= 2826.65) {
        impostoRenda = "7,50%";
        valorImpostoRenda = (user.saldo * 7.5) / 100;
      } else if (user.saldo > 2826.65 && user.saldo <= 3751.05) {
        impostoRenda = "15%";
        valorImpostoRenda = (user.saldo * 15) / 100;
      } else if (user.saldo > 3751.05 && user.saldo <= 4664.68) {
        impostoRenda = "22,50%";
        valorImpostoRenda = (user.saldo * 22.5) / 100;
      } else if (user.saldo > 4664.68) {
        impostoRenda = "27,50%";
        valorImpostoRenda = (user.saldo * 27.5) / 100;
      }
  
      // Cálculo da soma das despesas
      let somaDespesas = 0;
      for (const despesa of user.despesas) {
        somaDespesas += despesa.valor;
      }
  
      // Verificação da relação entre saldo e despesas para a mensagem
      let mensagem = "";
      if (user.saldo > somaDespesas) {
        mensagem = "Parabéns! Seus gastos estão abaixo do seu saldo disponível. Continue assim!";
      } else if (user.saldo < somaDespesas) {
        mensagem = "Atenção! Suas despesas estão excedendo o seu saldo disponível. Considere revisar seus gastos e ajustá-los de acordo com suas necessidades e prioridades.";
      } else {
        mensagem = "Seus gastos estão equilibrados com o seu saldo disponível. Mantenha o controle financeiro para alcançar seus objetivos.";
      }
  
      const relatorio = {
        nome: user.nome,
        saldo: user.saldo,
        despesas: user.despesas,
        objetivos: user.objetivos,
        impostoRenda,
        valorImpostoRenda,
        mensagem,
      };
  
      return response.status(200).json(relatorio);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao gerar o relatório financeiro' });
    } finally {
      await prisma.$disconnect();
    }
  }
  
}
