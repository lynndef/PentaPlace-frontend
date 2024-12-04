import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import { CadastroCriativo } from "./pages/cadastro-criativo.tsx";
import { Login } from "./pages/login";
import { LoginTipos } from "./pages/login-tipos";
import { CadastroOrg } from "./pages/cadastro-org.tsx";
import { HomeDeslogado } from "./pages/home.tsx";
import { Perfil } from "./pages/perfil.tsx";
import { PortfolioPerfil } from "./pages/portfolio-perfil.tsx";
import { ProjetoEditar } from "./pages/projeto-editar.tsx";
import MessageBoard from "./components/testando.tsx";
import { Projeto } from "./pages/projeto.tsx";
import { ProtectedRoute } from "./hooks/protected-route.ts";
import { Servicos } from "./pages/servicos.tsx";
import { Basico } from "./components/servicos/basico.tsx";
import Termos from "./pages/termos.tsx";

export const router = createBrowserRouter([
    {
      path: "/cadastro-tipos",
      element: <LoginTipos/>,
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/cadastro-criativo",
      element: <CadastroCriativo/>
    },
    {
      path: "/cadastro-org",
      element: <CadastroOrg/>
    },
    {
      path: "/",
      element: <HomeDeslogado/>
    },
    {
      path: "/id/:username",
      element: <Perfil/>
    },
    {
      path: "/id/:username/portfolio",
      element: <PortfolioPerfil/>
    },
    {
      path: "/id/:username/portfolio/:id/:titulo/editar",
      element:  <ProtectedRoute><ProjetoEditar/> </ProtectedRoute> 
    },
    {
      path: "/id/:username/portfolio/:id/:titulo",
      element: <Projeto/>
    },
    {
      path: "/id/:username/servicos",
      element: <Servicos/>
    },
    {
      path: "/chat",  
      element: <MessageBoard/>
    },
    {
      path: "/servicostest",  
      element: <Basico/>
    },
    {
      path: "/termos",  
      element: <Termos/>
    },
  ]);