<template>
  <div class="container pt-3 w-100">
    
    <div class="mb-2 d-flex gap-2 fw-semibold">

        <nuxt-link id="edita" name="edita" class="link-primary" 
          :to="`/dojos/edita?id=${id}`">
          Edita
        </nuxt-link>

        <nuxt-link id="cancela" name="cancela" class="link-primary" 
          :to="`/dojos`">
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
        <span>{{ dojo?.nome }}</span>
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

                <div v-else-if="dojo" class="col">
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Local:</strong> {{ dojo.local }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Endereço:</strong> {{ dojo.endereco }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>Cidade:</strong> {{ dojo.cidade }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>UF:</strong> {{ dojo.uf }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>País:</strong>
                      {{ dojo.pais || 'N/A' }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>URL:</strong>
                      {{ dojo.url || 'N/A' }}
                    </div>
                  </div>
                  <div class="row mb-2">
                    <div class="col">
                      <strong>E-mail:</strong>
                      {{ dojo.email || 'N/A' }}
                    </div>
                  </div>
                </div>
                <div class="row mb-2">
                  <div class="col">
                    <strong>Em atividade?</strong> {{ dojo?.is_ativo?'Sim':'Não' }}
                  </div>
                </div>
              </div>


            </div>
        </div>
    </div>

    <div class="card mt-3">
      <div class="card-header fw-bold">Professores e horários</div>
      <div class="card-body">
        <ul id="horarios" name="horarios" aria-label="Professores e horários" 
        class="list-group mb-2 list-group-flush">
          <li v-for="horario in dojo?.horarios" :key="horario._id" 
          class="list-group-item">
            {{ horario.horario }} ({{ horario.nome_professor }})
          </li>
        </ul>
      </div>
    </div>

    <div class="card mt-3">
      <div class="card-header fw-bold">Alunos ({{dojo?.alunos?.length}})</div>
      <div class="card-body">
        <ul id="alunos" name="alunos" aria-label="Alunos" 
        class="list-group mb-2 list-group-flush">
          <li v-for="aluno in dojo?.alunos" :key="aluno._id" 
          class="list-group-item">
            {{ aluno.nome }} - {{ aluno.graduacao.nome }} ({{ aluno.situacao }})
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
    return `/api/dojos/${id}`;
});

// Busca os dados através da API route do servidor
// O watch: ['endpoint'] faz o refetch automático quando a rota mudar
const { data, pending, error, refresh } = await useFetch<Resposta<Dojo>>(endpoint, {
  watch: [endpoint]
})

var dojo: Dojo | undefined;
if (error.value) {
  console.error('Erro ao buscar pessoa:', error.value);
  const mensagem = error.value.data?.message 
    || error.value.message 
    || 'Erro ao buscar pessoa.';
  showMessage(mensagem, 'error');
} else {
  const mensagem = 'Dojo carregado com sucesso.';
  showMessage(mensagem, 'info');
  dojo = data.value?.docs;
} 

function showMessage(text: string, type: 'success' | 'error' | 'info' = 'info') {
  localMessage.value = text;
  localMessageType.value = type;
  // keep existing global composable for consistency
  setMensagem(text, type === 'error' ? 'error' : 'success');
}

</script>
