import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CardMedia from '@mui/material/CardMedia';
import logo from '../../assets/Pupi_logo.png';
import { Grid } from '@mui/material';

export default function Navbar_Unstarted() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color=''>
        <Toolbar>
        <CardMedia
            component="img"
            image={logo}
            alt="Logo"
            sx={{ height: 50, width: 100, marginRight: 2 }}
          /> 
          <Button color="secondary" sx={{ flexGrow: 4}} >Publica tu propiedad</Button>
          <Button color="secondary" sx={{ flexGrow: 0.1}} >Login</Button>
          <Button color="secondary" sx={{ flexGrow: 0.1}} >Register</Button>
          <IconButton
            size="large"
            edge="start"
            color=" "
            aria-label="menu"
            sx={{ mr: 2, ml:2 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
