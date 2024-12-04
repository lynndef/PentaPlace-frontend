import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { StepForm } from "../util/multi-step-form";
import { z } from "zod";
import { NavLink } from "react-router-dom";
import { FirstStepOrg } from "@/components/forms/forms-org/first-step-org";
import { SecondStepOrg } from "@/components/forms/forms-org/second-step-org";
import { FourthStepOrg } from "@/components/forms/forms-org/fourth-step-org";
import { ThirdStepOrg } from "@/components/forms/forms-org/third-step-org";

const fotoPerfilViewSchema = z.object({
  type: z.string(),
  data: z.array(z.number()),
});

const usuarioOrgSchema = z.object({
    email: z.string().email().optional(),
    username: z.string().optional(),
    senha: z.string().optional(),
    telefone: z.coerce.string().optional(),
    nomeEmpresa: z.string().optional(),
    tipoEmpresa: z.string().optional(),
    pais: z.string().optional(),
    estado: z.string().optional(),
    cidade: z.string().optional(),
    endereco: z.string().max(24).optional(),
    codigoPostal: z.coerce.string().optional(),
    hashtag: z.string().optional(),
    descricaoCurta: z.string().max(28).optional(),
    descricaoEmpresa: z.string().optional(),
    pago: z.boolean().optional(),
    avaliacao: z.number().optional(),
    numero: z.coerce.number().optional(),
    complemento: z.string().optional(),
    fotoPerfil: fotoPerfilViewSchema.optional(),
});

const fotoPerfilSchema = z.object({
  fotoPerfil: z
    .any()
    .refine((files) => files?.length === 1, "1 foto é necessária."),
});

const tagsSchema = z.array(
  z.object({
    nome: z.string(),
    projetoId: z.number().optional(),
    usuarioCriativoId: z.string().optional(),
    usuarioOrgId: z.string().optional(),
    servicosId: z.number().optional(),
  })
);

export type usuarioOrg = z.infer<typeof usuarioOrgSchema>;
export type fotoPerfil = z.infer<typeof fotoPerfilSchema>;
export type tags = z.infer<typeof tagsSchema>;

export function CadastroOrg() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues: getValuesUser,
  } = useForm<usuarioOrg>({
    resolver: zodResolver(usuarioOrgSchema),
  });

  const {
    register: registerFoto,
    handleSubmit: handleSubmitFoto,
    formState: { errors: errorsFoto },
  } = useForm<fotoPerfil>({
    resolver: zodResolver(fotoPerfilSchema),
  });

  const {
    register: registerTags,
    formState: { errors: errorsTags },
    setValue: setValueUser,
    getValues: getValuesTags,
  } = useForm<tags>({
    resolver: zodResolver(tagsSchema),
  });

  const port = import.meta.env.VITE_PORT;

  function onSubmit(data: usuarioOrg) {
    handleSubmitFoto (  async (dataFoto: fotoPerfil) => {
      try {
        console.log("Dados do formulário:", data);
        console.log("Dados da foto:", dataFoto.fotoPerfil);

        const response = await axios.post(
          `${port}/create-usuario-org`,
          data
        );
        console.log("Usuário cadastrado!", response.data);
        alert("Usuário cadastrado!");

        const formData = new FormData();
        formData.append("fotoPerfil", dataFoto?.fotoPerfil[0]);

        await axios.put(
          `${port}/update-usuario-org/upload/${response.data}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        let tags = getValuesTags();
        console.log("Tags no onSubmit:", tags);

        if (!Array.isArray(tags)) {
          tags = Object.values(tags);
        }

        if (tags.length > 0) {
          await Promise.all(
            tags.map((tag) =>
              axios.post(`${port}:3333/create-tag`, {
                nome: tag.nome,
                usuarioOrgId: response.data,
              })
            )
          );
          console.log("Tags enviadas com sucesso!");
        } else {
          console.log("Nenhuma tag para enviar.");
        }
      } catch (error) {
        console.error("Erro ao enviar tags ou processar os dados:", error);
      }
    })();
  }

  const { next, back, step, currentStep } = StepForm([
    <FirstStepOrg key={1} register={register} errors={errors} />,
    <SecondStepOrg
      key={2}
      register={register}
      errors={errors}
      control={control}
    />,
    <ThirdStepOrg
      key={3}
      registerFoto={registerFoto}
      register={register}
      errors={errors}
      errorsFoto={errorsFoto}
    />,
    <FourthStepOrg
      key={4}
      register={register}
      errors={errors}
      control={control}
      setValueUser={setValueUser}
      registerTags={registerTags}
      errorsTags={errorsTags}
      getValuesUser={getValuesUser}
    />,
  ]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow flex justify-center pt-14">
        <div className="relative w-[600px] h-[785px] rounded-[20px] bg-[#232323] text-white flex flex-col">
          {currentStep === 0 ? (
            <div className="absolute top-12 left-4 flex items-center cursor-pointer">
              <NavLink to={"/"} className="flex">
                <ChevronLeft />
                <h1 className="ml-2">Voltar</h1>
              </NavLink>
            </div>
          ) : (
            <div
              className="absolute top-12 left-4 flex items-center cursor-pointer"
              onClick={back}
            >
              <ChevronLeft />
              <h1 className="ml-2">Voltar</h1>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center flex-grow space-y-4"
          >
            <div className="absolute top-12 text-center">
              <h1 className="text-lg">
                <strong>Cadastro de Organização</strong>
              </h1>
              {currentStep === 0 ? <p>Primeiros passos</p> : null}
              {currentStep === 1 ? <p>Endereço</p> : null}
              {currentStep === 2 ? <p>Perfil Público</p> : null}
              {currentStep === 3 ? <p>Últimos passos</p> : null}
            </div>
            <div className="w-[400px] space-y-5">{step}</div>
            {currentStep === 0 || currentStep === 1 || currentStep === 2 ? (
              <button
                type="button"
                onClick={next}
                className="w-[200px] h-10 font-bold bg-white text-black rounded-md"
              >
                Próximo
              </button>
            ) : null}
            {currentStep === 3 ? (
              <button
                type="submit"
                className="w-[200px] h-10 font-bold bg-white text-black rounded-md "
              >
                Finalizar
              </button>
            ) : null}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
