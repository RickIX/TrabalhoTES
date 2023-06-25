import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button component={Link} to="/userCrud" color="inherit">
          Usuários
        </Button>
        <Button component={Link} to="/despesaCrud" color="inherit">
          Despesas
        </Button>
        <Button component={Link} to="/objetivoCrud" color="inherit">
          Objetivos
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
