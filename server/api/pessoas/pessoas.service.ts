import { PessoaSchema } from "~~/server/models/Pessoa";
import mongoose from 'mongoose';
import { decripta } from "~~/server/utils/crypto";

interface RespostaPessoa {
  sucesso: boolean;
  doc?: IPessoa;
  mensagem?: string;
  erro?: string;
};

interface IPessoa {
  id: string;
  aniversario: string;
  cpf: string;
  matricula: string;
  nome: string;
  situacao: string;
  id_dojo: string;
  id_graduacao: string;
  data_inicio_aikido: string;
  data_matricula: string;
  promocoes?: {
    data: string;
    id_graduacao: string;
  }[];
  tipo: string;
};

const lookupDojo = {
    $lookup: {
        from: 'dojos',
        let: { dojoId: "$id_dojo" },
        pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$dojoId"] } } },
            { $project: { _id: 1, nome: 1 } },
            { $limit: 1 }
        ],
        as: 'dojo'
    }
}

const lookupGraduacao = {
    $lookup: {
        from: 'graduacoes',
        let: { graduacaoId: "$id_graduacao" },
        pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$graduacaoId"] } } },
            { $project: { _id: 1, nome: 1, faixa: 1, sequencia: 1 } },
            { $limit: 1 }
        ],
        as: 'graduacao'
    }
}

export async function buscaPeloId(id: string): Promise<RespostaPessoa> {
  try {
    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      lookupDojo,
      lookupGraduacao,
      {
          $project: {
              _id: 1,
              nome: 1,
              aniversario: 1,
              matricula: 1,
              situacao: 1,
              cpf: 1,
              tipo: 1,
              data_inicio_aikido: 1, 
              data_matricula: 1,
              promocoes: 1,
              dojo: 1,
              graduacao: 1,
          } 
      },
      { $limit: 1 }
    ];

    const resposta: IPessoa[] = await PessoaSchema.aggregate(pipeline)
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
        id: resposta[0].id,
        aniversario: resposta[0].aniversario,
        cpf: resposta[0].cpf,
        matricula: resposta[0].matricula,
        nome: decripta(resposta[0].nome) ,
        situacao: resposta[0].situacao,
        id_dojo: resposta[0].id_dojo,
        id_graduacao: resposta[0].id_graduacao,
        data_inicio_aikido: resposta[0].data_inicio_aikido,
        data_matricula: resposta[0].data_matricula,
        promocoes: resposta[0].promocoes?.map(promocao => ({
          data: promocao.data.toString(),
          id_graduacao: promocao.id_graduacao,
        })),
        tipo: resposta[0].tipo,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar pessoa pelo ID:", error);
    return {
      sucesso: false,
      erro: (error as Error).message,
    };
  } 
}   

