import { defineMongooseModel } from '#nuxt/mongoose'

export const PessoaSchema = defineMongooseModel({
    name: 'pessoas',
    schema: {
        aniversario: {
            type: String as any,
            required: false
        },
        matricula: {
            type: String as any,
            required: false
        },
        nome: {
            type: String as any,
            required: [true, 'O nome é obrigatório.'],
        },
        is_ativo: {
            type: Boolean as any,
            required: false
        },
        cpf: {
            type: String as any,
            required: false
        },
        data_inicio_aikido: {
            type: String as any,
            required: false
        },
        data_matricula: {
            type: String as any,
            required: false
        },
        tipo: {
            type: String as any,
            required: [true, 'O tipo é obrigatório.'],
        },
        id_dojo: {
            type: String as any,
            default: null,
            required: false
        },
        id_graduacao: {
            type: String as any,
            default: null,
            required: false
        },
        promocoes: [
            {
                data: {
                    type: Date as any,
                    required: true
                },
                id_graduacao: {
                    type: String as any,
                    default: null,
                    required: false
                },
            }
        ],
    }
})