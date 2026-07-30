import * as PessoaService from "../pessoas.service";

export default defineEventHandler(async (event): Promise<Resposta<Pessoa[]>> => {
    const mes = getRouterParam(event, 'mes') ?? '';

    try {
        const dados = await PessoaService.buscaAniversariantes(mes);
        if (!dados || !dados.docs || dados.docs.length === 0) {
            return {
                sucesso: false,
                mensagem: 'Nenhuma pessoa cadastrada para o mês informado.',
            };
        }

        return {
            sucesso: true,
            docs: dados.docs,
        };
    } catch (error) {
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar as pessoas por mês.',
        };
    }
});
