import { useState, useEffect } from "react";
import { usuarioCriativo } from "@/pages/cadastro-criativo";
import {
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormSetValue,
  Controller,
  UseFormGetValues,
} from "react-hook-form";
import { tags } from "@/pages/cadastro-criativo";

interface FourthStepCriativoProps {
  register: UseFormRegister<usuarioCriativo>;
  control: Control<usuarioCriativo>;
  errors: FieldErrors<usuarioCriativo>;
  setValueUser: UseFormSetValue<tags>;
  registerTags: UseFormRegister<tags>;
  errorsTags: FieldErrors<tags>;
  getValuesUser: UseFormGetValues<usuarioCriativo>;
}

export function FourthStepCriativo({
  setValueUser,
  control,
  register
}: FourthStepCriativoProps) {
  const diretores = ["Diretor de arte", "Diretor de marketing"];
  const visual = [
    "Editor",
    "Videomaker",
    "Motion 2D",
    "Motion 3D",
    "Animação",
    "Generalista 3D",
  ];
  const ilustracao = ["Designer", "Streamack", "Ilustrador", "Fotógrafo"];
  const socialMedia = ["Socialmedia", "Roteiristas", "Gerente de comunidade"];
  const audio = ["Sonoplasta", "Músico"];

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  function addTags(tag: string) {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((prevTag) => prevTag !== tag)
        : [...prevTags, tag]
    );
  }

  function isTagSelected(tag: string) {
    return selectedTags.includes(tag);
  }

  useEffect(() => {
    selectedTags.forEach((tag, index) => {
      setValueUser(`${index}.nome` as const, tag);
    });
  }, [selectedTags, setValueUser]);

  return (
    <div className="flex items-center flex-col gap-4">
      <label htmlFor="email" className="font-bold">
        Selecione com o que você trabalha
      </label>
      <div className="font-bold text-sm flex gap-2 flex-wrap justify-center">
        {selectedTags.map((item) => (
          <h1 key={item} className="h-6 w-auto rounded-lg px-2 bg-lime-500">
            <div>{item}</div>
          </h1>
        ))}
      </div>
      <div className="w-full h-px bg-[#8F8F8F]" />
      {[diretores, visual, ilustracao, socialMedia, audio].map(
        (category, index) => (
          <div
            key={index}
            className="font-bold text-sm flex gap-2 flex-wrap justify-center"
          >
            {category.map((item) => (
              <button
                type="button"
                onClick={() => addTags(item)}
                key={item}
                className={`h-6 w-auto rounded-lg px-2 ${
                  isTagSelected(item) ? "bg-red-500" : "bg-[#565656]"
                }`}
              >
                {item}
              </button>
            ))}
            <div className="w-full h-px bg-[#8F8F8F]" />
          </div>
        )
      )}
      <div>
        <h1 className="font-bold">Experiência de mercado desde:</h1>
        <input type="date" 
        className="ml-[60px] text-black"
           {...register("experiencia")}
        />
      </div>
      <div>
        <h1 className="font-bold text-center">Disponibilidade</h1>
        <Controller
          name="disponibilidade"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div className="flex text-white gap-3 text-sm">
              {["Remoto", "Presencial", "Freelance", "Voluntário"].map(
                (option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={option}
                      id={`option-${index + 1}`}
                      checked={
                        field.value
                          ? field.value.split("|").includes(option)
                          : false
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const currentValues = field.value
                          ? field.value.split("|")
                          : [];
                        const newValue = e.target.checked
                          ? [...currentValues, option]
                          : currentValues.filter((value) => value !== option);
                        field.onChange(newValue.join("|"));
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor={`option-${index + 1}`}
                      className={`flex items-center justify-center h-4 w-4 bg-[#232323] border border-white rounded cursor-pointer ${
                        field.value && field.value.split("|").includes(option)
                          ? "bg-[#232323]"
                          : ""
                      }`}
                    >
                      {field.value && field.value.split("|").includes(option)
                        ? "✓"
                        : ""}
                    </label>
                    <span>{option}</span>
                  </div>
                )
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}
