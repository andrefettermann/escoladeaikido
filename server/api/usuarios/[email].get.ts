import { UsuarioSchema } from "~~/server/models/Usuario";

interface Resposta {
    sucesso: boolean;
    mensagem?: string;
    dados?: any;
}

export default defineEventHandler(async (event): Promise<Resposta> => {
    const { email } = event.context.params as { email: string };

    const lookupPessoa = {
        $lookup: {
            from: "pessoas",
            let: { idProfessor: "$id_professor" },
            pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$idProfessor"] } } },
                { $project: { _id: 1, nome: 1 } },
                { $limit: 1 }
            ],
            as: "pessoa"
        }
    }

    const pipeline = [
        { $match: { 'email': email } },
        { $limit: 1 }
    ];

    try {

//        const [usuario] = await UsuarioSchema.find({ email }).limit(1).exec();
        const [usuario] = await UsuarioSchema.aggregate(
            [lookupPessoa, ...pipeline]).limit(1).exec();

        if (!usuario) {
            return {
                sucesso: false,
                mensagem: 'Usuário não encontrado',
            };
        }


        return {
            sucesso: true,
            dados: usuario,
        };
    } catch (error) {
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar usuário',
        };
    }
});

