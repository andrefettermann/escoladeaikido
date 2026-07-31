import * as DojoService from "./dojos.service";

export default defineEventHandler(async (event): Promise<Resposta<Dojo>> => {
    const resposta = await DojoService.cria(event); 

    return resposta;

});
