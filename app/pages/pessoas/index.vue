<template>
  <div>

    <!-- Mensagens -->
    <div v-if="localMessage" :class="['alert', localMessageType === 'error' ? 'alert-danger' : localMessageType === 'success' ? 'alert-success' : 'alert-info', 'alert-dismissible']">
      <strong v-if="localMessageType === 'error'">Erro:</strong>
      <strong v-else-if="localMessageType === 'success'">Ok:</strong>
      <strong v-else>Info:</strong>
      <span class="ms-1">{{ localMessage }}</span>
      <button type="button" class="btn-close" @click="localMessage = ''" aria-label="Fechar"></button>
    </div>

    <div>
      <h1 class="fs-3 fw-bold">Pessoas cadastradas</h1>
      <p class="fs-6 text-secondary">Gerencie as pessoas cadastradas na escola, incluindo alunos, professores e outros membros.</p>
    </div>

    <div class="mb-2">

        <NuxtLink id="todas" name="todas" 
          class="btn btn-primary btn-sm m-1" 
          to="/pessoas">Todos</NuxtLink>
        
        <NuxtLink id="ativas" name="ativas" 
          class="btn btn-primary btn-sm m-1" 
          to="/pessoas?situacao=ativo">Em atividade</NuxtLink>

        <NuxtLink id="inativas" name="inativas" 
          class="btn btn-primary btn-sm m-1" 
          to="/pessoas?situacao=inativo">Inativas</NuxtLink>

        <NuxtLink id="aniversariantes" 
          name="aniversariantes" 
          class="btn btn-primary btn-sm m-1" 
          :to="`/pessoas?mes=${mesCorrente}`">Aniversariantes do mês
        </NuxtLink>

        <NuxtLink id="professores" name="professores" 
          class="btn btn-primary btn-sm m-1" 
          to="/pessoas?tipo=professor">Professores</NuxtLink>

    </div>


    <div>
      <input class="form-control mt-2 mb-2" id="myInput" type="text" 
      placeholder="Filtrar.." v-model="filtro" aria-label="Filtrar as pessoas exibidas" />
    </div>

    <span v-if="tituloFiltro"> {{ tituloFiltro }} 
        Total encontrado: {{ pessoasFiltradas.length }}</span>

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
    
    <div v-else-if="pessoasFiltradas && pessoasFiltradas.length > 0">
    
      <div class="mb-2">
        <nuxt-link id="botao_nova_pessoa" name="botao_nova_pessoa" 
            class="btn btn-success btn-sm m-1" href="/pessoas/edita_pessoa">
              Incluir pessoa
        </nuxt-link>
      </div>


      <div class="table-responsive" role="region" aria-label="Tabela de pessoas" tabindex="0">

        <table id="lista" class="table table-striped table-hover align-middle">
          <caption class="visually-hidden">
            Lista de pessoas cadastradas, com nome, matrícula, graduação, status, aniversário, dojo e ações disponíveis
          </caption>
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Matrícula</th>
              <th scope="col">Graduação</th>
              <th scope="col">Status</th>
              <th scope="col">Aniversário</th>
              <th scope="col">Dojo</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pessoasFiltradas.length === 0">
              <td colspan="7" class="text-center text-secondary py-3">
                Nenhuma pessoa encontrada
              </td>
            </tr>
            <tr v-for="pessoa in pessoasFiltradas" :key="pessoa.id">
              <th scope="row">
                <span :class="{ 'text-decoration-line-through': !pessoa.is_ativo }" class="fs-6 fw-semibold">
                  {{ pessoa.nome }}
                </span>
              </th>
              <td>{{ pessoa.matricula ? pessoa.matricula : 'N/A' }}</td>
              <td>{{ pessoa.graduacao.nome }}</td>
              <td>
                <span class="badge" :class="pessoa.is_ativo ? 'bg-success' : 'bg-secondary'">
                  {{ pessoa.is_ativo ? 'Em atividade' : 'Inativo' }}
                </span>
              </td>
              <td>{{ pessoa.aniversario }}</td>
              <td>{{ pessoa.dojo?.nome ? pessoa.dojo?.nome : 'N/A' }}</td>
              <td>
                <div v-if="(user as any)?.role != 'admin'" class="d-flex gap-2">
                  <nuxt-link
                    :id="`detalhes_pessoa_${pessoa.id}`"
                    class="btn btn-primary btn-sm"
                    :to="`/pessoas/detalhes_pessoa?id=${pessoa.id}`"
                    :aria-label="`Ver detalhes de ${pessoa.nome}`"
                  >
                    Ver detalhes
                  </nuxt-link>
                  <nuxt-link
                    :id="`edita_pessoa_${pessoa.id}`"
                    class="btn btn-primary btn-sm"
                    :to="{ path: '/pessoas/edita_pessoa', query: { id: pessoa.id } }"
                    :aria-label="`Editar dados de ${pessoa.nome}`"
                  >
                    Editar os dados
                  </nuxt-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div v-else-if="!pending && !error">
      <p class="fs-3 fw-bold">Nenhuma pessoa encontrada.</p>
    </div>

  </div>

</template>

<script setup lang="ts">

// Verifica se esta logado
definePageMeta({
  middleware: ['authenticated']
})

// Mensagem composable
const { setMensagem } = useMensagem();

const { user } = useUserSession()
const route = useRoute();

const mesCorrente = new Date().getMonth() + 1;

// Computed para determinar qual endpoint usar baseado nos query params
const endpoint = computed(() => {
  const query = route.query;
  
  if (query.situacao) {
    return `/api/pessoas/situacao/${query.situacao}`;
  }
  if (query.mes) {
    return `/api/pessoas/aniversariantes/${query.mes}`;
  }
  if (query.tipo === 'professor') {
    return `/api/pessoas/tipo/${query.tipo.toLowerCase()}`;
  }
  if (query.id) {
    return `/api/pessoas/id/${query.id}`;
  }
  
  // Endpoint padrão (todas as pessoas)
  return '/api/pessoas';
});

const localMessage = ref('');
const localMessageType = ref<'success' | 'error' | 'info'>('info');
function showMessage(text: string, type: 'success' | 'error' | 'info' = 'info') {
  localMessage.value = text;
  localMessageType.value = type;
  // keep existing global composable for consistency
  setMensagem(text, type === 'error' ? 'error' : 'success');
}


// Busca os dados através da API route do servidor
// O watch: ['endpoint'] faz o refetch automático quando a rota mudar
const { data, pending, error, refresh } = 
  useFetch<{ sucesso: boolean; mensagem?: string; dados?: any[] }>(endpoint);

if (error.value) {
  console.error('Erro ao buscar pessoas:', error.value);
} else {
//  const mensagem = 'Pessoas carregadas com sucesso.';
//  showMessage(mensagem, 'info');
}

// Computed para o título do filtro aplicado
const tituloFiltro = computed(() => {
  
  const query = route.query;
  
  if (query.situacao === 'ativo') return 'Lista de pessoas em atividade.';
  if (query.situacao === 'inativo') return 'Lista de pessoas inativas.';
  if (query.mes) return 'Lista de aniversariantes do mês.';
  if (query.tipo === 'professor') return 'Lista de professores.';
  
  if (filtro.value && filtro.value.length > 1) 
    return `Exibindo pessoas pelo filtro ${filtro.value}.`;
  return 'Lista de todas as pessoas.';
});

// Variável reativa para o filtro
const filtro = ref('');

// Computed property que filtra as pessoas baseado no texto digitado
const pessoasFiltradas = computed(() => {
  // Se não houver dados, retorna array vazio
  if (!data.value?.dados) return [];
  
  // Se o filtro estiver vazio, retorna todos os dados
  if (!filtro.value) return data.value.dados;
  
  const valorFiltro = filtro.value.toLowerCase();
  
  return data.value.dados.filter((pessoa: any) => {
    const textoCompleto = [
      pessoa.id,
      pessoa.nome,
      pessoa.matricula,
      pessoa.graduacao?.nome,
      pessoa.is_ativo ? 'em atividade' : 'inativo',
      pessoa.aniversario,
      pessoa.dojo?.nome
    ].join(' ').toLowerCase();
    
    return textoCompleto.includes(valorFiltro);
  });
});

</script>