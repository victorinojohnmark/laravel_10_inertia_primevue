<template>
    <Message v-if="usePage().props.flash.success" class="mb-6" severity="success" closable>{{ usePage().props.flash.success }}</Message>
    <Message v-if="usePage().props.flash.info" class="mb-6" severity="info" closable>{{ usePage().props.flash.info }}</Message>
    <Message v-if="usePage().props.flash.warning" class="mb-6" severity="warn" closable>{{ usePage().props.flash.warning }}</Message>
    <Message v-if="usePage().props.flash.danger" class="mb-6" severity="error" closable>{{ usePage().props.flash.danger }}</Message>
    <Message v-if="usePage().props.flash.error" class="mb-6" severity="error" closable>{{ usePage().props.flash.error }}</Message>
</template>

<script setup>
import { usePage } from '@inertiajs/vue3';
const props = defineProps({
    flash: {
        type: Object,
        default: () => ({}),
    },
})
</script>