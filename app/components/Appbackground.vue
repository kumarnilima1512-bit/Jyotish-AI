<template>
  <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <!-- Video background -->
    <video
      autoplay
      loop
      muted
      playsinline
      class="absolute inset-0 w-full h-full object-cover"
      style="opacity: 0.55; transform: scale(1.3); transform-origin: center center;"
    >
      <source src="/videos/bg.mp4" type="video/mp4"/>
    </video>

    <!-- Dark overlay so text stays readable -->
    <div class="absolute inset-0 bg-[#07070f]/55"/>
  </div>
</template>