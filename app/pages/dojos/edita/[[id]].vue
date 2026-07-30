<template>
  <div class="container pt-3 w-100">
    <div class="card">
      <div class="card-header fw-bold">{{ title }}</div>
      <div class="card-body">
        <form id="formulario" @submit.prevent="grava">

          <!-- Info Alert -->
          <div class="alert alert-info alert-dismissible fade show">
            <strong>Info!</strong> O '*'' indica os campos obrigatórios.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
          </div>

          <!-- Mensagens -->
          <div v-if="localMessage" :class="['alert', localMessageType === 'error' ? 'alert-danger' : localMessageType === 'success' ? 'alert-success' : 'alert-info', 'alert-dismissible']">
            <strong v-if="localMessageType === 'error'">Erro:</strong>
            <strong v-else-if="localMessageType === 'success'">Ok:</strong>
            <strong v-else>Info:</strong>
            <span class="ms-1">{{ localMessage }}</span>
            <button type="button" class="btn-close" @click="localMessage = ''" aria-label="Fechar"></button>
          </div>

          <!-- Nome -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="nome" class="col-form-label">*Nome</label>
            </div>
            <div class="col">
              <input type="text" class="form-control" id="nome" name="nome" 
              v-model="dojo.nome" placeholder="O nome do dojo"/>
            </div>
          </div>

          <!-- Local -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="local" class="col-form-label">Local</label>
            </div>
            <div class="col">
              <input type="text" class="form-control" id="local" name="local" 
              v-model="dojo.local" placeholder="O local do dojo"/>
            </div>
          </div>

          <!-- Endereco -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="endereco" class="col-form-label">Endereço</label>
            </div>
            <div class="col">
              <input type="text" class="form-control" id="endereco" 
              name="endereco" v-model="dojo.endereco" 
              placeholder="O endereço do dojo"/>
            </div>
          </div>

          <!-- Bairro -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="bairro" class="col-form-label">Bairro</label>
            </div>
            <div class="col">
              <input type="text" class="form-control" id="bairro" name="bairro" 
              v-model="dojo.bairro" placeholder="O bairro do dojo"/>
            </div>
          </div>

          <!-- Cidade -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="cidade" class="col-form-label">Cidade</label>
            </div>
            <div class="col-3">
              <input type="text" class="form-control" id="cidade" name="cidade" 
              v-model="dojo.cidade" placeholder="A cidade do dojo"/>
            </div>
          </div>

          <!-- UF -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="uf" class="col-form-label">Estado</label>
            </div>
            <div class="col-1">
              <input type="text" class="form-control" id="uf" name="uf" 
              v-model="dojo.uf" placeholder="A sigla do estado" size="10" 
              data-toggle="tooltip" data-placement="top" 
              title="A sigla do estado">
            </div>
          </div>

          <!--Pais-->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="pais" class="col-form-label">País</label>
            </div>
            <div class="col-3">
              <input type="text" class="form-control" id="pais" name="pais" 
              v-model="dojo.pais"
              placeholder="O nome do país" size="10" data-toggle="tooltip" 
              data-placement="top"  title="O nome do país">
            </div>
          </div>

          <!--URL-->
          <div class="form-group row mb-3">
            <div class="col-2">
                <label for="url" class="col-form-label">URL do site</label>
            </div>
            <div class="col-3">
              <input type="text" class="form-control" id="url" name="url" 
              v-model="dojo.url" placeholder="A URL do site" size="10" 
              data-toggle="tooltip" data-placement="top" title="A URL do site">
            </div>
          </div>

          <!--E-mail-->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="url" class="col-form-label">E-mail de contato</label>
            </div>
            <div class="col-3">
              <input type="text" class="form-control" id="email" name="email" 
              v-model="dojo.email"
              placeholder="O e-mail de contato" size="10" data-toggle="tooltip" 
              data-placement="top"  title="O e-mail de contato">
            </div>
          </div>

          <!-- Ativo? -->
          <div class="form-group row mb-3">
            <div class="col-2">
                <label for="is_ativo" class="form-label">O dojo está ativo?</label>
            </div>
            <div class="col-1">
              <input class="form-check-input" type="checkbox" id="is_ativo" 
              name="is_ativo" v-model="dojo.is_ativo" >
            </div>
          </div>

          <!-- Horarios -->
          <div class="card w-75 mx-auto mb-5">
            <div class="card-header fw-bold">Horários e professores</div>
              <div class="card-body" id="promocoes">

                <button id="adiciona_horario" name="adiciona_horario"
                  type="button" 
                  class="btn btn-primary mb-3" 
                  @click="adicionarHorario">
                  <i class="bi bi-plus-circle"> Adiciona horário</i>
                </button>

                <div v-if="dojo.horarios && dojo.horarios.length > 0">
                  <div v-for="(horario, index) in dojo.horarios" 
                    :key="index" class="form-group row mb-3">

                    <div class="col-2">
                      <label :for="`professor_${index + 1}`" 
                      class="col-form-label">Professor</label>
                    </div>
                    <div class="col-3">
                      <select 
                        :id="`id_horario_professor_${index + 1}`" 
                        :name="`id_horario_professor_${index + 1}`" 
                        class="form-select" 
                        aria-label="Professor" 
                        required
                        v-model="horario.id_professor">
                        <option value="" selected>Selecione</option>
                        <option v-for="item in items" :key="item.value" 
                              :value="item.value">
                                {{ item.label }}
                              </option>
                      </select>
                    </div>

                    <div class="col-1">
                      <label :for="`horario_${index + 1}`" 
                      class="col-form-label">Horário</label>
                    </div>
                    <div class="col-3">
                      <input 
                        :id="`horario_${index + 1}`" 
                        :name="`horario_${index + 1}`" 
                        type="text" 
                        class="form-control" 
                        v-model="horario.horario"/>
                    </div>
                  

                    <div class="col-2">
                      <button 
                        type="button" 
                        class="btn btn-danger btn-sm" 
                        @click="removerHorario(index)"
                        title="Remover">
                        <i class="bi bi-trash">Exclui</i>
                      </button>
                    </div>
                  </div>
                </div> 
              </div>
            </div>
            
          

          <div class="col-12">
            <button :disabled="isSaving" type="submit" class="btn btn-primary btn-sm mt-4 me-2">Gravar</button>
            <a id="botao_cancela" name="botao_cancela" class="btn btn-secondary btn-sm mt-4" 
            href="/dojos">Cancela</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

definePageMeta({
  middleware: ['authenticated']
})

const route = useRoute();
const query = route.query;
const id = route.params.id as string;

const title = id ? 'Edita Dojo' : 'Novo Dojo';

// Reactive pessoa object
const dojo = reactive<Dojo>({
  _id: '',
  nome: '',
  endereco: '',
  bairro: '',
  cidade: '',
  uf: '',
  pais: '',
  horarios: [],
  url: '',
  email: '',
  local: '',
  is_ativo: false
});

// Busca os dados somente na alteracao (id != null)
if (id) {
  const endpoint = computed(() => `/api/dojos/${id}`);
  const { data: dojoData } = await useFetch<Resposta<Dojo>>(endpoint, 
    { 
      watch: [endpoint] 
    });
    
  if (dojoData.value?.docs) {
    Object.assign(dojo, dojoData.value.docs);
  }
}

// Inicia os professores
const professoresEndpoint = '/api/pessoas/tipo/professor';
const { data: dataProfessores, pending: pendingProfessores } = 
                      await useFetch<{ docs: any }>(professoresEndpoint);

const items = computed(() => {
  const docs = dataProfessores.value?.docs || [];
  return docs.map((prof: any) => ({ label: `${prof.nome}`, value: prof.id }));
});


// Mensagem composable
const { setMensagem } = useMensagem();

const isSaving = ref(false);

// Local reactive alert state (replaces manual DOM toggling)
const localMessage = ref('');
const localMessageType = ref<'success' | 'error' | 'info'>('info');

//
// Função para gravar
//
async function grava() {
  if (!dojo.nome || dojo.nome.trimStart() === '') {
    showMessage('Preencha o campo obrigatório: nome.', 'error');
    return;
  }

  const endpoint = dojo._id ? `/api/dojos/${dojo._id}` : '/api/dojos';
  const method = dojo._id ? 'PATCH' : 'POST';

  try {
    isSaving.value = true;
    await $fetch(endpoint, {
      method,
      body: dojo
    });

    showMessage('Dojo gravado com sucesso!', 'success');
    await navigateTo('/dojos', { replace: true });
  } catch (err: any) {
    console.error(err);
    showMessage(err?.data?.message || 'Erro ao gravar dojo', 'error');
  } finally {
    isSaving.value = false;
  }
}

function showMessage(text: string, type: 'success' | 'error' | 'info' = 'info') {
  localMessage.value = text;
  localMessageType.value = type;
  // keep existing global composable for consistency
  setMensagem(text, type === 'error' ? 'error' : 'success');
}

//
// Função para adicionar horario
//
const adicionarHorario = () => {
  // Inicializa o array se não existir
  if (!dojo.horarios) {
    dojo.horarios = []
  }
  
  dojo.horarios.push({
    id_professor: '',
    horario: '',
    nome_professor: '',
    _id: ''
  })
}

//
// Função para remover promoção
//
const removerHorario = (index: number) => {
  dojo?.horarios?.splice(index, 1)
}

</script>
