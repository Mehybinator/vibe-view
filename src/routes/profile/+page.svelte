<script lang="ts">
    import pb from "$lib/pocketbase";
    import type { RecordModel } from "pocketbase";
    import Card from "../Card.svelte";
    import authStore from "$lib/authStore";
    import { goto } from "$app/navigation";
    import { fly } from "svelte/transition";

    let isScrolling: boolean;
    let list: HTMLDivElement;
    let data: Promise<RecordModel>;
    let passwordModal: HTMLDialogElement;
    let usernameModal: HTMLDialogElement;
    let avatarModal: HTMLDialogElement;

    let password: string;
    let oldPassword: string;
    let passwordConfirm: string;
    
    let username: string;

    let avatar: HTMLInputElement;

    let loading: boolean = false;
    let showMessage: boolean = false;
    let messageType: string = '';
    let message: string = '';

    if(!$authStore){
        goto('/auth');
    }
    else{
        data = pb.collection("users").getOne($authStore.id, {expand: 'liked'});
    }

    function scroll(dir: number){
        if(!isScrolling){
            isScrolling = true;
            list.scrollBy({left:dir*(list.offsetWidth + 10), behavior:"smooth"});
            setTimeout(() => {isScrolling = false}, 500);
        }
    }

    async function changeUsername(){
        if($authStore){
            try{
                loading = true;
                await pb.collection('users').update($authStore.id, {'username': username});
                username = '';
                usernameModal.close();
                showToast('Username Changed Successfuly!', 'alert-success');
            }
            catch({response}){
                showToast(response.data.username.message, 'alert-error');
            }
            finally{
                loading = false;
            }
        }
    }

    async function changeAvatar(){
        if($authStore){
            try{
                loading = true;
                const formData = new FormData();
                formData.append('avatar', avatar.files && avatar.files[0] !== undefined ? avatar.files[0] : '')
                await pb.collection('users').update($authStore.id, formData);
                avatar.value = '';
                avatarModal.close();
                showToast('Avatar Changed Successfuly!', 'alert-success');
            }
            catch({response}){
                showToast(response.data.avatar.message, 'alert-error');
            }
            finally{
                loading = false;
            }
        }
    }

    async function changePassword(){
        if($authStore){
            if(password.length < 7 || password.length > 72){
                showToast('Password Length Not Optimal!', 'alert-warning');
                return;
            }
            else if(password !== passwordConfirm){
                showToast('Passwords Do Not Match!', 'alert-warning');
                return;
            }
            loading = true;
            try{
                loading = true;
                await pb.collection('users').update($authStore.id, {'password': password, 'passwordConfirm': passwordConfirm, 'oldPassword': oldPassword});
                password = '';
                oldPassword = '';
                passwordConfirm = '';
                passwordModal.close();
                showToast('Password Changed Successfuly! Redirecting <span class="loading loading-spinner loading-xs"></span>', 'alert-success');
                setTimeout(() => {
                    goto('/auth')
                }, 1000);
            }
            catch({response}){
                if(response.data.oldPassword){
                    showToast(response.data.oldPassword.message, 'alert-error');
                }
                else if(response.data.password){
                    showToast(response.data.password.message, 'alert-error');
                }
                else if(response.data.passwordConfirm){
                    showToast(response.data.passwordConfirm.message, 'alert-error');
                }
            }
            finally{
                loading = false;
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

{#if $authStore}
    <div class="flex flex-col">
        <div class="flex flex-col justify-between lg:flex-row gap-8 md:gap-0">
            <div class="flex flex-col gap-8 md:flex-row items-center">
                <div class="avatar relative">
                    <div class="w-96 h-96 rounded">
                        {#if $authStore.avatar != ''}
                            <img src="{pb.getFileUrl($authStore, $authStore.avatar)}" alt="">
                        {:else}
                            <i class="fa-solid fa-user fa-10x translate-x-[85%] translate-y-2/3"></i>
                        {/if}
                    </div>
                    <button on:click={() => {avatarModal.showModal()}} class="absolute btn btn-ghost bottom-0 right-0"><i class="fa-solid fa-pen-to-square"></i></button>
                    <dialog bind:this={avatarModal} class="modal">
                        <div class="modal-box">
                            <form method="dialog">
                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <h2 class="text-3xl">Change Avatar</h2>
                            <br>
                            <input bind:this={avatar} type="file" class="file-input file-input-bordered w-full" />
                            <div class="flex justify-end">
                                <button on:click={changeAvatar} class="btn btn-primary mt-6 {loading ? 'btn-disabled' : ''}"><span class="{loading ? 'loading loading-spinner loading-xs inline' : 'hidden'}"></span> {loading ? '' : 'Submit'}</button>
                            </div>
                        </div>
                    </dialog>
    
                </div>
                <div class="flex flex-col justify-center text-center md:text-start">
                    <h2 class="text-5xl">Hello {$authStore.username}!</h2>
                    <br>
                    <p>This Is Your Profile Page; Feel Free To Scout Your Belongings!</p>
                </div>    
            </div>
            <div class="flex flex-col justify-center gap-4">
                <button class="btn" on:click={() => {usernameModal.showModal()}}><i class="fa-solid fa-id-badge"></i> Change Username</button>
                <dialog bind:this={usernameModal} class="modal">
                    <div class="modal-box">
                        <form method="dialog">
                            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h2 class="text-3xl">Change Username</h2>
                        <br>
                        <input bind:value={username} type="text" placeholder="New Username" class="input input-bordered w-full" disabled={loading} required />
                        <div class="flex justify-end">
                            <button on:click={changeUsername} class="btn btn-primary mt-6 {loading ? 'btn-disabled' : ''}"><span class="{loading ? 'loading loading-spinner loading-xs inline' : 'hidden'}"></span> {loading ? '' : 'Submit'}</button>
                        </div>
                    </div>
                </dialog>

                <button class="btn" on:click={() => {passwordModal.showModal()}}><i class="fa-solid fa-signature"></i> Change Password</button>
                <dialog bind:this={passwordModal} class="modal">
                    <div class="modal-box">
                        <form method="dialog">
                            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h2 class="text-3xl">Change Password</h2>
                        <br>
                        <div class="flex flex-col gap-4">
                            <input bind:value={oldPassword} type="password" placeholder="Old Password" class="input input-bordered w-full" disabled={loading} required />
                            <input bind:value={password} type="password" placeholder="New Password" class="input input-bordered w-full" disabled={loading} required />
                            <input bind:value={passwordConfirm} type="password" placeholder="Confirm Password" class="input input-bordered w-full" disabled={loading} required />
                        </div>
                        <div class="flex justify-end">
                            <button  on:click={changePassword} class="btn btn-primary mt-6 {loading ? 'btn-disabled' : ''}"><span class="{loading ? 'loading loading-spinner loading-xs inline' : 'hidden'}"></span> {loading ? '' : 'Submit'}</button>
                        </div>
                    </div>
                </dialog>

            </div>
        </div>
        <div class="flex flex-col rounded border-current border px-16 pb-10 pt-12 relative mb-4 mt-10">
            <div class="flex justify-center">
                <h2 class="absolute top-0 text-4xl -translate-y-6 bg-base-100 px-8">Favorite</h2>
            </div>
            <div class="flex items-center absolute z-[1] bottom-0 top-0 left-0 w-16">
                <button class="bg-gradient-to-r from-base-300 via-base-100 via-20% hover:via-base-200 hover:via-40% h-full w-24 rounded" disabled={isScrolling} on:click={() => scroll(-1)}><i class="fa-solid fa-chevron-left"></i></button>
            </div>
            <div>
                <div bind:this={list} class="flex gap-2 overflow-hidden">
                    {#if $authStore.liked.length > 0}
                        {#await data}
                            <div class="flex flex-col items-center gap-4 w-64">
                                <div class="skeleton h-[22rem] w-full"></div>
                                <div class="skeleton h-8 w-full"></div>
                                <div class="skeleton h-6 w-2/3"></div>
                                <div class="skeleton btn btn-primary w-2/5"></div>
                            </div>        
                        {:then records}
                            {#if records.expand}
                                {#each records.expand.liked as record}
                                    <Card id={record.id} title={record.title} poster={record.vposter} rating={record.rating}/>
                                {/each}
                            {/if}
                        {/await}
                    {:else}
                    <div class="flex justify-center w-full">
                        <h3 class="text-3xl text-center">No Titles In Your Favorite!</h3>
                    </div>
                    {/if}
                    <!-- <Card id={"Big"} title={"Et voluptate nisi irure amet nostrud duis sint officia exercitation dolor. Duis elit anim quis in minim commodo dolore occaecat laboris aliquip eiusmod sit elit minim. Ad aliquip do voluptate irure ut elit occaecat ex officia reprehenderit tempor esse mollit. Aute ea cupidatat nostrud pariatur eu occaecat ullamco ullamco cupidatat elit anim mollit. Dolore magna exercitation ad reprehenderit labore consequat. Velit do consequat labore culpa ad occaecat."} poster={""} rating={6.5}/> -->
                </div>
            </div>
            <div class="flex items-center absolute z-[1] bottom-0 top-0 right-0 w-16">
                <button class="bg-gradient-to-l from-base-300 via-base-100 via-20% hover:via-base-200 hover:via-40% h-full w-24 rounded" disabled={isScrolling} on:click={() => scroll(1)}><i class="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>
    </div>
    {#if showMessage}
        <div class="toast toast-center" transition:fly="{{ y: +20, duration: 300 }}">
            <div class="alert {messageType} gap-0">
                <span>{@html message}</span>
            </div>
        </div>
    {/if}
{/if}