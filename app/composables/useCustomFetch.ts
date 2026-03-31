import type { UseFetchOptions } from '#app';

interface CustomFetchOptions<T> extends UseFetchOptions<T> {
  showErrorMessage?: boolean;
  showSuccessMessage?: boolean;
  successMessage?: string;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

// Mensagem composable
//const { setMensagem } = useMensagem();

// Local reactive alert state (replaces manual DOM toggling)
const localMessage = ref('');
const localMessageType = ref<'success' | 'error' | 'info'>('info');

//function showMessage(text: string, type: 'success' | 'error' | 'info' = 'info') {
//  localMessage.value = text;
//  localMessageType.value = type;
  // keep existing global composable for consistency
//  setMensagem(text, type === 'error' ? 'error' : 'success');
//}

export const useCustomFetch = <T = any>(
  url: MaybeRef<string>,
  options: CustomFetchOptions<T> = {}
) => {
  const {
    showErrorMessage = true,
    showSuccessMessage = false,
    successMessage,
    onSuccess,
    onError,
    ...fetchOptions
  } = options;

  const { data, error, refresh, status } = useFetch<T>(url, fetchOptions as any);

  // Processa erros automaticamente
  watch(error, (newError) => {
    if (newError) {
      console.error('Erro na requisição:', newError);
      
      if (showErrorMessage) {
        const mensagem = 
          newError.data?.message || 
          newError.message || 
          'Erro ao processar requisição.';
        //showMessage(mensagem, 'error');
      }

      onError?.(newError);
    }
  });

  // Processa sucesso
  watch(data, (newData) => {
    if (newData && newData !== null) {
      if (showSuccessMessage && successMessage) {
      //  showMessage(successMessage, 'success');
        console.log('Success message:', successMessage);
      }
      
      // Type guard garante que newData não é null
      onSuccess?.(newData as T);
    }
  }, { immediate: true });

  return {
    data,
    error,
    refresh,
    status,
    loading: computed(() => status.value === 'pending'),
    success: computed(() => status.value === 'success'),
  };
};