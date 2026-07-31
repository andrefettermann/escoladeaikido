// Carrega todos os dojos
import * as DojoService from "./dojos.service";

export default defineEventHandler(async (): Promise<Resposta<Dojo[]>> => {
    const resposta = await DojoService.buscaTodos();

    return {
        sucesso: true,
        docs: resposta.docs,
    };
});

