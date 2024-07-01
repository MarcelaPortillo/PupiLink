import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Box, CardActionArea } from "@mui/material";
export default function Cards() {
  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="180"
          image="https://cdn-static-new.uniplaces.com/property-photos/6b632e978454153a2a9790862f8e0af166ef9f7098c04181682f996027e67d7d/x-large.jpg"
          alt="Pupilage image"
        />
        <CardContent>
          <Box display="flex" alignItems="center">
            <HomeIcon fontSize="small" />
            <Typography
              variant="h6"
              color="text.secondary"
              component="div"
              align="left"
              marginLeft={0.5}
            >
              Habitación
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <LocationOnIcon fontSize="small" />
            <Typography
              variant="h6"
              color="text.secondary"
              component="div"
              align="left"
              marginLeft={0.5}
            >
              Colonia Loma Linda, Santa Tecla, La Libertad
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <AttachMoneyIcon fontSize="medium" />
            <Typography
              variant="h6"
              color="text.secondary"
              component="div"
              align="left"
              marginLeft={0.5}
            >
              325
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
