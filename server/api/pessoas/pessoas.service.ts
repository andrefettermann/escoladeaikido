import { decripta } from "~~/server/utils/crypto";
import { converteData, formataData } from "~~/server/utils/datas";
import * as GraduacaoService from "~~/server/api/graduacoes/graduacoes.service";
import * as PessoasRepository from "~~/server/api/pessoas/pessoas.repository";

interface Resposta {
  sucesso: boolean;
  docs?: any[];
  doc?: any;
  mensagem?: string;
  erro?: string;
}

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

export async function buscaPeloId(id: string): Promise<Resposta> {
  try {

    const response = await PessoasRepository.find(id)//.then(res => res.doc);

    if (!response || !response.sucesso) {
      return {
        sucesso: false,
        mensagem: 'Pessoa não encontrada.',
      };
    }

    if (response.doc.promocoes || response.doc.promocoes.length > 0) {
      const promocoesComNomes = await Promise.all(response.doc.promocoes.map(
        async (promocao: { id_graduacao: any; data: string | number | Date; }) => {
          const graduacaoResponse = await GraduacaoService.buscaPeloId(promocao.id_graduacao);
          return {
            ...promocao,
            data: formataData(new Date(promocao.data)),
            nome_graduacao: graduacaoResponse.doc ? graduacaoResponse.doc.nome : 'Desconhecido',
          };
        }));
      response.doc.promocoes = promocoesComNomes;
    }

    const pessoa = {
        id: response.doc._id,
        aniversario: response.doc.aniversario,
        cpf: response.doc.cpf?decripta(response.doc.cpf):'',
        matricula: response.doc.matricula,
        nome: decripta(response.doc.nome) ,
        is_ativo: response.doc.is_ativo,
        dojo: response.doc.dojo[0],
        graduacao: response.doc.graduacao[0],
        data_inicio_aikido: response.doc.data_inicio_aikido,
        data_matricula: response.doc.data_matricula,
        promocoes: response.doc.promocoes?.map((promocao: 
          { data: string; id_graduacao: string, nome_graduacao: string }) => ({
            data: promocao.data.toString(),
            id_graduacao: promocao.id_graduacao,
            nome_graduacao: promocao.nome_graduacao
          }))
        ,
        tipo: response.doc.tipo,
    }

    return {
      sucesso: true,
      doc: pessoa,
    };
  } catch (error) {
    console.error("Ao buscar pessoa pelo ID:", error);
    return {
      sucesso: false,
      erro: (error as Error).message,
    };
  } 
}

export async function buscaTodos(): Promise<Resposta> {
  try {
    const response = await PessoasRepository.findAll();//.then(res => res.docs);

    if (!response || !response.sucesso) {
      return {
        sucesso: false,
        mensagem: 'Nenhuma pessoa encontrada.',
      };
    }

    const pessoas = response.docs?.map((pessoa) => (
      {
        id: pessoa._id,
        aniversario: pessoa.aniversario,
        matricula: pessoa.matricula,
        nome: decripta(pessoa.nome),
        cpf: pessoa.cpf? decripta(pessoa.cpf):'',
        is_ativo: pessoa.is_ativo,
        dojo: pessoa.dojo?.[0],
        graduacao: pessoa.graduacao?.[0],
        tipo: pessoa.tipo,
    }));

    return {
        sucesso: true,
        docs: ordena(pessoas),
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
        'id_dojo': osDados.id_dojo == ''?null:osDados.id_dojo,
        'id_graduacao': osDados.id_graduacao,
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
            'erro': "Registro não encontrado"
        }
    }

    return {
        sucesso: true,
        doc: response.doc
    }

  } catch (error) {
        return {
            sucesso: false,
            mensagem: trataException(error)
        }
    }

}

