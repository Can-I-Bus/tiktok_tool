<template>
  <RouterView />
</template>

<script setup>
import { ref, onMounted } from 'vue'
onMounted(() => {
  if (!localStorage.getItem('system_concurrency_size')) {
    localStorage.setItem('system_concurrency_size', 20)
  }
})
</script>
<style lang='scss'>
.el-dialog {
  display: flex !important;
  flex-direction: column !important;
  margin: 0 !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  // overflow-y: scroll !important;
  max-height: 100vh !important;
}
</style>