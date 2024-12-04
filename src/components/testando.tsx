import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Header } from './header';
import { useAuth } from '@/hooks/useAuth';
import ubi from '../assets/ubi.jpg'

const MessageBoard = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    { message: string; username: string; avatarBytes?: number[] }[]
  >([]);
  const [isConnected, setIsConnected] = useState(false);
  const ydocRef = useRef<Y.Doc | null>(null);
  const wsPort = import.meta.env.VITE_WS;
  const { userData } = useAuth();

  // Converte buffer em URL de imagem
  function bufferToDataURL(buffer: number[] | undefined, mimeType: string): string {
    if (!buffer) return '';
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  useEffect(() => {
    // Inicializar Yjs Document e WebSocket Provider
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const provider = new WebsocketProvider(`${wsPort}/ws`, 'message-board', ydoc);

    // Atualizar estado de conexão
    setIsConnected(provider.wsconnected);

    // Ouvir mudanças na conexão
    provider.on('status', (event: { status: string }) => {
      setIsConnected(event.status === 'connected' || event.status === 'wsconnected');
    });

    const yArray = ydoc.getArray<{ message: string; username: string; avatarBytes?: number[] }>(
      'messages'
    );

    // Observar mudanças no Y.Array e atualizar a lista de mensagens
    yArray.observe(() => {
      setMessages(Array.from(yArray)); // Atualizar mensagens a partir do Y.Array
    });

    // Limpeza na desmontagem do componente
    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, [wsPort]);

  const handleSendMessage = () => {
    if (message.trim() === '') return; // Não enviar mensagens vazias

    const ydoc = ydocRef.current;
    if (ydoc) {
      const yArray = ydoc.getArray<{ message: string; username: string; avatarBytes?: number[] }>(
        'messages'
      );
      yArray.push([
        {
          message,
          username: userData?.username || 'Anônimo',
          avatarBytes: userData?.fotoPerfil?.data, // Enviar os bytes da imagem
        },
      ]);
      setMessage(''); // Limpar campo de entrada
    }
  };

  return (
    <>
      <Header />
      <div
        style={{ padding: '20px', backgroundColor: '#121212', height: '100vh' }}
        className="text-white"
      >
        <div className="max-w-4xl mx-auto pt-20 " >

        <div className='mx-auto w-[900px] h-[350px] bg-[#151515] flex'>
          <div className='font-bold '>
            <h1>Mensagens</h1>
            <input type="text" className='w-[260px] pl-2 border-white border-2 bg-[#151515] rounded-md'/>
            <div className='flex items-center text-white bg-[#151515] pt-2'>

          <img src={ubi} alt="ubi" className='rounded-full size-12'/>
          <div className='flex flex-col pl-2'>

          <h1>Ubisoft</h1>
            <p className='font-extralight'>oi</p>
    
          </div>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto bg-[#151515]">
            <div
              style={{
                height: '300px',
                overflowY: 'auto',
             
                backgroundColor: '#151515',
              }}
              className="text-black bg-[#151515]"
              >
              {messages.map((msg, index) => (
                <div key={index} className="flex flex-col mb-4 text-white bg-[#151515] ">
                  <div className="flex items-center gap-2 bg-[#151515]">
                    <img
                      src={bufferToDataURL(msg.avatarBytes, 'image/*')} 
                      alt={msg.username}
                      className="rounded-full w-8 h-8"
                      />
                    <h1 className="font-bold">{msg.username}</h1>
                  </div>
                  <div className="text-white bg-[#232323]/90 pl-2  rounded-md ml-10">{msg.message}</div>
                </div>
              ))}
            </div>
          <div className='w-[500px] ml-24 flex'>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escreva sua mensagem..."
            style={{ width: '80%', padding: '10px', marginRight: '10px' }}
            className="text-white w-[500px] rounded-md  border-white border-2 bg-[#151515] outline-none"
            />
          <button
            onClick={handleSendMessage}
            style={{ padding: '10px 20px' }}
            >
            Enviar
          </button>
              </div>
          </div>
        </div>
      </div>
      </div> 
    </>
  );
};

export default MessageBoard;
