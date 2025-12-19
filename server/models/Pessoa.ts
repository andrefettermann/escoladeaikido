import { defineMongooseModel } from '#nuxt/mongoose'

export const PessoaSchema = defineMongooseModel({
    name: 'pessoas',
    schema: {
        aniversario: {
            type: String,
            required: false
        },
        matricula: {
            type: String,
            required: false
        },
        nome: {
            type: String,
            required: true
        },
        situacao: {
            type: String,
            required: true
        },
        cpf: {
            type: String,
            required: false
        },
        data_inicio_aikido: {
            type: String,
            required: false
        },
        data_matricula: {
            type: String,
            required: false
        },
        id_dojo: {
            type: String,
            default: null,
            required: false
        },
        id_graduacao: {
            type: String,
            default: null,
            required: false
        },
        promocoes: [
            {
                data: {
                    type: Date,
                    required: true
                },
                id_graduacao: {
                    type: String,
                    default: null,
                    required: false
                },
            }
        ],
    }
})