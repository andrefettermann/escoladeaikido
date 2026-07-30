import { decripta } from "~~/server/utils/crypto";
import { converteData, formataData } from "~~/server/utils/datas";
import * as GraduacaoService from "~~/server/api/graduacoes/graduacoes.service";
import * as PessoasRepository from "~~/server/api/pessoas/pessoas.repository";

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

export async function buscaPeloId(id: string): Promise<Resposta<Pessoa>> {
  if (!id) {
    return {
        sucesso: false,
        mensagem: 'O id é obrigatório.'
    };
  }

  try {

    const response = await PessoasRepository.find(id)//.then(res => res.doc);

    if (!response || !response.sucesso) {
      return {
        sucesso: false,
        mensagem: 'Pessoa não encontrada.',
      };
    }

    if (response.docs && !Array.isArray(response.docs)) {
      //response.docs.id = response.docs._id;
      response.docs.nome = decripta(response.docs.nome);
      response.docs.cpf = response.docs.cpf?decripta(response.docs.cpf):'';
      response.docs.dojo = response.docs.dojo[0];
      response.docs.graduacao = response.docs.graduacao[0];
    }

    if (response.docs?.promocoes) {
      const promocoesComNomes = await Promise.all(response.docs.promocoes.map(
        async (promocao: { id_graduacao: any; data: string | number | Date; }) => {
          const graduacaoResponse = await GraduacaoService.buscaPeloId(promocao.id_graduacao);
          return {
            ...promocao,
            data: formataData(new Date(promocao.data)),
            nome_graduacao: graduacaoResponse.docs ? graduacaoResponse.docs.nome : 'Desconhecido',
          };
        }));
      response.docs.promocoes = promocoesComNomes;
    }

    return {
      sucesso: true,
      docs: response.docs,
    };
  } catch (error) {
    console.error("Ao buscar pessoa pelo ID:", error);
    return {
      sucesso: false,
      mensagem: (error as Error).message,
    };
  } 
}

export async function buscaTodos(): Promise<Resposta<Pessoa[]>> {
  try {
    const response = await PessoasRepository.findAll();//.then(res => res.docs);

    if (!response || !response.sucesso) {
      return {
        sucesso: false,
        mensagem: response.mensagem,
      };
    }

    response.docs?.map((p) => {
      p.id = p._id;
      p.nome = decripta(p.nome);
      p.cpf = p.cpf?decripta(p.cpf):'';
      p.graduacao = p.graduacao[0];
      p.dojo = p.dojo[0];
    })

    return {
        sucesso: true,
        docs: ordena(response.docs),
    };
  } catch (error: any) {
    console.error("Erro ao buscar todas as pessoas:", error);
    return {
        sucesso: false,
        //docs: [],
        mensagem: error.mensagem,
    };
  }
};

export async function buscaSituacao(situacao: string): Promise<Resposta<Pessoa[]>> {
  try {
    const response = await PessoasRepository.findBySituacao(situacao);

    if (!response || !response.sucesso) {
        return {
            sucesso: false,
            mensagem: 'Nenhuma pessoa encontrada!',
        };
    }

    response.docs?.map((p) => {
      p.id = p._id;
      p.nome = decripta(p.nome);
      p.cpf = p.cpf?decripta(p.cpf):'';
      p.graduacao = p.graduacao[0];
      p.dojo = p.dojo[0];
    })

    return {
        sucesso: true,
        docs: ordena(response.docs),
    };
  } catch (error) {
      console.error("Erro ao buscar pessoas por situação:", error);
      return {
          sucesso: false,
          docs: [],
          mensagem: 'Erro ao buscar as pessoas por situação.',
      };
  } 
}

export async function buscaAniversariantes(mes: string): Promise<Resposta<Pessoa[]>> {
  try {
      const response = await PessoasRepository.findByMesAniversario(mes);

      if (!response || !response.sucesso) {
          return {
              sucesso: false,
              mensagem: 'Nenhuma pessoa encontrada!',
          };
      }

    response.docs?.map((p) => {
      p.id = p._id;
      p.nome = decripta(p.nome);
      p.cpf = p.cpf?decripta(p.cpf):'';
      p.graduacao = p.graduacao[0];
      p.dojo = p.dojo[0];
    })

    return {
        sucesso: true,
        docs: ordena(response.docs),
    };
  } catch (error) {
      console.error("Erro ao buscar pessoas por mês de aniversário:", error);
      return {
          sucesso: false,
          docs: [],
          mensagem: 'Erro ao buscar as pessoas por mês de aniversário.',
      };
  } 
}

export async function buscaTipo(tipo: string): Promise<Resposta<Pessoa[]>> {
  try {
      const response = await PessoasRepository.findByTipo(tipo);

      if (!response || !response.sucesso) {
          return {
              sucesso: false,
              mensagem: 'Nenhuma pessoa encontrada!',
          };
      }

    response.docs?.map((p) => {
      p.id = p._id;
      p.nome = decripta(p.nome);
      p.cpf = p.cpf?decripta(p.cpf):'';
      p.graduacao = p.graduacao[0];
      p.dojo = p.dojo[0];
    })

      return {
          sucesso: true,
          docs: ordena(response.docs),
      };
  } catch (error) {
      console.error("Erro ao buscar pessoas por tipo:", error);
      return {
          sucesso: false,
          docs: [],
          mensagem: 'Erro ao buscar as pessoas por tipo.',
      };
  } 
}

function trataException(exception: any): string {
    var mensagem = '';
    if (exception.name === 'ValidationError') {
        // Para um campo específico
        //const mensagemNome = exception.errors.nome?.message;
        //console.log(mensagemNome); // "O nome é obrigatório"
        //return mensagemNome;
        
        // Ou percorrer todos os erros
        
        Object.keys(exception.errors).forEach(campo => {
            //console.log(exception.errors[campo].message);
            mensagem = exception.errors[campo].message;
        });
        
    }    
    return mensagem;
}

function preparaDadosGravacao(osDados: any): any {
    const docsPromocoes: any[] = [];
    osDados.promocoes.forEach((p: any)=>{
        docsPromocoes.push({
            'data': converteData(p.data),
            'id_graduacao': p.id_graduacao
        });
    })

    const doc = {
        'id': osDados.id,
        'aniversario': osDados.aniversario,
        'matricula': osDados.matricula,
        'nome': osDados.nome==''?osDados.nome:encripta(osDados.nome),
        'is_ativo': osDados.is_ativo,
        'cpf': osDados.cpf===''?'':encripta(osDados.cpf),
        'data_inicio_aikido': osDados.data_inicio,
        'data_matricula': osDados.data_matricula,
        'tipo': osDados.tipo,
        'id_dojo': osDados.dojo._id == ''?null:osDados.dojo._id,
        'id_graduacao': osDados.graduacao._id == ''?null:osDados.graduacao._id,
        'promocoes': docsPromocoes,
    }

    return doc;
}

export async function atualiza(event: any, id: string): Promise<Resposta> {
  const body = await readBody(event);
  const dados = preparaDadosGravacao(body);

  try {
    const response = await PessoasRepository.update(id, dados);

    if (!response || !response.sucesso) {
        return {
            'sucesso': false,
            'mensagem': "Erro ao atualizar os dados",
        }
    }

    return {
        sucesso: true,
        docs: response.docs
    }

  } catch (error) {
        return {
            sucesso: false,
            mensagem: trataException(error)
        }
    }

}

export async function cria(event: any): Promise<Resposta> {
  const body = await readBody(event);
  const dados = preparaDadosGravacao(body);

  try {
    const response = await PessoasRepository.create(dados);

    if (!response || !response.sucesso) {
        return {
            'sucesso': false,
            'mensagem': "Erro ao criar o registro",
        }
    }

    return {
        sucesso: true,
        docs: response.docs
    }

  } catch (error) {
        return {
            sucesso: false,
            mensagem: trataException(error)
        }
    }

}