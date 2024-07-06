import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PupilinkRoutes from "./enums/PupilinkRoutes";
import Home from "./pages/Home";
import DefaultTheme from "./themes/DefaultTheme";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import LodgingDetails from "./pages/LodgingDetails";
import PublishForm from "./pages/PublishForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  const router = createBrowserRouter([
    {
      path: PupilinkRoutes.ROOT,
      element: <Home />,
      errorElement: <NotFound />,
    },
    {
      path: PupilinkRoutes.REGISTER,
      element: <Register />,
    },
    {
      path: PupilinkRoutes.LOGIN,
      element: <Login />,
    },
    {
      path: PupilinkRoutes.FORGOT_PASSWORD,
      element: <ForgotPassword />,
    },
    {path: PupilinkRoutes.PUBLISH_FORM,
      element: <PublishForm/>,},
    {
      path: PupilinkRoutes.LODGING_DETAILS,
      element: <LodgingDetails/>,
      
    }
  ]);

  return (
    <ThemeProvider theme={DefaultTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      <RouterProvider router={router} />
      </LocalizationProvider>
    </ThemeProvider>   
  );
}

export default App;
