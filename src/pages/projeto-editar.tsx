import { Header } from "@/components/header";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { TinyEditor } from "@/components/tiny-editor";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { Projeto } from "./portfolio-perfil";

const port = import.meta.env.VITE_PORT;

const tituloSchema = z.object({
  titulo: z.string().nonempty("O título é necessário."),
});

const bannerSchema = z.object({
  banner: z
    .any()
    .refine((files) => files?.length === 1, "1 banner é necessário."),
});

type TituloForm = z.infer<typeof tituloSchema>;
type BannerForm = z.infer<typeof bannerSchema>;

async function fetchProjeto(id: string) {
  const response = await axios.get(
    `${port}/get-projeto-by-id/${id}`
  );
  return response.data as Projeto;
}

function bufferToDataURL(buffer: number[], mimeType: string): string {
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  return URL.createObjectURL(blob);
}

export function ProjetoEditar() {
  
  const { id } = useParams<string>();
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const { register: registerTitulo, setValue: setTitulo } = useForm<TituloForm>(
    {
      resolver: zodResolver(tituloSchema),
    }
  );

  const { register: registerBanner } = useForm<BannerForm>({
    resolver: zodResolver(bannerSchema),
  });

  const { data: dataProjeto } = useQuery<Projeto, Error>({
    queryKey: ["dataProjeto", id],
    queryFn: () => fetchProjeto(id || ""),
    enabled: !!id,
  });

  useEffect(() => {
    if (dataProjeto?.titulo) {
      setTitulo("titulo", dataProjeto.titulo);
    }
  }, [dataProjeto, setTitulo]);

  async function onSubmitTitulo(titulo: string) {
    try {
      await axios.put(`${port}/update-projeto/${id}`, { titulo });
      console.log("Título atualizado com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar o título:", error);
    }
  }

  async function BannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerPreview(imageUrl);

      const formData = new FormData();
      formData.append("banner", file);

      try {
        await axios.put(
          `${port}/update-projeto-banner/upload/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("Banner atualizado com sucesso.");
      } catch (error) {
        console.error("Erro ao atualizar o banner:", error);
      }
    } else {
      setBannerPreview("");
    }
  }

  const banner = dataProjeto?.banner.data
    ? bufferToDataURL(dataProjeto.banner.data, "image/*")
    : "";

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div>
          <img
            src={!bannerPreview ? banner : bannerPreview}
            alt="banner"
            className="w-[1440px] h-[400px] relative -z-0 object-cover mx-auto"
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
              <div className="relative z-10 bottom-56 bg-black/50 rounded-full flex justify-center items-center size-10 mx-auto">
                <Camera color="white" className=" hover:cursor-pointer" />
              </div>
            </label>
          </div>
        </div>
        <div className="flex justify-center font-bold text-4xl text-white">
          <input
            type="text"
            placeholder="Atualizar título"
            {...registerTitulo("titulo")}
            onChange={(e) => onSubmitTitulo(e.target.value)}
            className="text-center bg-transparent border-b border-white outline-none text-4xl text-white"
          />
        </div>
        <div className="w-[1440px] mx-auto rounded-xl pt-10">
          <TinyEditor projetoId={id} />
        </div>
      </div>
    </>
  );
}
