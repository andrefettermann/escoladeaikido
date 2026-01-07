import * as PessoaService from "../pessoas/pessoas.service";

interface Resposta {
    sucesso: boolean;
    mensagem?: string;
    dados?: any;
}

export default defineEventHandler(async (event): Promise<Resposta> => {
    const id = getRouterParam(event, 'id') ?? '';

    try {
        const dados = await PessoaService.atualiza(event, id);
        if (dados.sucesso === false) {
            return {
                sucesso: false,
                mensagem: dados.mensagem || 'Erro ao atualizar pessoa.',
            };
        }

        return dados;
    } catch (error: any) {
        return {
            sucesso: false,
            mensagem: 'Erro ao atualizar pessoa.',
        };
    }
});
