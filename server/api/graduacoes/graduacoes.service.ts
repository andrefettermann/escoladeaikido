import * as GraduacoesRepository from "../graduacoes/graduacoes.repository"

export async function buscaPeloId(id: string): Promise<Resposta<Graduacao>> {
  const resposta = await GraduacoesRepository.find(id);

  if (Array.isArray(resposta.docs?.pessoas)) {
    for (const a of resposta.docs.pessoas) {
      if (a?.nome) {
        try {
          a.nome = decripta(a.nome);

          // O loop 'for...of' vai pausar aqui a cada iteração
          const graduacao = await GraduacoesRepository.find(a.id_graduacao);
          if (!a.graduacao) a.graduacao = {} as any;
          a.graduacao.nome = graduacao.docs?.nome ?? '';
        } catch (error) {
          // Interrompe o loop e retorna o erro imediatamente
          return {
            sucesso: false,
            mensagem: 'Erro descriptografar nome do aluno',
          };
        }
      }
    }
  }
    
  return resposta;
}

export async function buscaTodos(): Promise<Resposta<Graduacao[]>> {
  const resposta = await GraduacoesRepository.findAll();//.then(res => res.docs);

  return resposta;
};

export async function cria(event: any): Promise<Resposta<Graduacao>> {
  const body = await readBody(event);

  if (!body.nome) {
    return {
      sucesso: false,
      mensagem: 'Nome da graduação é obrigatório',
    };
  }

  if (!body.faixa) {
    return {
      sucesso: false,
      mensagem: 'Faixa da graduação é obrigatória',
    };
  }

  if (!body.sequencia) {
    return {
      sucesso: false,
      mensagem: 'Sequência da graduação é obrigatória',
    };
  }

  if (!body.categoria) {
    return {
      sucesso: false,
      mensagem: 'Categoria da graduação é obrigatória',
    };
  }

  const resposta = await GraduacoesRepository.create(body);

  return resposta;
}

export async function atualiza(event: any, id: string): Promise<Resposta<Graduacao>> {
  const body = await readBody(event);

  if (!body.nome) {
    return {
      sucesso: false,
      mensagem: 'Nome da graduação é obrigatório',
    };
  }

  if (!body.faixa) {
    return {
      sucesso: false,
      mensagem: 'Faixa da graduação é obrigatória',
    };
  }

  if (!body.sequencia) {
    return {
      sucesso: false,
      mensagem: 'Sequência da graduação é obrigatória',
    };
  }

  if (!body.categoria) {
    return {
      sucesso: false,
      mensagem: 'Categoria da graduação é obrigatória',
    };
  }

  const resposta = await GraduacoesRepository.update(id, body);

  return resposta;
}