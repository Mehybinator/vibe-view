<script lang="ts">
  import pb from '$lib/pocketbase';
  import authStore from '$lib/authStore';
  import { onMount, onDestroy } from 'svelte';
  import "../app.css";
  import "@fortawesome/fontawesome-free/css/all.css";

  onMount(() => {
    if ($authStore) {
      const userId = $authStore.id;
      pb.collection('users').subscribe(userId, function(){
        pb.collection('users').authRefresh();
        authStore.set(pb.authStore.model);
      });
    }
  });

  onDestroy(() => {
    if($authStore){
      pb.collection('users').unsubscribe($authStore.id);
    }
  });
</script>

<div class="container mx-auto px-10">
    <div class="navbar bg-base-100 mb-6 sticky top-0 z-[2]">
        <div class="navbar-start">
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                <i class="fa-solid fa-bars"></i>
            </div>
            <ul class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded w-52 z-[2] border">
              <li><a href="/">Homepage</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </div>
        </div>
        <div class="navbar-center">
          <a href="/" class="btn btn-ghost text-xl">VibeView</a>
        </div>
        <div class="navbar-end">
          {#if $authStore}
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn">
                <p class="md:block hidden">{$authStore.username}</p>
                <div class="avatar">
                  <div class="w-8 rounded">
                    {#if $authStore.avatar === ""}
                      <i class="fa-solid fa-user translate-y-1/2"></i>
                    {:else}
                      <img src="{pb.files.getUrl($authStore, $authStore.avatar, {'thumb': '44x44'})}" alt="prof">
                    {/if}
                  </div>
                </div>
              </div>
              <ul class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded w-52 z-[2] border">
                <li><a href="/profile">Profile</a></li>
                <li><a href="/auth">Logout</a></li>
              </ul>
            </div>
          {:else}
            <a href="/auth" class="btn">
              <p class="hidden md:block">Login/Signup</p>
              <i class="fa-solid fa-right-to-bracket"></i>
            </a>
          {/if}
        </div>
    </div>
    
    <div class="container">
        <slot/>
    </div>

    <footer class="footer footer-center p-4 bg-base-300 text-base-content mt-6">
        <aside>
          <p>Copyright © 2024 - All right reserved by Gelatin Corp</p>
        </aside>
    </footer>
</div>