import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Rating } from "@mui/material";
import { usuarioCriativo, usuarioOrg } from "./perfil";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Projeto } from "./portfolio-perfil";
import { Heart } from "lucide-react";
import axios from "axios";

const port = import.meta.env.VITE_PORT;

async function fetchOrgs(): Promise<usuarioOrg[]> {
  const response = await fetch(`${port}/get-all-usuario-org`);
  if (!response.ok) {
    throw new Error("Erro ao buscar organizações");
  }
  return response.json();
}

async function fetchUsers(): Promise<usuarioCriativo[]> {
  const response = await fetch(
    `${port}/get-all-usuario-criativo`
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar criativos");
  }
  return response.json();
}

async function fetchProjetos(): Promise<Projeto[]> {
  const response = await fetch(`${port}/get-all-projeto`);
  if (!response.ok) {
    throw new Error("Erro ao buscar projetos");
  }
  return response.json();
}

function bufferToDataURL(buffer: number[], mimeType: string): string {
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  return URL.createObjectURL(blob);
}

export function HomeDeslogado() {
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

  const { isAuthenticated, user: userToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: orgs = [] } = useQuery({
    queryKey: ["orgs"],
    queryFn: fetchOrgs,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { data: projetos = [] } = useQuery({
    queryKey: ["projetos"],
    queryFn: fetchProjetos,
  });

  async function createLike(usuarioId: string | undefined, projetoId: number) {
    try {
      const response = await axios.post(`${port}/create-like`, {
        usuarioId,
        like: 1,
        projetoId,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteLike(id: string) {
    try {
      const response = await axios.delete(
        `${port}/delete-like/${id}`,
        {}
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function LikeClick(
    isLiked: boolean,
    projetoId: number,
    likeId?: string
  ) {
    if (!isAuthenticated) return;

    try {
      if (isLiked && likeId) {
        await deleteLike(likeId);
      } else {
        await createLike(userToken?.id, projetoId);
      }
      await queryClient.invalidateQueries({ queryKey: ["projetos"] });
    } catch (error) {
      console.error("Erro ao atualizar like:", error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow flex flex-col items-center">
        <div className="w-[1080px] h-[350px] pt-12">
          <img
            src="/src/assets/home.png"
            alt="home"
            className="object-contain relative"
          />
          <img
            src="/src/assets/pentaplace.svg"
            alt="Pentaplace Logo"
            className="relative bottom-[330px] left-1/2 -translate-x-1/2 w-[170px] h-[220px]"
          />
          <h1 className="text-white text-2xl text-center relative bottom-72">
            A <strong>Maior plataforma </strong> focada na descoberta <br />
            de talentos criativos nos <strong>Esports do Brasil </strong>
          </h1>
        </div>

        {!isAuthenticated && (
          <div className="pt-24 flex">
            <NavLink to={"/cadastro-org"}>
              <div>
                <img
                  src="/src/assets/hire banner.png"
                  alt="hire banner"
                  className="w-[540px] h-[200px] object-cover object-bottom relative"
                />
                <p className="relative text-white text-2xl bottom-14 left-8">
                  Quero <strong>contratar</strong>
                </p>
              </div>
            </NavLink>
            <NavLink to={"/cadastro-criativo"}>
              <div>
                <img
                  src="/src/assets/hiring banner.png"
                  alt="hiring banner"
                  className="w-[540px] h-[200px] object-cover object-center relative"
                />
                <p className="relative text-white text-2xl bottom-14 left-[240px]">
                  Quero ser <strong>contratado</strong>
                </p>
              </div>
            </NavLink>
          </div>
        )}

        <div
          className={`text-white font-bold text-lg space-y-4 ${
            !isAuthenticated ? "pt-4" : "pt-24"
          }`}
        >
          <h1 className="pr-[850px]">Organizações populares</h1>
          <div className="flex w-[1080px] h-[175px] space-x-6 overflow-hidden">
            {orgs.map((item, index) => {
              const fotoPerfilUrl = item.fotoPerfil
                ? bufferToDataURL(item.fotoPerfil.data, "image/*")
                : "";

              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 flex-shrink-0"
                >
                  <Link to={`/id/${item.username}`} className="text-center">
                    <img
                      src={fotoPerfilUrl}
                      alt={`${item.username}`}
                      className="size-[100px] object-cover rounded-2xl "
                    />
                    <p className="text-base">
                      {item.apelido || item.username}{" "}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-white font-bold text-lg space-y-4 relative bottom-4">
          <h1 className="pr-[890px]">Profissionais em alta </h1>
          <div className="flex w-[1080px] h-[225px] space-x-6 overflow-hidden">
            {users.map((item, index) => {
              const fotoPerfilUrl = item.fotoPerfil
                ? bufferToDataURL(item.fotoPerfil.data, "image/*")
                : "";

              return (
                <div
                  key={index}
                  className="flex flex-col items-start gap-2 flex-shrink-0 "
                >
                  <Link to={`/id/${item.username}`}>
                    <img
                      src={fotoPerfilUrl}
                      alt={`${item.username}`}
                      className="size-[150px] object-cover rounded-2xl "
                    />
                    <div className="leading-none pt-2 text-center">
                      <h1> {item.apelido}</h1>
                      <Rating
                        value={
                          item.avaliacao.length > 0
                            ? item.avaliacao.reduce(
                                (acc, curr) => acc + curr.avaliacaoNumero,
                                0
                              ) / item.avaliacao.length
                            : 0
                        }
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                    </div>
                  </Link>
                  <Carousel className="text-center w-[145px]">
                    <CarouselContent>
                      {item.tags.map((tag, tagIndex) => {
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
              );
            })}
          </div>
        </div>

        <div
          className="text-white font-bold text-lg space-y-4 pt-8
          pb-4 pr-3"
        >
          <h1 className="mr-[50px]">Projetos recentes</h1>
          <div className="w-[1080px] grid grid-cols-3 gap-6 mx-auo">
            {projetos.map((item, index) => {
              const usersMesclados = [...orgs, ...users];
              const fotoPerfilData = usersMesclados.find(
                (user) => user.id === item.criadorId || item.orgId
              )?.fotoPerfil.data;

              const like = item.likes.find(
                (like) => like.usuarioId === userToken?.id
              );
              const isLiked = item.likes.some(
                (like) => like.usuarioId === userToken?.id
              );
              const bannerProjetoUrl = item.banner
                ? bufferToDataURL(item.banner.data, "image/*")
                : "";

              const fotoPerfilUrl = fotoPerfilData
                ? bufferToDataURL(fotoPerfilData, "image/*")
                : "";

              const usernamesColaboradores = item.colaboradores
                .map((colab) => {
                  const usuario = users.find(
                    (user) => user.id === colab.usuarioCriativoId
                  );
                  return usuario ? usuario.username : null;
                })
                .filter((username) => username !== null);

              return (
                <div key={index}>
                  <Link
                    to={`/id/${item.nomeCriador}/portfolio/${item.id}/${item.titulo}`}
                  >
                    <div>
                      <img
                        src={bannerProjetoUrl}
                        alt={index.toString()}
                        className="w-[350px] h-[200px] rounded-md object-cover relative"
                      />
                      <img
                        src={fotoPerfilUrl}
                        alt={index.toString()}
                        className="rounded-full size-10 object-cover relative z-50 bottom-48 left-3 -mb-11"
                      />
                    </div>
                  </Link>
                  <h1 className="text-2xl relative top-1.5">{item.titulo}</h1>
                  <div className="flex gap-1">
                    <p className="text-lg font-extralight">
                      {item.nomeCriador}
                    </p>
                    <p>-</p>
                    <p className="text-lg font-extralight">
                      {usernamesColaboradores.join(" - ")}
                    </p>
                  </div>
                  <div className="flex">
                    <Heart
                      onClick={() => LikeClick(isLiked, item.id, like?.id)}
                      fill={isLiked ? "red" : "white"}
                      stroke={isLiked ? "red" : "white"}
                      size={16}
                      className="cursor-pointer"
                    />
                    <p className="relative left-2 bottom-[4px] text-base font-light">
                      {item.likes.length}
                    </p>
                  </div>
                  <Carousel className="text-center w-[340px] pt-1.5">
                    <CarouselContent>
                      {item.tags.map((tag, tagIndex) => {
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
              );
            })}
          </div>
        </div>
      </main>
      <div className="pt-10">
        <Footer />
      </div>
    </div>
  );
}
