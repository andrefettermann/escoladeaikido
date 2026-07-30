import * as PessoaService from "../pessoas/pessoas.service";

export default defineEventHandler(async (event): Promise<Resposta<Pessoa[]>> => {

    try {
        const resposta = await PessoaService.buscaTodos();

        if (!resposta || !resposta.docs || resposta.docs.length === 0) {
            return {
                sucesso: false,
                mensagem: 'Nenhuma pessoa cadastrada.',
            };
        }

        return {
            sucesso: true,
            docs: resposta.docs,
        };
    } catch (error) {
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar as pessoas.',
        };
    }
});

