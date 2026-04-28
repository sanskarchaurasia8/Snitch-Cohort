import { RouterProvider } from "react-router";
import { routes } from "./app.routes.jsx";
import { useEffect } from "react";
import { useAuth } from "../features/auth/hook/useAuth.js";
import './App.css'

function App() {
  const { handleCheckAuth } = useAuth();

  useEffect(() => {
    handleCheckAuth();
  }, []);

  return (
    <RouterProvider router={routes} />
  )
}

export default App
