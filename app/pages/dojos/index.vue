<template>
  <div>

    <figure>
      <blockquote class="blockquote fs-2 fw-bold">
        <p>Dojos cadastrados</p>
      </blockquote>
      <figcaption class="blockquote-footer">
        <span v-if="tituloFiltro"> {{ tituloFiltro }} 
          Total encontrado: {{ dojosFiltrados.length }}</span>
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

    <div v-else-if="dojosFiltrados && dojosFiltrados.length > 0">
    
      <div class="mb-2">
        <nuxt-link id="novo_dojo" name="novo_dojo" 
          class="btn btn-success btn-sm m-1" href="/dojos/edita">
          Incluir dojo</nuxt-link>

        <NuxtLink id="todos" name="todos" 
          class="btn btn-primary btn-sm m-1" 
          to="/dojos">Todos</NuxtLink>

        <NuxtLink id="ativos" name="ativos" 
          class="btn btn-primary btn-sm m-1" 
          to="/dojos?situacao=ativo">Em atividade</NuxtLink>

        <NuxtLink id="inativos" name="inativos" 
          class="btn btn-primary btn-sm m-1" 
          to="/dojos?situacao=inativo">Inativos</NuxtLink>

      </div>

      <div class="table-responsive" role="region" aria-label="Tabela de dojos" tabindex="0">

        <table id="lista" class="table table-striped table-hover align-middle">
          <caption class="visually-hidden">
            Lista de dojos cadastrados, com nome, matrícula, graduação, status, aniversário, dojo e ações disponíveis
          </caption>
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Local</th>
              <th scope="col">Endereço</th>
              <th scope="col">Cidade</th>
              <th scope="col">UF</th>
              <th scope="col">Situação</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="dojosFiltrados.length === 0">
              <td colspan="7" class="text-center text-secondary py-3">
                Nenhum dojo encontrado
              </td>
            </tr>
            <tr v-for="dojo in dojosFiltrados" :key="dojo._id">
              <th scope="row">
                <span :class="{ 'text-decoration-line-through': !dojo.is_ativo }" class="fs-6 fw-semibold">
                  {{ dojo.nome }}
                </span>
              </th>
              <td>{{ dojo.local }}</td>
              <td>{{ dojo.endereco }}</td>
              <td>{{ dojo.cidade }}</td>
              <td>{{ dojo.uf }}</td>
              <td>
                <span class="badge" :class="dojo.is_ativo ? 'bg-success' : 'bg-secondary'">
                  {{ dojo.is_ativo ? 'Em atividade' : 'Inativo' }}
                </span>
              </td>
              <td>
                <div v-if="(user as any)?.role != 'admin'" class="d-flex gap-2">
                  <nuxt-link
                    :id="`detalhes_dojo_${dojo._id}`"
                    class="btn btn-primary btn-sm m-1"
                    :to="{ path: '/dojos/detalhes', query: { id: dojo._id } }"
                    :aria-label="`Ver detalhes de ${dojo.nome}`">Ver</nuxt-link>

                  <nuxt-link
                    :id="`edita_dojo_${dojo._id}`"
                    class="btn btn-primary btn-sm m-1"
                    :to="{ path: `/dojos/edita/${dojo._id}` }"
                    :aria-label="`Editar dados de ${dojo.nome}`">Editar</nuxt-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div v-else-if="!pending && !error">
      <p class="fs-3 fw-bold">Nenhum dojo encontrado.</p>
    </div>

  </div>

</template>

<script setup lang="ts">
// Verifica se esta logado
definePageMeta({
  middleware: ['authenticated']
})

const { user } = useUserSession()
const route = useRoute();
/*
const { mensagem, tipo, limparMensagem } = useMensagem();
*/

// Computed para determinar qual endpoint usar baseado nos query params
const endpoint = computed(() => {
  const query = route.query;
  
  if (query.situacao) {
    return `/api/dojos/situacao/${query.situacao}`;
  }

  if (query.id) {
    return `/api/dojos/id/${query.id}`;
  }

  return '/api/dojos';
});

// Busca os dados através da API route do servidor
// O watch: ['endpoint'] faz o refetch automático quando a rota mudar
const { data, pending, error, refresh } = useFetch<Resposta<Dojo[]>>(endpoint,
  { 
    watch: [endpoint] 
  }
);

// Computed para o título do filtro aplicado
const tituloFiltro = computed(() => {
  const query = route.query;
  
  if (query.situacao === 'ativo') return 'Lista de dojos em atividade.';
  if (query.situacao === 'inativo') return 'Lista de dojos inativos.';
  
  if (filtro.value && filtro.value.length > 1) 
    return `Exibindo dojos pelo filtro ${filtro.value}.`;

  return 'Lista de todos os dojos.';
});

// Variável reativa para o filtro
const filtro = ref('');

// Computed property que filtra os dojos baseado no texto digitado
const dojosFiltrados = computed(() => {
  if (!data.value?.docs) return [];
  
  if (!filtro.value) return data.value.docs;
  
  const valorFiltro = filtro.value.toLowerCase();
  
  return data.value.docs.filter((dojo: any) => {
    const textoCompleto = [
      dojo._id,
      dojo.nome,
      dojo.local,
      dojo.endereco,
      dojo.cidade,
      dojo.uf,
      dojo.horarios,
      dojo.is_ativo?'ativo':'inativo'
    ].join(' ').toLowerCase();
    
    return textoCompleto.includes(valorFiltro);
  });
});

</script>