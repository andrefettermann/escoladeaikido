// Busca a graduacao pelo id
import * as GraduacaoService from "./graduacoes.service";

export default defineEventHandler(async (event): Promise<Resposta<Graduacao>> => {
    const id = getRouterParam(event, 'id') ?? '';
    const resposta = await GraduacaoService.buscaPeloId(id);

    return {
        sucesso: true,
        docs: resposta.docs,
    };
});
