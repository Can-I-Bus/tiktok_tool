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

/* 隐藏 Chrome, Safari, Edge 上的上下箭头 */
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 隐藏 Firefox 上的上下箭头 */
input[type=number] {
  -moz-appearance: textfield;
}
</style>