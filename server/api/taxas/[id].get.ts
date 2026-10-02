// Busca a taxa pelo id
import * as TaxaService from "./taxas.service";

export default defineEventHandler(async (event): Promise<Resposta<Taxa>> => {
    const id = getRouterParam(event, 'id') ?? '';
    const resposta = await TaxaService.buscaPeloId(id);

    return {
        sucesso: true,
        docs: resposta.docs,
    };
});
