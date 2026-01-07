import { PessoaSchema } from "~~/server/models/Pessoa";
import mongoose from 'mongoose';

interface Resposta {
  sucesso: boolean;
  docs?: any[];
  doc?: any;
  mensagem?: string;
  erro?: string;
}

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

export async function find(id: string): Promise<Resposta> {
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
              is_ativo: 1,
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

    const response = await PessoaSchema.aggregate(pipeline)
        .allowDiskUse(true)
        .option({ maxTimeMS: 15000 })
        .limit(1)
        .exec();

    if (!response || response.length === 0) {
      return {
        sucesso: false,
        mensagem: 'Pessoa não encontrada.',
      };
    }

    return {
      sucesso: true,
      doc: response[0],
    };
  } catch (error) {
    console.error(`Repositorio - ao buscar pessoa pelo ID: ${error}`);
    return {
      sucesso: false,
      erro: (error as Error).message,
    };
  } 
}

export async function findAll(): Promise<Resposta> {
  const pipeline = [
      lookupDojo,
      lookupGraduacao,
      {
          $project: {
              _id: 1,
              nome: 1,
              aniversario: 1,
              matricula: 1,
              is_ativo: 1,
              dojo: 1,
              graduacao: 1
          } 
      },
  ];

  try {
    const response = await PessoaSchema.aggregate(pipeline)
          .allowDiskUse(true)
          .option({ maxTimeMS: 15000 })
          .exec();

    if (!response || response.length === 0) {
      return {
        sucesso: false,
        mensagem: 'Nenhuma pessoa encontrada.',
      };
    }

    return {
        sucesso: true,
        docs: response,
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


export async function update(id: string, dados: any): Promise<Resposta> {

  try {
    const response = await PessoaSchema.findByIdAndUpdate(
        {"_id": id},
        dados,
        {
            new: true,
            runValidators: true
        }
    )

    if (!response) {
      return {
          'sucesso': false,
          'mensagem': "Erro ao atualizar os dados",
          'erro': "Registro não encontrado"
      }
    }
    
    return {
        sucesso: true,
        doc: response
    }

  } catch (error) {
      return {
          sucesso: false,
          mensagem: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar pessoa.'
      }
  }

}
