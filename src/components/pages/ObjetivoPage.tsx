import axios from "axios";
import { useEffect, useState } from "react";
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
import { Objetivo } from "../../models/objetivo.model";

function ObjetivoCrud() {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [userId, setUserId] = useState("");
  const [objetivos, setObjetivos] = useState([]);
  const [editObjetivoId, setEditObjetivoId] = useState(-1);

  useEffect(() => {
    axios
      .get("http://localhost:3001/objetivos")
      .then((resposta) => {
        console.log(resposta.data);
        setObjetivos(resposta.data);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }, []);

  function enviar() {
    const objetivo = new Objetivo();
    objetivo.nome = nome;
    objetivo.valor = parseInt(valor);
    objetivo.userId = parseInt(userId);

    axios
      .post("http://localhost:3001/objetivos", objetivo)
      .then((resposta) => {
        console.log(resposta.data.mensagem);
        axios
          .get("http://localhost:3001/objetivos")
          .then((resposta) => {
            setObjetivos(resposta.data);
          })
          .catch((erro) => {
            console.log(erro);
          });
      })
      .catch((erro) => {
        console.log(erro);
      });
  }

  function atualizarObjetivo(id: number) {
    setEditObjetivoId(id);
  }

  function salvarAtualizacao(id: number) {
    const objetivo = {
      nome: nome,
      valor: parseInt(valor),
    };

    axios
      .put(`http://localhost:3001/objetivos/${id}`, objetivo)
      .then((resposta) => {
        console.log(resposta.data.mensagem);
        axios
          .get("http://localhost:3001/objetivos")
          .then((resposta) => {
            setObjetivos(resposta.data);
          })
          .catch((erro) => {
            console.log(erro);
          });
      })
      .catch((erro) => {
        console.log(erro);
      });

    setNome("");
    setValor("");
    setEditObjetivoId(-1);
  }

  function cancelarAtualizacao() {
    setNome("");
    setValor("");
    setEditObjetivoId(-1);
  }

  function deletarObjetivo(id:number) {
    axios
      .delete(`http://localhost:3001/objetivos/${id}`)
      .then((resposta) => {
        console.log(resposta.data.mensagem);
        axios
          .get("http://localhost:3001/objetivos")
          .then((resposta) => {
            setObjetivos(resposta.data);
          })
          .catch((erro) => {
            console.log(erro);
          });
      })
      .catch((erro) => {
        console.log(erro);
      });
  }

  return (
    <div>
      <Typography variant="h4">Cadastrar Objetivo</Typography>
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
        <Typography variant="subtitle1">UserId:</Typography>
        <TextField
          type="text"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
        />
      </div>
      <div>
        <Button variant="contained" onClick={enviar}>Cadastrar</Button>
      </div>

      <Typography variant="h4">Listagem de Objetivos</Typography>
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
          {objetivos.map((objetivo: any) => (
            <TableRow key={objetivo.id}>
              <TableCell>{objetivo.id}</TableCell>
              <TableCell>{objetivo.nome}</TableCell>
              <TableCell>{objetivo.valor}</TableCell>
              <TableCell>{objetivo.userId}</TableCell>
              <TableCell>
                {editObjetivoId === objetivo.id ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => salvarAtualizacao(objetivo.id)}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={cancelarAtualizacao}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => atualizarObjetivo(objetivo.id)}
                    >
                      Atualizar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => deletarObjetivo(objetivo.id)}
                    >
                      Deletar
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ObjetivoCrud;
