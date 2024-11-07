<script lang="ts">
  export let id: string;
  export let title: string;
  export let poster: string;
  export let rating: number;
</script>

<a
  href="/detail/movies/{id}"
  class="group card card-compact bg-base-100 sm:min-w-64 sm:max-w-64 min-w-full transition-all duration-300 hover:opacity-80 border border-neutral"
>
  <figure>
    <img
      class="group-hover:scale-110 transition-all duration-300"
      src={poster}
      alt="{title} Poster"
    />
  </figure>
  <div class="card-body items-center text-center justify-between">
    <h2 class="card-title">{title}</h2>
    <div class="flex flex-col items-center gap-2">
      <div class="rating">
        <h4>
          Rating: <i
            class="fa-solid fa-star text-orange-400 {rating == 0
              ? '!hidden'
              : ''}"
          ></i>
          {rating == 0 ? "Not Specified" : rating}
        </h4>
      </div>
      <div class="card-actions justify-end">
        <a href="/detail/movies/{id}" class="btn btn-primary">Details</a>
      </div>
    </div>
  </div>
</a>
