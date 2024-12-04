import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import ReactFlagsSelect from "react-flags-select";
import { useState } from "react";
import { usuarioOrg } from "@/pages/cadastro-org";

interface SecondStepOrgProps {
  register: UseFormRegister<usuarioOrg>;
  control: Control<usuarioOrg>;
  errors: FieldErrors<usuarioOrg>;
}

export function SecondStepOrg({
  register,
  errors,
  control,
}: SecondStepOrgProps) {
  const [selected, setSelected] = useState("");
  const tiposDeEmpresa = [
    "Agência",
    "Organização",
    "ONG",
    "Startup",
    "Empresa",
    "Instituição",
    "Associação",
    "Fundação",
    "Cooperativa",
    "Corporação",
    "Sociedade",
    "Entidade",
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2 pt-20">
        <label htmlFor="nome" className="font-bold">
          Nome da Empresa
        </label>
        <input
          id="nome"
          placeholder="Digite o nome da sua empresa"
          {...register("nomeEmpresa")}
          className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md w-full px-2"
        />
        {errors.nomeEmpresa && (
          <span className="text-red-500">{errors.nomeEmpresa.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="estado" className="font-bold">
          Tipo de empresa
        </label>
        <select
          id="tipo"
          className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md w-full px-2"
          {...register("tipoEmpresa")}
        >
          {tiposDeEmpresa.map((item) => (
            <option className="text-black">{item}</option>
          ))}
        </select>
        {errors.tipoEmpresa && (
          <span className="text-red-500">{errors.tipoEmpresa.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="pais" className="font-bold">
          País
        </label>
        <Controller
          name="pais"
          control={control}
          render={({ field }) => (
            <ReactFlagsSelect
              className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md w-full text-black"
              selected={field.value || selected}
              onSelect={(code) => {
                setSelected(code);
                field.onChange(code);
              }}
              searchable={true}
              placeholder={"Escolha seu país!"}
              searchPlaceholder="Busca"
              id="pais"
            />
          )}
        />
        {errors.pais && (
          <span className="text-red-500">{errors.pais.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="estado" className="font-bold">
          Estado
        </label>
        <input
          id="estado"
          placeholder="Digite o seu estado"
          {...register("estado")}
          className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md w-full px-2"
        />
        {errors.estado && (
          <span className="text-red-500">{errors.estado.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="cidade" className="font-bold">
          Cidade
        </label>
        <input
          id="cidade"
          placeholder="Digite a sua cidade"
          {...register("cidade")}
          className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md w-full px-2"
        />
        {errors.cidade && (
          <span className="text-red-500">{errors.cidade.message}</span>
        )}
      </div>

      <div className="flex space-x-4">
        <div className="flex-1 space-y-2">
          <label htmlFor="endereco" className="font-bold">
            Endereço
          </label>
          <input
            id="endereco"
            placeholder="Digite o seu endereço"
            {...register("endereco")}
            className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md w-full px-2"
          />
          {errors.endereco && (
            <span className="text-red-500">{errors.endereco.message}</span>
          )}
        </div>
        <div className="w-1/4 space-y-2">
          <label htmlFor="numero" className="font-bold">
            Número
          </label>
          <input
            id="numero"
            type="number"
            {...register("numero")}
            className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md w-full px-2"
          />
          {errors.numero && (
            <span className="text-red-500">{errors.numero.message}</span>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1 space-y-2">
          <label htmlFor="codigoPostal" className="font-bold">
            Código Postal
          </label>
          <input
            id="codigoPostal"
            type="text"
            {...register("codigoPostal")}
            className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md w-full px-2"
          />
          {errors.codigoPostal && (
            <span className="text-red-500">{errors.codigoPostal.message}</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label htmlFor="complemento" className="font-bold flex">
            Complemento <span className="text-gray-400">(opcional)</span>
          </label>
          <input
            id="complemento"
            {...register("complemento")}
            className="bg-transparent outline-none border-[1px] border-white h-10 rounded-md w-full px-2"
          />
          {errors.complemento && (
            <span className="text-red-500">{errors.complemento.message}</span>
          )}
        </div>
      </div>
    </div>
  );
}
