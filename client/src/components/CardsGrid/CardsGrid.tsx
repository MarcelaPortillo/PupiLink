import { Box, Grid} from "@mui/material";
import Cards from '../Principal_card/Cards.tsx'
export default function CardsGrid() {
    const numberOfCards = 12; //Define de number of cards
  return (
    <Box>
      <Grid container spacing={3} justifyContent="center">
        {Array.from({ length: numberOfCards }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
            <Cards/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}