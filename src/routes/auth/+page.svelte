<script lang="ts">
    import pb from '$lib/pocketbase';
    import authStore from '$lib/authStore';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    
    let username: string = '';
    let password: string = '';
    let passwordConfirm: string = '';
    
    let message: string = '';
    let loading: boolean = false;
    let signup: boolean = false;
    let showMessage: boolean = false;
    let messageType: string = '';

    onMount(() => {
        if($authStore){
            pb.collection('users').unsubscribe($authStore.id);
        }
        pb.authStore.clear()
    });

    async function login() {
        try {
            loading = true;
            let user = await pb.collection('users').authWithPassword(username, password);
            pb.collection('users').subscribe(user.record.id, function(){
                pb.collection('users').authRefresh();
                authStore.set(pb.authStore.model);
            });
            showToast('Login Succesful! Redirecting <span class="loading loading-spinner loading-xs"></span>', 'alert-success', false);
            setTimeout(() => {
                goto('/')
            }, 1000);
        } catch (err) {
            showToast('Login failed. Please check your credentials.', 'alert-error');
        } finally {
            loading = false;
        }
    }

    async function signUp() {
        if (password !== passwordConfirm) {
            showToast('Passwords do not match.', 'alert-warning');
            return;
        }

        if (password.length < 8) {
            showToast('Password too short.', 'alert-warning');
            return;
        }
        else if(password.length > 72){
            showToast('Password too long.', 'alert-warning');
            return;
        }

        try {
            loading = true;
            const data = {
                username: username,
                password: password,
                passwordConfirm: password,
            };
            await pb.collection('users').create(data);
            showToast('Signup Succesful', 'alert-success');
            await login();
        } catch ({response}) {
            if(response.data.username){
                showToast(response.data.username.message, 'alert-error');
            }
            else if(response.data.password){
                showToast(response.data.password.message, 'alert-error');
            }
        } finally {
            loading = false;
        }
    }

    function handleSubmit() {
        message = ''; // Clear previous error messages
        if (signup) {
            signUp();
        } else {
            login();
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

<div class="flex justify-center">
    <form class="flex flex-col w-full sm:w-1/2 gap-2" on:submit|preventDefault={handleSubmit}>
        <input type="text" placeholder="Username" class="input input-bordered text-center" bind:value={username} required />
        <input type="password" placeholder="Password" class="input input-bordered text-center {!signup ? '' : password.length > 7 ? 'input-success' : 'input-error'}" bind:value={password} required />
        {#if signup}
            <input type="password" placeholder="Confirm Password" class="input input-bordered text-center {passwordConfirm.length > 7 ? 'input-success' : 'input-error'}" bind:value={passwordConfirm} 
                transition:fly="{{ y: -20, duration: 300 }}" required />
            <p class="text-center opacity-80 text-sm" transition:fly="{{ y: -20, duration: 300 }}">Password must be between 8 and 72 characters</p>
        {/if}
        <button class="btn w-1/3 m-auto mt-4" type="submit" disabled={loading}>
            {#if loading}
                <span class="loading loading-spinner loading-xs"></span>
            {/if}
            {signup ? 'Signup' : 'Login'}
        </button>
        <p class="text-center">{signup ? 'Have An Account?' : 'No Account?'} 
            <button type="button" class="link link-primary" on:click={() => {signup = !signup}}>{signup ? 'Login' : 'Signup'}</button>
        </p>
    </form>
    {#if showMessage}
        <div class="toast toast-center" transition:fly="{{ y: +20, duration: 300 }}">
            <div class="alert {messageType} gap-0">
                <span>{@html message}</span>
            </div>
        </div>
    {/if}
</div>