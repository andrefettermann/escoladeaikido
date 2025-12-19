import { DojoSchema } from "~~/server/models/Dojo";
import * as PessoaService from "../pessoas/pessoas.service";

interface Resposta {
    sucesso: boolean;
    mensagem?: string;
    dados?: any;
}

type Dojo = {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  uf: string;
  local?: string;
  professores?: {
    id_professor: string;
    nome?: string;
    horarios?: string;
  }[];
}

export default defineEventHandler(async (event): Promise<Resposta> => {
    const dojos: Dojo[] = [];
    let dojoItem: Dojo;

    try {
        const resposta = await DojoSchema.find({ is_ativo: true }).lean();

        if (!resposta || resposta.length === 0) {
            return {
                sucesso: true,
                mensagem: 'Nenhum dojo cadastrado.',
            };
        }

        for (const dojo of resposta) {
            dojoItem = {
                id: dojo._id.toString(),
                nome: dojo.nome.toString(),
                endereco: dojo.endereco.toString(),
                cidade: dojo.cidade.toString(),
                uf: dojo.uf.toString(),
                local: dojo.local ? dojo.local.toString() : undefined,
                professores: [],
            }

            if (dojo.professores && dojo.professores.length > 0) {
                for (const p of dojo.professores) {
                    if (!dojoItem.professores) {
                        dojoItem.professores = [];
                    }

                    const id: string = (p as any).id_professor;
                    const resposta = await PessoaService.buscaPeloId(id);

                    if (resposta.sucesso && resposta.doc) {
                        dojoItem.professores.push({
                            id_professor: id,
                            nome: resposta.doc?.nome.toString(),
                            horarios: (p as any).horarios ? (p as any).horarios.toString() : undefined,
                        });
                    }
                };
            }
            dojos.push(dojoItem);
        }

        return {
            sucesso: true,
            dados: dojos,
        };
    } catch (error) {
        console.error("Erro ao buscar os dojos:", error);
        return {
            sucesso: false,
            mensagem: 'Erro ao buscar os dojos',
        };
    }
});

