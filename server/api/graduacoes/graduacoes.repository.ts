import { GraduacaoSchema } from "~~/server/models/Graduacao";
import mongoose from 'mongoose';

const lookupPessoas = {
    $lookup: {
        from: "pessoas",
        localField: "_id",
        foreignField: "id_graduacao",
        pipeline: [
            { $project: { _id: 1, nome: 1, situacao: 1 } },
        ],
        as: "pessoas"
    }
}

export async function find(id: string): Promise<Resposta<Graduacao>> {
  try {
    const pipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        //lookupPessoas,
        { $limit: 1 }
    ];

    const response = await GraduacaoSchema.aggregate(pipeline)
        .allowDiskUse(true)
        .option({ maxTimeMS: 15000 })
        .limit(1)
        .exec();

    if (!response || response.length === 0) {
      return {
        sucesso: false,
        mensagem: 'Graduação não encontrada.',
      };
    }

    return {
      sucesso: true,
      docs: response[0],
    };
  } catch (error) {
    console.error(`Repositorio - ao buscar graduacao pelo ID: ${error}`);
    return {
      sucesso: false,
      mensagem: (error as Error).message,
    };
  } 
}

export async function findAll(): Promise<Resposta<Graduacao[]>> {
  try {
    const response = await GraduacaoSchema.aggregate([{ $sort: { sequencia: 1 } }])
          .allowDiskUse(true)
          .option({ maxTimeMS: 15000 })
          .exec();

    if (!response || response.length === 0) {
      return {
        sucesso: false,
        mensagem: 'Nenhuma graduação encontrada.',
      };
    }

    return {
        sucesso: true,
        docs: response,
    };
  } catch (error) {
    console.error("Erro ao buscar todas as graduacoes:", error);
    return {
        sucesso: false,
        docs: [],
        mensagem: 'Erro ao buscar as graduacoes.',
    };
  }
};
