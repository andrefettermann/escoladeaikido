import * as PessoaService from "../../pessoas/pessoas.service";

export default defineEventHandler(async (event): Promise<Resposta<Pessoa[]>> => {
    const situacao = getRouterParam(event, 'situacao') ?? '';

    try {
        const resposta = await PessoaService.buscaSituacao(situacao);

        if (!resposta || !resposta.docs || resposta.docs.length === 0) {
            return {
                sucesso: false,
                mensagem: 'Nenhuma pessoa cadastrada para a situação informada.',
            };
        }

        return {
            sucesso: true,
            docs: resposta.docs,
        };
    } catch (error) {
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar as pessoas por situação.',
        };
    }
});
