export const usePessoa = async (id: MaybeRef<string>) => {

    interface Promocao {
        data: string;
        id_graduacao: string;
        nome_graduacao: string;
    }

    interface Pessoa {
    id: string;
    nome: string;
    matricula: string;
    aniversario: string;
    is_ativo: boolean;
    cpf: string;
    tipo: string;
    dojo: {
        _id: string;
        nome: string;
    };
    data_inicio_aikido: string;
    data_matricula: string;
    graduacao: {
        _id: string;
        nome: string;
        faixa: string;
        sequencia: number;
    };
    promocoes: Promocao[];
    }

  const pessoa = reactive<Pessoa & { dojoId: string }>({
    id: '',
    nome: '',
    matricula: '',
    aniversario: '',
    is_ativo: true,
    cpf: '',
    tipo: '',
    dojoId: '',
    dojo: {
        _id: '',
        nome: ''
    },
    data_inicio_aikido: '',
    data_matricula: '',
    graduacao: {
        _id: '',
        nome: '',
        faixa: '',
        sequencia: 0
    },
    promocoes: []
});

  const pessoaId = ref(id);
  
 const { data, error, loading, refresh } = useCustomFetch(
    computed(() => `/api/pessoas/${unref(pessoaId)}`),
    {
      onSuccess: (response: any) => {
        if (response?.dados) {
          Object.assign(pessoa, response.dados);
          pessoa.dojoId = response.dados?.dojo?._id || '';
          console.log('Pessoa dojo:', response.dados?.dojo);
        }
      }
    }
  );

  return {
    pessoa,
    //readonly(pessoa),
    loading,
    error,
    refresh,
    setPessoaId: (newId: string) => {
      pessoaId.value = newId;
    }
  };
};