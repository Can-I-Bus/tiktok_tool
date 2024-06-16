<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="'并发控制'" width="420" :before-close="handleClose"
            style="border-radius: 8px;">

            <div class="item">
                <p style="margin-right: 10px;" class="mb8">并发数量: </p>
                <el-input style="width: 300px" placeholder="请输入并发数量" v-model="form.size"></el-input>
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
import { ElMessage } from 'element-plus';
import { ref, reactive, defineProps, defineEmits } from 'vue'
const props = defineProps({
    isShow: Boolean,
})

const emits = defineEmits(['handleClose'])

const loading = ref(false)

const form = reactive({
    size: '100'
})

const handleClose = () => {
    emits('handleClose')
    form.size = ''
    loading.value = false
}

const handleConfim = async () => {
    localStorage.setItem('system_concurrency_size', form.size)
    handleClose()
}

</script>

<style lang="scss" scoped>
.item {
    display: flex;
    align-items: center;
}

.item:first-child {
    margin-bottom: 20px
}
</style>