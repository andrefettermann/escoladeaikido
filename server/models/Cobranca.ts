import { defineMongooseModel } from '#nuxt/mongoose'
import { Schema } from 'mongoose'

export const CobrancaSchema = defineMongooseModel({
    name: 'cobrancas',
    schema: {
        id_pessoa: {
            type: Schema.Types.ObjectId as any,
            default: null,
            required: [true, 'O ID da pessoa é obrigatório.'],
        },
        id_taxa: {
            type: Schema.Types.ObjectId as any,
            default: null,
            required: [true, 'O ID da taxa é obrigatório.'],
        },
        id_evento: {
            type: Schema.Types.ObjectId as any,
            default: null,
            required: [true, 'O ID do evento é obrigatório.'],
        },
        descricao: {
            type: String,
            required: false,
        },
        valor: {
            type: Schema.Types.Decimal128,
            required: [true, 'O valor devido é obrigatório.'],
        },
        data_vencimento: {
            type: Schema.Types.Date,
            required: [true, 'A data de vencimento é obrigatória.']
        },
        situacao: {
            type: String,
            required: [true, 'A situação é obrigatória.'],
        },
        periodo_referencia: {
            type: String,
            required: [true, 'O período de referência é obrigatório.'],
        },
        observacoes: {
            type: String,
            required: [true, 'As observações são obrigatórias.'],
        },
    }
})