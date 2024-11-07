<script lang="ts">
    import type { PageData } from './$types';
	export let data: PageData;
    import Card from '../../Card.svelte';
    let page = 1;
    let perPage = 10;
</script>

<div class="flex flex-col rounded border-current border-2 p-6 pt-12 relative">
    <div class="flex justify-center">
        <h1 class="transition-all absolute top-0 text-4xl -translate-y-6 bg-base-100 px-8">Movies</h1>
    </div>
    <div class="flex flex-wrap justify-center gap-4">
        {#each data.data as record}
            <Card id={record.id} title={record.title} poster={record.vposter} rating={record.rating}/>
            <Card id={record.id} title={record.title} poster={record.vposter} rating={record.rating}/>
            <Card id={record.id} title={record.title} poster={record.vposter} rating={record.rating}/>
            <Card id={record.id} title={record.title} poster={record.vposter} rating={record.rating}/>
            <Card id={record.id} title={record.title} poster={record.vposter} rating={record.rating}/>
            <Card id={record.id} title={record.title} poster={record.vposter} rating={record.rating}/>
            <Card id={record.id} title={record.title} poster={record.vposter} rating={record.rating}/>
            <Card id={record.id} title={record.title} poster={record.vposter} rating={record.rating}/>
            <Card id={record.id} title={record.title} poster={record.vposter} rating={record.rating}/>
            <Card id={record.id} title={record.title} poster={record.vposter} rating={record.rating}/>
        {/each}
    </div>
</div>
<div class="flex pt-6 justify-evenly">
    <div class="join">
        <button class="join-item btn">«</button>
        <button class="join-item btn">Page 1</button>
        <button class="join-item btn">»</button>
      </div>
</div>
