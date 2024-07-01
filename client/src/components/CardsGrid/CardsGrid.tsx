import { Box, Grid} from "@mui/material";
import Cards from '../Principal_card/Cards.tsx'
import BasicPagination from "../Pagination/Pagination.tsx";
export default function CardsGrid() {
    const numberOfCards = 12; //Define de number of cards
  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <Grid container spacing={3} justifyContent="center">
        {Array.from({ length: numberOfCards }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
            <Cards/>
          </Grid>
        ))}
      </Grid>
      <BasicPagination/>
    </Box>
  );
}