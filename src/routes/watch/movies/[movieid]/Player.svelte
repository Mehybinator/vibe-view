<script lang="ts">
    import 'vidstack/player/styles/default/theme.css';
    import 'vidstack/player/styles/default/layouts/video.css';
    import 'vidstack/player/styles/plyr/theme.css'

    import 'vidstack/player';
    import 'vidstack/player/layouts/default';
    import 'vidstack/player/ui';

	export let id: string;
</script>

<div class="w-4/5 m-auto">
    <media-player src="https://vibeview.storage.iran.liara.space/movies/{id}/master.m3u8">
        <media-provider></media-provider>
        <media-video-layout></media-video-layout>
    </media-player>
</div>