<template>
  <div class="container pt-3 w-100">
    
    <div class="mb-2 d-flex gap-2 fw-semibold">

        <nuxt-link id="edita" name="edita" class="btn btn-primary btn-sm m-1"
        :to="{ path: `/taxas/edita/${id}` }"
        :aria-label="`Editar dados de ${taxa?.descricao}`">Edita</nuxt-link>

        <nuxt-link id="cancela" name="cancela" 
        class="btn btn-warning btn-sm m-1" :to="`/taxas`">Cancela</nuxt-link>

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
        <span>{{ taxa?.descricao }}</span>
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

                <div v-else-if="taxa" class="col">
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Tipo:</strong> {{ taxa.tipo }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Observações:</strong> {{ taxa.observacoes }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Em atividade?</strong> {{ taxa.is_ativa?'Sim':'Não' }}
                    </div>
                  </div>
                </div>
              </div>

            </div>
        </div>
    </div>

    <div class="card mt-3">
      <div class="card-header fw-bold">Cobranças e pagamentos ({{taxa?.cobrancas?.length}})</div>
      <div class="card-body">
        <ul id="cobrancas" name="cobrancas" aria-label="Cobranças" 
        class="list-group mb-2 list-group-flush">
          <li v-for="cobranca in taxa?.cobrancas" :key="cobranca._id" 
          class="list-group-item">
            {{ cobranca.periodo_referencia }} - {{ cobranca.pessoa }} - 
            {{ cobranca.descricao }} - {{ cobranca.valor }} -
            {{ cobranca.data_vencimento }} - {{ cobranca.situacao }} 
            {{ cobranca.observacoes ? `- ${cobranca.observacoes}` : '' }}
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
    return `/api/taxas/${id}`;
});

// Busca os dados através da API route do servidor
// O watch: ['endpoint'] faz o refetch automático quando a rota mudar
const { data, pending, error, refresh } = await useFetch<Resposta<Taxa>>(endpoint, {
  watch: [endpoint]
})

var taxa: Taxa | undefined;
if (error.value) {
  console.error('Erro ao buscar pessoa:', error.value);
  const mensagem = error.value.data?.message 
    || error.value.message 
    || 'Erro ao buscar pessoa.';
  showMessage(mensagem, 'error');
} else {
  const mensagem = 'Taxa carregada com sucesso.';
  showMessage(mensagem, 'info');
  taxa = data.value?.docs;
} 

function showMessage(text: string, type: 'success' | 'error' | 'info' = 'info') {
  localMessage.value = text;
  localMessageType.value = type;
  // keep existing global composable for consistency
  setMensagem(text, type === 'error' ? 'error' : 'success');
}

</script>
