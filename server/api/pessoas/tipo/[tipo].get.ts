import { buscaTipo } from '../pessoas.service';

export default defineEventHandler(async (event): Promise<Resposta<Pessoa[]>> => {
    const tipo = getRouterParam(event, 'tipo') ?? '';

    try {
        const dados = await buscaTipo(tipo);
        if (!dados || !dados.docs || dados.docs.length === 0) {
            return {
                sucesso: false,
                mensagem: 'Nenhuma pessoa cadastrada para o tipo informado.',
            };
        }

        return {
            sucesso: true,
            docs: dados.docs,
        };
    } catch (error) {
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar as pessoas por tipo.',
        };
    }
});
