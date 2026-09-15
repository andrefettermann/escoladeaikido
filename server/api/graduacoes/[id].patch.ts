import { Graduacao } from "~~/shared/types";
import * as GraduacaoService from "./graduacoes.service";

export default defineEventHandler(async (event): Promise<Resposta<Graduacao>> => {
    const id = getRouterParam(event, 'id') ?? '';
    const resposta = await GraduacaoService.atualiza(event, id);
    return resposta;
});
