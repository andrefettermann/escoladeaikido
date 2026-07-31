// Carrega os aniversariantes do mes
import * as PessoaService from "../pessoas.service";

export default defineEventHandler(async (event): Promise<Resposta<Pessoa[]>> => {
    const mes = getRouterParam(event, 'mes') ?? '';
    const dados = await PessoaService.buscaAniversariantes(mes);

    return {
        sucesso: true,
        docs: dados.docs,
    };
});
