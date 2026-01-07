import * as PessoaService from "../pessoas/pessoas.service";

interface Resposta {
    sucesso: boolean;
    mensagem?: string;
    dados?: any;
}

export default defineEventHandler(async (event): Promise<Resposta> => {

    try {
        const pessoas = await PessoaService.buscaTodos();

        if (!pessoas || !pessoas.docs || pessoas.docs.length === 0) {
            return {
                sucesso: false,
                mensagem: 'Nenhuma pessoa cadastrada.',
            };
        }

        return {
            sucesso: true,
            dados: pessoas.docs,
        };
    } catch (error) {
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar as pessoas.',
        };
    }
});

