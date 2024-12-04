import { FieldErrors, UseFormRegister } from "react-hook-form";
import foto from "../../../assets/foto.png";
import { fotoPerfil, usuarioCriativo } from "../../../pages/cadastro-criativo";
import { useState } from "react";

interface ThirdStepCriativoProps {
  registerFoto: UseFormRegister<fotoPerfil>;
  register: UseFormRegister<usuarioCriativo>;
  errors: FieldErrors<usuarioCriativo>;
  errorsFoto: FieldErrors<fotoPerfil>;
}

export function ThirdStepCriativo({
  registerFoto,
  register,
  errors,
  errorsFoto,
}: ThirdStepCriativoProps) {
  const [image, setImage] = useState<string | null>(null);

  function ImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      registerFoto("fotoPerfil").onChange(e);
    } else {
      setImage("");
    }
  }
  
  return (
    <>
      <div className="space-y-4 mx-auto w-48 pt-16">
        <div className="text-center">
          <label htmlFor="fotoPerfil" className="font-bold text-center">
            Imagem de perfil
          </label>
        </div>
        <input
          id="fotoPerfil"
          type="file"
          className="hidden"
          {...registerFoto("fotoPerfil")}
          accept="image/*"
          onChange={ImageChange}
        />
        <label htmlFor="fotoPerfil" className="cursor-pointer rounded-2xl mt-2 block">
          {image ? (
            <img src={image} alt="Preview da Imagem" className="rounded-2xl" />
          ) : (
            <img src={foto} alt="Imagem padrão" className="rounded-2xl" />
          )}
        </label>
          {errorsFoto?.fotoPerfil && (
            <p className="text-red-500">{errorsFoto?.fotoPerfil.message as string}</p>
          )}
      </div>

      <div className="flex flex-col mt-4">
        <label htmlFor="apelido" className="font-bold">
          Nome
        </label>
        <input
          type="text"
          id="apelido"
          placeholder="Digite seu apelido."
          className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md"
          {...register("apelido")}
        />
        {errors?.apelido && <p className="text-red-500">{errors.apelido.message}</p>}
      </div>

      <div className="flex flex-col mt-4">
        <label htmlFor="descricaoCurta" className="font-bold">
          Descrição curta
        </label>
        <input
          type="text"
          id="descricaoCurta"
          placeholder="Digite uma descrição curta de uma linha."
          className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md"
          {...register("descricaoCurta")}
        />
        {errors?.descricaoCurta && <p className="text-red-500">{errors.descricaoCurta.message}</p>}
      </div>

      <div className="flex flex-col mt-4">
        <label htmlFor="descricao-longa" className="font-bold">
          Descrição longa
        </label>
        <textarea
          id="descricao-longa"
          placeholder="Digite uma descrição."
          className="bg-transparent outline-none border-[1px] border-white h-40 rounded-md"
          {...register("descricaoLonga")}
        />
        {errors?.descricaoLonga && <p className="text-red-500">{errors.descricaoLonga.message}</p>}
      </div>
    </>
  );
}