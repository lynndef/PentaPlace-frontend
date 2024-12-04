import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditorType } from "tinymce";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useQuery } from "@tanstack/react-query";

interface TinyEditorProps {
  projetoId: string | undefined;
}

interface Projeto {
  id: number;
  conteudo: string;
}

export function TinyEditor(props: TinyEditorProps) {
  const { projetoId } = props;
  const editorRef = useRef<TinyMCEEditorType | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const isUpdatingContent = useRef(false);
  const port = import.meta.env.VITE_PORT;
  const wsPort = import.meta.env.VITE_WS

  async function fetchProjeto(projetoId: string) {
    const response = await axios.get(
      `${port}/get-projeto-by-id/${projetoId}`
    );
    return response.data as Projeto;
  }

  const { data: dataProjeto } = useQuery<Projeto, Error>({
    queryKey: ["dataProjeto", projetoId],
    queryFn: () => fetchProjeto(projetoId || ""),
    enabled: !!projetoId,
  });
  
  const { setValue } = useForm({
    defaultValues: {
      content: "", 
    },
  });

  async function updateContent(conteudo: string) {
    if (!projetoId) return;

    try {
      await axios.put(`${port}/update-projeto/${projetoId}`, {
        conteudo,
      });
    } catch (error) {
      console.error("Erro ao atualizar conteúdo no backend:", error);
    }
  }

  useEffect(() => {
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const provider = new WebsocketProvider(`${wsPort}/ws`, "tinymce-room", ydoc);

    const yText = ydoc.getText("tinymce");

    yText.observe(() => {
      const editor = editorRef.current;
      if (editor && !isUpdatingContent.current) {
        const yContent = yText.toString();
        if (editor.getContent() !== yContent) {
          isUpdatingContent.current = true;
          editor.setContent(yContent);
          setValue("content", yContent);
          isUpdatingContent.current = false;
        }
      }
    });

    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, [setValue, wsPort]);

  const handleEditorChange = () => {
    const editor = editorRef.current;
    const ydoc = ydocRef.current;

    if (editor && ydoc) {
      const yText = ydoc.getText("tinymce");
      const currentContent = editor.getContent();

      if (!isUpdatingContent.current && yText.toString() !== currentContent) {
        isUpdatingContent.current = true;
        yText.delete(0, yText.length);
        yText.insert(0, currentContent);
        setValue("content", currentContent);
        
        updateContent(currentContent);

        isUpdatingContent.current = false;
      }
    }
  };

  return (
    <>
      <div className="w-[1440px]">
        <Editor
          apiKey="o4f4hifgqir1j7vvz6wa52gfiumhwwj9c8d5gbxmu82nx1xh"
          onInit={(_evt, editor) => {
            editorRef.current = editor;
            editor.on("input", handleEditorChange);
            editor.on("change", handleEditorChange);
          }}
          initialValue={dataProjeto?.conteudo}
          init={{
            height: 500,
            menubar: false,
            setup: (editor) => {
              editor.on("init", function () {
                editor.getDoc().body.style.backgroundColor = "#1c1c1c";
                editor.getDoc().body.style.color = "#fff";
              });
            },
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "help",
              "wordcount",
              "media mediaembed",
            ],
            toolbar:
              "undo redo | blocks | image | media mediaembed" +
              " bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            file_picker_types: "image",
            file_picker_callback: (cb) => {
              const editorInstance = editorRef.current;
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");

              input.addEventListener("change", (e) => {
                const target = e.target as HTMLInputElement | null;
                if (target && target.files) {
                  const file = target.files[0];
                  const reader = new FileReader();
                  reader.addEventListener("load", () => {
                    const result = reader.result;
                    if (typeof result === "string") {
                      const id = "blobid" + new Date().getTime();
                      const blobCache = editorInstance?.editorUpload?.blobCache;
                      if (!blobCache) return;
                      const base64 = result.split(",")[1];
                      const blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);
                      cb(blobInfo.blobUri(), { title: file.name });
                    }
                  });
                  reader.readAsDataURL(file);
                }
              });

              input.click();
            },
          }}
        />
      </div>
    </>
  );
}