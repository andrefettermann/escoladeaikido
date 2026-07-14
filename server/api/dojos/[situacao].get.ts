import * as DojoService from "./dojos.service";

interface Resposta {
    sucesso: boolean;
    mensagem?: string;
    dados?: any;
}

export default defineEventHandler(async (event): Promise<Resposta> => {
    const situacao = getRouterParam(event, 'situacao') ?? '';

    try {
        const dados = await DojoService.buscaSituacao(situacao);
        if (!dados || !dados.docs || dados.docs.length === 0) {
            return {
                sucesso: false,
                mensagem: 'Nenhum dojo cadastrado para a situação informada.',
            };
        }

        return {
            sucesso: true,
            dados: dados.docs,
        };
    } catch (error) {
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar os dojos por situação.',
        };
    }
});
