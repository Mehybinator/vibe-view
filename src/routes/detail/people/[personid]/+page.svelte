<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import pb from '$lib/pocketbase';
	export let data;

    let loading = true;

    onMount(async() => {
        data = await pb.collection('people').getOne($page.params.personid);
        loading = false;
    });
</script>

{#if loading}
    <div class="flex flex-col lg:flex-row gap-8 items-center">
        <div class="flex flex-col items-center gap-8">
            <div class="avatar">
                <div class="skeleton w-96 rounded">
                </div>
            </div>
            <div class="skeleton h-8 w-48"></div>
        </div>
        <div class="skeleton h-24 w-full"></div>
    </div>
{:else}
    <div class="flex flex-col lg:flex-row gap-8 items-center">
        <div class="flex flex-col items-center gap-8">
            <div class="avatar">
                <div class="w-96 rounded">
                    <img src="{data.image}" alt="{data.name}">
                </div>
            </div>
            <h2 class="text-xl">{data.name}</h2>
        </div>
        <p>{data.bio}</p>
    </div>
{/if}
