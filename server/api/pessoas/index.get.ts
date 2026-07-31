// Carrega todas as pessoas
import * as PessoaService from "../pessoas/pessoas.service";

export default defineEventHandler(async (event): Promise<Resposta<Pessoa[]>> => {
    const resposta = await PessoaService.buscaTodos();

    return {
        sucesso: true,
        docs: resposta.docs,
    };
});

