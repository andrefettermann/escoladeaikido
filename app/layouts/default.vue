<!-- layouts/default.vue -->
<template>

<div class="container">
    
    <NavigationBarPublic  />

    <slot /> <!-- This is where your page content will be injected -->

    <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top"> 
        <div class="col-md-4 d-flex align-items-center"> 
            <span class="mb-3 mb-md-0 text-body-secondary">2025 - Escola de Aikidô</span>
        </div> 
        <ul class="nav col-md-4 justify-content-end list-unstyled d-flex"></ul> 
    </footer>
</div>

</template>


<script setup lang="ts">
    const { user , clear: clearSession } = useUserSession()

    async function logout () {
        await clearSession()
        await navigateTo('/login')
    }
</script>
