<template>

<div class="flex justify-center items-center h-screen">
  <div class="xl:w-[700px] px-10 h-[400px] rounded-3xl xl:shadow-xl">
    <h1 class="text-center text-3xl font-bold mt-2 mb-2">Registro</h1>
    <hr>
    <div class="flex justify-center mt-10">
      <form @submit.prevent="registra">

          <!-- Mensagens -->
        <div v-if="localMessage" :class="[
        'relative px-4 py-3 rounded border',
        localMessageType === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 
        localMessageType === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 
        'bg-blue-100 border-blue-400 text-blue-700'
        ]" role="alert">
        <strong class="font-bold">
            <span v-if="localMessageType === 'error'">Erro:</span>
            <span v-else-if="localMessageType === 'success'">Ok:</span>
            <span v-else>Info:</span>
        </strong>
        <span class="ml-1">{{ localMessage }}</span>
        <button 
            type="button" 
            class="absolute top-0 right-0 px-4 py-3 text-xl leading-none hover:opacity-75"
            @click="localMessage = ''" 
            aria-label="Fechar">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>

        <input type="text" name="email" id="email" 
        class="py-3 p-5 rounded-md  bg-zinc-50 md:w-[500px] w-[300px] outline-indigo-400" 
        placeholder="Informe o e-mail" v-model="form.email">
        
        <br><br>
        
        <input type="password" name="senha" id="senha" 
        class="py-3 p-5 rounded-md  bg-zinc-50 md:w-[500px] w-[300px] outline-indigo-400" 
        placeholder="Informe a senha" v-model="form.senha">


        <div class="flex justify-end mt-3 mb-4">
        <!--
          <a href="#" class="text-blue-700">Forgot password</a>
        -->
        </div>

        <button type="submit" id="enviar" name="enviar"
        class="py-3 bg-indigo-400 text-white w-full rounded-md font-bold">Enviar</button>
      </form>
    </div>
  </div>
</div>

</template>

<script lang="ts" setup>
import { useUserSession } from '#imports';
import { reactive } from 'vue';
import { useMensagem } from '~/composable/useMensagem';

const { fetch: refreshSession } = useUserSession()

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

const form = reactive({
  email: '',
  senha: ''
})

async function registra() {
    if (!form.email || form.email.trimStart() === '') {
      showMessage('Preencha o email.', 'error');
      return;
    }

    if (!form.senha || form.email.trimStart() === '') {
      showMessage('Preencha a senha.', 'error');
      return;
    }

    try {
        await $fetch('/api/usuarios/', {
            method: 'POST',
            body: form,
        })

        // Refresh the session on client-side and redirect to the home page
        await refreshSession()
        await navigateTo('/')
    } catch {
        showMessage('Falha no registro.', 'error');
    }
}
</script>