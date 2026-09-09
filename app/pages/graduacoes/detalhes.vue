<template>
  <div class="container pt-3 w-100">
    
    <div class="mb-2 d-flex gap-2 fw-semibold">

        <nuxt-link id="edita" name="edita" class="btn btn-primary btn-sm m-1"
        :to="{ path: `/graduacoes/edita/${id}` }"
        :aria-label="`Editar dados de ${graduacao?.nome}`">Edita</nuxt-link>

        <nuxt-link id="cancela" name="cancela" 
        class="btn btn-warning btn-sm m-1" :to="`/graduacoes`">Cancela</nuxt-link>

    </div>

    <!-- Mensagens -->
    <div v-if="localMessage" :class="['alert', localMessageType === 'error' ? 'alert-danger' : localMessageType === 'success' ? 'alert-success' : 'alert-info', 'alert-dismissible']">
      <strong v-if="localMessageType === 'error'">Erro:</strong>
      <strong v-else-if="localMessageType === 'success'">Ok:</strong>
      <strong v-else>Info:</strong>
      <span class="ms-1">{{ localMessage }}</span>
      <button type="button" class="btn-close" @click="localMessage = ''" aria-label="Fechar"></button>
    </div>

    <div class="card">
      <div class="card-header fw-bold">
        <span>{{ graduacao?.nome }}</span>
      </div>
      <div class="card-body">
          <div class="row">
              <div class="col">
                
                <div v-if="pending" class="loading">
                  Carregando dados...
                </div>

                <div v-else-if="error" class="error">
                  Erro ao carregar dados: {{ error.message }}
                  <button @click="() => refresh()" class="btn">Tentar novamente</button>
                </div>

                <div v-else-if="graduacao" class="col">
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Faixa:</strong> {{ graduacao.faixa }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Categoria:</strong> {{ graduacao.categoria }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Observações:</strong> {{ graduacao.observacoes || 'N/A' }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Requisitos para exame:</strong>
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Qtde horas de treino na graduação anterior:</strong> 
                      {{ graduacao.requisitos?.horas_treino || 'N/A' }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Qtde meses de treino na graduação anterior:</strong>
                      {{ graduacao.requisitos?.meses_treino || 'N/A' }}
                    </div>
                  </div>
              </div>
            </div>
        </div>
      </div>
    </div>

    <div class="card mt-3">
      <div class="card-header fw-bold">Técnicas</div>
      <div class="card-body">
        <ul id="tecnicas" name="tecnicas" aria-label="Técnicas" 
        class="list-group mb-2 list-group-flush">
          <li v-for="tecnica in graduacao?.tecnicas" :key="tecnica._id" 
          class="list-group-item">
            {{ tecnica.nome }}
          </li>
        </ul>
      </div>
    </div>

    <div class="card mt-3">
      <div class="card-header fw-bold">Alunos ({{graduacao?.pessoas?.length}})</div>
      <div class="card-body">
        <ul id="alunos" name="alunos" aria-label="Alunos" 
        class="list-group mb-2 list-group-flush">
          <li v-for="pessoas in graduacao?.pessoas" :key="pessoas._id" 
          class="list-group-item">
            {{ pessoas.nome }} ({{ pessoas.is_ativo ? 'Ativo' : 'Inativo' }})
          </li>
        </ul>
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
const id = query.id as string;

const { setMensagem } = useMensagem();
// Local reactive alert state (replaces manual DOM toggling)
const localMessage = ref('');
const localMessageType = ref<'success' | 'error' | 'info'>('info');

// Computed para determinar qual endpoint usar baseado nos query params
const endpoint = computed(() => {
    return `/api/graduacoes/${id}`;
});

// Busca os dados através da API route do servidor
// O watch: ['endpoint'] faz o refetch automático quando a rota mudar
const { data, pending, error, refresh } = await useFetch<Resposta<Graduacao>>(endpoint, {
  watch: [endpoint]
})

var graduacao: Graduacao | undefined;
if (error.value) {
  console.error('Erro ao buscar a graduacao:', error.value);
  const mensagem = error.value.data?.message 
    || error.value.message 
    || 'Erro ao buscar graduação.';
  showMessage(mensagem, 'error');
} else {
  const mensagem = 'Graduação carregada com sucesso.';
  showMessage(mensagem, 'info');
  graduacao = data.value?.docs;
} 

function showMessage(text: string, type: 'success' | 'error' | 'info' = 'info') {
  localMessage.value = text;
  localMessageType.value = type;
  // keep existing global composable for consistency
  setMensagem(text, type === 'error' ? 'error' : 'success');
}

</script>
