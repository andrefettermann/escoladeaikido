import { defineMongooseModel } from '#nuxt/mongoose'

export const UsuarioSchema = defineMongooseModel({
  name: 'usuarios',
  schema: {
    email: {
      type: 'string',
      required: [true, 'O email é obrigatório'],
    },
    senha: {
      type: 'string',
      required: [true, 'A senha é obrigatória'],
    },
  },
})