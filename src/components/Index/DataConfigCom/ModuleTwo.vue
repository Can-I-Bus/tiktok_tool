<template>
    <div>
        <div class="config_wrap">
            <div style="display: flex;align-items: center;margin-bottom: 20px">
                <span style="margin-right: 42px;">统计时间(小时): </span>
                <el-input placeholder="输入统计时间" v-model="from.time" style="width: 120px;"></el-input>

            </div>
            <div style="display: flex;align-items: center;margin-bottom: 20px">
                <span style="margin-right: 80px;">涨粉大于: </span>
                <el-input placeholder="输入涨粉配置" v-model="from.fans" style="width: 120px;"></el-input>

            </div>

            <div style="display: flex;justify-content: flex-end;">
                <el-button :disabled="props.categoryId === '' || props.categoryId === undefined"
                    @click="setExplosiveAccConfig" :loading="loading">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { removeEmptyValues } from '@/utils'
import { ref, reactive, onMounted, defineExpose, getCurrentInstance, defineProps } from 'vue'
const { $api } = getCurrentInstance().proxy

const props = defineProps({
    categoryId: {
        type: Number
    }
})

const from = reactive({
    time: '',
    fans: ''
})

const loading = ref(false)

const clearFrom = () => {
    from.time = ''
    from.fans = ''
}

const fetchExplosiveAccConfig = async (data = { class_id: props.categoryId }) => {
    try {
        loading.value = true
        const res = await $api({ type: 'fetchExplosiveAccConfig', data })
        if (res.code === 0) {
            from.time = res?.data?.growth_period_hours ?? ''
            from.fans = res?.data?.growth_count ?? ''
        }
        loading.value = false
    } catch (error) {
        loading.value = false
        console.error(error);
    }
}

const setExplosiveAccConfig = async () => {
    try {
        loading.value = true
        const data = {
            "class_id": props.categoryId,
            "growth_count": Number(from.fans),
            "growth_period_hours": Number(from.fans)
        }
        const postData = removeEmptyValues(data)
        const res = await $api({ type: 'setExplosiveAccConfig', data: postData })
        if (res.code === 0) [
            ElMessage.success('配置成功')
        ]
        loading.value = false
    } catch (error) {
        loading.value = false
        console.error(error);
    }
}


defineExpose({
    clearFrom,
    fetchExplosiveAccConfig
})
</script>
<style scoped lang='scss'>
.config_wrap {
    padding: 10px;
    background-color: rgba(243, 245, 250, 1);
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
}
</style>