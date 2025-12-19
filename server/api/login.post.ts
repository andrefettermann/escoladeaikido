import { z } from 'zod'
import bcrypt from 'bcrypt';

const bodySchema = z.object({
  email: z.email(),
  senha: z.string().min(8),
})

export default defineEventHandler(async (event) => {
  const { email, senha } = await readValidatedBody(event, bodySchema.parse)

  if (!email || !senha) {
    console.log('Email ou senha nao fornecidos')
    throw createError({
      statusCode: 400,
      message: 'Email e senha são obrigatórios.',
    })
  }

  try {
    const resposta = 
      await $fetch<{ sucesso: boolean; dados?: any }>
                            (`/api/usuarios/${email}`, { method: 'GET' })

    if (resposta.sucesso === false) {
      console.log('Usuario nao encontrado');
      throw createError({
        statusCode: 401,
        message: 'Email ou senha inválidos.',
      })
    }

    const senhaValida = await bcrypt.compare(senha, resposta.dados.senha);
    if (!senhaValida) {
        console.log('Senha incorreta');
        throw createError({
            statusCode: 401,
            message: 'Email ou senha inválidos.',
        })
    }

    await setUserSession(event, {
      user: {
        name: 'John Doe',
      },
    })

    return {}
  } catch (error) {
    console.error('Erro ao processar login:', error)
    throw createError({
      statusCode: 500,
      message: 'Nao foi possivel ler os dados do usuario.',
    })
  }
})
