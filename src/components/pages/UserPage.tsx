import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../../models/user.model";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function UserCrud() {
  const [nome, setNome] = useState("");
  const [saldo, setSaldo] = useState("");
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(-1);

  interface Relatorio {
    nome: string;
    saldo: number;
    despesas: Despesa[];
    objetivos: Objetivo[];
    impostoRenda: string;
    valorImpostoRenda: number;
    mensagem: string;
  }

  interface Despesa {
    id: number;
    nome: string;
    valor: number;
    userId: number;
  }

  interface Objetivo {
    id: number;
    nome: string;
    valor: number;
    userId: number;
  }

  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  // tipa o estado como um array de Relatorio
  const [showRelatorio, setShowRelatorio] = useState(false); // cria um estado para controlar a visibilidade do relatório

  useEffect(() => {
    axios
      .get("http://localhost:3001/usuarios")
      .then((resposta) => {
        console.log(resposta.data);
        setUsers(resposta.data);
        console.log(relatorio);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }, [relatorio]);

  function enviar() {
    let user: User = new User();
    user.nome = nome;
    user.saldo = Number.parseFloat(saldo);

    axios
      .post("http://localhost:3001/usuarios", user)
      .then((resposta) => {
        console.log(resposta.data.mensagem);
        axios
          .get("http://localhost:3001/usuarios")
          .then((resposta) => {
            setUsers(resposta.data);
          })
          .catch((erro) => {
            console.log(erro);
          });
      })
      .catch((erro) => {
        console.log(erro);
      });
  }

  function atualizarUsuario(id: number) {
    setEditUserId(id);
  }

  function salvarAtualizacao(id: number) {
    const user = {
      nome: nome,
      saldo: parseInt(saldo),
      despesas: [],
      objetivos: [],
    };

    axios
      .put(`http://localhost:3001/usuarios/${id}`, user)
      .then((resposta) => {
        console.log(resposta.data.mensagem);
        axios
          .get("http://localhost:3001/usuarios")
          .then((resposta) => {
            setUsers(resposta.data);
          })
          .catch((erro) => {
            console.log(erro);
          });
      })
      .catch((erro) => {
        console.log(erro);
      });

    setNome("");
    setSaldo("");
    setEditUserId(-1);
  }

  function cancelarAtualizacao() {
    setNome("");
    setSaldo("");
    setEditUserId(-1);
  }

  function deletarUsuario(nome: string) {
    axios
      .delete(`http://localhost:3001/usuarios/${nome}`)
      .then((resposta) => {
        console.log(resposta.data.mensagem);
        axios
          .get("http://localhost:3001/usuarios")
          .then((resposta) => {
            setUsers(resposta.data);
          })
          .catch((erro) => {
            console.log(erro);
          });
      })
      .catch((erro) => {
        console.log(erro);
      });
  }

  function gerarRelatorio(id: number) {
    axios
      .get(`http://localhost:3001/usuarios/${id}/relatorio`)
      .then((resposta) => {
        const relatorioData = resposta.data;
        console.log(relatorioData);
        setRelatorio(relatorioData); // atualiza o estado do relatório
        setShowRelatorio(true); // atualiza o estado da visibilidade
        console.log(setShowRelatorio);
      })
      .catch((erro) => {
        console.log(erro);
      });
  }

  return (
    <div>
      <h1>Cadastrar Usuário</h1>
      <div>
        <TextField
          label="Nome"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
        />
      </div>
      <div>
        <TextField
          label="Saldo"
          value={saldo}
          onChange={(event) => setSaldo(event.target.value)}
        />
      </div>
      <div>
        <Button variant="contained" color="primary" onClick={enviar}>
          Cadastrar
        </Button>
      </div>

      <h2>Listagem de Usuários</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Saldo</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.nome}</TableCell>
              <TableCell>{user.saldo}</TableCell>
              <TableCell>
                {editUserId === user.id ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => salvarAtualizacao(user.id)}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={cancelarAtualizacao}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => atualizarUsuario(user.id)}
                    >
                      Atualizar
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => deletarUsuario(user.nome)}
                    >
                      Deletar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => gerarRelatorio(user.id)}
                    >
                      Gerar Relatório
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showRelatorio && relatorio && (
        <div>
          <Typography variant="h5">Nome: {relatorio.nome}</Typography>
          <Typography variant="body1">Saldo: {relatorio.saldo}</Typography>
          <Typography variant="body1">
            Imposto de Renda: {relatorio.impostoRenda}
          </Typography>
          <Typography variant="body1">
            Valor do Imposto de Renda: {relatorio.valorImpostoRenda}
          </Typography>
          <Typography variant="body1">
            Mensagem: {relatorio.mensagem}
          </Typography>

          <Typography variant="h5">Despesas:</Typography>
          <List>
            {Array.isArray(relatorio.despesas) &&
              relatorio.despesas.map((despesa, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Nome: ${despesa.nome}`}
                    secondary={`Valor: ${despesa.valor}`}
                  />
                </ListItem>
              ))}
          </List>

          <Typography variant="h5">Objetivos:</Typography>
          <List>
            {Array.isArray(relatorio.objetivos) &&
              relatorio.objetivos.map((objetivo, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Nome: ${objetivo.nome}`}
                    secondary={`Valor: ${objetivo.valor}`}
                  />
                </ListItem>
              ))}
          </List>
        </div>
      )}
    </div>
  );
}

export default UserCrud;
