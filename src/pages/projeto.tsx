import { Header } from "@/components/header";
import axios from "axios";
import type { Projeto } from "./portfolio-perfil";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { usuarioCriativo, usuarioOrg } from "./perfil";

const port = import.meta.env.VITE_PORT;

async function fetchProjeto(id: string) {
  const response = await axios.get(
    `${port}/get-projeto-by-id/${id}`
  );
  return response.data as Projeto;
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

async function fetchOrgs(): Promise<usuarioOrg[]> {
  const response = await fetch(`${port}/get-all-usuario-org`);
  if (!response.ok) {
    throw new Error("Erro ao buscar organizações");
  }
  return response.json();
}

export function Projeto() {
  const { id } = useParams<string>();

  const { data: dataProjeto } = useQuery<Projeto, Error>({
    queryKey: ["dataProjeto", id],
    queryFn: () => fetchProjeto(id || ""),
    enabled: !!id,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { data: orgs = [] } = useQuery({
    queryKey: ["orgs"],
    queryFn: fetchOrgs,
  });

  function bufferToDataURL(buffer: number[], mimeType: string): string {
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  const banner = dataProjeto?.banner.data
    ? bufferToDataURL(dataProjeto.banner.data, "image/*")
    : "";

  const dataProjetoColabsId = dataProjeto?.colaboradores.map(
    (item) => item.usuarioCriativoId
  );
  const fotoPerfilIds = users.filter((data) =>
    dataProjetoColabsId?.includes(data.id)
  );

  const usersMesclados = [...orgs, ...users];

  const fotoPerfilCriador = usersMesclados.find(
    (user) => user.id === dataProjeto?.criadorId || dataProjeto?.orgId
  )?.fotoPerfil.data;

  const bufferFotoPerfilCriador = fotoPerfilCriador
    ? bufferToDataURL(fotoPerfilCriador, "image/*")
    : "";

  const data = dataProjeto?.createdAt ? new Date(dataProjeto.createdAt) : "";
  const dataFormatada = data.toLocaleString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="min-h-screen flex flex-col text-white">
        <Header />
        <div className="h-screen w-[1440px] mx-auto">
          <img
            src={banner}
            alt={dataProjeto?.titulo?.toString()}
            className="w-[1440px] h-[400px] object-cover"
          />
          <div className="flex items-baseline gap-2 relative bottom-14 left-[160px]">
            <img
              src={bufferFotoPerfilCriador}
              className="rounded-full object-cover size-24"
            />

            {fotoPerfilIds.map((item, index) => (
              <img
                key={index}
                src={bufferToDataURL(item.fotoPerfil.data, "image/*")}
                alt={index.toString()}
                className="rounded-full object-cover size-16"
              />
            ))}
          </div>
          <h1 className="text-start text-4xl font-bold relative bottom-8 pl-[164px]">
            {dataProjeto?.titulo}
          </h1>
          <h1 className="pl-[164px] relative bottom-6">{dataFormatada}</h1>
          <div className="w-[1080px] mx-auto">
            <div
              dangerouslySetInnerHTML={{ __html: dataProjeto?.conteudo || "" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}