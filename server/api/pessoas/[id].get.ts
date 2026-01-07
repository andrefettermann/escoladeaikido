import { buscaPeloId } from './pessoas.service';

interface Resposta {
    sucesso: boolean;
    mensagem?: string;
    dados?: any;
}

export default defineEventHandler(async (event): Promise<Resposta> => {
    const id = getRouterParam(event, 'id') ?? '';

    try {
        const response = await buscaPeloId(id);

        if (response.sucesso === false) {
            return {
                sucesso: false,
                mensagem: response.erro,
            };
        }

        return {
            sucesso: true,
            dados: response.doc,
        };
    } catch (error: any) {
        return {
            sucesso: false,
            mensagem: `Ao buscar a pessoa: ${error.message}`,
        };
    }
});
