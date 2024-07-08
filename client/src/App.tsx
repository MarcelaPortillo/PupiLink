import { CssBaseline, ThemeProvider } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyRequests from "./pages/MyRequests";
import MyAds from "./pages/MyAds";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import AuthService from "./services/AuthService";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = AuthService.getUserData();
      setUser(loggedInUser);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const PrivateRoute = ({ children }) => {
    if (loading) return null;
    return AuthService.isLoggedIn() ? children : <Navigate to="*" />;
  };

  const LayoutWithNavbar = ({ children }) => (
    <>
      <Navbar />
      {children}
    </>
  );

  return (
    <ThemeProvider theme={DefaultTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <ToastContainer />

        <Router>
          <Routes>
            {/* Private Routes */}

            <Route
              path={PupilinkRoutes.PUBLISH_FORM}
              element={
                <PrivateRoute>
                  <LayoutWithNavbar>
                    <PublishForm />
                  </LayoutWithNavbar>
                </PrivateRoute>
              }
            />
            <Route
              path={PupilinkRoutes.LODGING_DETAILS}
              element={
                <PrivateRoute>
                  <LayoutWithNavbar>
                    <LodgingDetails />
                  </LayoutWithNavbar>
                </PrivateRoute>
              }
            />
            <Route
              path={PupilinkRoutes.MY_REQUESTS}
              element={
                <PrivateRoute>
                  <LayoutWithNavbar>
                    <MyRequests />
                  </LayoutWithNavbar>
                </PrivateRoute>
              }
            />
            <Route
              path={PupilinkRoutes.MY_ADS}
              element={
                <PrivateRoute>
                  <LayoutWithNavbar>
                    <MyAds />
                  </LayoutWithNavbar>
                </PrivateRoute>
              }
            />

            {/* Public Routes */}
            <Route path={PupilinkRoutes.REGISTER} element={<Register />} />
            <Route
              path={PupilinkRoutes.ROOT}
              element={
                <LayoutWithNavbar>
                  <Home />
                </LayoutWithNavbar>
              }
            />
            <Route path={PupilinkRoutes.LOGIN} element={<Login />} />
            <Route
              path={PupilinkRoutes.FORGOT_PASSWORD}
              element={<ForgotPassword />}
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
