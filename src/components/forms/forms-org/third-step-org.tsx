import { FieldErrors, UseFormRegister } from "react-hook-form";
import foto from "../../../assets/foto.png";
import { fotoPerfil, usuarioOrg } from "../../../pages/cadastro-org";
import { useState } from "react";

interface ThirdStepOrgProps {
  registerFoto: UseFormRegister<fotoPerfil>;
  register: UseFormRegister<usuarioOrg>;
  errors: FieldErrors<usuarioOrg>;
  errorsFoto: FieldErrors<fotoPerfil>;
}

export function ThirdStepOrg({
  registerFoto,
  register,
  errors,
  errorsFoto,
}: ThirdStepOrgProps) {
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
            <img src={image} alt="Preview da Imagem" className="rounded-2xl object-cover" />
          ) : (
            <img src={foto} alt="Imagem padrão" className="rounded-2xl object-cover" />
          )}
        </label>
          {errorsFoto?.fotoPerfil && (
            <p className="text-red-500">{errorsFoto?.fotoPerfil.message as string}</p>
          )}
      </div>

      <div className="flex flex-col mt-4">
        <label htmlFor="hashtag" className="font-bold">
          Hashtag
        </label>
        <input
          type="text"
          id="hashtag"
          placeholder="Digite sua hashtag."
          className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md"
          {...register("hashtag")}
        />
        {errors?.hashtag && <p className="text-red-500">{errors.hashtag.message}</p>}
      </div>

      <div className="flex flex-col mt-4">
        <label htmlFor="descricaoCurta" className="font-bold">
          Descrição curta da empresa
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
        <label htmlFor="descricaoEmpresa" className="font-bold">
          Descrição da empresa
        </label>
        <textarea
          id="descricaoEmpresa"
          placeholder="Digite uma descrição."
          className="bg-transparent outline-none border-[1px] border-white h-40 rounded-md"
          {...register("descricaoEmpresa")}
        />
        {errors?.descricaoEmpresa && <p className="text-red-500">{errors.descricaoEmpresa.message}</p>}
      </div>
    </>
  );
}