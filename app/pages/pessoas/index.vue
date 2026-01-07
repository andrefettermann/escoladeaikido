<template>
  <div>

    <figure>
      <blockquote class="blockquote fs-2 fw-bold">
        <p>Pessoas cadastradas</p>
      </blockquote>
      <figcaption class="blockquote-footer">
        <span v-if="tituloFiltro"> {{ tituloFiltro }} 
          Total encontrado: {{ pessoasFiltradas.length }}</span>
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
    
    <div v-else-if="pessoasFiltradas && pessoasFiltradas.length > 0">
    
      <div class="mb-2">
        <nuxt-link id="botao_nova_pessoa" name="botao_nova_pessoa" 
            class="btn btn-success btn-sm m-1" href="/pessoas/edita_pessoa">
              Incluir pessoa
        </nuxt-link>
      </div>

      <ul id="lista" class="list-group mb-2">
        <li v-for="pessoa in pessoasFiltradas" :key="pessoa.id" class="list-group-item">

          <h5 v-if="!pessoa.is_ativo" class="text-decoration-line-through">{{ pessoa.nome }}</h5>
          <h5 v-if="pessoa.is_ativo" >{{ pessoa.nome }}</h5>
          
          <p class="fs-6 text-secondary">
            {{ pessoa.matricula?pessoa.matricula:'N/A' }} | 

            {{ pessoa.graduacao.nome }}
            
            | {{ pessoa.is_ativo ? 'Em atividade' : 'Inativo' }} | {{ pessoa.aniversario }} | 
            {{ pessoa.dojo?.nome?pessoa.dojo?.nome:'N/A' }}
          </p>
          <div v-if="(user as any)?.role!='admin'" class="flex gap-2">
            <nuxt-link id="detalhes_pessoa" name="detalhes_pessoa" 
              class="btn btn-primary btn-sm m-1" 
              :to="`/pessoas/detalhes_pessoa?id=${pessoa.id}`">
              Detalhes
            </nuxt-link>

            <nuxt-link id="edita_pessoa" name="edita_pessoa" 
              class="btn btn-primary btn-sm m-1" 
              :to="{ path: '/pessoas/edita_pessoa', query: { id: pessoa.id } }">
              Edita
            </nuxt-link>
          </div>
        </li>
      </ul>
    </div>

    <div v-else-if="!pending && !error">
      <p class="fs-3 fw-bold">Nenhuma pessoa encontrada.</p>
    </div>

  </div>

</template>

<script setup lang="ts">
//import { useMensagem } from '~/composable/useMensagem';

// Verifica se esta logado
//definePageMeta({
//  middleware: ['authenticated']
//})

const { user } = useUserSession()
//const { mensagem, tipo, limparMensagem } = useMensagem();
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
  if (query.tipo === 'Professor') {
    return `/api/pessoas/professores`;
  }
  if (query.id) {
    return `/api/pessoas/id/${query.id}`;
  }
  
  // Endpoint padrão (todas as pessoas)
  return '/api/pessoas';
});

// Busca os dados através da API route do servidor
// O watch: ['endpoint'] faz o refetch automático quando a rota mudar
const { data, pending, error, refresh } = 
  useFetch<{ sucesso: boolean; mensagem?: string; dados?: any[] }>(endpoint);

// Computed para o título do filtro aplicado
const tituloFiltro = computed(() => {
  /*
  const query = route.query;
  
  if (query.situacao === 'Ativo') return 'Lista de pessoas em atividade.';
  if (query.situacao === 'Inativo') return 'Lista de pessoas inativas.';
  if (query.mes) return 'Lista de aniversariantes do mês.';
  if (query.tipo === 'Professor') return 'Lista de professores.';
  */
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