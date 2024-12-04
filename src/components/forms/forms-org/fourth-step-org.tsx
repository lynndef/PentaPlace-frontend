import { useState, useEffect } from "react";
import { usuarioOrg } from "@/pages/cadastro-org";
import {
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import { tags } from "@/pages/cadastro-org";

interface FourthStepOrgProps {
  register: UseFormRegister<usuarioOrg>;
  control: Control<usuarioOrg>;
  errors: FieldErrors<usuarioOrg>;
  setValueUser: UseFormSetValue<tags>;
  registerTags: UseFormRegister<tags>;
  errorsTags: FieldErrors<tags>;
  getValuesUser: UseFormGetValues<usuarioOrg>;
}

export function FourthStepOrg({
  setValueUser,
}: FourthStepOrgProps) {
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
        Tipos de profissionais que busca
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
    </div>
  );
}
