export const useMensagem = () => {
  const mensagem = useState<string | null>('mensagem-global', () => null);
  const tipo = useState<'success' | 'error' | 'info'>('tipo-mensagem', () => 'success');

  function setMensagem(msg: string, t: 'success' | 'error' | 'info' = 'success') {
    mensagem.value = msg;
    tipo.value = t;
  }

  function limparMensagem() {
    mensagem.value = null;
  }

  return {
    mensagem,
    tipo,
    setMensagem,
    limparMensagem
  };
};