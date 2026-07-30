import { buscaPeloId } from './pessoas.service';

export default defineEventHandler(async (event): Promise<Resposta<Pessoa>> => {
    const id = getRouterParam(event, 'id') ?? '';

    try {
        const response = await buscaPeloId(id);

        if (response.sucesso === false) {
            return {
                sucesso: false,
                mensagem: response.mensagem,
            };
        }

        return {
            sucesso: true,
            docs: response.docs,
        };
    } catch (error: any) {
        return {
            sucesso: false,
            mensagem: `Ao buscar a pessoa: ${error.message}`,
        };
    }
});
