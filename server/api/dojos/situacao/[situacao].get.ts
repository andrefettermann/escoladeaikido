// Carrega os dojos por situacao (ativo ou inativo)
import * as DojoService from "../dojos.service";

export default defineEventHandler(async (event): Promise<Resposta<Dojo[]>> => {
    const situacao = getRouterParam(event, 'situacao') ?? '';
    const dados = await DojoService.buscaSituacao(situacao);

    return {
        sucesso: true,
        docs: dados.docs,
    };
});
