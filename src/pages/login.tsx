import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().optional(),
});

export type login = z.infer<typeof loginSchema>;

export function Login() {

  const {
    register,
    handleSubmit,
  } = useForm<login>({
    resolver: zodResolver(loginSchema),
  });

  const port = import.meta.env.VITE_PORT;

 async function LoginToken(data: login){

  try {
    const response = await axios.post(`${port}/login-usuario-org`, data);
    
    localStorage.setItem("token", response.data.token);
    window.location.href = "/";
    
  } catch {
    try {
      const response = await axios.post(`${port}/login-usuario-criativo`, data);
      
      localStorage.setItem("token", response.data.token);
      window.location.href = "/";
      
    } catch {
      console.log("Login falhou. Verifique suas credenciais.");
    }
  }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow flex justify-center items-center">
        <div className="max-w-4xl bg-[#232323] text-white flex rounded-2xl">
          <form onSubmit={handleSubmit(LoginToken)} className="flex flex-col gap-4 font-bold text-sm items-center w-[400px] p-10">
            <h1 className="text-center text-lg">Login</h1>
            <div className="space-y-2 pt-4">
            <label htmlFor="email-usuario" className="pl-2">E-Mail ou Usuário</label>
            <input
              type="text"
              id="email-usuario"
              className="bg-transparent outline-none border-[1px] w-[350px] border-white h-10 rounded-lg"
              required
              {...register("email")}
              />
              </div>
            <div className="space-y-2">
            <label htmlFor="senha" className="pl-2">Senha</label>
            <input
              type="password"
              id="senha"
              className="bg-transparent outline-none border-[1px] w-[350px] border-white h-10 rounded-lg"
              required
              {...register("senha")}
              />
              </div>
            <button className="bg-white text-black rounded-md h-10 w-[200px]">Entrar</button>
          </form>
          <div>
            <img
              src="/src/assets/Rectangle 158.png"
              alt="signup-image"
              className="rounded-r-2xl object-cover"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
