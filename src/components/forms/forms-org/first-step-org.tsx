import { UseFormRegister, FieldErrors } from "react-hook-form";
import { usuarioOrg } from "@/pages/cadastro-org";

interface FirstStepOrgProps {
  register: UseFormRegister<usuarioOrg >;
  errors: FieldErrors<usuarioOrg > ;
}

export function FirstStepOrg({
  register,
  errors,
}: FirstStepOrgProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="font-bold">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register("email", { required: true })}
          placeholder="Digite seu email"
          className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md w-full px-2"
        />
        {errors?.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="font-bold">
          Username
        </label>
        <input
          type="text"
          id="username"
          {...register("username")}
          placeholder="Digite seu username"
          className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md w-full px-2"
        />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="senha" className="font-bold">
          Senha
        </label>
        <input
          type="password"
          id="senha"
          {...register("senha")}
          placeholder="Digite sua senha"
          className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md w-full px-2"
        />
        {errors.senha && <p className="text-red-500">{errors.senha.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="telefone" className="font-bold">
          Telefone
        </label>
        <input
          type="text"
          id="telefone"
          {...register("telefone")}
          placeholder="Digite seu telefone"
          className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md w-full px-2"
        />
        {errors.telefone && (
          <p className="text-red-500">{errors.telefone.message}</p>
        )}
      </div>
    </div>
  );
}
