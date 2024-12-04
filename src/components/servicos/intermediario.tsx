import { PostServico } from "@/pages/servicos";
import { UseFormRegister } from "react-hook-form";

interface ServicoProps {
  register: UseFormRegister<PostServico>;
}

export function Intermediario({ register }: ServicoProps) {
    return (
      <div className="w-[465px] h-[350px] bg-[#232323] text-white">
        <div className="p-8 flex flex-col ">
          <div className="flex justify-between items-baseline">
            <div>
            <h1 className="text-center ">Pacote Intermediário</h1>
            <h1>Preço</h1>
            <input
              className="font-regular text-xl text-black w-[400px] rounded-md "
              type="number"
              {...register("intermediarioPreco")}
            />
          </div>
        </div>
        <div>
          <h1>Descrição pacote básico</h1>
          <textarea
            className="font-regular text-lg text-black w-[400px] h-[116px] max-h-[116px] rounded-md"
            {...register("intermediarioTexto")}
          />
        </div>

        <div>
          <h1>Dias para entrega</h1>
          <input
            className="font-regular text-lg text-black w-[400px] rounded-md"
            type="number"
            {...register("diasParaEntregaIntermediario")}
          />
        </div>
        </div>
      </div>
    );
  }
  