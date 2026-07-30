import * as DojoService from "./dojos.service";

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

export default defineEventHandler(async (): Promise<Resposta<Dojo[]>> => {
    try {
        const resposta = await DojoService.buscaTodos();
        if (!resposta || resposta.docs?.length === 0) {
            return {
                sucesso: true,
                mensagem: 'Nenhum dojo cadastrado.',
            };
        }

        return {
            sucesso: true,
            docs: ordena(resposta.docs),
        };
    } catch (error) {
        console.error("Erro ao buscar os dojos:", error);
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar os dojos',
        };
    }
});

