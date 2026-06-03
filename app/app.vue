<script>
import Index from './pages/index.vue'

export default {
  components: {
    Index
  }
}
</script>

<template>
  <div>
    <NuxtPage />
    <Appbackground /> <!-- Add the background component here -->
     <div
      class="fixed bottom-4 right-4 z-50 pointer-events-none"
    >
      <img
        src="/images/nil-logobg.png"
        alt="Logo"
        class="w-20 md:w-24 opacity-70"
      />
    </div>
  </div>
</template>