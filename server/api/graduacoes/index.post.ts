import * as GraduacaoService from "./graduacoes.service";

export default defineEventHandler(async (event): Promise<Resposta<Graduacao>> => {
    try {
        const dados = await GraduacaoService.cria(event); 
        console.log('Dados recebidos do serviço:', dados);
        if (dados.sucesso === false) {
            return {
                sucesso: false,
                mensagem: dados.mensagem || 'Erro ao criar graduação.',
            };
        }
        return dados;
    } catch (error: any) {
        return {
            sucesso: false,
            mensagem: `Erro ao criar graduação: ${error.message}`,
        };
    }
});
