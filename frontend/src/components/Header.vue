<template>
    <header class="header">
        <button v-if="!isHomePage" @click="goBack" class="back-button">
            ← Back
        </button>
        <nav>
            <ul class="nav-list">
                <li class="nav-item"><router-link to="/" class="nav-link">Home</router-link></li>
            </ul>
        </nav>
    </header>
</template>

<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    name: "Header",
    setup() {
        const route = useRoute();
        const router = useRouter();

        // Check if the current route is the Home page
        const isHomePage = computed(() => route.name === 'Home');

        // Navigate back
        const goBack = () => {
            router.back();
        };

        return {
            isHomePage,
            goBack,
        };
    },
};
</script>

<style scoped>
.header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 1rem;
    background-color: #f8f9fa;
    border-bottom: 1px solid #ddd;
    position: sticky;
    z-index: 10;
    top: 0;
    width: 100%;
}

.back-button {
    position: absolute;
    left: 1rem;
    background: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
}

.nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
}

.nav-item {
    font-size: 1.1rem;
    font-weight: 500;
}
</style>