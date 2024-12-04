import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

const port = import.meta.env.VITE_PORT;

interface usuario {
  id: string;
  fotoPerfil: string;
  banner: string;
  isSuccessCriativo: boolean;
}

const updateUserSchema = z.object({
  apelido: z.string(),
  descricaoCurta: z.string(),
  descricaoLonga: z.string(),
  disponibilidade: z.string().optional(),
});

const fotoPerfilSchema = z.object({
  fotoPerfil: z
    .any()
    .refine((files) => files?.length === 1, "1 foto é necessária."),
});

const bannerSchema = z.object({
  banner: z
    .any()
    .refine((files) => files?.length === 1, "1 banner é necessário."),
});

export type updateUser = z.infer<typeof updateUserSchema>;
export type fotoPerfil = z.infer<typeof fotoPerfilSchema>;
export type bannerImg = z.infer<typeof bannerSchema>;

export function EditarPerfil(user: usuario) {
  const { isAuthenticated, userData, user: userToken } = useAuth();
  const queryClient = useQueryClient();

  const { register, handleSubmit, control } = useForm<updateUser>({
    resolver: zodResolver(updateUserSchema),
  });

  const { register: registerFoto, handleSubmit: handleSubmitFoto } =
    useForm<fotoPerfil>({
      resolver: zodResolver(fotoPerfilSchema),
    });

  const { register: registerBanner, handleSubmit: handleSubmitBanner } =
    useForm<bannerImg>({
      resolver: zodResolver(bannerSchema),
    });

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
  const [fotoPerfilpreview, setFotoPerfilPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  function ImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFotoPerfilPreview(imageUrl);
      registerFoto("fotoPerfil").onChange(e);
    } else {
      setFotoPerfilPreview("");
    }
  }

  function BannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerPreview(imageUrl);
      registerBanner("banner").onChange(e);
    } else {
      setBannerPreview("");
    }
  }

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

  async function onSubmit(data: updateUser) {
    try {
      const response =
        userToken?.type === "org"
          ? await axios.put(
              `${port}/update-usuario-org/${userToken?.id}`,
              {
                apelido: data.apelido || undefined,
                descricaoCurta: data.descricaoCurta || undefined,
                descricaoLonga: data.descricaoLonga || undefined,
              }
            )
          : await axios.put(
              `${port}/update-usuario-criativo/${userToken?.id}`,
              {
                apelido: data.apelido || undefined,
                descricaoCurta: data.descricaoCurta || undefined,
                descricaoLonga: data.descricaoLonga || undefined,
                disponibilidade: data.disponibilidade || undefined,
              }
            );

      void (user.isSuccessCriativo
        ? await queryClient.invalidateQueries({ queryKey: ["userCriativo"] })
        : await queryClient.invalidateQueries({ queryKey: ["userOrg"] }));

      console.log("Dados do usuário atualizados:", response.data);

      handleSubmitFoto(async (fotoData: fotoPerfil) => {
        const fotoPerfilFile = fotoData.fotoPerfil?.[0];
        if (fotoPerfilFile) {
          const formDataFoto = new FormData();
          formDataFoto.append("fotoPerfil", fotoPerfilFile);

          const uploadUrl =
            userToken?.type === "org"
              ? `${port}/update-usuario-org/upload/${userToken?.id}`
              : `${port}/update-usuario-criativo/upload/${userToken?.id}`;

          await axios.put(uploadUrl, formDataFoto, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("Foto de perfil enviada com sucesso!");
        }
      })();

      handleSubmitBanner(async (bannerData: bannerImg) => {
        const bannerFile = bannerData.banner?.[0];
        if (bannerFile) {
          const formDataBanner = new FormData();
          formDataBanner.append("banner", bannerFile);

          const uploadUrl =
            userToken?.type === "org"
              ? `${port}/update-usuario-org/upload/${userToken?.id}`
              : `${port}/update-usuario-criativo/upload/${userToken?.id}`;

          await axios.put(uploadUrl, formDataBanner, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("Banner enviado com sucesso!");
          void (user.isSuccessCriativo
            ? await queryClient.invalidateQueries({
                queryKey: ["userCriativo"],
              })
            : await queryClient.invalidateQueries({ queryKey: ["userOrg"] }));
        }
      })();

      if (selectedTags.length > 0) {
        const tagsToSend = selectedTags.map((tag) => ({ nome: tag }));
        await axios.put(`${port}/update-tags`, {
          novasTags: tagsToSend,
          usuarioOrgId: user.isSuccessCriativo ? undefined : userToken?.id,
          usuarioCriativoId: !user.isSuccessCriativo
            ? undefined
            : userToken?.id,
        });
        console.log("Tags enviadas com sucesso!");
        void (user.isSuccessCriativo
          ? await queryClient.invalidateQueries({ queryKey: ["userCriativo"] })
          : await queryClient.invalidateQueries({ queryKey: ["userOrg"] }));
      } else {
        console.log("Nenhuma tag para enviar.");
      }
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {isAuthenticated && user.id == userData?.id ? (
            <h1 className="absolute bottom-0 right-0 bg-white font-bold text-center text-black w-[120px] h-8 mb-8 mr-8 p-1 rounded-md hover:cursor-pointer">
              Editar Perfil
            </h1>
          ) : null}
        </DialogTrigger>
        <DialogContent className="bg-[#121212] text-white border-none h-[700px]">
          <ScrollArea className="h-[600px]">
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <h1>Editar Perfil</h1>
                  <button className="mr-6 text-black bg-white rounded-2xl h-8 w-20 text-base">
                    Salvar
                  </button>
                </DialogTitle>
              </DialogHeader>
              <div>
                <img
                  alt="banner"
                  className="relative -z-0 top-14 rounded-md w-full max-h-32 object-cover"
                  src={!bannerPreview ? user.banner : bannerPreview}
                />
                <div className="mx-auto w-[100px]">
                  <label htmlFor="banner">
                    <input
                      type="file"
                      className="hidden"
                      id="banner"
                      accept="image/*"
                      {...registerBanner("banner")}
                      onChange={BannerChange}
                    />
                    <div className="bg-white/25 rounded-full flex justify-center items-center size-10 mx-auto">
                      <Camera className="relative z-10 hover:cursor-pointer" />
                    </div>
                  </label>
                </div>
                <div className="relative inline-block">
                  <label htmlFor="fotoPerfil">
                    <img
                      src={
                        !fotoPerfilpreview ? user.fotoPerfil : fotoPerfilpreview
                      }
                      alt="fotoPerfil"
                      className="rounded-full size-24 object-cover"
                    />
                    <Camera className="absolute inset-0 left-9 top-8 z-10 hover:cursor-pointer" />
                    <input
                      type="file"
                      className="hidden"
                      id="fotoPerfil"
                      {...registerFoto("fotoPerfil")}
                      onChange={ImageChange}
                      accept="image/*"
                    />
                  </label>
                </div>
                <div className="flex flex-col w-full h-12 bg-[#373737] rounded-md mt-2">
                  <label htmlFor="nome" className="text-sm pl-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 bg-[#373737] rounded-md focus:outline-none pl-3"
                    {...register("apelido")}
                  />
                </div>
                <div className="flex flex-col w-full h-12 bg-[#373737] rounded-md mt-2">
                  <label htmlFor="nome" className="text-sm pl-2">
                    Descricão curta
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 bg-[#373737] rounded-md focus:outline-none pl-3"
                    {...register("descricaoCurta")}
                  />
                </div>
                <div className="flex flex-col w-full h-12 bg-[#373737] rounded-md mt-2">
                  <label htmlFor="nome" className="text-sm pl-2">
                    Descricão Longa
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 bg-[#373737] rounded-md focus:outline-none pl-3"
                    {...register("descricaoLonga")}
                  />
                </div>

                <div className="pt-4">
                  <h1 className="font-bold">Procurando:</h1>
                  {[diretores, visual, ilustracao, socialMedia, audio].map(
                    (category, index) => (
                      <div
                        key={index}
                        className="font-bold text-sm flex gap-2 flex-wrap justify-center pt-4"
                      >
                        {category.map((item) => (
                          <button
                            type="button"
                            onClick={() => addTags(item)}
                            key={item}
                            className={`h-6 w-auto rounded-lg px-2 ${
                              isTagSelected(item)
                                ? "bg-red-500"
                                : "bg-[#565656]"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )
                  )}
                </div>

                {user.isSuccessCriativo && (
                  <div className="pt-4">
                    <h1 className="font-bold">Disponibilidade</h1>
                    <Controller
                      name="disponibilidade"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <div className="flex text-white gap-3 text-sm pt-2">
                          {[
                            "Remoto",
                            "Presencial",
                            "Freelance",
                            "Voluntário",
                          ].map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                value={option}
                                id={`option-${index + 1}`}
                                checked={
                                  field.value
                                    ? field.value.split("|").includes(option)
                                    : false
                                }
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  const currentValues = field.value
                                    ? field.value.split("|")
                                    : [];
                                  const newValue = e.target.checked
                                    ? [...currentValues, option]
                                    : currentValues.filter(
                                        (value) => value !== option
                                      );
                                  field.onChange(newValue.join("|"));
                                }}
                                className="hidden"
                              />
                              <label
                                htmlFor={`option-${index + 1}`}
                                className={`flex items-center justify-center h-4 w-4 bg-[#232323] border border-white rounded cursor-pointer ${
                                  field.value &&
                                  field.value.split("|").includes(option)
                                    ? "bg-[#232323]"
                                    : ""
                                }`}
                              >
                                {field.value &&
                                field.value.split("|").includes(option)
                                  ? "✓"
                                  : ""}{" "}
                              </label>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </div>
                )}
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
