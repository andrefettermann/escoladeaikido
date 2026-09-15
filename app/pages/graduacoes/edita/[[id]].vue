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

          <!-- Sequencia -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="sequencia" class="col-form-label">*Sequência</label>
            </div>
            <div class="col-1">
              <input type="text" class="form-control" id="sequencia" 
              name="sequencia" v-model="graduacao.sequencia"
              placeholder="A sequência da graduacao"/>
            </div>
          </div>

          <!-- Nome -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="nome" class="col-form-label">*Nome</label>
            </div>
            <div class="col-2">
              <input type="text" class="form-control" id="nome" name="nome" 
              v-model="graduacao.nome" placeholder="O nome da graduacao"/>
            </div>
          </div>

          <!-- Faixa -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="faixa" class="col-form-label">*Faixa</label>
            </div>
            <div class="col-2">
              <input type="text" class="form-control" id="faixa" name="faixa" 
              v-model="graduacao.faixa" placeholder="A faixa da graduacao" 
              size="10" data-toggle="tooltip" data-placement="top" 
              title="A faixa da graduacao">
            </div>
          </div>

          <!-- Categoria -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="categoria" class="form-label">*Categoria</label>
            </div>
            <div class="col-2">
              <select id="categoria" name="categoria" v-model="graduacao.categoria" 
              class="form-select">
                <option value="">Selecione...</option>
                <option v-for="item in itemsCategoria" :key="item.value" 
                :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Observacoes -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="observacoes" class="col-form-label">Observações</label>
            </div>
            <div class="col">
              <input type="text" class="form-control" id="observacoes" 
              name="observacoes" v-model="graduacao.observacoes" 
              placeholder="Observações sobre a graduação" data-toggle="tooltip" 
              data-placement="top" title="Observações sobre a graduação">
            </div>
          </div>
        
          <!-- Requisito horas treino -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="horas_treino" class="col-form-label">Qtde horas de treino na graduação anterior</label>
            </div>
            <div class="col-2">
              <input type="text" class="form-control" id="horas_treino" 
              name="horas_treino" v-model="graduacao.requisitos.horas_treino"
              placeholder="Quantidade de horas de treino" size="10" 
              data-toggle="tooltip" data-placement="top" 
              aria-label="A quantidde de horas de treino na graduação anterior para o exame para esta graduação"
              title="A quantidde de horas de treino na graduação anterior para o exame para esta graduação">
            </div>
          </div>
        
          <!-- Requisito meses treino -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="meses_treino" class="col-form-label">Qtde meses de treino na graduação anterior</label>
            </div>
            <div class="col-2">
              <input type="text" class="form-control" id="meses_treino" 
              name="meses_treino" v-model="graduacao.requisitos.meses_treino"
              placeholder="Quantidade de meses de treino" size="10" 
              data-toggle="tooltip" data-placement="top" 
              aria-label="A quantidade de meses de treino na graduação anterior para o exame para esta graduação"
              title="A quantidade de meses de treino na graduação anterior para o exame para esta graduação">
            </div>
          </div>

          <!-- Técnicas -->
          <div class="card w-75 mx-auto mb-5">
            <div class="card-header fw-bold">Técnicas</div>
            <div class="card-body" id="tecnicas">

            <button 
              type="button" 
              class="btn btn-primary mb-3" 
              @click="adicionarTecnica">
              <i class="bi bi-plus-circle">Adiciona técnica</i>
            </button>

              <div v-if="graduacao.tecnicas && graduacao.tecnicas.length > 0">
                <div v-for="(tecnica, index) in graduacao.tecnicas" 
                  :key="index" class="form-group row mb-3">
                  
                  <div class="col-2">
                    <label :for="`tecnica_${index + 1}`" 
                    class="col-form-label">Nome da técnica</label>
                  </div>
                  <div class="col-8">
                    <input 
                      :id="`tecnica_${index + 1}`" 
                      :name="`tecnica_${index + 1}`" 
                      type="text" 
                      class="form-control" 
                      v-model="tecnica.nome"/>
                  </div>
                
                  <div class="col-2">
                    <button 
                      type="button" 
                      class="btn btn-danger btn-sm" 
                      @click="removerTecnica(index)"
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
            class="btn btn-primary btn-sm mt-4 me-2" title="Grava" 
            aria-label="Grava">Gravar</button>
            <NuxtLink id="cancela" name="cancela" 
            class="btn btn-warning btn-sm mt-4" aria-label="Cancela" 
            title="Cancela" :to="'/graduacoes'">Cancela</NuxtLink>
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
const id = route.params.id as string;

const { setMensagem } = useMensagem();
const localMessage = ref('');
const localMessageType = ref<'success' | 'error' | 'info'>('info');

const title = id ? 'Edita graduação' : 'Nova graduação';
const isSaving = ref(false);

const query = route.query;
const sequencia = query.sequencia as string;


// Reactive graduacao object
const graduacao = reactive<Graduacao>({
  _id: '',
  nome: '',
  faixa: '',
  sequencia: sequencia ? parseInt(sequencia) : 0,
  categoria: '',
  requisitos: {
    horas_treino: 0,
    meses_treino: 0
  },
  observacoes: '',
  tecnicas: []
});

// Busca os dados da graduacao na alteracao
if (id) {
  const graduacaoEndpoint = computed(() => `/api/graduacoes/${id}`);
  const { data, error } = await useFetch<Resposta<Graduacao>>(graduacaoEndpoint, 
    { 
      watch: [graduacaoEndpoint] 
    });

  if (error.value) {
    const mensagem = error.value.data?.message 
      || error.value.message 
      || 'Erro ao buscar graduacao.';
    showMessage(mensagem, 'error');
  } else if (data.value) {
    const dadosCarregados = { ...data.value.docs };
    Object.assign(graduacao, dadosCarregados);
  }
}

// Inicializa a categoria
const itemsCategoria = computed(() => [
  { label: 'Adulto', value: 'Adulto' },
  { label: 'Infantil', value: 'Infantil' }
]);


//
// ----------- Functions
//

//
// Validacoes
//

function isValidGraduacao(graduacao: Graduacao): boolean {
  if (!graduacao.sequencia || isNaN(Number(graduacao.sequencia)) 
      || Number(graduacao.sequencia) <= 0) {
    showMessage('Preencha o campo obrigatório: Sequência.', 'error');
    return false;
  }

  if (!graduacao.nome || graduacao.nome.trimStart() === '') {
    showMessage('Preencha o campo obrigatório: Nome.', 'error');
    return false;
  }

  if (!graduacao.faixa || graduacao.faixa === '') {
    showMessage('Preencha o campo obrigatório: Faixa.', 'error');
    return false;
  }

  if (!graduacao.categoria || graduacao.categoria === '') {
    showMessage('Preencha o campo obrigatório: Categoria.', 'error');
    return false;
  }

  return true;
}

//
// Função para gravar
//
async function grava() {
  if (!isValidGraduacao(graduacao)) {
    return;
  }

  const endpoint = graduacao._id ? 
      `/api/graduacoes/${graduacao._id}` : '/api/graduacoes';
  const method = graduacao._id ? 'PATCH' : 'POST';

  try {
    isSaving.value = true;
    const resposta: Resposta = await $fetch(endpoint, {
      method,
      body: graduacao
    });

    // 2. Verificamos se a propriedade "sucesso" retornada pelo backend é verdadeira
    if (resposta && resposta.sucesso) {
      //showMessage(resposta.mensagem || 'Cessionário gravado com sucesso!', 'success');
      await navigateTo({
        path: '/graduacoes',
        query: { sucesso: 'true' }
        }, { replace: true });
    } else {
      // Se o backend retornou sucesso: false (caiu no catch do backend)
      showMessage(resposta?.mensagem || 'Erro ao gravar a graduação', 'error');
    }

  } catch (err: any) {
    showMessage(err || 'Erro ao gravar graduacao', 'error');
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
// Função para adicionar técnica
//
const adicionarTecnica = () => {
  // Inicializa o array se não existir
  if (!graduacao.tecnicas) {
    graduacao.tecnicas = []
  }
  
  graduacao.tecnicas.push({
    _id: '',
    nome: ''
  })
}

//
// Função para remover técnica
//
const removerTecnica = (index: number) => {
  graduacao?.tecnicas?.splice(index, 1)
}

</script>
