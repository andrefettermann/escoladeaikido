// Retorna as pessoas pelo tipo (professor, aluno, etc)
import { buscaTipo } from '../pessoas.service';

export default defineEventHandler(async (event): Promise<Resposta<Pessoa[]>> => {
    const tipo = getRouterParam(event, 'tipo') ?? '';
    const dados = await buscaTipo(tipo);

    return {
        sucesso: true,
        docs: dados.docs,
    };
});
