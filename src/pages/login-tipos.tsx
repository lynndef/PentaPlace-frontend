import { NavLink } from "react-router-dom";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export function LoginTipos() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow flex flex-col items-center">
        <div className="flex justify-center items-center flex-grow">
          <div className="text-white flex pt-10">
            <div className="w-[540px] h-[560px] flex flex-col items-center">
            <NavLink to={"/cadastro-org"} className="w-[540px] h-[560px] flex flex-col items-center">
              <img
                src="/src/assets/hire banner.png"
                alt="hire banner"
                className="object-contain relative"
              />
              </NavLink>
              <h1 className="relative bottom-20 left-[-160px] text-2xl">
                Quero <strong>contratar</strong>
              </h1>
              <p className="w-[500px] pl-8 text-center text-sm relative bottom-4">
                Selecione se você é uma organização, veículo de mídia, agência ou
                outro tipo de empresa do cenário dos esports buscando contratar
                profissionais criativos.
              </p>
            </div>
            <div className="w-[540px] h-[560px] flex flex-col items-center">
              <NavLink to={"/cadastro-criativo"}>
                <img
                  src="/src/assets/hiring banner.png"
                  alt="hiring banner"
                  className="object-contain relative"
                />
              </NavLink>
              <h1 className="relative bottom-20 left-32 text-2xl">
                Quero ser <strong>contratado</strong>
              </h1>
              <p className="pl-8 w-[520px] text-sm text-center relative bottom-4">
                Selecione se você é um profissional criativo buscando serviços
                temporários, remotos ou fixos em empresas do cenário dos esports.
              </p>
            </div>
          </div>
        </div>
        <div className="text-white text-center pb-10">
          <p>Já possui uma conta?</p>
          <strong><h1>Login</h1></strong>
        </div>
      </main>
      <Footer />
    </div>
  );
}