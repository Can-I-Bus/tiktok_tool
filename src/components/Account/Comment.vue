<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="'账号评论'" width="420" :before-close="handleClose"
            style="border-radius: 8px;">
            <span style="position: absolute;top: 44px;color: #409eff;font-size: 12px">tip: 除博主国家与粉丝范围外，其他配置项必填</span>
            <div class="content" style="margin-top: 10px;">
                <div>
                    <p>选择博主分类</p>
                    <el-select placeholder="选择分类" v-model="form.category">
                        <el-option v-for="item in categoryList" :key="item.id" :label="item.class_name"
                            :value="item.id" />
                    </el-select>
                </div>

                <!-- <div @dragover="handleDragOver" @drop="e => handleDrop('uid', e)">
                    <p>导入博主UID</p>
                    <el-input class="mb8" v-model="form.uid" :rows="4" type="textarea"
                        placeholder="将博主uid txt文件拖入或手动输入，一行一个" />
                    <p style="color: #409eff">博主数量：{{ form.uid === '' ? 0 : form.uid.split('\n').length }}个</p>
                </div> -->

                <div>
                    <p>博主国家</p>
                    <el-input class="mb8" v-model="form.code" :rows="4" type="textarea" placeholder="输入国家代码，用空格隔开" />
                </div>

                <div>
                    <p>评论话术</p>
                    <el-input @dragover="handleDragOver" @drop="e => handleDrop('comment', e)" class="mb8"
                        v-model="form.comment" :rows="4" type="textarea" placeholder="将评论话术txt文件拖入或手动输入，一行一个" />
                    <p style="color:#409eff">话术数量：{{ form.comment === '' ? 0 : form.comment.split('\n').length }}个</p>

                </div>

                <div>
                    <p>监控频率(分)</p>
                    <el-input class="mb8" v-model="form.watch" placeholder="输入监控频率" />
                </div>

                <div style="display: flex;justify-content: space-between">
                    <div>
                        <p>单视频评论次数</p>
                        <el-input v-model="form.commentTime" placeholder="输入单视频评论次数"></el-input>
                    </div>
                    <div>
                        <p>失败换号重试(次)</p>
                        <el-input v-model="form.repeatTime" placeholder="输入失败次数"></el-input>
                    </div>
                </div>

                <div style="display: flex;justify-content: space-between">
                    <div>
                        <p>单号评论次数</p>
                        <el-input v-model="form.accCommentTime" placeholder="输入单号评论次数"></el-input>
                    </div>
                    <div>
                        <p>单号评论间隔(次)</p>
                        <el-input v-model="form.accInterTime" placeholder="输入单号评论间隔"></el-input>
                    </div>
                </div>

                <div style="margin-bottom: 0px;">
                    <p>粉丝范围</p>
                    <div style="display: flex;justify-content: space-between;align-items: center;">
                        <el-input style="width: 180px" class="mb8" v-model="form.min" placeholder="输入最小值" />
                        -
                        <el-input style="width: 180px" class="mb8" v-model="form.max" placeholder="输入最大值" />
                    </div>

                </div>

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
import { ref, reactive, defineProps, defineEmits, watch, getCurrentInstance } from 'vue'

const { $api } = getCurrentInstance().proxy

const props = defineProps({
    isShow: Boolean,
    selectArr: Array,
})

watch(() => props.isShow, (val) => {
    if (val) {
        getBlogCategoryList()
    }
})

const emits = defineEmits(['handleClose'])

const loading = ref(false)

let form = reactive({
    uid: '',
    code: '',
    comment: '',
    watch: '',
    min: '',
    max: '',
    accCommentTime: '',
    accInterTime: '',
    repeatTime: '',
    commentTime: '',
    category: ''
})

const categoryList = ref([])

const handleClose = () => {
    emits('handleClose')
    form = {
        uid: '',
        code: '',
        comment: '',
        watch: '',
        min: '',
        max: '',
        accCommentTime: '',
        accInterTime: '',
        repeatTime: '',
        commentTime: '',
        category: ''
    }
    categoryList.value = []
    loading.value = false
}

//获取博主分类列表
const getBlogCategoryList = async () => {
    try {
        const res = await $api({ type: 'fetchBlogCategoryList', data: {} })
        if (res.code === 0) {
            categoryList.value = res?.class_list ?? []
        }
    } catch (error) {
        console.error(error);
    }
}

const handleDragOver = (event) => {
    event.preventDefault();
}

const handleDrop = async (type, event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const fileList = Array.from(files); // 将文件列表转换为数组
    // const filePaths = fileList.map(file => file.path); // 获取文件路径
    await handleFileList(fileList, type);
}

const handleFileList = async (fileList, type) => {
    console.log(fileList, type);
    fileList.forEach(async i => {
        const res = await readeFile(i)
        if (type === 'uid') {
            form.uid += '\n'
            form.uid += res
            form.uid = form.uid.replace(/^\s*[\r\n]/gm, '')
        } else if (type === 'comment') {
            form.comment += '\n'
            form.comment += res
            form.comment = form.comment.replace(/^\s*[\r\n]/gm, '')
        }
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

const handleConfim = async () => {
    if (form.category === '') {
        return ElMessage.warning('请选择博主分类')
    }
    if (form.comment === '') {
        return ElMessage.warning('请输入评论话术')
    }
    if (form.watch === '') {
        return ElMessage.warning('请输入监控频率')
    }
    if (form.commentTime === '') {
        return ElMessage.warning('请输入单视频评论次数')
    }
    if (form.repeatTime === '') {
        return ElMessage.warning('请输入失败换号重试次数')
    }
    if (form.accCommentTime === '') {
        return ElMessage.warning('请输入单号评论次数')
    }
    if (form.accInterTime === '') {
        return ElMessage.warning('请输入单号评论间隔')
    }
    loading.value = true
    const uniqueIdList = props.selectArr.reduce((acc, curr) => {
        acc.push(curr.unique_id.trim())
    }, [])

    const commentList = form.comment.split('\n').map(i => i.replace('\r', ''))

    const data = {
        "unique_ids": uniqueIdList,
        "follower_min": Number(form.min),
        "follower_max": Number(form.max),
        "monitor_interval": Number(form.watch),
        "comment_content": commentList,
        "aweme_comment_count": Number(form.commentTime),
        "user_comment_count": Number(form.accCommentTime),
        "user_comment_interval": Number(form.accInterTime),
        "failed_change_retry_count": Number(form.repeatTime)
    }
    console.log(data)
    try {
        const res = $api({ type: 'createCommentTask', data })
        if (res.code === 0) {
            ElMessage.success('创建成功')
            handleClose()
        } else {
            ElMessage.error(res?.message ?? '创建失败')
        }
    } catch (error) {
        console.error(error);
        ElMessage.error(error.message)
    } finally {
        loading.value = false
    }
}

</script>

<style lang="scss" scoped>
.mb8 {
    margin-bottom: 8px;
}

.content {
    >div {
        margin-bottom: 16px;

        p:nth-of-type(1) {
            margin-bottom: 8px;
        }
    }
}
</style>