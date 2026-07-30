import * as GraduacaoService from "../graduacoes/graduacoes.service";

export default defineEventHandler(async (event): Promise<Resposta<Graduacao[]>> => {

    try {
        const graduacoes = await GraduacaoService.buscaTodos();

        if (!graduacoes || !graduacoes.docs || graduacoes.docs.length === 0) {
            return {
                sucesso: false,
                mensagem: 'Nenhuma graduação cadastrada.',
            };
        }

        return {
            sucesso: true,
            docs: graduacoes.docs,
        };
    } catch (error) {
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar as graduacoes.',
        };
    }
});

