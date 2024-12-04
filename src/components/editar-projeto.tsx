import { Usuario } from "@/pages/portfolio-perfil";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import useAutocomplete from "@mui/material/useAutocomplete";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

interface EditarProjetoProps {
  options: Usuario[];
  getOptionLabel: (option: Usuario) => string;
  onChange: (event: React.SyntheticEvent, value: Usuario | null) => void;
  setSelectedColaboradores: React.Dispatch<React.SetStateAction<Usuario[]>>;
  selectedColaboradores: Usuario[];
  projetoId: number;
  projetoTitulo: string;
}

export function EditarProjeto({
  options,
  getOptionLabel,
  setSelectedColaboradores,
  selectedColaboradores,
  projetoId,
  projetoTitulo,
}: EditarProjetoProps) {
  const { username } = useParams();
  const { getInputProps, getListboxProps, getOptionProps, groupedOptions } =
    useAutocomplete<Usuario>({
      id: "colaboradores-autocomplete",
      options,
      getOptionLabel,
      onChange: (_, value) => {
        setSelectedColaboradores((prev) =>
          value && !prev.find((colaborador) => colaborador.id === value.id)
            ? [...prev, value]
            : prev
        );
      },
    });

  const bufferToDataURL = (buffer: number[], mimeType: string) => {
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    return URL.createObjectURL(blob);
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const colaboradoresIds = selectedColaboradores.map(
      (colaborador) => colaborador.id
    );

    const port = import.meta.env.VITE_PORT;

    try {
      await axios.put(`${port}/update-colaboradores`, {
        projetoId: projetoId,
        usuarioCriativoIds: colaboradoresIds,
      });
      console.log("atualizado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <h1 className="bg-white text-black font-medium rounded-md h-6 w-16 text-center hover:cursor-pointer">
          Editar
        </h1>
      </DialogTrigger>
      <DialogContent className="bg-[#1c1c1c] border-none text-white ">
        <DialogTitle>Editar</DialogTitle>

        <Link to={`/id/${username}/portfolio/${projetoId}/${projetoTitulo}/editar`}>
          <div className="w-[250px] h-8 pt-1 font-bold text-center bg-white text-black rounded-md">
            {" "}
            <h1>Editar conteúdo do projeto</h1>
          </div>
        </Link>

        <h1>Editar Colaboradores</h1>
        <div className="flex gap-2 mb-2">
          {selectedColaboradores.map((colaborador: Usuario) => (
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

        <form onSubmit={onSubmit}>
          <div className="flex flex-col w-full h-12 bg-[#373737] rounded-md">
            <label htmlFor="colaboradores" className="text-sm pl-2">
              Colaboradores
            </label>

            <input
              {...getInputProps()}
              className="w-full h-12 bg-[#373737] rounded-md focus:outline-none pl-3"
              placeholder="Selecione um colaborador"
            />
            {groupedOptions.length > 0 && (
              <ul
                {...getListboxProps()}
                className="bg-[#1c1c1c] space-y-2 relative z-50 w-full rounded-lg"
              >
                {groupedOptions.map((option, index) =>
                  "id" in option ? (
                    <li {...getOptionProps({ option, index })} key={option.id}>
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
                  ) : null
                )}
              </ul>
            )}
          </div>
          <button>Enviar</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
