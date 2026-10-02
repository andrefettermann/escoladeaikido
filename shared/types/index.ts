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
    is_ativo: boolean;
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
  observacoes: string;
  sequencia: number;
  tecnicas: {
    _id: string;
    nome: string;
  }[];
  requisitos: {
    horas_treino: number;
    meses_treino: number;
  };
  pessoas?: {
    _id: string;
    nome: string;
    id_graduacao: string;
    situacao: string;
    is_ativo: boolean;
    graduacao: {
      nome: string
    }
  }[];
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
  dojo?: {
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

export interface Cobranca {
  _id: string;
  descricao: string;
  valor: number;
  data_vencimento: string;
  situacao: string;
  periodo_referencia: string;
  observacoes: string;
  pessoa?: {
    _id: string;
    nome: string;
  }
}

export interface Taxa {
  _id: string;
  tipo: string;
  descricao: string;
  valor_padrao: number;
  is_ativa: boolean;
  periodo_referencia?: string;
  observacoes?: string;
  cobrancas?: Cobranca[];
}