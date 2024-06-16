<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="'导入Token'" width="420" :before-close="handleClose"
            style="border-radius: 8px;">

            <div @dragover="handleDragOver" @drop="handleDrop">
                <p style="margin-bottom: 10px;">账号token</p>
                <el-input style="margin-bottom: 10px;" class="mb8" v-model="form.token" :rows="8" type="textarea"
                    placeholder="将token文件拖入或手动输入，一行一个" />
                <p style="color: #409eff">token数量：{{ form.token === '' ? 0 : form.token.split('\n').length }}个</p>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">
                        取消
                    </el-button>
                    <el-button :loading="loading" type="primary" @click="importToken">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, defineProps, defineEmits, getCurrentInstance } from 'vue'
const { $api } = getCurrentInstance().proxy
const props = defineProps({
    isShow: Boolean,
})

const emits = defineEmits(['handleClose'])

const loading = ref(false)

const form = reactive({
    token: ''
})

const handleClose = () => {
    emits('handleClose')
    form.token = ''
    loading.value = false
}

const handleDragOver = (event) => {
    event.preventDefault();
}

const handleDrop = async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const fileList = Array.from(files); // 将文件列表转换为数组
    await handleFileList(fileList);
}

const handleFileList = async (fileList) => {
    fileList.forEach(async i => {
        const res = await readeFile(i)
        form.token += '\n'
        form.token += res
        form.token = form.token.replace(/^\s*[\r\n]/gm, '')
    })
}

const readeFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target.result);
        };
        reader.onerror = function (event) {
            reject(event.target.error);
        };
        reader.readAsText(file);
    });
}

const importToken = async () => {
    try {
        loading.value = true
        console.log(form.token.split('\n').filter(i => { return i !== '' }).map(i => JSON.parse(i.replace(/[^\x20-\x7E\u4E00-\u9FFF]+/g, ""))), '=====')
        const data = {
            tokens: form.token.split('\n').filter(i => { return i !== '' }).map(i => JSON.parse(i.replace(/[^\x20-\x7E\u4E00-\u9FFF]+/g, "")))
        }
        const res = await $api({ type: 'importToken', data })
        if (res.code === 0) {
            ElMessage.success('导入成功')
            localStorage.setItem('server_concurrency_size', Math.floor(res.total / 2))
            handleClose()
        } else {
            ElMessage.error(res?.message ?? '导入失败')
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false
    }
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