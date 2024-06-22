<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="'发布视频'" width="420" :before-close="handleClose"
            style="border-radius: 8px;">
            <p style="position: absolute;top: 20px;left: 100px;color: #409eff;">当前选中账号: {{
            props.selectedTokenList.length }}个</p>
            <p style="margin-bottom: 8px;color: #f32d22">tip: 表单内所有项均为必填项</p>
            <div v-loading="videoLoing" class="drag_wrap" ref="upload" @click="triggerFileUpload"
                style="margin-bottom: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px dashed #ccc; padding-bottom: 20px; cursor: pointer;">
                <el-icon size="60" class="el-icon--upload"><upload-filled /></el-icon>
                <p>将视频拖入</p>
                <p style="color: #409eff">仅支持'map4','avi','mov','wmv','mkv','webm'格式视频</p>
                <input type="file" ref="fileInput" @change="handleFileChange" accept="video/*" style="display: none;">
            </div>
            <p v-show="form.videos.length < props.selectedTokenList.length && form.videos.length > 0 && !videoLoing"
                style="margin-bottom: 8px;color: #f32d22">
                注意！: 导入视频数量小于选中账号数量，如继续执行可能会存在发布视频重复情况</p>
            <p style="margin-bottom: 20px;color: #409eff;">当前导入视频: {{ form.videos.length }}</p>

            <div style="margin-bottom: 20px;">
                <p style="margin-bottom: 8px;">导入标签</p>
                <div ref="tagInput" style="margin-bottom: 8px;">
                    <el-input v-model="form.tags" :rows="5" type="textarea" placeholder="请输入视频标签，一行一个或拖入txt文件">
                    </el-input>
                </div>
                <p style="color: #409eff;">当前标签数量: {{ tagsLen }}</p>
            </div>

            <div style="margin-bottom: 20px;">
                <p style="margin-bottom: 8px;">标签数量</p>
                <el-input type="number" v-model="form.tagNum" :rows="5" placeholder="请输入标签数量">
                </el-input>
            </div>

            <div style="margin-bottom: 20px;">
                <p style="margin-bottom: 8px;">并发数量</p>
                <el-input type="number" v-model="form.queueNum" :rows="5" placeholder="请输入标签数量">
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
import useDrag from '@/hooks/useDrag'
import { nextTick, ref, computed, defineProps, defineEmits, watch, reactive, getCurrentInstance } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus';
import { convertVideoToBase64, taskQueue, readeFile, getRandomElements } from '@/utils'
const { $api } = getCurrentInstance().proxy
const emits = defineEmits(['handleClose'])
const props = defineProps({
    isShow: {
        type: Boolean,
        default: false
    },
    selectedTokenList: {
        type: Array,
        default: () => []
    }
})
const concurrency = ref(5) // 可配置的并发数量
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
    write: '',
    queueNum: 10
})
const progressData = reactive({
    taskTotal: 0,
    taskProgress: 0,
})
const videosGetter = ref([])
const writeGetter = computed(() => {
    const res = []
    const writeList = form.value.write.split('\n').filter(i => { return i !== '' })
    for (let i = 0; i < writeList.length; i++) {
        const data = { file: writeList[i], canUse: false, idx: i }
        res.push(data)
    }
    return res
})

const tagsLen = computed(() => {
    return form.value.tags.split('\n').filter(i => { return i !== '' }).length
})
const writeLen = computed(() => {
    return form.value.write.split('\n').filter(i => { return i !== '' }).length
})

const handleClose = () => {
    form.value = {
        tags: '',
        videos: [],
        tagNum: '',
        write: '',
        queueNum: 10
    }
    videoLoing.value = false
    progressData.taskProgress = 0
    progressData.taskTotal = 0
    emits('handleClose')
}
const triggerFileUpload = () => {
    fileInput.value.click()
}

const handleConfim = async () => {
    console.log(Number(form.value.tagNum), tagsLen.value)
    if (Number(form.value.tagNum) > tagsLen.value) {
        return ElMessage.warning('导入的标签数量不能小于所配置的标签数量')
    }
    if (form.value.videos.length === 0) {
        return ElMessage.warning('请上传视频')
    }
    if (form.value.tags === '') {
        return ElMessage.warning('请上传标签')
    }
    if (Number(form.value.tagNum) === 0 || form.value.tagNum === '') {
        return ElMessage.warning('请设置标签数量')
    }
    if (Number(form.value.queueNum) === 0 || form.value.queueNum === '') {
        return ElMessage.warning('请设置并发数量')
    }
    if (form.value.write === '') {
        return ElMessage.warning('请上传文案')
    }
    const res = await assemblePackageInfoArr()
    console.log('视频素材组装回调: ', res)
    const videoQueueCb = await videoQueueIntegrate(res)
    console.log('视频任务队列总回调: ', videoQueueCb)
    const successNum = videoQueueCb.filter(i => { return i?.code === 0 })?.length
    const failNum = videoQueueCb.length - successNum
    ElMessage.success(`视频发布完毕，成功${successNum}个账号，失败${failNum}个账号`)
    handleClose()
}

// 视频列队集成
const videoQueueIntegrate = async (requestArr) => {
    const len = requestArr.length
    progressData.taskTotal = len
    let loading = ElLoading.service({ fullscreen: true, text: `视频发布中... \n 请完成后再进行其他操作 \n ${progressData.taskProgress} / ${progressData.taskTotal}` })
    const result = []

    const runBatch = async (batch) => {
        await Promise.all(batch.map(async (task, index) => {
            try {
                const res = await postVideo(task)
                result.push(res)
            } catch (error) {
                console.error(error)
                result.push({})
            }
            progressData.taskProgress++
            loading.setText(`视频发布中... \n 请完成后再进行其他操作 \n ${progressData.taskProgress} / ${progressData.taskTotal}`)
        }))
    }

    for (let i = 0; i < len; i += form.value.queueNum) {
        const batch = requestArr.slice(i, i + form.value.queueNum)
        await runBatch(batch)
    }

    loading.close()
    return result
}

//组装数据  如果包装数据小于选中账号的话，循环去使用   如果只有一个，那就全去用这一个
const assemblePackageInfoArr = async () => {
    const res = []
    let video, tag, write, proxy, token, text

    for (let i = 0; i < props.selectedTokenList.length; i++) {
        video = await getCanUseMaterial('video')
        tag = await getCanUseMaterial('tag')
        write = await getCanUseMaterial('write')
        proxy = getProxyLink(props.selectedTokenList[i])
        token = props.selectedTokenList[i]
        text = tag.reduce((acc, curr) => {
            acc += (curr.trim() + ' ')
            return acc
        }, '')
        text += (' ' + write.trim())
        const postObj = { video, token, proxy, text }
        res.push(postObj)
    }
    return res
}

const getCanUseMaterial = async (type) => {
    const typeMap = {
        'video': videosGetter.value,
        'write': writeGetter.value
    }

    if (type === 'tag') {
        return getRandomElements(form.value.tags.split('\n'), Number(form.value.tagNum))
    } else {
        if (typeMap[type].length === 0) {
            return null
        }
        const canUseItem = typeMap[type].filter(i => { return i.canUse })[0]
        if (!canUseItem) {
            if (typeMap[type][1]) {
                typeMap[type][0].canUse = false
                typeMap[type][1].canUse = true
            } else {
                typeMap[type][0].canUse = true
            }
            return typeMap[type][0].file
        } else {
            const currIdx = canUseItem.idx
            if (typeMap[type][currIdx + 1]) {
                typeMap[type][currIdx + 1].canUse = true
            } else {
                typeMap[type][0].canUse = true
            }
            typeMap[type][currIdx].canUse = false
            return canUseItem.file
        }
    }
}

const postVideo = async (data) => {
    try {
        const res = await $api({ type: 'postVideo', data })
        return res
    } catch (error) {
        console.error(error)
        return {}
    }
}

const getProxyLink = (token) => {
    const acc = localStorage.getItem('tool_proxy_acc')
    const pwd = localStorage.getItem('tool_proxy_pwd')
    const addr = localStorage.getItem('tool_proxy_addr')
    let region = ''
    const uid = token.user.uid
    const searchParams = new URLSearchParams(token?.['common-params'])
    let newObj = {}
    for (let param of searchParams) {
        newObj[param[0]] = param[1]
    }
    const carrier_region = newObj?.carrier_region
    const op_region = newObj?.op_region
    const residence = newObj?.residence
    region = carrier_region || op_region || residence
    return `http://${acc}-zone-custom-region-${region}-session-${uid}-sessTime-30:${pwd}@${addr}`
}

const uploadDragHandlers = useDrag(upload, async (e) => {
    if (videoLoing.value) {
        return ElMessage.warning('请等待视频处理完毕')
    }
    videoLoing.value = true
    const files = Array.from(e.dataTransfer.files)
    const suffixs = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm']
    const filters = files.filter(i => { return i?.name?.split('.')?.length && suffixs.includes(i.name.split('.')[1]) })
    if (filters.length === 0) {
        return ElMessage.warning('没有有效的视频文件')
    }
    const queueNum = 100
    await taskQueue(queueNum, filters, async (files) => {
        let base64String = await convertVideoToBase64(files)
        base64String = base64String.split(',')[1]
        form.value.videos.push(base64String)
        const data = { file: base64String, canUse: false, idx: videosGetter.value.length }
        videosGetter.value.push(data)
    })

    videoLoing.value = false
})

const tagInputDragHandlers = useDrag(tagInput, async (e) => {
    const files = Array.from(e.dataTransfer.files)
    const queueNum = 100
    await taskQueue(queueNum, files, async (files) => {
        const resTxt = await readeFile(files)
        form.value.tags += resTxt.replace(/\r/g, '').split('\n').filter(i => { return i !== '' }).join('\n')
    })
})

const wraiteInputDragHandlers = useDrag(writeInput, async (e) => {
    const files = Array.from(e.dataTransfer.files)
    const queueNum = 100
    await taskQueue(queueNum, files, async (files) => {
        const resTxt = await readeFile(files)
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
