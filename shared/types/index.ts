export interface Resposta<T = void> {
    sucesso: boolean;
    mensagem?: string;
    docs?: T;
  }
  
export interface Dojo {
  _id: string;
  nome: string;
  local?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  pais?: string;
  url?: string;
  email?: string;
  horarios?: {
    _id: string;
    id_professor: string;
    nome_professor: string;
    horario: string;
  }[];
  alunos?: {
    _id: number;
    nome: string;
    id_graduacao: string;
    situacao: string;
    graduacao: {
      nome: string
    }
  }[];
  is_ativo: boolean;
}

export interface Graduacao {
  _id: string;
  nome: string;
  faixa: string;
  categoria: string;
  minimo_horas_treino_exame: number;
  minimo_tempo_exame: number;
  observacoes: string;
  sequencia: number;
  tecnicas: {
    id: number;
    nome: string;
  }
}

export interface Pessoa {
  _id: string;
  aniversario: string;
  matricula: string;
  nome: string;
  cpf: string;
  data_inicio_aikido: string;
  data_matricula: string;
  promocoes: {
    data: string;
    id_graduacao: string
    nome_graduacao: string;
  }[];
  dojo: {
    _id: string;
    nome: string;
  }
  graduacao: {
    _id: string;
    nome: string;
    faixa: string;
    sequencia: number;
  }
  tipo: string;
  is_ativo: boolean;
}