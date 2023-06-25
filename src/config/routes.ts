import { Router } from "express";
import { ObjetivosController } from './../controllers/objetivos.controller';
import { DespesaController } from './../controllers/despesa.controller';
import { UserController } from './../controllers/user.controller';
// import { ObjetivosService } from "../services/objetivos.service";

const router :  Router = Router();

// Rotas de usuário
const userController = new UserController();
router.post("/usuarios", userController.cadastrarUsuario);
router.get("/usuarios", userController.listarUsuarios);
router.get("/usuarios/:nome", userController.buscarUsuarioPorNome);
router.put("/usuarios/:id", userController.atualizarUsuarioPorId);
router.delete("/usuarios/:nome", userController.deletarUsuarioPorNome);
router.get("/usuarios/:id/relatorio", userController.gerarRelatorioFinanceiro);

// Rotas de despesa
const despesaController = new DespesaController();
router.post("/usuarios/:userId/despesas", despesaController.cadastrarDespesa);
router.get("/despesas", despesaController.listarDespesas);
router.get("/despesas/:userId", despesaController.buscarDespesaPorUsuario);
router.put("/despesas/:despesaId", despesaController.atualizarDespesa);
router.delete("/despesas/:despesaId", despesaController.deletarDespesa);


// Rotas de objetivo
const objetivoController = new ObjetivosController();
router.post("/objetivos", objetivoController.cadastrarObjetivo);
router.get("/objetivos", objetivoController.listarObjetivos);
router.get("/objetivos/:userId", objetivoController.buscarObjetivoPorUsuario);
router.put("/objetivos/:id", objetivoController.atualizarObjetivo);
router.delete("/objetivos/:id", objetivoController.deletarObjetivo);


export { router };
