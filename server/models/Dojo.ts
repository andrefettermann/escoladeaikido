import { defineMongooseModel } from '#nuxt/mongoose'

export const DojoSchema = defineMongooseModel({
  name: 'dojos',
  schema: {
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório.'],
    },
    local: {
        type: String,
        required: false
    },
    endereco: {
        type: String,
        required: false
    },
    bairro: {
        type: String,
        required: false
    },
    cidade: {
        type: String,
        required: false
    },
    uf: {
        type: String,
        required: false
    },
    pais: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    id_professor: {
        type: String,
        required: false
    },
    horarios: {
        type: String,
        required: false
    },
    is_ativo: {
        type: Boolean,
        required: false
    },
    professores: [{
        id_professor: {
            type: String,
            required: false
        }
    }]
  },
})