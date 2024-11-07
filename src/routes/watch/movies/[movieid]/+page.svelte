<script lang="ts">
  import { page } from '$app/stores';
  import Player from './Player.svelte';
</script>

<Player id={$page.params.movieid}></Player>