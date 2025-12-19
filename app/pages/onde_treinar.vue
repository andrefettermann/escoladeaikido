<template>
  <div>

    <figure>
      <blockquote class="blockquote fs-2 fw-bold">
        <p>Onde treinar</p>
      </blockquote>
      <figcaption class="blockquote-footer">
        Escolha um local para treinar.
      </figcaption>
    </figure>
    
    <div v-if="pending" class="text-center">
      <p class="mb-4">Carregando dados...</p>
      <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden" 
      role="progressbar" aria-label="Animated striped example" aria-valuenow="75" 
      aria-valuemin="0" aria-valuemax="100">
        <div class="h-full bg-blue-600 animate-pulse" style="width: 75%"></div>
      </div>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p class="mb-2">Erro ao carregar dados: {{ error.message }}</p>
      <button @click="() => refresh()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Tentar novamente
      </button>
    </div>

    <div v-else-if="dojos && dojos.length > 0">
      
      <div v-for="(dojosDaUF, uf) in dojosPorUF" :key="uf" class="mb-4">
        <!-- Cabeçalho do grupo (UF) -->
        <h3 class="text-black px-3 py-2 rounded mb-2">{{ uf }}</h3>
        
        <ul class="list-group mb-2">
          <li v-for="dojo in dojosDaUF" :key="dojo.id" class="list-group-item">
            <div>
              <span class="fs-5 fw-bold">{{ dojo.nome }}</span>
              <br/>
              <span class="fs-6">{{ dojo.local }}</span>
            </div>
            <hr>
            <div>
              {{ dojo.endereco ? dojo.endereco : 'N/A' }} -
              {{ dojo.cidade ? dojo.cidade : 'N/A' }} - {{ dojo.uf ? dojo.uf : 'N/A' }}
            </div>
            <div v-for="professor in dojo.professores" :key="professor.id_professor">
                {{ professor ? professor.horarios : 'N/A' }} -
                {{ professor ? professor.nome : 'N/A' }} <br/>
            </div>

            <div v-if="(user as any)?.role=='admin'" class="flex gap-2">
              <nuxt-link 
                id="bota_detalhes_dojo" 
                name="botao_detalhes_dojo" 
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700" 
                :to="`/dojos/detalhes_dojo?id=${dojo.id}`">
                Detalhes
              </nuxt-link>
              <nuxt-link 
                id="bota_editar_dojo" 
                name="botao_editar_dojo" 
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700" 
                :to="`/dojos/edita_dojo?id=${dojo.id}`">
                Editar
              </nuxt-link>
            </div>
          </li>
        </ul>
      </div>

    </div>

    <div v-else-if="!pending && !error">
      <p class="fs-3 fw-bold">Nenhum dojo encontrado.</p>
    </div>

  </div>

</template>

<script setup lang="ts">
const { user } = useUserSession()

const situacao = 'ativos'
const endpoint = `/api/dojos/${situacao}`

const { data, pending, error, refresh } = 
  useFetch<{ sucesso: boolean; mensagem?: string; dados?: any[] }>(endpoint);
const dojos = computed(() => data.value?.dados || []);

// Agrupar por UF e ordenar dentro de cada grupo por cidade e nome
const dojosPorUF = computed(() => {
  const agrupados: Record<string, typeof dojos.value> = {}
  
  dojos.value.forEach(dojo => {
    const uf = dojo.uf || 'Sem UF'
    if (!agrupados[uf]) {
      agrupados[uf] = []
    }
    agrupados[uf].push(dojo)
  })
  
  // Ordenar as UFs alfabeticamente
  return Object.keys(agrupados)
    .sort()
    .reduce((acc: any, uf) => {
      // Ordenar os dojos dentro de cada UF por cidade e depois por nome
      const dojosDaUF = agrupados[uf]
      
      if (dojosDaUF) {
        acc[uf] = dojosDaUF.sort((a, b) => {
          // Primeiro ordena por cidade
          const cidadeA = (a.cidade || '').toLowerCase()
          const cidadeB = (b.cidade || '').toLowerCase()
          
          if (cidadeA < cidadeB) return -1
          if (cidadeA > cidadeB) return 1
          
          // Se as cidades forem iguais, ordena por nome
          const nomeA = (a.nome || '').toLowerCase()
          const nomeB = (b.nome || '').toLowerCase()
          
          if (nomeA < nomeB) return -1
          if (nomeA > nomeB) return 1
          
          return 0
        })
      }
      return acc
    }, {} as Record<string, typeof dojos.value>)
})
</script>