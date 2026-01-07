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
            class="btn btn-success btn-sm m-1" href="/dojos/edita_dojo">
              Incluir dojo
        </nuxt-link>
      </div>

      <ul id="lista" class="list-group mb-2">
        <li v-for="dojo in dojosFiltrados" :key="dojo.id" class="list-group-item">
          <h5 v-if="!dojo.is_ativo" class="text-decoration-line-through">{{ dojo.nome }}</h5>
          <div class="fs-6 text-secondary">
            {{ dojo.local?dojo.local:'N/A' }} -  
            {{ dojo.endereco ? dojo.endereco : 'N/A' }} -
            {{ dojo.cidade ? dojo.cidade : 'N/A' }}  
            ({{ dojo.uf ? dojo.uf : 'N/A' }}) -
            {{  dojo.is_ativo ? 'Ativo' : 'Inativo' }}
          </div>
            
          <div v-for="professor in dojo.professores" :key="professor.id_professor">
            {{ professor ? professor.horarios : 'N/A' }} -
            {{ professor ? professor.nome : 'N/A' }} <br/>          
          </div>
          
          <div v-if="(user as any)?.role!='admin'" class="flex gap-2">
            <nuxt-link 
              id="detalhes_dojo" 
              name="detalhes_dojo" 
              class="btn btn-primary btn-sm m-1" 
              :to="`/dojos/detalhes_dojo?id=${dojo.id}`">
              Detalhes
            </nuxt-link>
            <nuxt-link 
              id="bota_editar_dojo" 
              name="botao_editar_dojo" 
              class="btn btn-primary btn-sm m-1" 
              :to="`/dojos/edita_dojo?id=${dojo.id}`">
              Editar
            </nuxt-link>
          </div>
        </li>
      </ul>
    </div>

    <div v-else-if="!pending && !error">
      <p class="fs-3 fw-bold">Nenhuma dojo encontrado.</p>
    </div>

  </div>

</template>

<script setup lang="ts">
import { useMensagem } from '~/composable/useMensagem';

// Verifica se esta logado
//definePageMeta({
//  middleware: ['authenticated']
//})

const { user } = useUserSession()
/*
const { mensagem, tipo, limparMensagem } = useMensagem();
const route = useRoute();

const mesCorrente = new Date().getMonth() + 1;
*/

// Computed para determinar qual endpoint usar baseado nos query params
const endpoint = computed(() => {
  // Endpoint padrão (todos os dojos)
  return '/api/dojos';
});

// Busca os dados através da API route do servidor
// O watch: ['endpoint'] faz o refetch automático quando a rota mudar
const { data, pending, error, refresh } = 
  useFetch<{ sucesso: boolean; mensagem?: string; dados?: any[] }>(endpoint);

// Computed para o título do filtro aplicado
const tituloFiltro = computed(() => {
  return 'Lista de todos os dojos.';
});

// Variável reativa para o filtro
const filtro = ref('');

// Computed property que filtra os dojos baseado no texto digitado
const dojosFiltrados = computed(() => {
  if (!data.value?.dados) return [];
  
  if (!filtro.value) return data.value.dados;
  
  const valorFiltro = filtro.value.toLowerCase();
  
  return data.value.dados.filter((dojo: any) => {
    const textoCompleto = [
      dojo.nome,
      dojo.local,
      dojo.endereco,
      dojo.cidade,
      dojo.uf,
      dojo.professores,
      dojo.is_ativo?'ativo':'inativo'
    ].join(' ').toLowerCase();
    
    return textoCompleto.includes(valorFiltro);
  });
});

</script>