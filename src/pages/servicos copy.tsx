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

export function Servicos() {
  const { step, goTo } = StepForm([
    <Basico />,
    <Intermediario />,
    <Avancado />,
  ]);

  return (
    <div className="min-h-screen flex flex-col text-white">
      <Header />
      <main className="flex w-[1080px] mx-auto pt-12">
        <div className="flex flex-col mx-auto">
          <h1 className="font-bold text-2xl">Titulo</h1>
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
        <p className="pt-4">
          Olá! Meu nome é Marcus Aires e tenho vasta experiência em edição de
          vídeo. Irei transformar a sua VOD de livestream em um vídeo no estilo
          “melhores momentos”. O resultado será um vídeo dinâmico e divertido.
          São oferecidos 3 níveis de pacotes, com diferenças de tamanho máximo
          da VOD e do vídeo final. Todos os vídeos são editados com o mesmo
          carinho e nível de qualidade! E aí, tá esperando o que pra me
          contratar?
        </p>
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
              <TableHead className="w-[100px]  text-white text-center">
                Intermediário
              </TableHead>
              <TableHead className="w-[100px] text-white text-center">
                Avançado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center ">
            <TableRow>
              <TableCell className="font-light bg-[#232323] border-[0.1px] border-white ">INV001</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-light bg-[#232323] border-[0.1px] border-white">INV001</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-light bg-[#232323] border-[0.1px] border-white">INV001</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
