<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="'发布视频'" width="420" :before-close="handleClose"
            style="border-radius: 8px;">
            <div v-loading="videoLoing" class="drag_wrap" ref="upload" @click="triggerFileUpload"
                style="margin-bottom: 8px;;display: flex;flex-direction: column;align-items: center;justify-content: center;border: 1px dashed #ccc;padding-bottom: 20px;cursor: pointer;">
                <el-icon size="60" class="el-icon--upload"><upload-filled /></el-icon>
                <p>将视频拖入或者点击上传</p>
                <p style="color: #409eff">仅支持'map4','avi','mov','wmv','mkv','webm'格式视频</p>
                <input type="file" ref="fileInput" @change="handleFileChange" accept="video/*" style="display: none;">
            </div>
            <p style="margin-bottom: 30px;color: #409eff;">当前导入视频: {{ form.videos.length }}</p>

            <div style="margin-bottom: 30px;">
                <p style="margin-bottom: 8px;">导入标签</p>
                <div ref="tagInput" style="margin-bottom: 8px;">
                    <el-input v-model="form.tags" :rows="5" type="textarea" placeholder="请输入视频标签，一行一个或拖入txt文件">
                    </el-input>
                </div>
                <p style="color: #409eff;">当前标签数量: {{ tagsLen }}</p>
            </div>

            <div style="margin-bottom: 30px;">
                <p style="margin-bottom: 8px;">标签数量</p>
                <el-input v-model="form.tagNum" :rows="5" placeholder="请输入标签数量">
                </el-input>
            </div>

            <div>
                <p style="margin-bottom: 8px;">导入文案</p>
                <div ref="writeInput" style="margin-bottom: 8px;">
                    <el-input v-model="form.write" :rows="5" type="textarea" placeholder="请输入视频文案，一行一个或拖入txt文件">
                    </el-input>
                </div>
                <p style="color: #409eff;">当前标签数量: {{ writeLen }}</p>
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
import { nextTick, ref, onMounted, computed, defineProps, defineEmits, watch } from 'vue'
import useDrag from '@/hooks/useDrag'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { convertVideoToBase64, taskQueue, readeFile } from '@/utils'

const emits = defineEmits(['handleClose'])
const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    }
})
const videoLoing = ref(false)
const loading = ref(false)
const fileInput = ref(null)
const upload = ref(null)
const tagInput = ref(null)
const writeInput = ref(null)
const form = ref({
    tags: '',
    videos: [],
    tagNum: '',
    write: ''
})

const tagsLen = computed(() => {
    return form.value.tags.split('\n').filter(i => { return i !== '' }).length
})
const writeLen = computed(() => {
    return form.value.write.split('\n').filter(i => { return i !== '' }).length
})

const handleClose = () => {
    emits('handleClose')
}
const triggerFileUpload = () => {
    fileInput.value.click()
}

const handleConfim = () => {
    if (Number(form.value.tagNum) < tagsLen.value) {
        return ElMessage.warning('标签文本数量不能小于标签配置数量')
    }
}

const uploadDragHandlers = useDrag(upload, async (e) => {
    if (videoLoing.value) {
        return ElMessage.warning('请等待视频处理完毕')
    }
    videoLoing.value = true
    const files = Array.from(e.dataTransfer.files)
    console.log('文件被拖放到上传区域', files)
    const suffixs = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm']
    const filters = files.filter(i => { return i?.name?.split('.')?.length && suffixs.includes(i.name.split('.')[1]) })
    if (filters.length === 0) {
        return ElMessage.warning('没有有效的视频文件')
    }
    const queueNum = 100
    await taskQueue(queueNum, filters, async (files) => {
        const base64String = await convertVideoToBase64(files);
        form.value.videos.push(base64String);
    })
    videoLoing.value = false
    console.log(form.value.videos)
})

const tagInputDragHandlers = useDrag(tagInput, async (e) => {
    const files = Array.from(e.dataTransfer.files)
    console.log('文件被拖放到标签输入区域', files)
    const queueNum = 100
    await taskQueue(queueNum, files, async (files) => {
        const resTxt = await readeFile(files);
        form.value.tags += resTxt
    })
})

const wraiteInputDragHandlers = useDrag(writeInput, async (e) => {
    const files = Array.from(e.dataTransfer.files)
    console.log('文件被拖放到标签输入区域', files)
    const queueNum = 100
    await taskQueue(queueNum, files, async (files) => {
        const resTxt = await readeFile(files);

        form.value.write += resTxt.replace(/\r/g, '').split('\n').filter(i => { return i !== '' }).join('\n')
    })
})

const initDragAndDrop = async () => {
    await nextTick()
    uploadDragHandlers.registerListeners()
    tagInputDragHandlers.registerListeners()
    wraiteInputDragHandlers.registerListeners()
}

const removeDragAndDrop = () => {
    uploadDragHandlers.unregisterListeners()
    tagInputDragHandlers.unregisterListeners()
    wraiteInputDragHandlers.unregisterListeners()
}

watch(() => props.isShow, async (newVal) => {
    if (newVal) {
        await initDragAndDrop()
    } else {
        removeDragAndDrop()
    }
})
</script>

<style scoped lang='scss'></style>
