import { Header } from "@/components/header";
import { Avancado } from "@/components/servicos/avancado";
import { Basico } from "@/components/servicos/basico";
import { Intermediario } from "@/components/servicos/intermediario";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StepForm } from "@/util/multi-step-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const servicoSchema = z.object({
  titulo: z.string().optional(),
  basicoTexto: z.string().optional(),
  basicoPreco: z.number().optional(),
  intermediarioTexto: z.string().optional(),
  intermediarioPreco: z.number().optional(),
  avancadoTexto: z.string().optional(),
  avancadoPreco: z.number().optional(),
  diasParaEntregaBasico: z.number().optional(),
  diasParaEntregaIntermediario: z.number().optional(),
  diasParaEntregaAvancado: z.number().optional(),
  descricao: z.string(),
});

const pacoteAtributoSchema = z.object({
  pacotes: z.array(z.string().nonempty("Pacote não pode ser vazio")),
  atributos: z.array(
    z.object({
      basico: z.string().nonempty("Básico não pode ser vazio"),
      intermediario: z.string().nonempty("Intermediário não pode ser vazio"),
      avancado: z.string().nonempty("Avançado não pode ser vazio"),
    })
  ),
});

export type PostServico = z.infer<typeof servicoSchema>;
export type PacoteAtributoForm = z.infer<typeof pacoteAtributoSchema>;

export function Servicos() {
  const port = import.meta.env.VITE_PORT;

  const { register: registerServico, handleSubmit: handleSubmitServico } =
    useForm<PostServico>({
      resolver: zodResolver(servicoSchema),
    });

  const { handleSubmit: handleSubmitAtributo } = useForm<PacoteAtributoForm>({
    defaultValues: {
      pacotes: [""],
      atributos: [{ basico: "", intermediario: "", avancado: "" }],
    },
    resolver: zodResolver(pacoteAtributoSchema),
  });

  const { step, goTo } = StepForm([
    <Basico register={registerServico} key={1} />,
    <Intermediario register={registerServico} key={2} />,
    <Avancado register={registerServico} key={3} />,
  ]);

  const [rows, setRows] = useState([{ id: 1, values: ["", "", "", ""] }]);

  const handleInputChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].values[colIndex] = value;

    if (rowIndex === rows.length - 1 && value.trim() !== "") {
      updatedRows.push({ id: rows.length + 1, values: ["", "", "", ""] });
    }

    setRows(updatedRows);
  };

  const onSubmit = async (data: PacoteAtributoForm) => {
    try {
      const pacotePromises = data.pacotes.map((caracteristica) =>
        axios.post(`${port}/create-pacote`, { caracteristica })
      );

      const atributoPromises = data.atributos.map((atributo) =>
        axios.post(`${port}/create-pacote-atributo`, atributo)
      );

      await Promise.all([...pacotePromises, ...atributoPromises]);

      alert("Dados enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      alert("Erro ao enviar os dados!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Header />
      <main className="flex w-[1080px] mx-auto pt-12">
        <div className="flex flex-col mx-auto">
          <div className="flex flex-col">
            <h1 className="font-bold text-2xl">Título</h1>
            <div className="bg-[#232323]">
              <input
                type="text"
                className="bg-[#232323] outline-none pt-2 w-full"
                placeholder="Escreva o título do seu serviço."
                {...registerServico("titulo")}
              />
            </div>
          </div>

          <div>
            <img
              src="/src/assets/headerbanner.png"
              alt="ad"
              className="w-[585px] h-[330px] object-cover"
            />
          </div>
        </div>
        <div className="pt-8">
          <div className=" w-[465px] h-[40px] flex justify-between text-center ">
            <button
              className="font-bold bg-[#151515] border-[0.1px] border-white h-12 w-full"
              onClick={() => goTo(0)}
            >
              basico
            </button>
            <button
              className="font-bold bg-[#151515] border-[0.1px] border-white h-12 w-full "
              onClick={() => goTo(1)}
            >
              intermediario
            </button>
            <button
              className="font-bold bg-[#151515] border-[0.1px] border-white h-12 w-full"
              onClick={() => goTo(2)}
            >
              avancado
            </button>
          </div>
          <div className="pt-2">{step}</div>
        </div>
      </main>
      <div className="w-[585px] flex flex-col mx-auto pt-4 relative right-[232px]">
        <h1 className="font-bold text-lg">Sobre este serviço</h1>
        <textarea
          className="font-regular text-white text-l w-[580px] h-[136px] max-h-[136px] rounded-md bg-[#232323] outline-none"
          placeholder="Escreva aqui sobre o serviço."
          {...registerServico("descricao")}
        />
      </div>
      <div className="mx-auto w-[1080px] h-[500px] pt-12 text-white">
        <Table className="border-[0.1px] border-white">
          <TableCaption>Todos os pacotes.</TableCaption>
          <TableHeader>
            <TableRow className="bg-[#232323] h-20 w-[100px] text-white text-center">
              <TableHead className="w-[100px] font-bold text-white text-center">
                Pacotes
              </TableHead>
              <TableHead className="w-[100px] text-white text-center">
                Básico
              </TableHead>
              <TableHead className="w-[100px] text-white text-center">
                Intermediário
              </TableHead>
              <TableHead className="w-[100px] text-white text-center">
                Avançado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {rows.map((row, rowIndex) => (
              <TableRow key={row.id}>
                {row.values.map((value, colIndex) => (
                  <TableCell
                    key={`${rowIndex}-${colIndex}`}
                    className="font-light bg-[#232323] border-[0.1px] border-white"
                  >
                    <input
                      type="text"
                      className="bg-transparent outline-none w-full text-center text-white"
                      value={value}
                      onChange={(e) =>
                        handleInputChange(rowIndex, colIndex, e.target.value)
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <button
          className="bg-white text-black font-bold text-center flex items-center border-none h-9 p-2 rounded-md mx-auto mt-2"
          onClick={()=> { 
            handleSubmitAtributo(onSubmit)}}
        >
          Criar Serviço
        </button>
      </div>
    </div>
  );
}
