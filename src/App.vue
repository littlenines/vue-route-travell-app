<template>
<TheNavigaion />
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import TheNavigaion from "@/components/TheNavigation.vue";
export default {
  components: { TheNavigaion },
};
</script>


