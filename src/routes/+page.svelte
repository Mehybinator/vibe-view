<script lang="ts">
    import { onMount } from 'svelte';
    import type { RecordModel, ListResult } from 'pocketbase';
    import pb from '$lib/pocketbase';
	  let data: ListResult<RecordModel>;
    import Card from './Card.svelte';

    let list: HTMLDivElement;
    let isScrolling: boolean;
    let shouldCenter: string = "justify-center";

    let loading: boolean = true;

    function scroll(dir: number){
        if(!isScrolling){
            isScrolling = true;
            list.scrollBy({left:dir*(list.offsetWidth + 8), behavior:"smooth"});
            setTimeout(() => {isScrolling = false}, 500);
        }
    }
    
    onMount(async() => {
        data = await pb.collection('movies').getList(1, 10, {sort: '-created'});

        if(data.totalItems == 1){
            shouldCenter = "sm:justify-center";
        }
        else if(data.totalItems == 2){
            shouldCenter = "md:justify-center";
        }
        else if(data.totalItems == 3){
            shouldCenter = "lg:justify-center";
        }
        else if(data.totalItems == 4){
            shouldCenter = "xl:justify-center";
        }
        else if(data.totalItems == 5){
            shouldCenter = "2xl:justify-center";
        }
        else{
            shouldCenter = "";
        }
        loading = false;
    });

</script>

<div class="flex flex-col rounded border-current border px-16 pb-10 pt-12 relative mb-10">
    <div class="flex justify-center">
        <a href="/full/movies" class="hover:text-primary transition-all absolute top-0 text-4xl -translate-y-6 bg-base-100 px-8">Movies</a>
    </div>
    <div class="flex items-center absolute z-[1] bottom-0 top-0 left-0 w-16">
        <button class="bg-gradient-to-r from-base-300 via-base-100 via-20% hover:via-base-200 hover:via-40% h-full w-24 rounded" disabled={isScrolling} on:click={() => scroll(-1)}><i class="fa-solid fa-chevron-left"></i></button>
    </div>
    <div>
        <div bind:this={list} class="flex gap-2 overflow-hidden {shouldCenter}">
            {#if loading}
                <div class="flex flex-col items-center gap-4 w-64">
                    <div class="skeleton h-[22rem] w-full"></div>
                    <div class="skeleton h-8 w-full"></div>
                    <div class="skeleton h-6 w-2/3"></div>
                    <div class="skeleton btn btn-primary w-2/5"></div>
                </div>
            {:else}
                {#each data.items as record}
                    <Card id={record.id} title={record.title} poster={record.vposter} rating={record.rating}/>
                {/each}
            {/if}
        </div>
    </div>
    <div class="flex items-center absolute z-[1] bottom-0 top-0 right-0 w-16">
        <button class="bg-gradient-to-l from-base-300 via-base-100 via-20% hover:via-base-200 hover:via-40% h-full w-24 rounded" disabled={isScrolling} on:click={() => scroll(1)}><i class="fa-solid fa-chevron-right"></i></button>
    </div>
</div>
