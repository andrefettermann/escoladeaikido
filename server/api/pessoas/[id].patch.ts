import * as PessoaService from "../pessoas/pessoas.service";

export default defineEventHandler(async (event): Promise<Resposta> => {
    const id = getRouterParam(event, 'id') ?? '';
    const resposta = await PessoaService.atualiza(event, id);
    return resposta;
});
