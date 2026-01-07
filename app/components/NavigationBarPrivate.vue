<!-- layouts/default.vue -->
<template>

        <header class="d-flex flex-wrap justify-content-center py-2 mb-3 border-bottom bg-light">
            <a href="/pessoas" class="d-flex align-items-center mb-2 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"> 
                <!--
                <svg class="bi me-2" width="40" height="32" aria-hidden="true"><use xlink:href="#bootstrap"></use></svg> 
                -->
                <img src="../../logo.png" width="60" height="70"/>
                <span class="fs-4">E.M.A. - Escola Meirelles de Aikidô</span>
            </a> 
            <nav class="navbar navbar-expand-lg">
                <div class="container-fluid">
                    
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarNav">

                        <ul class="nav navbar-nav ms-auto"> 

                            <li class="nav-item">
                                <nuxt-link id="pessoas" name="pessoas" 
                                class="nav-link" active-class="active bg-primary text-white rounded"
                                aria-current="page"
                                :to = " { path: '/pessoas' } ">
                                    Pessoas
                                </nuxt-link>
                            </li> 

                            <li class="nav-item">
                                <nuxt-link id="dojos" name="dojos" 
                                class="nav-link" active-class="active bg-primary text-white rounded"
                                aria-current="page"
                                :to = " { path: '/dojos' } ">
                                    Dojos
                                </nuxt-link>
                            </li> 

                            <li class="nav-item">
                                <nuxt-link id="graduacoes" name="graduacoes" 
                                class="nav-link" active-class="active bg-primary text-white rounded"
                                aria-current="page"
                                :to = " { path: '/graduacoes' } ">
                                    Graduações
                                </nuxt-link>
                            </li> 
                            
                            <li class="nav-item dropdown">
                                <nuxt-link id="financeiro" name="financeiro" 
                                class="nav-link dropdown-toggle" href="#" 
                                role="button" data-bs-toggle="dropdown" 
                                aria-expanded="false">
                                        Financeiro
                                </nuxt-link>
                                <ul class="dropdown-menu">
                                    <li>
                                        <nuxt-link id="taxas" name="taxas" 
                                        :to=" { path: '/taxas/lista_taxas' } " 
                                        class="nav-link" aria-current="page">
                                            Taxas
                                        </nuxt-link>
                                    </li>
                                    <li>
                                        <nuxt-link id="menu-cobrancas" name="menu-cobrancas" 
                                        :to=" { path: '/cobrancas' } " 
                                        class="nav-link" aria-current="page">
                                            Cobranças
                                        </nuxt-link>
                                    </li>
                                </ul>
                            </li>

                            <li class="nav-item"><a id="menu-sair" name="menu-sair" 
                                @click="logout" class="nav-link">Sair</a>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        </header>
</template>

<script setup lang="ts">
    const { user , clear: clearSession } = useUserSession()

    async function logout () {
        await clearSession()
        await navigateTo('/login')
    }
</script>