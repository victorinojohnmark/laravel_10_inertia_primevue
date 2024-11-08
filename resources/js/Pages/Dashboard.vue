<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import Container from '@/Components/Container.vue';
import ResponsiveCard from '@/Components/ResponsiveCard.vue';

const pageTitle = 'Dashboard';

const breadcrumbs = [
    { label: 'Dashboard', route: route('dashboard') },
    { label: pageTitle, route: route('welcome') },
    { label: 'List' },
];

</script>

<template>
    <Head title="Dashboard" />
    <AuthenticatedLayout :page-title="pageTitle" :breadcrumbs="breadcrumbs">
        <template #headerOption>
            <div class="flex items-center">
                <!-- left options -->
            </div>
        </template>

        <template #headerEnd>
            <div class="flex gap-2">
                <!-- right options -->
            </div>
        </template>

        
        <ResponsiveCard>
            <p class="m-0">You are logged in!</p>
        </ResponsiveCard>
    </AuthenticatedLayout>
</template>
