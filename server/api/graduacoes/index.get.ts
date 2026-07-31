// Busca todas as graduacoes
import * as GraduacaoService from "../graduacoes/graduacoes.service";

export default defineEventHandler(async (event): Promise<Resposta<Graduacao[]>> => {
    const resposta = await GraduacaoService.buscaTodos();
    return resposta;
});

