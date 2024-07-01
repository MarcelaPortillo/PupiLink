import { Box, Typography, Grid } from "@mui/material";
import CardsGrid from '../components/CardsGrid/CardsGrid'
import Navbar_Unstarted_Seccion from "../components/Navbar_Unstarted Section/Navbar_Unstarted";

const Home = () => {
  return (
    <Box display='flex' flexDirection='column'>
      <Navbar_Unstarted_Seccion></Navbar_Unstarted_Seccion>
      <Grid container spacing={2} margin={2}>
      <Grid item xs={10} md={6}>
        <Typography variant="h2" color='text.secondary' align="left">
          ¿Buscas Pupilaje?
        </Typography>
      </Grid>
      <Grid item xs={10} md={6}>
        <Typography variant="h2" color='secondary' align="left">
          Cuenta con nosotros
        </Typography>
      </Grid>
    </Grid>
      <CardsGrid></CardsGrid>
    </Box>
  );
};

export default Home;
