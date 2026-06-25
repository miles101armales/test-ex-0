import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { AnimalTypesPage } from "./pages/AnimalTypesPage";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BreedsPage } from './pages/BreedsPage';
import { AnimalsPage } from './pages/AnimalsPage';
import { WeightingsPage } from './pages/WeightingsPage';
import { UsersPage } from './pages/UsersPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/animaltypes" element={<AnimalTypesPage />} />
          <Route path="/breeds" element={<BreedsPage />} />
          <Route path="/animals" element={<AnimalsPage />} />
          <Route path="/weightings" element={<WeightingsPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}