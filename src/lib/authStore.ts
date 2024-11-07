import { writable } from 'svelte/store';
import pb from './pocketbase';

const authStore = writable(pb.authStore.model);

pb.authStore.onChange(() => {
    authStore.set(pb.authStore.model);
});

export default authStore;