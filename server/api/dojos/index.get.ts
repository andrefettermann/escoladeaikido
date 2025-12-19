import { DojoSchema } from "~~/server/models/Dojo";

interface Resposta {
    sucesso: boolean;
    mensagem?: string;
    dados?: any;
}

export default defineEventHandler(async (event): Promise<Resposta> => {
    try {
        const dojos = await DojoSchema.find().lean();

        if (!dojos) {
            return {
                sucesso: true,
                mensagem: 'Nenhum dojo cadastrado.',
            };
        }


        return {
            sucesso: true,
            dados: dojos,
        };
    } catch (error) {
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar os dojos',
        };
    }
});

