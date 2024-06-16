<template>
    <div class="layout_wrap">
        <Aside />
        <div class="content_wrap">
            <RouterView />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Aside from '../components/Base/BaseAside.vue'
</script>
<style scoped lang='scss'>
.layout_wrap {
    display: flex;
    overflow-x: hidden
}

.content_wrap {
    flex: 1;
    overflow: auto;
}
</style>