export const useFetchProfessores = (
  professoresEndpoint: MaybeRefOrGetter<string>, 
  options?: { onError?: (mensagem: string) => void } // 👈 Recebe a função aqui
) => {
  const { data, pending, error } = useFetch<Resposta<Pessoa[]>>(professoresEndpoint, {
    watch: [() => toValue(professoresEndpoint)]
  })

  const dadosProfessores = computed(() => data.value || null)

  watch(error, (newError) => {
    if (newError) {
      console.error('Erro ao buscar os professores:', newError)
      
      const mensagem = newError.data?.message 
        || newError.message 
        || 'Erro ao buscar as funcoes.'
      
      // 👈 Se a função foi passada pelo componente, nós a executamos aqui
      if (options?.onError) {
        options.onError(mensagem)
      }
    }
  })

  return {
    dadosProfessores: dadosProfessores,
    carregandoProfessores: pending
  }
}
