<script setup>
defineProps({
    message: {
        type: String,
    },
});
</script>

<template>
    <div v-show="message">
        <small class="text-xs text-red-500 dark:text-red-300">
            {{ message }}
        </small>
    </div>
</template>
