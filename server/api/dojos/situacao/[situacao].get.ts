import * as DojoService from "../dojos.service";

function ordena(docs: any): any {
    docs.sort((a: { nome: string; }, b: { nome: string; }) => {
        var fa = a.nome.toLowerCase();
        var fb = b.nome.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });

    return docs;
}

export default defineEventHandler(async (event): Promise<Resposta<Dojo[]>> => {
    const situacao = getRouterParam(event, 'situacao') ?? '';

    try {
        const dados = await DojoService.buscaSituacao(situacao);
        
        if (!dados || !dados.docs || dados.docs.length === 0) {
            return {
                sucesso: false,
                mensagem: 'Nenhum dojo cadastrado para a situação informada.',
            };
        }

        return {
            sucesso: true,
            docs: dados.docs,
        };
    } catch (error) {
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar os dojos por situação.',
        };
    }
});
