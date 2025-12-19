import bcrypt from 'bcrypt';

interface Resposta {
    sucesso: boolean;
    mensagem?: string;
    dados?: any;
}


export default defineEventHandler(async (event): Promise<Resposta> => {
    const body = await readBody(event);

    body.senha = String(body.senha); // Garantir que a senha seja uma string
    body.senha = body.senha.trim(); // Remover espaços em branco extras
    body.senha = await bcrypt.hash(body.senha, 10);
    
    try {
        const novoUsuario = new UsuarioSchema(body);
        const usuarioSalvo = await novoUsuario.save();

        return {
            sucesso: true,
            dados: usuarioSalvo,
        };
    } catch (error) {
        return {
            sucesso: false,
            mensagem: 'Erro ao criar usuário',
        };
    } 

});