<template>
  <div class="container pt-3 w-100">
    
    <div class="mb-2">
        <nuxt-link id="edita" name="edita" class="btn btn-primary btn-sm m-1" 
          :to="`/pessoas/edita_pessoa?id=${id}`">
          Edita
        </nuxt-link>

        <nuxt-link id="cancela" name="cancela" class="btn btn-primary btn-sm m-1" 
          :to="`/pessoas`">
          Cancela
        </nuxt-link>

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
        <span>{{ pessoa.nome }} ({{ pessoa.graduacao.nome }})</span>
      </div>
      <div class="card-body">
          <div class="row">
              <div class="col">

                
                <div v-if="loading" class="loading">
                  Carregando dados...
                </div>

                <div v-else-if="error" class="error">
                  Erro ao carregar dados: {{ error.message }}
                  <button @click="() => refresh()" class="btn">Tentar novamente</button>
                </div>

                <div v-else-if="pessoa" class="col">
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Matrícula:</strong> {{ pessoa.matricula }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Aniversário:</strong> {{ pessoa.aniversario }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>CPF:</strong> {{ pessoa.cpf }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Em atividade?</strong> {{ pessoa.is_ativo?'Sim':'Não' }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Data de Início no Aikido:</strong>
                      {{ pessoa.data_inicio_aikido || 'N/A' }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Data de Matrícula:</strong>
                      {{ pessoa.data_matricula || 'N/A' }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Tipo:</strong>
                      {{ pessoa.tipo.charAt(0).toUpperCase() + pessoa.tipo.slice(1) }}
                  </div>
                </div>
                <div class="row mb-2">
                  <div class="col">
                      <strong>Dojo:</strong>
                      {{ pessoa.dojo.nome }}
                  </div>
                </div>

                <div class="card mb-3 mt-4">
                  <div class="card-header fw-bold">Promoções</div>
                      <div class="card-body">
                        <ul id="lista" class="list-group mb-2">
                          <li v-for="promocao in pessoa.promocoes" :key="promocao.id_graduacao" class="list-group-item">
                            {{ promocao.data }} - {{ promocao.nome_graduacao }}
                          </li>
                      </ul>
                    </div>
                  </div>

                <div class="card mb-3 mt-4">
                  <div class="card-header fw-bold">Cobranças</div>
                      <div class="card-body">
                        <ul id="lista" class="list-group mb-2">
                          <li v-for="cobranca in pessoa.cobrancas" :key="cobranca.id_graduacao" class="list-group-item">
                            {{ cobranca.data }} - {{ cobranca.nome_graduacao }}
                          </li>
                      </ul>
                    </div>
                  </div>
                </div>

                
              </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMensagem } from '~/composables/useMensagem';

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

function showMessage(text: string, type: 'success' | 'error' | 'info' = 'info') {
  localMessage.value = text;
  localMessageType.value = type;
  // keep existing global composable for consistency
  setMensagem(text, type === 'error' ? 'error' : 'success');
}

// Computed para determinar qual endpoint usar baseado nos query params
//const endpoint = computed(() => {
//    return `/api/pessoas/${id}`;
//});

// Busca os dados através da API route do servidor
// O watch: ['endpoint'] faz o refetch automático quando a rota mudar
/*
interface resposta { 
  sucesso: boolean,
  dados?: any,
  mensagem?: string
}
const { data, pending, error, refresh} = await useFetch<resposta>(endpoint, 
  { 
    watch: [endpoint] 
  });

  console.log('Data fetched:', data.value?.sucesso);

if (!data.value?.sucesso) {
  showMessage(`${data.value?.mensagem || 'Erro desconhecido.'}`, 'error');
}

const pessoa =  {
    nome: data.value?.dados?.nome || 'N/A',
    matricula: data.value?.dados?.matricula || 'N/A',
    aniversario: data.value?.dados?.aniversario || 'N/A',
    data_inicio_aikido: data.value?.dados?.data_inicio_aikido || 'N/A',
    data_matricula: data.value?.dados?.data_matricula || 'N/A',
    is_ativo: data.value?.dados?.is_ativo,
    cpf: data.value?.dados?.cpf || 'N/A',
    tipo: data.value?.dados?.tipo?.charAt(0).toUpperCase() 
                                + data.value?.dados?.tipo?.slice(1),
    dojo: data.value?.dados?.dojo?.nome || 'N/A',
    graduacao: data.value?.dados?.graduacao?.nome || 'N/A',
    promocoes: data.value?.dados?.promocoes || []
};
*/
// Busca a pessoa se id for fornecido
const { pessoa, loading, error, refresh } = await usePessoa(id);
if (error.value) {
  console.error('Erro ao buscar pessoa:', error.value);
  const mensagem = error.value.data?.message 
    || error.value.message 
    || 'Erro ao buscar pessoa.';
  showMessage(mensagem, 'error');
} else {
  const mensagem = 'Pessoa carregada com sucesso.';
  showMessage(mensagem, 'info');
} 

</script>
