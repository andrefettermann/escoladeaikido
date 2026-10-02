<template>
  <div>

    <figure>
      <blockquote class="blockquote fs-2 fw-bold">
        <p>Taxas cadastradas</p>
      </blockquote>
      <figcaption class="blockquote-footer">
        <span v-if="tituloFiltro"> {{ tituloFiltro }} 
          Total encontrado: {{ taxasFiltradas.length }}</span>
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

    <div v-else-if="taxasFiltradas && taxasFiltradas.length > 0">
    
      <div class="mb-2">
        <nuxt-link id="incluir" name="incluir" 
          class="btn btn-success btn-sm m-1" href="/taxas/edita">
          Incluir taxa</nuxt-link>
      </div>

      <div class="table-responsive" role="region" aria-label="Tabela de taxas" tabindex="0">

        <table id="lista" class="table table-striped table-hover align-middle">
          <caption class="visually-hidden">
            Lista de taxas cadastradas, com descrição, valor padrão e ações disponíveis
          </caption>
          <thead>
            <tr>
              <th scope="col">Descrição</th>
              <th scope="col">Situação</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="taxasFiltradas.length === 0">
              <td colspan="7" class="text-center text-secondary py-3">
                Nenhuma taxa encontrada
              </td>
            </tr>
            <tr v-for="taxa in taxasFiltradas" :key="taxa._id">
              <th scope="row">
                <span :class="{ 'text-decoration-line-through': !taxa.is_ativa }" class="fs-6 fw-semibold">
                  {{ taxa.descricao }}
                </span>
              </th>
              <!-- <td>{{ taxa.valor_padrao }}</td> -->
              <td>
                <span class="badge" :class="taxa.is_ativa ? 'bg-success' : 'bg-secondary'">
                  {{ taxa.is_ativa ? 'Ativa' : 'Inativa' }}
                </span>
              </td>
              <td>
                <div v-if="(user as any)?.role != 'admin'" class="d-flex gap-2">
                  <nuxt-link
                    :id="`detalhes_${taxa._id}`"
                    class="btn btn-primary btn-sm m-1"
                    :to="{ path: '/taxas/detalhes', query: { id: taxa._id } }"
                    :aria-label="`Ver detalhes de ${taxa.tipo}`">Ver</nuxt-link>

                  <nuxt-link
                    :id="`edita_${taxa._id}`"
                    class="btn btn-primary btn-sm m-1"
                    :to="{ path: `/taxas/edita/${taxa._id}` }"
                    :aria-label="`Editar dados de ${taxa.tipo}`">Editar</nuxt-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div v-else-if="!pending && !error">
      <p class="fs-3 fw-bold">Nenhuma taxa encontrada.</p>
    </div>

  </div>

</template>

<script setup lang="ts">
// Verifica se esta logado
definePageMeta({
  middleware: ['authenticated']
})

const { user } = useUserSession()
const router = useRouter();
const route = useRoute();
const { setMensagem } = useMensagem();
const localMessage = ref('');
const localMessageType = ref<'success' | 'error' | 'info'>('info');

onMounted(() => {
  // Se existir o parâmetro "gravado=true" na URL
  if (route.query.sucesso === 'true') {
    showMessage('Taxa gravada com sucesso!', 'success');
    
    // Opcional: Limpa a URL para remover o "?gravado=true" de forma discreta
    router.replace({ query: {} });
  }
});

// Computed para determinar qual endpoint usar
const endpoint = computed(() => { return '/api/taxas'; });

// Busca os dados através da API route do servidor
// O watch: ['endpoint'] faz o refetch automático quando a rota mudar
const { data, pending, error, refresh } = useFetch<Resposta<Taxa[]>>(endpoint,
  { 
    watch: [endpoint] 
  }
);

// Computed para o título do filtro aplicado
const tituloFiltro = computed(() => {
  if (filtro.value && filtro.value.length > 1) 
    return `Exibindo taxas pelo filtro ${filtro.value}.`;

  return 'Lista de todas as taxas.';
});

// Variável reativa para o filtro
const filtro = ref('');

// Computed property que filtra os dojos baseado no texto digitado
const taxasFiltradas = computed(() => {
  if (!data.value?.docs) return [];
  
  if (!filtro.value) return data.value.docs;
  
  const valorFiltro = filtro.value.toLowerCase();
  
  return data.value.docs.filter((taxa: Taxa) => {
    const textoCompleto = [
      taxa._id,
      taxa.tipo,
      taxa.descricao,
//      taxa.valor_padrao,
      taxa.is_ativa ? 'ativa' : 'inativa',
//      taxa.periodo_referencia,
      taxa.observacoes
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