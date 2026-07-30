<template>
  <div class="container pt-3 w-100">
    <div class="card">
      <div class="card-header fw-bold">{{ title }}</div>
      <div class="card-body">

        <form id="formulario" @submit.prevent="grava">

          <!-- Info Alert -->
          <div class="alert alert-info alert-dismissible fade show">
            <strong>Info!</strong> O '*'' indica os campos obrigatórios.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
          </div>

          <!-- Mensagens -->
          <div v-if="localMessage" 
          :class="['alert', localMessageType === 'error' ? 'alert-danger' : localMessageType === 'success' ? 'alert-success' : 'alert-info', 'alert-dismissible']">
            <strong v-if="localMessageType === 'error'">Erro:</strong>
            <strong v-else-if="localMessageType === 'success'">Ok:</strong>
            <strong v-else>Info:</strong>
            <span class="ms-1">{{ localMessage }}</span>
            <button type="button" class="btn-close" @click="localMessage = ''" aria-label="Fechar"></button>
          </div>

          <!-- Nome -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="nome" class="col-form-label">*Nome</label>
            </div>
            <div class="col">
              <input type="text" class="form-control" id="nome" name="nome" v-model="pessoa.nome"
              placeholder="O nome da pessoa"/>
            </div>
          </div>

          <!-- Matricula -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="matricula" class="col-form-label">Matrícula</label>
            </div>
            <div class="col-1">
              <input type="text" class="form-control" id="matricula" name="matricula" v-model="pessoa.matricula"
              placeholder="O número de matrícula na FEPAI" size="10" data-toggle="tooltip" data-placement="top" 
              title="O número de matrícula na FEPAI">
            </div>
          </div>

          <!-- CPF -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="cpf" class="col-form-label">CPF</label>
            </div>
            <div class="col-3">
              <input type="text" class="form-control" id="cpf" name="cpf" v-model="pessoa.cpf"
              placeholder="O número do CPF" data-toggle="tooltip" data-placement="top" 
              title="O número do CPF no formato 999.999.999-99">
            </div>
          </div>

          <!--Graduacao atual-->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="graduacao_atual" class="col-form-label">*Graduação atual</label>
            </div>
            <div class="col-2">
              <div v-if="carregandoGraduacoes">Carregando...</div>
              <select
                v-else
                id="id_graduacao" name="id_graduacao"
                v-model="pessoa.graduacao._id" class="form-select">
                <option value="">Selecione...</option>
                <option v-for="item in items" :key="item.value" 
                :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>

          <!--Em atividade -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="is_ativo" class="form-label">Em atividade?</label>
            </div>
            <div class="col-2">              
              <input class="form-check-input" type="checkbox" id="is_ativo" 
              name="is_ativo" v-model="pessoa.is_ativo" >
            </div>
          </div>
        

          <!-- Aniversario -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="aniversario" class="col-form-label">Aniversário</label>
            </div>
            <div class="col-1">
              <input type="text" class="form-control" id="aniversario" name="aniversario" v-model="pessoa.aniversario"
              placeholder="A data de aniversário(dd/mm)" data-toggle="tooltip" data-placement="top" 
              title="A data de aniversário(dd/mm)">
            </div>
          </div>
        
          <!-- Data inicio -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="data_inicio" class="col-form-label">Data de início</label>
            </div>
            <div class="col-2">
              <input type="text" class="form-control" id="data_inicio" 
              name="data_inicio" v-model="pessoa.data_inicio_aikido"
              placeholder="A data de início no aikidô" size="10" 
              data-toggle="tooltip" data-placement="top" 
              title="A data de início no aikidô">
            </div>
          </div>
        
          <!--Data de matricula -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="data_inicio" class="col-form-label">Data de matrícula</label>
            </div>
            <div class="col-2">
              <input type="text" class="form-control" id="data_matricula" name="data_matricula" 
              v-model="pessoa.data_matricula"
              placeholder="A data de matrícula" size="10" data-toggle="tooltip" data-placement="top" 
              title="A data de início no aikidô">
            </div>
          </div>
        
          <!--Tipo -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="tipo" class="form-label">*Tipo</label>
            </div>
            <div class="col-2">
              <select id="tipo" name="tipo" v-model="pessoa.tipo" 
              class="form-select">
                <option value="">Selecione...</option>
                <option v-for="item in itemsTipo" :key="item.value" 
                :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Dojo -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="dojo" class="col-form-label">Dojo</label>
            </div>
            <div class="col-4">
                  <div v-if="carregandoDojos">Carregando...</div>
                  <select v-else id="id_dojo" name="id_dojo" 
                  v-model="pessoa.dojoId" class="form-select">
                    <option value="">Selecione...</option>
                    <option v-for="item in itemsDojos" :key="item.value" 
                    :value="item.value">
                      {{ item.label }}
                    </option>
                  </select>
            </div>
          </div>

        <!-- Promocoes -->
          <div class="card w-75 mx-auto mb-5">
            <div class="card-header fw-bold">Promoções</div>
            <div class="card-body" id="promocoes">

            <button 
              type="button" 
              class="btn btn-primary mb-3" 
              @click="adicionarPromocao">
              <i class="bi bi-plus-circle"> Adiciona promoção</i>
            </button>

              <div v-if="pessoa.promocoes && pessoa.promocoes.length > 0">
                <div v-for="(promocao, index) in pessoa.promocoes" 
                  :key="index" class="form-group row mb-3">
                  
                  <div class="col-1">
                    <label :for="`data_promocao_${index + 1}`" 
                    class="col-form-label">Data</label>
                  </div>
                  <div class="col-3">
                    <input 
                      :id="`data_promocao_${index + 1}`" 
                      :name="`data_promocao_${index + 1}`" 
                      type="text" 
                      class="form-control" 
                      v-model="promocao.data"/>
                  </div>
                
                  <div class="col-2">
                    <label :for="`graduacao_promocao_${index + 1}`" 
                    class="col-form-label">Graduação</label>
                  </div>
                  <div class="col-3">
                    <select 
                      :id="`id_graduacao_promocao_${index + 1}`" 
                      :name="`id_graduacao_promocao_${index + 1}`" 
                      class="form-select" 
                      aria-label="Graduação" 
                      required
                      v-model="promocao.id_graduacao">
                      <option value="" selected>Selecione</option>
                      <option v-for="item in items" :key="item.value" 
                            :value="item.value">
                              {{ item.label }}
                            </option>
                    </select>
                  </div>

                  <div class="col-2">
                    <button 
                      type="button" 
                      class="btn btn-danger btn-sm" 
                      @click="removerPromocao(index)"
                      title="Remover">
                      <i class="bi bi-trash">Exclui</i>
                    </button>
                  </div>

                </div>
              </div> 
            </div>
          </div>

          <div class="col-12">
            <button id="grava" name="grava" :disabled="isSaving" type="submit" 
            class="btn btn-primary btn-sm mt-4 me-2">Gravar</button>
            <NuxtLink id="cancela" name="cancela" 
            class="btn btn-secondary btn-sm mt-4" 
            :to="'/pessoas'">Cancela</NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated']
})

const route = useRoute();
const query = route.query;
const id = route.params.id as string;

const { setMensagem } = useMensagem();
const localMessage = ref('');
const localMessageType = ref<'success' | 'error' | 'info'>('info');

const title = id ? 'Edita Pessoa' : 'Nova Pessoa';
const isSaving = ref(false);

const dojoId = computed({
  get: () => pessoa.dojo?._id || '',
  set: (value: string) => {
    if (!pessoa.dojo) {
      pessoa.dojo = { _id: '', nome: '' };
    }
    pessoa.dojo._id = value;
  }
});

// Reactive pessoa object
const pessoa = reactive<Pessoa & { dojoId?: string }>({
  _id: '',
  nome: '',
  matricula: '',
  aniversario: '',
  is_ativo: false,
  cpf: '',
  tipo: '',
  dojo: {
    _id: '',
    nome: ''
  },
  dojoId: '',
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

// Busca os dados da pessoa na alteracao
if (id) {
  const pessoaEndpoint = computed(() => `/api/pessoas/${id}`);
  const { data, error } = await useFetch<Resposta<Pessoa>>(pessoaEndpoint, 
    { 
      watch: [pessoaEndpoint] 
    });

  if (error.value) {
    console.error('Erro ao buscar pessoa:', error.value);
    const mensagem = error.value.data?.message 
      || error.value.message 
      || 'Erro ao buscar pessoa.';
    showMessage(mensagem, 'error');
  } else if (data.value) {
    Object.assign(pessoa, data.value.docs);
    // Sincroniza o ID auxiliar
    pessoa.dojoId = data.value.docs?.dojo?._id || '';
  }
}

// Inicializa as graduacoes
const graduacoesEndpoint = '/api/graduacoes';
const carregandoGraduacoes = ref(false);
const dadosGraduacoes = ref<{ docs: any } | null>(null);
fetchGraduacoes();

const items = computed(() => {
  const docs = dadosGraduacoes.value?.docs || [];
  return docs.map((grad: any) => 
    ({ label: `${grad.nome} (${grad.categoria})`, value: grad._id }));
});

// Inicializa o tipo e a situacao
const itemsTipo = computed(() => [
  { label: 'Aluno', value: 'aluno' },
  { label: 'Professor', value: 'professor' }
]);

// Inicializa os dojos
//
// Busca os dojos para popular o select
//
const dojosEndpoint = '/api/dojos';
const carregandoDojos = ref(false);
const dadosDojos = ref<{ docs: any } | null>(null);

fetchDojos();

const itemsDojos = computed(() => {
  const docs = dadosDojos.value?.docs || [];
  return docs.map((dojo: any) => ({ label: `${dojo.nome}`, value: dojo.id }));
});

//
// ----------- Functions
//

//
// Busca as graduações para popular o select
//
async function fetchGraduacoes() {
  carregandoGraduacoes.value = true;
  
  const { data, error } = await useFetch<{ docs: any }>(graduacoesEndpoint);
  
  if (error.value) {
    console.error('Erro ao buscar graduações:', error.value);

    // Acessa a mensagem específica do servidor
    const mensagem = error.value.data?.message 
      || error.value.message 
      || 'Erro ao buscar graduações.';
    
    showMessage(mensagem, 'error');
  } else if (data.value) {
    dadosGraduacoes.value = data.value;
  }
  
  carregandoGraduacoes.value = false;
}

//
// Busca os dojos para popular o select
//
async function fetchDojos() {
  carregandoDojos.value = true;
  
  const { data, error } = await useFetch<{ docs: any }>(dojosEndpoint);
  
  if (error.value) {
    console.error('Erro ao buscar graduações:', error.value);

    // Acessa a mensagem específica do servidor
    const mensagem = error.value.data?.message 
      || error.value.message 
      || 'Erro ao buscar dojos.';
    
    showMessage(mensagem, 'error');
  } else if (data.value) {
    dadosDojos.value = data.value;
  }
  
  carregandoDojos.value = false;
}


//
// Validacoes
//

function isValidCPF(cpf = '') {
  if (!cpf) return true;
  const re = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return re.test(cpf);
}

function isValidDateDDMM(s = '') {
  if (!s) return true;
  const re = /^\d{2}\/\d{2}$/;
  return re.test(s);
}

//
// Função para gravar a pessoa
//
async function grava() {
  if (!pessoa.nome || pessoa.nome.trimStart() === '') {
    showMessage('Preencha o campo obrigatório: nome.', 'error');
    return;
  }

  if (!pessoa.graduacao._id || pessoa.graduacao._id === '') {
    showMessage('Preencha o campo obrigatório: graduação.', 'error');
    return;
  }

  if (!pessoa.tipo || pessoa.tipo === '') {
    showMessage('Preencha o campo obrigatório: tipo.', 'error');
    return;
  }

  if (!isValidCPF(pessoa.cpf || '')) {
    showMessage('CPF inválido. Utilize o formato 999.999.999-99', 'error');
    return;
  }

  if (!isValidDateDDMM(pessoa.aniversario || '') 
    || !isValidDateDDMM(pessoa.data_inicio_aikido || '') 
    || !isValidDateDDMM(pessoa.data_matricula || '')) {
    showMessage('Datas devem estar no formato dd/mm ou ficar em branco.', 'error');
    return;
  }

  // Sincroniza dojoId com dojo._id
  if (pessoa.dojoId) {
    if (!pessoa.dojo) pessoa.dojo = { _id: '', nome: '' };
    pessoa.dojo._id = pessoa.dojoId;
  } else {
    pessoa.dojo = { _id: '', nome: '' };
  }

  const endpoint = pessoa._id ? `/api/pessoas/${pessoa._id}` : '/api/pessoas';
  const method = pessoa._id ? 'PATCH' : 'POST';

  try {
    isSaving.value = true;
    await $fetch(endpoint, {
      method,
      body: pessoa
    });

    showMessage('Pessoa gravada com sucesso!', 'success');
    await navigateTo('/pessoas', { replace: true });
  } catch (err: any) {
    console.error(err);
    showMessage(err?.data?.message || 'Erro ao gravar pessoa', 'error');
    isSaving.value = false;
  }
}

function showMessage(text: string, type: 'success' | 'error' | 'info' = 'info') {
  localMessage.value = text;
  localMessageType.value = type;
  // keep existing global composable for consistency
  setMensagem(text, type === 'error' ? 'error' : 'success');
}

//
// Função para adicionar promoção
//
const adicionarPromocao = () => {
  // Inicializa o array se não existir
  if (!pessoa.promocoes) {
    pessoa.promocoes = []
  }
  
  pessoa.promocoes.push({
    data: '',
    id_graduacao: '',
    nome_graduacao: ''
  })
}

//
// Função para remover promoção
//
const removerPromocao = (index: number) => {
  pessoa?.promocoes?.splice(index, 1)
}

</script>
