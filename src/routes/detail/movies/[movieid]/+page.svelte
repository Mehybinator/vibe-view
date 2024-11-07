<script lang="ts">
    import Skeleton from './Skeleton.svelte';
    import type { RecordModel } from 'pocketbase';
    import authStore from '$lib/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import pb from '$lib/pocketbase';
    import { fly } from 'svelte/transition';

	let data: RecordModel;
    let loading: boolean = true;
    let liking: boolean = false;
    let showMessage: boolean;
    let message: string;
    let messageType: string;

    onMount(async() => {
        data = await pb.collection('movies').getOne($page.params.movieid, {expand: 'writers, directors, categories, cast, producers'});
        loading = false;
    });

    async function like(){
        if($authStore){
            if($authStore.liked.includes(data.id)){
                try{
                    liking = true;
                    await pb.collection('users').update($authStore.id, {"liked-": data.id});
                    showToast('Removed From Likes!', 'alert-success');
                }
                catch{
                    showToast('Failed To Dislike Title!', 'alert-error');
                }
                finally{
                    liking = false;
                }
            }
            else{
                try{
                    liking = true;
                    await pb.collection('users').update($authStore.id, {"liked+": data.id});
                    showToast('Added To Likes!', 'alert-success');
                }
                catch{
                    showToast('Failed To Like Title!', 'alert-error');
                }
                finally{
                    liking = false;
                }
            }
        }
    }

    function showToast(msg: string, type: string, timeout: boolean = true) {
        message = msg;
        messageType = type;
        showMessage = true;
        if(timeout){
            setTimeout(() => {
                showMessage = false;
            }, 3000);
        }
    }

</script>

{#if loading}
    <Skeleton></Skeleton>
{:else}
    <div class="flex flex-col px-5 xl:flex-row gap-8 text-center xl:text-start items-center xl:items-stretch">
        <img class="w-96" src={data.vposter} alt="Poster">
        <div class="flex flex-col justify-between gap-6 xl:gap-0">
            <div class="flex flex-col md:flex-row border rounded p-6 justify-between gap-4">
                <div class="flex flex-col gap-4">
                    <h1 class="m-0 text-5xl">{data.title}</h1>
                    <div class="flex justify-center md:justify-start flex-row">
                        <p class="m-0 ">PG: {data.pg == 0 ? 'Not Specified' : '+'.concat(data.pg)}</p>
                        <div class="divider divider-horizontal divider-primary"></div>
                        <p class="m-0">Rating: <i class="fa-solid fa-star text-orange-400 {data.rating == 0 ? '!hidden' : ''}"></i> {data.rating == 0 ? 'Not Specified' : data.rating}</p>
                    </div>
                    {#if data.categories.length > 0}
                        <div class="join justify-center md:justify-normal flex-wrap">
                            {#if data.expand}
                                {#each data.expand.categories as category}
                                    <button class="m-0 btn btn-primary btn-outline join-item">{category.name}</button>
                                {/each}
                            {/if}
                        </div>
                    {/if}
                </div>
                <div class="join self-center md:self-start">
                    <button class="m-0 btn btn-secondary {$authStore ? $authStore.liked.includes(data.id) ? '' : 'btn-outline' : 'btn-disabled'} {liking ? 'btn-disabled' : ''} join-item" on:click={like}><i class="{$authStore ? $authStore.liked.includes(data.id) ? 'fa-solid' : 'fa-regular' : 'fa-regular'} {liking ? 'loading loading-spinner loading-xs' : 'fa-heart'}"></i>{$authStore ? '' : 'Login Required'}</button>
                    <a href="/watch/movies/{data.id}" class="m-0 btn btn-info btn-outline join-item"><i class="fa-regular fa-circle-play"></i></a>
                </div>
            </div>
            <p class="text-xl">{data.description}</p>
            <div class="flex flex-col gap-1 xl:flex-row">
                <p class="opacity-80">Released:</p>
                <p class="font-bold">{Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: 'numeric'}).format(new Date(data.release_date))}</p>    
            </div>
            {#if data.writers.length > 0}
                <div class="flex flex-col xl:flex-row justify-center xl:justify-start gap-1">
                    <p class="opacity-80">Writers:</p>
                    <div class="flex flex-row flex-wrap justify-center gap-1">
                        {#if data.expand}
                            {#each data.expand.writers as writer, index}
                                <a href="/detail/people/{writer.id}" class="font-bold link-hover link-primary">{writer.name}{#if index < data.expand.writers.length - 1},{/if}</a>
                            {/each}
                        {/if}
                    </div>
                </div>
            {/if}
            {#if data.directors.length > 0}
                <div class="flex flex-col xl:flex-row justify-center xl:justify-start gap-1">
                    <p class="opacity-80">Directors:</p>
                    <div class="flex flex-row flex-wrap justify-center gap-1">
                        {#if data.expand}
                            {#each data.expand.directors as director, index}
                                <a href="/detail/people/{director.id}" class="font-bold link-hover link-primary">{director.name}{#if index < data.expand.directors.length - 1},{/if}</a>
                            {/each}
                        {/if}
                    </div>
                </div>
            {/if}
            {#if data.cast.length > 0}
                <div class="flex flex-col xl:flex-row justify-center xl:justify-start gap-1">
                    <p class="opacity-80">Cast:</p>
                    <div class="flex flex-row flex-wrap justify-center gap-1">
                        {#if data.expand}
                            {#each data.expand.cast as cast, index}
                                <a href="/detail/people/{cast.id}" class="font-bold link-hover link-primary">{cast.name}{#if index < data.expand.cast.length - 1},{/if}</a>
                            {/each}
                        {/if}
                    </div>
                </div>    
            {/if}
        </div>
    </div>
    {#if showMessage}
        <div class="toast toast-end" transition:fly="{{ y: +20, duration: 300 }}">
            <div class="alert {messageType} gap-0">
                <span>{message}</span>
            </div>
        </div>
    {/if}
{/if}