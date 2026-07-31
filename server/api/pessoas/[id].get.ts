// Busca a pessoa pelo _id
import { buscaPeloId } from './pessoas.service';

export default defineEventHandler(async (event): Promise<Resposta<Pessoa>> => {
    const id = getRouterParam(event, 'id') ?? '';
    const response = await buscaPeloId(id);

    return {
        sucesso: true,
        docs: response.docs,
    };
});
