import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from 'mongoose'

export const TaxaSchema = defineMongooseModel({
  name: 'taxas',
  schema: {
    tipo: {
        type: String,
        required: [true, 'O tipo é obrigatório.'],
    },
    descricao: {
        type: String,
        required: [true, 'A descrição é obrigatória.'],
    },
//    valor_padrao: {
//        type: Schema.Types.Decimal128,
//        required: [true, 'O valor padrão é obrigatório.'],
//    },
    is_ativa: {
        type: Boolean,
        required: false
    },
//    periodo_referencia: {
//        type: String,
//        required: false,
//    },
    observacoes: {
        type: String,
        required: false,
    },
  },
})