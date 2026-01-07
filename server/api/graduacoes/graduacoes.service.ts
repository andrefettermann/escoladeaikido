import { GraduacaoSchema } from "../../models/Graduacao";
import mongoose from 'mongoose';

interface RespostaGraduacao {
  sucesso: boolean;
  doc?: IGraduacao;
  mensagem?: string;
  erro?: string;
};

interface RespostaGraduacoes {
  sucesso: boolean;
  docs?: IGraduacao[];
  mensagem?: string;
  erro?: string;
};

interface IGraduacao {
  _id: string;
  nome: string;
  faixa: string;
  sequencia: number;
};


function ordena(docs: any): any {
    docs.sort((a: { nome: string; }, b: { nome: string; }) => {
        var fa = a.nome.toLowerCase();
        var fb = b.nome.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });

    return docs;
}

export async function buscaPeloId(id: string): Promise<RespostaGraduacao> {
  try {
    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $limit: 1 }
    ];

    const resposta = await GraduacaoSchema.aggregate(pipeline)
        .allowDiskUse(true)
        .option({ maxTimeMS: 15000 })
        .limit(1)
        .exec();

    if (!resposta || resposta.length === 0) {
      return {
        sucesso: false,
        mensagem: 'Pessoa não encontrada.',
      };
    }

    return {
      sucesso: true,
      doc: {
        _id: resposta[0]._id,
        nome: resposta[0].nome,
        faixa: resposta[0].faixa,
        sequencia: resposta[0].sequencia,
      }
    }
  } catch (error) { 
    console.error("Erro ao buscar graduacao pelo ID:", error);
    return {
      sucesso: false,
      erro: (error as Error).message,
    };
  } 
}

export async function buscaTodos(): Promise<RespostaGraduacoes> {
  const pipeline = [
      {
          $project: {
              _id: 1,
              nome: 1,
              faixa: 1,
              sequencia: 1,
              categoria: 1,
          } 
      },
  ];

  try {
    const resposta = await GraduacaoSchema.aggregate(pipeline)
          .allowDiskUse(true)
          .option({ maxTimeMS: 15000 })
          .exec();

    const graduacoes = resposta.map((graduacao: any) => (
      {
        _id: graduacao._id,
        nome: graduacao.nome,
        faixa: graduacao.faixa,
        sequencia: graduacao.sequencia,
        categoria: graduacao.categoria,
      }
    ));

    return {
        sucesso: true,
        docs: ordena(graduacoes),
    };
  } catch (error) {
    console.error("Erro ao buscar todas as pessoas:", error);
    return {
        sucesso: false,
        docs: [],
        mensagem: 'Erro ao buscar as pessoas.',
    };
  }
};

