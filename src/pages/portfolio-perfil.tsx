import { Header } from "@/components/header";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import useAutocomplete from "@mui/material/useAutocomplete";
import { EditarProjeto } from "@/components/editar-projeto";
import { Footer } from "@/components/footer";

const port = import.meta.env.VITE_PORT;

const bannerSchema = z.object({
  banner: z
    .any()
    .refine((files) => files?.length === 1, "1 banner é necessário."),
});

const projetoSchema = z.object({
  titulo: z.string(),
  banner: bannerSchema.shape.banner.optional(),
});

export interface Projeto {
  id: number;
  titulo: string | null;
  nomeCriador: string | null;
  banner: {
    data: number[];
  };
  tags: {
    nome: string;
  }[];
  views: number | null;
  conteudo: string;
  createdAt: string;
  updatedAt: string;
  criadorId: string | null;
  orgId: string | null;
  colaboradores: Usuario[];
  likes: {
    id: string;
    usuarioId: string;
    like: number;
    projetoId: number;
  }[];
}

export interface Usuario {
  id: string;
  username: string;
  usuarioCriativoId: string;
  fotoPerfil: {
    data: number[];
  };
  Projetos: Projeto[];
  colaborador: {
    id: number;
    usuarioCriativoId: string;
    projetoId: number;
  }[];
}

export type projeto = z.infer<typeof projetoSchema>;

async function fetchDataCriativo() {
  const response = await axios.get(`${port}/get-all-usuario-criativo`);
  return response.data as Usuario;
}

async function fetchUserCriativo(perfilname: string) {
  const response = await axios.get(
    `${port}/get-usuario-criativo-by-name/${perfilname}`
  );
  return response.data as Usuario;
}

async function fetchUserOrg(perfilname: string) {
  const response = await axios.get(
    `${port}/get-usuario-org-by-name/${perfilname}`
  );
  return response.data as Usuario;
}

async function fetchProjetoById(id: number) {
  const response = await axios.get(`${port}/get-projeto-by-id/${id}`);
  return response.data as Projeto;
}

export function PortfolioPerfil() {
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
  const { register, handleSubmit, watch } = useForm<projeto>({
    resolver: zodResolver(projetoSchema),
  });

  const { user: userData, userData: usuario } = useAuth();
  const { username } = useParams<string>();
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedColaboradores, setSelectedColaboradores] = useState<Usuario[]>(
    []
  );

  const { data: dataCriativo } = useQuery({
    queryKey: ["userCriativo"],
    queryFn: fetchDataCriativo,
  });

  const { data: userCriativo, isSuccess: isSuccessCriativo } = useQuery({
    queryKey: ["userCriativo", username],
    queryFn: () => fetchUserCriativo(username || ""),
    enabled: !!username,
  });

  const { data: userOrg, isSuccess: isSuccessOrg } = useQuery({
    queryKey: ["userOrg", username],
    queryFn: () => fetchUserOrg(username || ""),
    enabled: !!username,
  });
  const queryClient = useQueryClient();

  const user =
    isSuccessCriativo && userCriativo
      ? userCriativo
      : isSuccessOrg && userOrg
      ? userOrg
      : null;

  const colaboradorProjetosIds =
    user?.colaborador?.map((colab) => colab.projetoId) || [];

  const colaboradorProjetosQueries = useQueries({
    queries: colaboradorProjetosIds.map((id) => ({
      queryKey: ["projeto", id],
      queryFn: () => fetchProjetoById(id),
      enabled: !!id,
    })),
  });

  const colaboradorProjetos = colaboradorProjetosQueries
    .filter((query) => query.isSuccess)
    .map((query) => query.data);

  async function createProjeto(data: projeto) {
    const orgId = userData?.type === "org" ? userData.id : undefined;
    const criadorId = userData?.type !== "org" ? userData?.id : undefined;
    const bannerFile = data.banner?.[0];
    const colaboradoresIds = selectedColaboradores.map(
      (colaborador) => colaborador.id
    );

    try {
      const response = await axios.post(`${port}/create-projeto`, {
        titulo: data.titulo,
        orgId,
        criadorId,
      });

      console.log("Resposta do servidor:", response);
      const projetoID = response.data.id;

      await axios.post(`${port}/create-colaborador`, {
        projetoId: projetoID,
        usuarioCriativoIds: colaboradoresIds,
      });

      if (selectedTags.length > 0) {
        const tagsToSend = selectedTags.map((tag) => ({ nome: tag }));
        await axios.put(`${port}/update-tags`, {
          novasTags: tagsToSend,
          projetoId: projetoID,
        });
        console.log("Tags enviadas com sucesso!");
      }

      if (bannerFile) {
        const formDataBanner = new FormData();
        formDataBanner.append("banner", bannerFile);

        await axios.put(
          `${port}/update-projeto-banner/upload/${projetoID}`,
          formDataBanner,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Sucesso ao enviar o banner.");
      }
      void (isSuccessCriativo
        ? await queryClient.invalidateQueries({
            queryKey: ["userCriativo"],
          })
        : await queryClient.invalidateQueries({ queryKey: ["userOrg"] }));
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
    }
  }

  function BannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerPreview(imageUrl);
      register("banner").onChange(e);
    } else {
      setBannerPreview("");
    }
  }

  const tituloValue = watch("titulo");
  const bannerValue = watch("banner");

  useEffect(() => {
    setIsFormValid(!!tituloValue && !!bannerValue?.length);
  }, [tituloValue, bannerValue]);

  function bufferToDataURL(buffer: number[], mimeType: string): string {
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  const options = [...(Array.isArray(dataCriativo) ? dataCriativo : [])];

  const { getInputProps, getListboxProps, getOptionProps, groupedOptions } =
    useAutocomplete({
      options,
      getOptionLabel: (option) => option.username,
      onChange: (event, value) => {
        if (
          value &&
          !selectedColaboradores.find((col) => col.id === value.id)
        ) {
          setSelectedColaboradores((prev) => [...prev, value]);
          event.preventDefault();
        }
      },
    });

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

  return (
    <>
      <div className="min-h-screen flex flex-col text-white">
        <Header />
        <h1 className="text-xl font-bold mx-auto pt-8">
          Projetos de {username}
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <h1 className="bg-white text-black w-[160px] rounded-lg font-bold text-center mx-auto">
              {usuario?.username === username && "Adicionar projeto"}
            </h1>
          </DialogTrigger>
          <DialogContent className="bg-[#121212] text-white border-none h-[720px]">
            <DialogTitle>
              <h1>Adicionar projeto</h1>
            </DialogTitle>
            <form onSubmit={handleSubmit(createProjeto)} className="space-y-2">
              <div>
                <img
                  alt="banner"
                  className="relative -z-0 rounded-md w-full max-h-32 object-cover"
                  src={!bannerPreview ? "" : bannerPreview}
                />
                <div className="mx-auto w-[100px]">
                  <label htmlFor="banner">
                    <input
                      type="file"
                      className="hidden"
                      id="banner"
                      accept="image/*"
                      {...register("banner")}
                      onChange={BannerChange}
                    />
                    <div className="bottom-20 relative bg-white/25 rounded-full flex justify-center items-center size-10 mx-auto">
                      <Camera className="relative z-10 hover:cursor-pointer" />
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col w-full h-12 bg-[#373737] rounded-md">
                <label htmlFor="titulo" className="text-sm pl-2">
                  Titulo
                </label>
                <input
                  type="text"
                  className="w-full h-12 bg-[#373737] rounded-md focus:outline-none pl-3"
                  id="titulo"
                  {...register("titulo")}
                />
              </div>

              <div className="flex gap-2 mb-2">
                {selectedColaboradores.map((colaborador) => (
                  <span
                    key={colaborador.id}
                    className="bg-[#373737] text-white px-2 py-1 rounded-full"
                  >
                    {colaborador.username}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedColaboradores((prev) =>
                          prev.filter((col) => col.id !== colaborador.id)
                        )
                      }
                      className="text-white hover:text-red-700 font-bold pl-2"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex flex-col w-full h-12 bg-[#373737] rounded-md">
                <label htmlFor="colaboradores" className="text-sm pl-2">
                  Colaboradores
                </label>

                <input
                  {...getInputProps()}
                  className="w-full h-12 bg-[#373737] rounded-md focus:outline-none pl-3"
                />
                {groupedOptions.length > 0 && (
                  <ul
                    {...getListboxProps()}
                    className=" bg-[#1c1c1c] space-y-2  relative z-50 w-full rounded-lg"
                  >
                    {groupedOptions.map((option, index) => (
                      <li
                        {...getOptionProps({ option, index })}
                        key={option.id}
                      >
                        <div className="flex items-center gap-2 hover:bg-white/25 rounded-lg p-2">
                          {option.fotoPerfil?.data && (
                            <img
                              src={bufferToDataURL(
                                option.fotoPerfil.data,
                                "image/*"
                              )}
                              alt={`${option.username} Foto de Perfil`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <span>{option.username}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4">
                <h1 className="font-bold">Tags do projeto:</h1>
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
                            isTagSelected(item) ? "bg-red-500" : "bg-[#565656]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )
                )}
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`mt-4 ${
                  !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                enviar
              </button>
            </form>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-3 w-[1100px] mx-auto gap-4 pt-12">
          {user?.Projetos?.length ? (
            user.Projetos.map((item, index) => {
              const bannerUrl = item.banner?.data
                ? bufferToDataURL(item.banner.data, "image/*")
                : "";

              return (
                <div key={index}>
                  {bannerUrl && (
                    <Link
                      to={`/id/${user.username}/portfolio/${item.id}/${item.titulo}`}
                    >
                      <img
                        src={bannerUrl}
                        alt={`${item.titulo} banner`}
                        className="w-[350px] h-[200px] object-cover rounded-md"
                      />
                    </Link>
                  )}

                  <div className="flex justify-between p-1">
                    <h2 className="font-bold text-xl pt-px">{item.titulo}</h2>
                    <EditarProjeto
                      options={options}
                      getOptionLabel={(option) => option.username}
                      onChange={(event, value) => {
                        if (
                          value &&
                          !selectedColaboradores.find(
                            (col) => col.id === value.id
                          )
                        ) {
                          setSelectedColaboradores((prev) => [...prev, value]);
                          event.preventDefault();
                        }
                      }}
                      selectedColaboradores={selectedColaboradores}
                      setSelectedColaboradores={setSelectedColaboradores}
                      projetoId={item.id}
                      projetoTitulo={item.titulo || ""}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-white">Nenhum projeto encontrado.</p>
          )}
        </div>
        {isSuccessCriativo && (
          <>
            <h1 className="text-xl font-bold pt-2 bg-[#232323] w-full mt-14">
              <div className="mx-auto w-[283px] pt-2">
                Projetos como colaborador
              </div>
            </h1>
            <div className="mx-auto pt-6 w-full h-[300px] bg-[#232323]">
              <div className="grid grid-cols-3 w-[1100px] mx-auto gap-4 ">
                {colaboradorProjetos.length > 0 ? (
                  colaboradorProjetos.map((projeto) => (
                    <div key={projeto.id}>
                      <Link
                        to={`/id/${user?.username}/portfolio/${projeto.id}/${projeto.titulo}`}
                      >
                        <img
                          src={bufferToDataURL(projeto.banner.data, "image/*")}
                          alt={`${projeto.titulo} banner`}
                          className="w-[350px] h-[200px] object-cover rounded-md"
                        />
                      </Link>
                      <div className="flex justify-between p-1">
                        <h2 className="font-bold text-xl pt-px">
                          {projeto.titulo}
                        </h2>
                        <EditarProjeto
                          options={options}
                          getOptionLabel={(option) => option.username}
                          onChange={(event, value) => {
                            if (
                              value &&
                              !selectedColaboradores.find(
                                (col) => col.id === value.id
                              )
                            ) {
                              setSelectedColaboradores((prev) => [
                                ...prev,
                                value,
                              ]);
                              event.preventDefault();
                            }
                          }}
                          selectedColaboradores={selectedColaboradores}
                          setSelectedColaboradores={setSelectedColaboradores}
                          projetoId={projeto.id}
                          projetoTitulo={projeto.titulo || ""}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Nenhum projeto encontrado como colaborador.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
