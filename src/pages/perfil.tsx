import { Header } from "@/components/header";
import { Link, NavLink, useParams } from "react-router-dom";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { Rating } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EditarPerfil } from "@/components/editar-perfil";
import { Footer } from "@/components/footer";

export interface usuarioCriativo {
  id: string;
  username: string;
  estado: string;
  cidade: string;
  descricaoCurta: string;
  descricaoLonga: string;
  descricaoEmpresa: string;
  apelido: string;
  fotoPerfil: {
    data: number[];
  };
  banner: {
    data: number[];
  };
  tags: {
    nome: string;
  }[];
  avaliacao: {
    avaliacaoNumero: number;
  }[];
  perfilComentarios: {
    id: string;
    texto: string;
    data: string;
    avaliacao: number;
    usuarioCriativoId?: string;
    usuarioOrgId?: string;
    perfilCriativoId?: string;
    perfilOrgId?: string;
  }[];
  disponibilidade: string;
  hashtag: string;
  experiencia: string;
  recebeuRecomendacoes: {
    id: string;
    recomendadorOrgId: string;
    recomendadoCriativoId: string | null;
    recomendadoOrgId: string | null;
    recomendadorOrg: usuarioOrg[];
    recomendadorCriativo: usuarioCriativo[];
  }[];
}

export interface usuarioOrg {
  id: string;
  username: string;
  apelido: string;
  estado: string;
  cidade: string;
  descricaoCurta: string;
  descricaoLonga: string;
  descricaoEmpresa: string;
  fotoPerfil: {
    data: number[];
  };
  banner: {
    data: number[];
  };
  tags: {
    nome: string;
  }[];
  avaliacao: {
    avaliacaoNumero: number;
  }[];
  perfilComentarios: {
    id: string;
    texto: string;
    data: string;
    avaliacao: number;
    usuarioCriativoId?: string;
    usuarioOrgId?: string;
    perfilCriativoId?: string;
    perfilOrgId?: string;
  }[];
  disponibilidade: string;
  hashtag: string;
  experiencia: string;
  recebeuRecomendacoes: {
    id: string;
    recomendadorCriativoId: string;
    recomendadoCriativoId: string | null;
    recomendadoOrgId: string | null;
    recomendadorCriativo: usuarioCriativo[];
    recomendadorOrg: usuarioOrg[];
  }[];
}

const port = import.meta.env.VITE_PORT;

interface comentario {
  texto: string;
  avaliacao: number;
}

function bufferToDataURL(buffer: number[], mimeType: string): string {
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  return URL.createObjectURL(blob);
}

async function fetchUserCriativo(perfilname: string) {
  const response = await axios.get(
    `${port}/get-usuario-criativo-by-name/${perfilname}`
  );
  return response.data as usuarioCriativo;
}

async function fetchUserOrg(perfilname: string) {
  const response = await axios.get(
    `${port}/get-usuario-org-by-name/${perfilname}`
  );
  return response.data as usuarioOrg;
}

async function fetchComentarioAuthor(
  perfilCriativoId?: string,
  perfilOrgId?: string
) {
  if (perfilCriativoId) {
    const response = await axios.get(
      `${port}/get-usuario-criativo-by-id/${perfilCriativoId}`
    );
    return response.data as usuarioCriativo;
  } else if (perfilOrgId) {
    const response = await axios.get(
      `${port}/get-usuario-org-by-id/${perfilOrgId}`
    );
    return response.data as usuarioOrg;
  }
  return null;
}

const comentarioSchema = z.object({
  texto: z.string(),
  avaliacao: z.number().min(0).max(5),
});

type FormData = z.infer<typeof comentarioSchema>;

export function Perfil() {
  type TagName =
    | "Diretor de arte"
    | "Diretor de Marketing"
    | "Editor"
    | "Videomaker"
    | "Motion 2D"
    | "Motion 3D"
    | "Animação"
    | "Generalista 3D"
    | "Designer"
    | "Streampack"
    | "Ilustrador"
    | "Fotógrafo"
    | "Socialmedia"
    | "Roteirista"
    | "Gerente de comunidade"
    | "Sonoplasta"
    | "Músico";

  const tagColors: Record<TagName, string> = {
    "Diretor de arte": "bg-red-600",
    "Diretor de Marketing": "bg-red-600",
    Editor: "bg-sky-600",
    Videomaker: "bg-sky-600",
    "Motion 2D": "bg-sky-600",
    "Motion 3D": "bg-sky-600",
    Animação: "bg-sky-600",
    "Generalista 3D": "bg-sky-600",
    Designer: "bg-purple-600",
    Streampack: "bg-purple-600",
    Ilustrador: "bg-purple-600",
    Fotógrafo: "bg-purple-600",
    Socialmedia: "bg-green-600",
    Roteirista: "bg-green-600",
    "Gerente de comunidade": "bg-green-600",
    Sonoplasta: "bg-orange-600",
    Músico: "bg-orange-600",
  };

  const { register, handleSubmit, control } = useForm<FormData>({
    resolver: zodResolver(comentarioSchema),
  });
  const { isAuthenticated, userData, user: userToken } = useAuth();
  const queryClient = useQueryClient();
  const { username } = useParams<string>();

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

  const user =
    isSuccessCriativo && userCriativo
      ? userCriativo
      : isSuccessOrg && userOrg
      ? userOrg
      : null;

  const [comentariosPositivos, setComentariosPositivos] = useState<
    {
      texto: string;
      autorNome: string;
      autorFoto: string;
      ratingValue: number;
    }[]
  >([]);
  const [comentariosNegativos, setComentariosNegativos] = useState<
    {
      texto: string;
      autorNome: string;
      autorFoto: string;
      ratingValue: number;
    }[]
  >([]);

  useEffect(() => {
    async function fetchComentarios() {
      if (user) {
        const positivos = await Promise.all(
          user.perfilComentarios
            .filter((comment) => comment.avaliacao >= 3)
            .map(async (comment) => {
              const autor = await fetchComentarioAuthor(
                comment.usuarioCriativoId,
                comment.usuarioOrgId
              );
              const autorNome = autor?.username || "Anônimo";
              const autorFoto = autor?.fotoPerfil?.data
                ? bufferToDataURL(autor.fotoPerfil.data, "image/*")
                : "";
              return {
                texto: comment.texto,
                autorNome,
                autorFoto,
                ratingValue: comment.avaliacao,
              };
            })
        );
        const negativos = await Promise.all(
          user.perfilComentarios
            .filter((comment) => comment.avaliacao < 3)
            .map(async (comment) => {
              const autor = await fetchComentarioAuthor(
                comment.usuarioCriativoId,
                comment.usuarioOrgId
              );
              const autorNome = autor?.username || "Anônimo";
              const autorFoto = autor?.fotoPerfil?.data
                ? bufferToDataURL(autor.fotoPerfil.data, "image/*")
                : "";
              return {
                texto: comment.texto,
                autorNome,
                autorFoto,
                ratingValue: comment.avaliacao,
              };
            })
        );
        setComentariosPositivos(positivos);
        setComentariosNegativos(negativos);
      }
    }
    fetchComentarios();
  }, [user]);

  if (!user) {
    return 
  }

  const fotoPerfil = user.fotoPerfil?.data
    ? bufferToDataURL(user.fotoPerfil.data, "image/*")
    : "";

  const fotoPerfilToken = userData?.fotoPerfil?.data
    ? bufferToDataURL(userData.fotoPerfil.data, "image/*")
    : "";

  const banner = user.banner?.data
    ? bufferToDataURL(user.banner.data, "image/*")
    : "";

  async function onSubmit(data: FormData) {
    const requestBody = {
      texto: data.texto,
      avaliacao: data.avaliacao,
      usuarioCriativoId:
        userToken?.type === "criativo" ? userData?.id : undefined,
      usuarioOrgId: userToken?.type === "org" ? userData?.id : undefined,
      perfilCriativoId: isSuccessCriativo ? user?.id : undefined,
      perfilOrgId: isSuccessOrg ? user?.id : undefined,
    };

    console.log(requestBody);

    const responseComentario = await axios.post(
      `${port}/create-comentario`,
      requestBody
    );

    if (isSuccessCriativo) {
      const updateResponse = await axios.put(
        `${port}/create-avaliacao`,
        {
          avaliacaoNumero: data.avaliacao,
          usuarioCriativoId: user?.id,
        }
      );
      console.log("Atualização de usuarioCriativo:", updateResponse.data);
      await queryClient.invalidateQueries({ queryKey: ["userCriativo"] });
      await queryClient.invalidateQueries({ queryKey: ["userOrg"] });
    } else if (isSuccessOrg) {
      const updateResponse = await axios.put(
        `${port}/create-avaliacao`,
        {
          avaliacaoNumero: data.avaliacao,
          usuarioOrgId: user?.id,
        }
      );
      console.log("Atualização de usuarioOrg:", updateResponse.data);
      await queryClient.invalidateQueries({ queryKey: ["userCriativo"] });
      await queryClient.invalidateQueries({ queryKey: ["userOrg"] });
    }

    return responseComentario.data as comentario;
  }

  async function enviarRecomendacao() {
    event?.preventDefault();
    try {
      const response = isSuccessCriativo
        ? await axios.post(
            `${port}/create-recomendado-criativo`,
            {
              usuarioOrgId: userData?.id,
              usuarioCriativoId: user?.id,
            }
          )
        : await axios.post(`${port}/create-recomendado-org`, {
            usuarioOrgId: user?.id,
            usuarioCriativoId: userData?.id,
          });
      console.log("recomendado com sucesso!" + response);
    } catch (error) {
      console.log(user?.id);
      console.log(error);
    }
  }

  const dataAntiga = new Date(user?.experiencia).getTime();
  const dataAtual = Date.now();
  const diferencaEmMilissegundos = dataAntiga - dataAtual;
  const anosDeDiferenca =
    diferencaEmMilissegundos / (1000 * 60 * 60 * 24 * 365.25);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="w-full h-[400px]">
          <div className="w-[1440px] h-full mx-auto">
            <img
              src={banner ? banner : "../src/assets/headerbanner.png"}
              alt="banner"
              className="w-full h-full object-cover relative"
            />
          </div>
          <div className="w-[980px] h-[516px] mx-auto relative bottom-[118px]">
            <div className="bg-[#373737] w-full h-full rounded-2xl flex relative">
              <div className="rounded-2xl flex flex-col relative">
                <div className="flex p-2 pt-4">
                  <div className="pl-12 pt-4">
                    <img
                      src={fotoPerfil}
                      alt="foto"
                      className="w-[140px] h-[140px] rounded-full object-cover"
                    />
                  </div>
                  <div className="pt-[34px] pl-7 text-base text-white">
                    <div className="flex gap-2">
                      <h1 className="text-lg font-bold pb-1.5">
                        {user.apelido || user.username}
                      </h1>
                      <Rating
                        value={
                          user.avaliacao.length > 0
                            ? user.avaliacao.reduce(
                                (acc, curr) => acc + curr.avaliacaoNumero,
                                0
                              ) / user.avaliacao.length
                            : 0
                        }
                        precision={0.5}
                        readOnly
                      />
                    </div>
                    <p>{user.descricaoCurta}</p>
                    <p>{user.estado + ", " + user.cidade}</p>
                    {isSuccessOrg ? (
                      <h1>#{user?.hashtag.replace(/\s+/g, "")}</h1>
                    ) : (
                      <h1>
                        {Math.abs(Math.floor(anosDeDiferenca)) > 1
                          ? `${Math.abs(Math.floor(anosDeDiferenca))} anos `
                          : `${Math.abs(Math.floor(anosDeDiferenca))} ano `}
                        de experiência
                      </h1>
                    )}
                    <div className="flex space-x-1 pt-4">
                      {isSuccessCriativo && (
                        <Carousel className="text-center w-[270px]">
                          <CarouselContent>
                            {user.tags.map((tag, tagIndex) => {
                              const backgroundColor =
                                tagColors[tag.nome as TagName] || "bg-gray-400";
                              return (
                                <CarouselItem
                                  key={tagIndex}
                                  className="basis-1/1"
                                >
                                  <div
                                    className={`${backgroundColor} h-[20px] px-2 w-auto text-sm rounded-md`}
                                  >
                                    <h1>{tag.nome}</h1>
                                  </div>
                                </CarouselItem>
                              );
                            })}
                          </CarouselContent>
                        </Carousel>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-[540px] h-[200px] text-white text-base pl-20 pt-5">
                  <p className="text-start">
                    {user.descricaoEmpresa
                      ? user.descricaoEmpresa
                      : user.descricaoLonga}
                  </p>
                </div>
              </div>
              <div className="w-px h-[400px] mt-8 ml-8 bg-white" />
              <div className="text-white font-medium pt-10 pl-8">
                <h1 className="font-semibold">Avaliações positivas</h1>
                <Carousel className="w-[280px] pt-4">
                  <CarouselContent>
                    {comentariosPositivos.map((item, index) => (
                      <CarouselItem key={index}>
                        <div key={index}>
                          <div className="flex pl-6">
                            <NavLink to={`/id/${item.autorNome}`}>
                              <img
                                src={item.autorFoto}
                                alt="Autor"
                                className="size-12 rounded-md object-cover"
                              />
                            </NavLink>
                            <div className="flex flex-col">
                              <h1 className="pl-2 font-bold size-6">
                                <NavLink to={`/id/${item.autorNome}`}>
                                  {item.autorNome}
                                </NavLink>
                              </h1>
                              <Rating
                                value={item.ratingValue}
                                precision={0.5}
                                readOnly
                                className="pl-2"
                                size="small"
                              />
                            </div>
                          </div>
                          <p className="font-light pl-6 pt-2">{item.texto}</p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="text-black ml-5" />
                  <CarouselNext className="text-black ml-5" />
                </Carousel>

                <h1 className="font-semibold pt-4">Avaliações negativas</h1>
                <Carousel className="w-[280px] pt-4">
                  <CarouselContent>
                    {comentariosNegativos.map((item, index) => (
                      <CarouselItem key={index}>
                        <div key={index}>
                          <div className="flex pl-6">
                            <NavLink to={`/id/${item.autorNome}`}>
                              <img
                                src={item.autorFoto}
                                alt="Autor"
                                className="size-12 rounded-md object-cover"
                              />
                            </NavLink>
                            <div className="flex flex-col">
                              <h1 className="pl-2 font-bold size-6">
                                <NavLink to={`/id/${item.autorNome}`}>
                                  {item.autorNome}
                                </NavLink>
                              </h1>
                              <Rating
                                value={item.ratingValue}
                                precision={0.5}
                                readOnly
                                className="pl-2"
                                size="small"
                              />
                            </div>
                          </div>
                          <p className="font-light pl-6 pt-2">{item.texto}</p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="text-black ml-5" />
                  <CarouselNext className="text-black ml-5" />
                </Carousel>

                <Dialog>
                  <DialogTrigger asChild>
                    {isAuthenticated && user.id !== userData?.id ? (
                      <div>

                      <h1 className="absolute bottom-0 right-0 bg-white font-bold text-center text-black w-[88px] h-8 mb-8 mr-8 p-1 rounded-md hover:cursor-pointer">
                        Avaliar
                      </h1>
                      <Link to={"/chat"}>
                      <h1 className="absolute bottom-0 left-12 bg-white font-bold text-center text-black w-[88px] h-8 mb-8 mr-8 p-1 rounded-md hover:cursor-pointer">
                        Contato
                      </h1>
                      </Link>
                      </div>
                    ) : (
                      <NavLink to={"/login"}>
                        <h1 className="absolute bottom-0 right-0 bg-white font-bold text-center text-black w-[88px] h-8 mb-8 mr-8 p-1 rounded-md hover:cursor-pointer">
                          Avaliar
                        </h1>
                      </NavLink>
                    )}
                  </DialogTrigger>
                  <DialogContent className="bg-[#121212] text-white border-none min-h-[200px]">
                    <DialogHeader>
                      <DialogTitle>
                        <h1>Comentar</h1>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex space-x-2">
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="border-none w-full rounded-lg"
                      >
                        <Controller
                          name="avaliacao"
                          control={control}
                          defaultValue={0}
                          render={({ field }) => (
                            <Rating
                              className="ml-[66px] bg-[#373737] rounded-md"
                              {...field}
                              precision={0.5}
                              onChange={(_, value) => field.onChange(value)}
                            />
                          )}
                        />
                        <div className="flex gap-2">
                          <img
                            src={fotoPerfilToken}
                            alt="foto"
                            className="size-14 rounded-full object-cover flex-shrink-0"
                          />
                          <input
                            className="border-none max-h-12 w-full rounded-lg bg-[#373737] mt-2 pl-2 h-12"
                            placeholder="Adicione um comentário..."
                            {...register("texto")}
                          />
                        </div>
                        <button className="ml-[375px] mt-2 bg-white text-black font-bold rounded-lg w-[90px] h-8">
                          Comentar
                        </button>
                      </form>
                      {isSuccessCriativo && userToken?.type == "org" ? (
                        <form
                          onSubmit={enviarRecomendacao}
                          className="absolute -z-0 bottom-6 right-32"
                        >
                          <button className=" mt-2 bg-white text-black font-bold rounded-lg w-auto px-px h-8">
                            Recomendar
                          </button>
                        </form>
                      ) : null}
                      {isSuccessOrg && userToken?.type == "criativo" ? (
                        <form
                          onSubmit={enviarRecomendacao}
                          className="absolute -z-0 bottom-6 right-32"
                        >
                          <button className=" mt-2 bg-white text-black font-bold rounded-lg w-auto px-px h-8">
                            Recomendar
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </DialogContent>
                </Dialog>

                <EditarPerfil
                  id={user.id}
                  fotoPerfil={fotoPerfil}
                  banner={banner}
                  isSuccessCriativo={isSuccessCriativo}
                />
              </div>
              {isSuccessCriativo ? (
                <div className="absolute right-0 bottom-0 text-white mr-44 mb-8 flex text-sm">
                  <h1>Disponível para trabalho: </h1> {user.disponibilidade}
                </div>
              ) : (
                <div className="absolute right-[-10px] bottom-0 text-white mr-44 mb-4 text-center flex gap-2 text-sm">
                  Geralmente <br /> contrata:
                  <Carousel className="text-center w-[240px]">
                    <CarouselContent>
                      {user.tags.map((tag, tagIndex) => {
                        const backgroundColor =
                          tagColors[tag.nome as TagName] || "bg-gray-400";
                        return (
                          <CarouselItem key={tagIndex} className="basis-1/1">
                            <div
                              className={`${backgroundColor} h-[20px] px-2 w-auto text-sm rounded-md`}
                            >
                              <h1>{tag.nome}</h1>
                            </div>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                  </Carousel>
                </div>
              )}

              <div className="flex gap-4 absolute bottom-9 left-[75px] text-white font-bold">
                {(() => {
                  const displayedRecomendadorIds = new Set();

                  return user?.recebeuRecomendacoes.flatMap((item) => {
                    const recomendadores = isSuccessCriativo
                      ? item.recomendadorOrg
                      : item.recomendadorCriativo;

                    const recomendadorArray = Array.isArray(recomendadores)
                      ? recomendadores
                      : [recomendadores];

                    return recomendadorArray.map((org) => {
                      if (
                        "id" in org &&
                        "fotoPerfil" in org &&
                        "username" in org &&
                        !displayedRecomendadorIds.has(org.id)
                      ) {
                        displayedRecomendadorIds.add(org.id);

                        return (
                          <>
                            <h1 className=" flex gap-4 absolute bottom-[54px] text-white font-bold">
                              Recomendado por
                            </h1>
                            <div key={org.id}>
                              <Link to={`/id/${org.username}`}>
                                <img
                                  src={bufferToDataURL(
                                    org.fotoPerfil.data,
                                    "image/*"
                                  )}
                                  alt={org.username}
                                  className="size-12 rounded-lg object-cover"
                                />
                              </Link>
                            </div>
                          </>
                        );
                      }
                      return null;
                    });
                  });
                })()}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center pt-[440px] pr-[920px] text-white">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg">Serviços</h1>

            <p className="text-sm">
              {isAuthenticated && userData?.id == user.id ? (
                <Link to={`/id/${user.username}/servicos`}>Editar </Link>
              ) : null}
            </p>
          </div>
        </div>

        <div className="w-full flex justify-center pt-[200px] pr-[930px] text-white">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg">Portfolio</h1>

            <p className="text-sm">
              {isAuthenticated && userData?.id == user.id ? (
                <Link to={`/id/${user.username}/portfolio`}>Editar </Link>
              ) : null}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
