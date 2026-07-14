import { DojoSchema } from "~~/server/models/Dojo";
import mongoose from 'mongoose';

interface Resposta {
  sucesso: boolean;
  docs?: any[];
  doc?: any;
  mensagem?: string;
  erro?: string;
}

const projectDojos = {
    $project: {
        _id: 1,
        local: 1,
        bairro: 1,
        nome: 1,
        endereco: 1,
        cidade: 1,
        uf: 1,
        is_ativo: 1,
        professores: 1
    }
}

export async function find(id: string): Promise<Resposta> {
  try {
    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      projectDojos,
      { $limit: 1 }
    ];

    const response = await DojoSchema.aggregate(pipeline)
        .allowDiskUse(true)
        .option({ maxTimeMS: 15000 })
        .limit(1)
        .exec();

    if (!response || response.length === 0) {
      return {
        sucesso: false,
        mensagem: 'Dojo não encontrado.',
      };
    }

    return {
      sucesso: true,
      doc: response[0],
    };
  } catch (error) {
    console.error(`Repositorio - ao buscar dojo pelo ID: ${error}`);
    return {
      sucesso: false,
      erro: (error as Error).message,
    };
  } 
}

export async function findAll(): Promise<Resposta> {
  const pipeline = [
        projectDojos,
    ];

  try {
    const response = await DojoSchema.aggregate(pipeline)
          .allowDiskUse(true)
          .option({ maxTimeMS: 15000 })
          .exec();

    if (!response || response.length === 0) {
      return {
        sucesso: false,
        mensagem: 'Nenhum dojo encontrado.',
      };
    }

    return {
        sucesso: true,
        docs: response,
    };
  } catch (error) {
    console.error("Erro ao buscar todos os dojos:", error);
    return {
        sucesso: false,
        docs: [],
        mensagem: 'Erro ao buscar os dojos.',
    };
  }
};

export async function findBySituacao(situacao: string): Promise<Resposta> {
  var isAtivo = false;
  if (situacao !== 'ativo' && situacao !== 'inativo') {
    return {
        sucesso: false,
        mensagem: 'Situação inválida. Use "ativo" ou "inativo".',
    };
  }

  if (situacao === 'ativo') {
    isAtivo = true;
  }

  const pipeline = [
      { $match: { is_ativo: isAtivo } },
      projectDojos,
  ];

  try {
      const response = await DojoSchema.aggregate(pipeline)
          .allowDiskUse(true)
          .option({ maxTimeMS: 15000 })
          .exec();

      if (!response || response.length === 0) {
          return {
              sucesso: false,
              mensagem: 'Nenhum dojo encontrado para a situação informada.',
          };
      }

      return {
          sucesso: true,
          docs: response,
      };
  } catch (error) {
      console.error("Erro ao buscar dojos por situação:", error);
      return {
          sucesso: false,
          docs: [],
          mensagem: 'Erro ao buscar os dojos por situação.',
      };
  }
}

export async function update(id: string, dados: any): Promise<Resposta> {
  try {
    const response = await DojoSchema.findByIdAndUpdate(
        {"_id": id},
        dados,
        {
            returnDocument: 'after',
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
          mensagem: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar dojo.'
      }
  }

}

export async function create(dados: any): Promise<Resposta> {
  try {
    const dojo = new DojoSchema(dados);
    const response = await dojo.save();

    if (!response) {
      return {
          'sucesso': false,
          'mensagem': "Erro ao criar o dojo",
          'erro': "Registro não criado"
      }
    }

    return {
        sucesso: true,
        doc: response
    }

  } catch (error) {
      return {
          sucesso: false,
          mensagem: error instanceof Error ? error.message : 'Erro desconhecido ao criar dojo.'
      }
  }
}
