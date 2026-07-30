import * as DojoService from "./dojos.service";

export default defineEventHandler(async (event): Promise<Resposta<Dojo>> => {
    const id = getRouterParam(event, 'id') ?? '';

    try {
        const resposta = await DojoService.buscaPeloId(id);

        if (!resposta || !resposta.docs) {
            return {
                sucesso: false,
                mensagem: 'Nenhum dojo cadastrado para o ID informado.',
            };
        }

        return {
            sucesso: true,
            docs: resposta.docs,
        };
    } catch (error) {
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar os dojos por ID.',
        };
    }
});
