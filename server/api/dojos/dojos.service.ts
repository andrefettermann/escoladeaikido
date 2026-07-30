import * as DojosRepository from "../dojos/dojos.repository";
import * as GraduacoesRepository from "../graduacoes/graduacoes.repository"
import * as PessoasRepository from "../pessoas/pessoas.repository"

/*
interface Resposta {
  sucesso: boolean;
  docs?: Dojo[];
  doc?: Dojo;
  mensagem?: string;
  erro?: string;
}

interface Dojo {
  id: number;
  nome: string;
  local: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  pais: string;
  url: string;
  email: string;
  horarios: {
    id: number;
    id_professor: number;
    nome_professor: string;
    horario: string;
  }[];
  alunos: {
    id: number;
    nome: string;
    id_gradauacao: number;
  }[];
  is_ativo: boolean;
}
*/
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

export async function buscaPeloId(id: string): Promise<Resposta<Dojo>> {
  try {
    const response = await DojosRepository.find(id)//.then(res => res.doc);

    if (!response || !response.sucesso) {
      return {
        sucesso: false,
        mensagem: 'Dojo não encontrado.',
      };
    }

    if (Array.isArray(response.docs?.horarios)) {
      for (const h of response.docs.horarios) {
        if (h?.id_professor) {
          try {
            //a.nome = decripta(a.nome);

            // O loop 'for...of' vai pausar aqui a cada iteração
            const pessoa = await PessoasRepository.find(h.id_professor);
            h.nome_professor = pessoa.docs?.nome ?? '';
            h.nome_professor = decripta(h.nome_professor);
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

    if (Array.isArray(response.docs?.alunos)) {
      for (const a of response.docs.alunos) {
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

    ordena(response.docs?.alunos);

    return {
      sucesso: true,
      docs: response.docs,
    };
  } catch (error) {
    console.error("Ao buscar dojo pelo ID:", error);
    return {
      sucesso: false,
      mensagem: (error as Error).message,
    };
  } 
}

export async function buscaTodos(): Promise<Resposta<Dojo[]>> {
  try {
    const response = await DojosRepository.findAll();//.then(res => res.docs);

    if (!response || !response.sucesso) {
      return {
        sucesso: false,
        mensagem: 'Nenhum dojo encontrado.',
      };
    }

    response.docs?.map((d) => {
      d.id = d._id;
    })
    
    return {
        sucesso: true,
        docs: ordena(response.docs),
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

export async function buscaSituacao(situacao: string): Promise<Resposta<Dojo[]>> {
  try {
    const response = await DojosRepository.findBySituacao(situacao);

    if (!response || !response.sucesso) {
        return {
            sucesso: false,
            mensagem: 'Nenhum dojo encontrado!',
        };
    }

    response.docs?.map((d) => {
      d.id = d._id;
    })

    return {
        sucesso: true,
        docs: ordena(response.docs),
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

  const docsProfessores: any[] = [];
  osDados.professores.forEach((p: any)=>{
    docsProfessores.push({
      'id_professor': p.id_professor
    });
  })
  

  const doc = {
    'id': osDados.id,
    'nome': osDados.nom,
    'local': osDados.local,
    'endereco': osDados.endereco,
    'bairro': osDados.bairro,
    'cidade': osDados.cidade,
    'uf': osDados.uf,
    'pais': osDados.pais,
    'url': osDados.url,
    'email': osDados.email,
    'horarios': osDados.horarios,
    'is_ativo': osDados.is_ativo,
    'professores': docsProfessores,
  }

  return doc;
}

export async function atualiza(event: any, id: string): Promise<Resposta> {
  const body = await readBody(event);
  const dados = preparaDadosGravacao(body);

  try {
    const response = await DojosRepository.update(id, dados);

    if (!response || !response.sucesso) {
        return {
            'sucesso': false,
            'mensagem': "Erro ao atualizar os dados do dojo",
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
    const response = await DojosRepository.create(dados);

    if (!response || !response.sucesso) {
        return {
            'sucesso': false,
            'mensagem': "Erro ao criar o registro do dojo",
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