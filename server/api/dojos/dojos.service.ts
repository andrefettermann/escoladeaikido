import * as DojosRepository from "../dojos/dojos.repository";

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

    const response = await DojosRepository.find(id)//.then(res => res.doc);

    if (!response || !response.sucesso) {
      return {
        sucesso: false,
        mensagem: 'Dojo não encontrado.',
      };
    }

    const dojo = {
        id: response.doc._id,
        nome: response.doc.nome,
        endereco: response.doc.endereco,
        bairro: response.doc.bairro,
        cidade: response.doc.cidade,
        uf: response.doc.uf,
        pais: response.doc.pais,
        local: response.doc.local,
        url: response.doc.url,
        email: response.doc.email,
        id_professor: response.doc.id_professor,
        horarios: response.doc.horarios,
        is_ativo: response.doc.is_ativo,
        professores: response.doc.professores,
      };

    return {
      sucesso: true,
      doc: dojo,
    };
  } catch (error) {
    console.error("Ao buscar dojo pelo ID:", error);
    return {
      sucesso: false,
      erro: (error as Error).message,
    };
  } 
}

export async function buscaTodos(): Promise<Resposta> {
  try {
    const response = await DojosRepository.findAll();//.then(res => res.docs);

    if (!response || !response.sucesso) {
      return {
        sucesso: false,
        mensagem: 'Nenhum dojo encontrado.',
      };
    }

    const dojos = response.docs?.map((d: any) => (
      {
        id: d._id,
        nome: d.nome,
        endereco: d.endereco,
        bairro: d.bairro,
        cidade: d.cidade,
        uf: d.uf,
        pais: d.pais,
        local: d.local,
        url: d.url,
        email: d.email,
        id_professor: d.id_professor,
        horarios: d.horarios,
        is_ativo: d.is_ativo,
        professores: d.professores,
    }));

    return {
        sucesso: true,
        docs: ordena(dojos),
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

export async function buscaSituacao(situacao: string): Promise<Resposta> {
  try {
    const response = await DojosRepository.findBySituacao(situacao);

    if (!response || !response.sucesso) {
        return {
            sucesso: false,
            mensagem: 'Nenhum dojo encontrado!',
        };
    }

    const dojos = response.docs?.map((d: any) => (
    {
      id: d._id,
      nome: d.nome,
      endereco: d.endereco,
      bairro: d.bairro,
      cidade: d.cidade,
      uf: d.uf,
      pais: d.pais,
      local: d.local,
      url: d.url,
      email: d.email,
      id_professor: d.id_professor,
      horarios: d.horarios,
      is_ativo: d.is_ativo,
      professores: d.professores,
    }));

    return {
        sucesso: true,
        docs: ordena(dojos),
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
            'erro': "Dojo não encontrado"
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

export async function cria(event: any): Promise<Resposta> {
  const body = await readBody(event);
  const dados = preparaDadosGravacao(body);

  try {
    const response = await DojosRepository.create(dados);

    if (!response || !response.sucesso) {
        return {
            'sucesso': false,
            'mensagem': "Erro ao criar o registro do dojo",
            'erro': "Dojo não criado"
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