import { TaxaSchema } from "~~/server/models/Taxa";
import mongoose from 'mongoose';

const projectTaxas = {
    $project: {
      _id: 1,
      tipo: 1,
      descricao: 1,
//      valor_padrao: 1,
      is_ativa: 1,
//      periodo_referencia: 1,
      observacoes: 1
    }
}

const lookupCobrancas: any[] = [
    {
        $lookup: {
            from: "cobrancas",
            let: { taxaId: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: ["$id_taxa", "$$taxaId"] } } },
                // Faz o lookup da pessoa DENTRO de cada cobrança encontrada
                {
                    $lookup: {
                        from: "pessoas",
                        let: { pessoaId: "$id_pessoa" }, // Aqui id_pessoa é um ID único da cobrança atual
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$pessoaId"] } } },
                            { $project: { _id: 1, nome: 1 } }
                        ],
                        as: "pessoa"
                    }
                },
                // Opcional: transforma o array 'pessoa' em um objeto único se cada cobrança tiver só 1 pessoa
                { $unwind: { path: "$pessoa", preserveNullAndEmptyArrays: true } },
                { $project: { _id: 1, descricao: 1, valor: 1, data_vencimento: 1, situacao: 1, periodo_referencia: 1, observacoes: 1, id_pessoa: 1, pessoa: 1 } },
                { $sort: { periodo_referencia: -1 } } // Ordena as cobranças pelo período de referência, do mais recente para o mais antigo
            ],
            as: "cobrancas"
        }
    }
];

export async function find(id: string): Promise<Resposta<Taxa>> {
  try {
    const pipeline: any[] = [
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        ...lookupCobrancas,
        { $limit: 1 }
    ];

    const response = await TaxaSchema.aggregate(pipeline)
        .allowDiskUse(true)
        .option({ maxTimeMS: 15000 })
        .limit(1)
        .exec();

    if (!response || response.length === 0) {
      return {
        sucesso: false,
        mensagem: 'Taxa não encontrada.',
      };
    }

    return {
      sucesso: true,
      docs: response[0],
    };
  } catch (error) {
    console.error(`Repositorio - ao buscar taxa pelo ID: ${error}`);
    return {
      sucesso: false,
      mensagem: (error as Error).message,
    };
  } 
}

export async function findAll(): Promise<Resposta<Taxa[]>> {

  try {
    const response = await TaxaSchema.aggregate([
          projectTaxas,
          { $sort: { descricao: 1 } }
        ])
          .allowDiskUse(true)
          .option({ maxTimeMS: 15000 })
          .exec();

    if (!response || response.length === 0) {
      return {
        sucesso: false,
        mensagem: 'Nenhuma taxa encontrada.',
      };
    }

    return {
        sucesso: true,
        docs: response,
    };
  } catch (error: any) {
    return {
        sucesso: false,
        mensagem: error.message,
    };
  }
};

export async function create(dados: any): Promise<Resposta<any>> {
  try {
    dados._id = new mongoose.Types.ObjectId(); // Gera um novo ObjectId para o documento

    const taxa = new TaxaSchema(dados);
    const savedTaxa = await taxa.save();

    return {
      sucesso: true,
      docs: savedTaxa,
    };
  } catch (error: any) {
    return {
      sucesso: false,
      mensagem: error.message,
    };
  }
}

export async function update(id: string, dados: any): Promise<Resposta<any>> {
  try {
    const updatedTaxa = await TaxaSchema.findByIdAndUpdate(
      id,
      dados,
      {
            returnDocument: 'after',
            runValidators: true
      }
    );

    if (!updatedTaxa) {
      return {
        sucesso: false,
        mensagem: 'Taxa não encontrada para atualização.',
      };
    }

    return {
      sucesso: true,
      docs: updatedTaxa,
    };
  } catch (error: any) {
    return {
      sucesso: false,
      mensagem: error.message,
    };
  }
}
