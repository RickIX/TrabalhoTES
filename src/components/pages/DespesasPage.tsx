import axios from "axios";
import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Despesa } from "../../models/despesa.model";

function DespesaCrud() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/despesas")
      .then((resposta) => {
        console.log(resposta.data);
        setDespesas(resposta.data);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }, []);

  function listarDespesas() {
    axios
      .get("http://localhost:3001/despesas")
      .then((response) => {
        setDespesas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function cadastrarDespesa() {
    const despesa = {
      nome: nome,
      valor: parseInt(valor),
      userId: parseInt(userId),
    };

    axios
      .post(`http://localhost:3001/usuarios/${userId}/despesas`, despesa)
      .then((response) => {
        console.log(response.data);
        listarDespesas();
        setNome("");
        setValor("");
        setUserId("");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function atualizarDespesa(id: number, novoNome: string, novoValor: number) {
    const despesa = {
      nome: novoNome,
      valor: novoValor,
    };

    axios
      .put(`http://localhost:3001/despesas/${id}`, despesa)
      .then((response) => {
        console.log(response.data);
        listarDespesas();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function excluirDespesa(id: number) {
    axios
      .delete(`http://localhost:3001/despesas/${id}`)
      .then((response) => {
        console.log(response.data);
        listarDespesas();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <Typography variant="h4">Cadastrar Despesa</Typography>
      <div>
        <Typography variant="subtitle1">Nome:</Typography>
        <TextField
          type="text"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
        />
      </div>
      <div>
        <Typography variant="subtitle1">Valor:</Typography>
        <TextField
          type="text"
          value={valor}
          onChange={(event) => setValor(event.target.value)}
        />
      </div>
      <div>
        <Typography variant="subtitle1">UserID:</Typography>
        <TextField
          type="text"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
        />
      </div>
      <div>
        <Button variant="contained" onClick={cadastrarDespesa}>
          Cadastrar
        </Button>
      </div>

      <Typography variant="h4">Listagem de Despesas</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>UserID</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {despesas.map((despesa) => (
            <TableRow key={despesa.id}>
              <TableCell>{despesa.id}</TableCell>
              <TableCell>{despesa.nome}</TableCell>
              <TableCell>{despesa.valor}</TableCell>
              <TableCell>{despesa.userId}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const novoNome = prompt("Novo nome:", despesa.nome);
                    const novoValorString = prompt(
                      "Novo valor:",
                      String(despesa.valor)
                    );

                    if (novoNome !== null && novoValorString !== null) {
                      const novoValor = parseInt(novoValorString, 10);
                      atualizarDespesa(despesa.id, novoNome, novoValor);
                    }
                  }}
                >
                  Atualizar
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => excluirDespesa(despesa.id)}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DespesaCrud;
