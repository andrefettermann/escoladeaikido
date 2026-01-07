<template>

  <div class="container">
          <!-- Mensagens -->
          <div v-if="localMessage" :class="['alert', localMessageType === 'error' ? 'alert-danger' : localMessageType === 'success' ? 'alert-success' : 'alert-info', 'alert-dismissible']">
            <strong v-if="localMessageType === 'error'">Erro:</strong>
            <strong v-else-if="localMessageType === 'success'">Ok:</strong>
            <strong v-else>Info:</strong>
            <span class="ms-1">{{ localMessage }}</span>
            <button type="button" class="btn-close" @click="localMessage = ''" aria-label="Fechar"></button>
          </div>

        <div class="wrapper d-flex align-items-center justify-content-center h-100">
            <div class="card login-form">
                <div class="card-body">
                    <h5 class="card-title text-center">Login</h5>
                    <form @submit.prevent="login">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email"
                              name="email" aria-describedby="Informe o seu email"
                              placeholder="Informe o seu email" v-model="form.email">
                        </div>
                        <div class="mb-3">
                            <label for="senha" class="form-label">Senha</label>
                            <input type="password" class="form-control" id="senha"
                              name="senha" aria-describedby="Informe a senha"
                            placeholder="Informe a senha" v-model="form.senha">
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Entrar</button>

                        <!--
                        <div class="sign-up mt-4">
                            Don't have an account? <a href="#">Create One</a>
                        </div>
                      -->
                    </form>
                </div>
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

async function login() {
    if (!form.email || form.email.trimStart() === '') {
      showMessage('Preencha o email.', 'error');
      return;
    }

    if (!form.senha || form.email.trimStart() === '') {
      showMessage('Preencha a senha.', 'error');
      return;
    }

    try {
        await $fetch('/api/login', {
            method: 'POST',
            body: form,
        })

        // Refresh the session on client-side and redirect to the home page
        await refreshSession()
        await navigateTo('/pessoas')
    } catch {
        showMessage('Falha no login. Verifique suas credenciais.', 'error');
    }
}
</script>