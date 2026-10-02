// Busca todas as taxas
import * as TaxaService from "./taxas.service";

export default defineEventHandler(async (event): Promise<Resposta<Taxa[]>> => {
    const resposta = await TaxaService.buscaTodos();    
    return resposta;
});

