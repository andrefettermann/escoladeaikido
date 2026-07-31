// Carrega as pessoas por situacao (ativo ou inativo)
import * as PessoaService from "../../pessoas/pessoas.service";

export default defineEventHandler(async (event): Promise<Resposta<Pessoa[]>> => {
    const situacao = getRouterParam(event, 'situacao') ?? '';
    const resposta = await PessoaService.buscaSituacao(situacao);
    
    return {
        sucesso: true,
        docs: resposta.docs,
    };
});
