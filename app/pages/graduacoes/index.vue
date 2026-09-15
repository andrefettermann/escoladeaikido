<template>
  <div>

    <figure>
      <blockquote class="blockquote fs-2 fw-bold">
        <p>Graduações cadastradas</p>
      </blockquote>
      <figcaption class="blockquote-footer">
        <span v-if="tituloFiltro"> {{ tituloFiltro }} 
          Total encontrado: {{ graduacoesFiltradas.length }}</span>
      </figcaption>
    </figure>
    
    <div>
      <input class="form-control mt-2 mb-2" id="myInput" type="text" 
      placeholder="Filtrar.." v-model="filtro">
    </div>

    <div v-if="pending" class="text-center">
      <p class="mb-4">Carregando dados...</p>
      <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden" 
      role="progressbar" aria-label="Animated striped example" aria-valuenow="75" 
      aria-valuemin="0" aria-valuemax="100">
        <div class="h-full bg-blue-600 animate-pulse" style="width: 75%"></div>
      </div>
    </div>
    
    <div v-else-if="error" class="error">
      Erro ao carregar dados: {{ error.message }}
      <button @click="() => refresh()" class="btn">Tentar novamente</button>
    </div>

    <div v-else-if="graduacoesFiltradas && graduacoesFiltradas.length > 0">
    
      <div class="mb-2">
        <nuxt-link id="incluir" name="incluir" title="Incluir graduação"
            aria-label="Incluir graduação"
            class="btn btn-success btn-sm m-1" 
            :to="{ path: '/graduacoes/edita', query: { sequencia: ultimaSequencia ? ultimaSequencia + 1 : 1 } }">
              Incluir graduação
        </nuxt-link>
      </div> 

      <div class="table-responsive" role="region" 
      aria-label="Tabela de graduações" tabindex="0">

        <table id="lista" class="table table-striped table-hover align-middle">
          <caption class="visually-hidden">
            Lista de graduações cadastradas, com o nome, a faixa, os tempos
            necessários para atingir e ações disponíveis
          </caption>
          <thead>
            <tr>
              <th scope="col">Sequência</th>
              <th scope="col">Nome</th>
              <th scope="col">Faixa</th>
              <th scope="col">Categoria</th>
              <th scope="col">Horas de treino para exame</th>
              <th scope="col">Meses de treino para exame</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="graduacoesFiltradas.length === 0">
              <td colspan="7" class="text-center text-secondary py-3">
                Nenhuma graduação encontrada
              </td>
            </tr>
            <tr v-for="graduacao in graduacoesFiltradas" :key="graduacao._id">
              <th scope="row">{{ graduacao.sequencia }}</th>
              <td>{{ graduacao.nome }}</td>
              <td>{{ graduacao.faixa? graduacao.faixa.charAt(0).toUpperCase() + graduacao.faixa.slice(1):'N/A' }}</td>
              <td>{{ graduacao.categoria }}</td>
              <td>{{ graduacao.requisitos?.horas_treino }}</td>
              <td>{{ graduacao.requisitos?.meses_treino }}</td>
              <td>
                <div v-if="(user as any)?.role != 'admin'" class="d-flex gap-2">
                  <nuxt-link
                    :id="`detalhes_graduacao_${graduacao._id}`"
                    class="btn btn-primary btn-sm m-1"
                    :to="{ path: '/graduacoes/detalhes', query: { id: graduacao._id } }"
                    :aria-label="`Ver detalhes de ${graduacao.nome}`">Ver</nuxt-link>

                  <nuxt-link
                    :id="`edita_${graduacao._id}`"
                    class="btn btn-primary btn-sm m-1"
                    :to="{ path: `/graduacoes/edita/${graduacao._id}` }"
                    :aria-label="`Editar dados de ${graduacao.nome}`">Editar
                  </nuxt-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div v-else-if="!pending && !error">
      <p class="fs-3 fw-bold">Nenhuma graduação encontrada.</p>
    </div>

  </div>

</template>

<script setup lang="ts">
// Verifica se esta logado
definePageMeta({
  middleware: ['authenticated']
})

const router = useRouter();
const { user } = useUserSession()
const route = useRoute();
const { setMensagem } = useMensagem();
const localMessage = ref('');
const localMessageType = ref<'success' | 'error' | 'info'>('info');

onMounted(() => {
  // Se existir o parâmetro "gravado=true" na URL
  if (route.query.sucesso === 'true') {
    showMessage('Graduação gravada com sucesso!', 'success');
    
    // Opcional: Limpa a URL para remover o "?gravado=true" de forma discreta
    router.replace({ query: {} });
  }
});

// Computed para determinar qual endpoint usar
const endpoint = computed(() => { return '/api/graduacoes'; });

// Busca os dados através da API route do servidor
// O watch: ['endpoint'] faz o refetch automático quando a rota mudar
const { data, pending, error, refresh } = useFetch<Resposta<Graduacao[]>>(endpoint,
  { 
    watch: [endpoint] 
  }
);

const ultimaSequencia = computed(() => {
  const docs = data.value?.docs;
  if (!docs || docs.length === 0) return null;

  // Ordena as graduações pela sequência em ordem decrescente
  const ordenadas = [...docs].sort((a, b) => (b.sequencia ?? 0) - (a.sequencia ?? 0));
  const maior = ordenadas[0];

  return maior?.sequencia ?? null;
});


// Computed para o título do filtro aplicado
const tituloFiltro = computed(() => {
  if (filtro.value && filtro.value.length > 1) 
    return `Exibindo graduações pelo filtro ${filtro.value}.`;

  return 'Lista de todas as graduações.';
});

// Variável reativa para o filtro
const filtro = ref('');

// Computed property que filtra os dojos baseado no texto digitado
const graduacoesFiltradas = computed(() => {
  if (!data.value?.docs) return [];
  
  if (!filtro.value) return data.value.docs;
  
  const valorFiltro = filtro.value.toLowerCase();
  
  return data.value.docs.filter((graduacao: any) => {
    const textoCompleto = [
      graduacao._id,
      graduacao.sequencia,
      graduacao.nome,
      graduacao.faixa,
      graduacao.endereco,
      graduacao.categoria,
      graduacao.requisitos.horas_treino,
      graduacao.requisitos.meses_treino
    ].join(' ').toLowerCase();
    
    return textoCompleto.includes(valorFiltro);
  });
});

function showMessage(text: string, type: 'success' | 'error' | 'info' = 'info') {
  localMessage.value = text;
  localMessageType.value = type;
  // keep existing global composable for consistency
  setMensagem(text, type === 'error' ? 'error' : 'success');
}

</script>