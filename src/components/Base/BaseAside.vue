<template>
    <el-menu active-text-color="#409eff" background-color="#f2f2f2" text-color="#303133" :default-active="activeIndex"
        class="aside" @select="handleSelect" :collapse="isCollapse" router>

        <el-menu-item index="/index">
            <el-icon>
                <HomeFilled />
            </el-icon>
            <span slot="title">仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/account">
            <el-icon>
                <User />
            </el-icon>
            <span slot="title">账号使用</span>
        </el-menu-item>
        <el-menu-item index="/collection">
            <el-icon>
                <Tools />
            </el-icon>
            <span slot="title">数据采集</span>
        </el-menu-item>
    </el-menu>

</template>

<script setup>
import {
    HomeFilled,
    Tools,
    User
} from '@element-plus/icons-vue'
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const isCollapse = ref(false);
const route = useRoute();
const router = useRouter();
const activeIndex = ref('/index');

const handleSelect = (key) => {
    activeIndex.value = key;
};

const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
    console.log(isCollapse.value)
};

watch(route, (to) => {
    activeIndex.value = to.path;
    localStorage.setItem('aside_active', activeIndex.value)
});

onMounted(() => {
    if (localStorage.getItem('aside_active')) {
        activeIndex.value = localStorage.getItem('aside_active')
        router.push(activeIndex.value)
    }
})

</script>

<style>
.aside {
    height: 100vh;
}
</style>