import { Cobranca } from "~~/shared/types";
import * as TaxasRepository from "./taxas.repository"

function formataMoeda(
  value: number,
  locale: string = 'pt-BR',
  currencyCode: string = 'BRL',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol'
  }).format(value);
}


export async function buscaPeloId(id: string): Promise<Resposta<Taxa>> {
  const resposta = await TaxasRepository.find(id);
  if (resposta.docs) {
    const cobrancasFormatadas = resposta.docs.cobrancas?.map((cobranca: Cobranca) => ({
      ...cobranca,
      valor: formataMoeda(cobranca.valor),
      data_vencimento: new Date(cobranca.data_vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
      pessoa: cobranca.pessoa?.nome ? decripta(cobranca.pessoa.nome) : undefined,
    })) as any;

    resposta.docs = {
      ...resposta.docs,
      cobrancas: cobrancasFormatadas,
    };
  }

  return resposta;
}

export async function buscaTodos(): Promise<Resposta<Taxa[]>> {
  const resposta = await TaxasRepository.findAll();//.then(res => res.docs);
  /*
  if (resposta.docs) {
    resposta.docs = resposta.docs.map((taxa: Taxa) => {
      return {
        ...taxa,
        valor_padrao: formataMoeda(taxa.valor_padrao),
      } as any;
    });
  }
    */
  return resposta;
};

export async function cria(event: any): Promise<Resposta<Taxa>> {
  const body = await readBody(event);

  if (!body.nome) {
    return {
      sucesso: false,
      mensagem: 'Nome da taxa é obrigatório',
    };
  }

  if (!body.faixa) {
    return {
      sucesso: false,
      mensagem: 'Faixa da taxa é obrigatória',
    };
  }

  if (!body.sequencia) {
    return {
      sucesso: false,
      mensagem: 'Sequência da taxa é obrigatória',
    };
  }

  if (!body.categoria) {
    return {
      sucesso: false,
      mensagem: 'Categoria da taxa é obrigatória',
    };
  }

  const resposta = await TaxasRepository.create(body);

  return resposta;
}

export async function atualiza(event: any, id: string): Promise<Resposta<Taxa>> {
  const body = await readBody(event);

  if (!body.nome) {
    return {
      sucesso: false,
      mensagem: 'Nome da taxa é obrigatório',
    };
  }

  if (!body.faixa) {
    return {
      sucesso: false,
      mensagem: 'Faixa da taxa é obrigatória',
    };
  }

  if (!body.sequencia) {
    return {
      sucesso: false,
      mensagem: 'Sequência da taxa é obrigatória',
    };
  }

  if (!body.categoria) {
    return {
      sucesso: false,
      mensagem: 'Categoria da taxa é obrigatória',
    };
  }

  const resposta = await TaxasRepository.update(id, body);

  return resposta;
}