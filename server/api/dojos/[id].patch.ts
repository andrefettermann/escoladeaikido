import * as DojoService from "./dojos.service";

export default defineEventHandler(async (event): Promise<Resposta<Dojo>> => {
    const id = getRouterParam(event, 'id') ?? '';

    const resposta = await DojoService.atualiza(event, id);
    return resposta;
});
