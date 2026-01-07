import { defineMongooseModel } from '#nuxt/mongoose'

export const GraduacaoSchema = defineMongooseModel({
    name: 'graduacoes',
    schema: {
        nome: {
            type: String,
            required: [true, 'O nome é obrigatório.'],
        },
        faixa: {
            type: String,
            required: [true, 'A faixa é obrigatória.'],
        },
        sequencia: {
            type: Number,
            required: [true, 'A sequência é obrigatória.'],
        },
        categoria: {
            type: String,
            required: [true, 'A categoria é obrigatória.'],
        },
        minimo_horas_treino_exame: {
            type: Number,
            required: false,
        },
        minimo_tempo_exame: {
            type: Number,
            required: false,
        },
        observacoes: {
            type: String,
            required: false,
        },
        tecnicas: [{
            nome: {
                type: String,
                required: true,
            }
        }]
    }
})