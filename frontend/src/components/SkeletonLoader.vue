<template>
    <div class="skeleton-loader">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line" v-for="i in 5" :key="i"></div>
    </div>
</template>

<style>
.skeleton-loader {
    padding: 16px;
}

.skeleton {
    position: relative;
    background: #e0e0e0;
    margin: 8px 0;
    border-radius: 4px;
    overflow: hidden;
}

.skeleton::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0));
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}

.skeleton-title {
    height: 24px;
    width: 80%;
}

.skeleton-line {
    height: 16px;
    width: 100%;
}
</style>