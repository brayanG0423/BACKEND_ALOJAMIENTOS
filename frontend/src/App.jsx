import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import AlojamientosPage from "./pages/AlojamientosPage";
import ReservasPage from "./pages/ReservasPage";
import PagosPage from "./pages/PagosPage";
import ResenasPage from "./pages/ResenasPage";
import UsuariosPage from "./pages/UsuariosPage";
import DisponibilidadPage from "./pages/DisponibilidadPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alojamientos"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AlojamientosPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservas"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ReservasPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pagos"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PagosPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resenas"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ResenasPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UsuariosPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/disponibilidad"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DisponibilidadPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
