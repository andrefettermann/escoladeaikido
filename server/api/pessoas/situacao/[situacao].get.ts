import * as PessoaService from "../../pessoas/pessoas.service";

interface Resposta {
    sucesso: boolean;
    mensagem?: string;
    dados?: any;
}

export default defineEventHandler(async (event): Promise<Resposta> => {
    const situacao = getRouterParam(event, 'situacao') ?? '';

    try {
        const dados = await PessoaService.buscaSituacao(situacao);
        if (!dados || !dados.docs || dados.docs.length === 0) {
            return {
                sucesso: false,
                mensagem: 'Nenhuma pessoa cadastrada para a situação informada.',
            };
        }

        return {
            sucesso: true,
            dados: dados.docs,
        };
    } catch (error) {
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar as pessoas por situação.',
        };
    }
});
