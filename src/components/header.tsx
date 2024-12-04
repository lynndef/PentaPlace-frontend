import { Bell, Mail, Search } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@radix-ui/react-menubar";

export function Header() {
  const { isAuthenticated, userData } = useAuth();

  function LogOut() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  function bufferToDataURL(buffer: number[], mimeType: string): string {
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  const fotoPerfil = userData?.fotoPerfil?.data
    ? bufferToDataURL(userData.fotoPerfil.data, "image/*")
    : "";

  return (
    <header className="h-[75px] bg-[#373737] flex items-center justify-center text-white font-bold">
      <Link to={"/"}>
        <img src="/src/assets/pentaplace-text.svg" alt="pentaplace" />
      </Link>
      <nav className="space-x-5 pl-10">
        <a href="#" >Profissionais</a>
        <a href="#">Organizações</a>
        <a href="#">Descobrir</a>
      </nav>
      <div className="ml-24 bg-transparent outline-none w-[450px] h-9 border-[1px] border-white font-normal rounded-[10px] flex items-center px-2">
        <input
          type="text"
          className="bg-transparent w-[450px] h-9 border-none outline-none"
        />
        <Search />
      </div>
      <div className="flex gap-2 pl-14">
        {!isAuthenticated ? (
          <>
            <Link to={"/cadastro-tipos"}>
              <button className="bg-white font-bold text-black text-sm rounded-md px-2 p-0.5">
                Cadastrar-se
              </button>
            </Link>
            <Link to={"/login"}>
              <button className="bg-white font-bold text-black text-sm rounded-md px-2 p-0.5">
                Entrar
              </button>
            </Link>
          </>
        ) : (
          <div className="flex gap-3 items-center pt-2.5 relative z-20">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>
                 <Link to={"/chat"}> <Mail fill="white" stroke="#373737"/></Link>
                </MenubarTrigger>
                <MenubarContent></MenubarContent>
              </MenubarMenu>
            </Menubar>
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>
                  <Bell fill="white" size={20}/>
                </MenubarTrigger>
                <MenubarContent></MenubarContent>
              </MenubarMenu>
            </Menubar>
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>
                  <img
                    src={fotoPerfil}
                    alt="perfil"
                    className="rounded-full size-7 object-cover"
                  />
                </MenubarTrigger>

                <MenubarContent className="bg-[#121212] p-2 rounded-lg border-[1px] border-[#373737] text-center font-semibold">
                  <NavLink to={`/id/${userData?.username}`}>
                    <MenubarItem className="border-b-white border-t-transparent border-r-transparent border-l-transparent border-[1px] px-2 py-1 outline-none text-white hover:bg-gray-600 w-44">
                      @{userData?.username}
                    </MenubarItem>
                  </NavLink>

                  <MenubarSeparator className="my-2 border-gray-500" />

                  <NavLink to={`/id/${userData?.username}/portfolio`}>
                    <MenubarItem className="border-b-white border-t-transparent border-r-transparent border-l-transparent border-[1px] px-2 py-1 outline-none text-white hover:bg-gray-600 w-44">
                     <h1>Seus projetos</h1>
                    </MenubarItem>
                  </NavLink>
                  <MenubarSeparator className="my-2 border-gray-500" />

                  <NavLink to={`/id/${userData?.username}/servicos`}>
                    <MenubarItem className="border-b-white border-t-transparent border-r-transparent border-l-transparent border-[1px] px-2 py-1 outline-none text-white hover:bg-gray-600 w-44">
                     <h1>Seus serviços</h1>
                    </MenubarItem>
                  </NavLink>

                  <MenubarSeparator className="my-2 border-gray-500" />
                  <MenubarItem
                    onClick={LogOut}
                    className="text-red-400 px-2 py-0.5 cursor-pointer outline-none hover:bg-red-600 hover:text-white"
                  >
                    Sair
                  </MenubarItem>


               
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        )}
      </div>
    </header>
  );
}
