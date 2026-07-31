import * as GraduacoesRepository from "../graduacoes/graduacoes.repository"

export async function buscaPeloId(id: string): Promise<Resposta<Graduacao>> {
  const response = await GraduacoesRepository.find(id);
  
  return response;
}

export async function buscaTodos(): Promise<Resposta<Graduacao[]>> {
  const response = await GraduacoesRepository.findAll();//.then(res => res.docs);    

  return response;
};

