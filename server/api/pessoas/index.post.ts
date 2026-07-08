import * as PessoaService from "../pessoas/pessoas.service";

interface Resposta {
    sucesso: boolean;
    mensagem?: string;
    dados?: any;
}

export default defineEventHandler(async (event): Promise<Resposta> => {
    try {
        const dados = await PessoaService.cria(event); 
        if (dados.sucesso === false) {
            return {
                sucesso: false,
                mensagem: dados.mensagem || 'Erro ao criar pessoa.',
            };
        }
        return dados;
    } catch (error: any) {
        return {
            sucesso: false,
            mensagem: 'Erro ao criar pessoa.',
        };
    }
});
