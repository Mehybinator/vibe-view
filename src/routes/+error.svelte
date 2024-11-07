<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex justify-center items-center">
    <div class="flex sm:flex-row flex-col border p-8 py-28 sm:p-16 text-center items-center rounded">
        <h1 class="text-6xl">{$page.status}</h1>
        <div class="divider divider-vertical sm:divider-horizontal"></div>
        {#if String($page.status).slice(0, 2) == "50" }
            <p>Internal Server Error, Apologies.</p>
        {:else if String($page.status).slice(0, 2) == "40"}
            <p>Unable To Parse Your Request, Maybe The Wrong Webpage? <a class="link link-primary" href="/">Homepage</a></p>
        {/if}
    </div>
</div>