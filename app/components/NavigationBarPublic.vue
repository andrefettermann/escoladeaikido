<!-- layouts/default.vue -->
<template>

        <header class="d-flex flex-wrap justify-content-center py-2 mb-3 border-bottom bg-light">
            <a href="/pessoas" class="d-flex align-items-center mb-2 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
            aria-label="Voltar para a página inicial"> 
                <!--
                <svg class="bi me-2" width="40" height="32" aria-hidden="true"><use xlink:href="#bootstrap"></use></svg> 
                -->
                <img src="../../logo.png" alt="Logomarca da E.M.A." width="60" height="70"/>
                <span class="fs-4">E.M.A. - Escola Meirelles de Aikidô</span>
            </a> 
            <nav class="navbar navbar-expand-lg">
                <div class="container-fluid">
                    
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarNav">

                        <ul class="nav navbar-nav ms-auto"> 

                            <li class="nav-item">
                                <nuxt-link id="sobre_nos" name="sobre_nos" 
                                class="nav-link" active-class="active bg-primary text-white rounded"
                                :to = " { path: '/sobre' } ">
                                    Sobre nós
                                </nuxt-link>
                            </li> 

                            <li class="nav-item">
                                <nuxt-link id="sobre_aikido" name="sobre_aikido" 
                                class="nav-link" active-class="active bg-primary text-white rounded"
                                :to = " { path: '/sobre_aikido' } ">
                                    Sobre o Aikidô
                                </nuxt-link>
                            </li> 

                            <li class="nav-item">
                                <nuxt-link id="onde_treinar" name="onde_treinar" 
                                class="nav-link" active-class="active bg-primary text-white rounded"
                                aria-current="page"
                                :to = " { path: '/onde_treinar' } ">
                                    Onde treinar
                                </nuxt-link>
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