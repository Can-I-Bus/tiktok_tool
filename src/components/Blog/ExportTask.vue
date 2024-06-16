<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="'导出任务'" width="300" :before-close="handleClose"
            style="border-radius: 8px;">

            <div class="item">
                <p class="mb8">选择导出数据类型：</p>
                <el-select v-model="taskVal" placeholder="选择类型">
                    <el-option v-for="item in taskOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">
                        取消
                    </el-button>
                    <el-button :loading="loading" type="primary" @click="handleConfim">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import axios from 'axios'
import { ElMessage } from 'element-plus';
import { ref, getCurrentInstance, defineProps, defineEmits } from 'vue'
const { $api } = getCurrentInstance().proxy

const props = defineProps({
    isShow: Boolean,
    uidList: Array
})

const emits = defineEmits(['handleClose'])

const taskOptions = ref([
    { label: '粉丝列表', value: 1 },
    { label: '关注列表', value: 2 },
    { label: '全部', value: 0 },
])

const loading = ref(false)

const taskVal = ref(1)

const handleClose = () => {
    emits('handleClose')

    loading.value = false
}

const handleConfim = async () => {
    try {
        const data = {
            uids: props.uidList,
            export_type: taskVal.value
        }
        axios({
            url: 'http://localhost:9000/tiktok/export_spider_data',
            method: 'POST',
            responseType: 'blob',
            data
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'task_data.xls');
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            handleClose()

        }).catch((error) => {
            console.error('Download error:', error);
        })

    } catch (error) {
        console.error(error);
    }

}

</script>

<style lang="scss" scoped>
.item:first-child {
    margin-bottom: 20px
}

.item:nth-of-type(2) {
    margin-bottom: 20px;
}

.mb8 {
    margin-bottom: 10px;
}
</style>