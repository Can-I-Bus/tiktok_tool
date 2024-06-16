<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="'账号收藏'" width="420" :before-close="handleClose"
            style="border-radius: 8px;">

            <div class="content">
                <!-- <div>
                    <p>选择博主分类</p>
                    <el-select>
                        <el-option v-for="item in props.categoryList"></el-option>
                    </el-select>
                </div> -->
                <div>
                    <p>单号点赞收藏数量(个)</p>
                    <el-input class="mb8" v-model="form.startNum" placeholder="输入单号点赞收藏个数" />
                </div>
                <div>
                    <p>导入博主UID</p>
                    <el-input @dragover="handleDragOver" @drop="handleDrop" class="mb8" v-model="form.uid" :rows="5"
                        type="textarea" placeholder="将需要采集的博主txt文件拖入或手动输入，一行一个" />
                    <p style="color: #409eff">博主数量：{{ form.uid === '' ? 0 : form.uid.split('\n').length }}个</p>
                </div>

                <div>
                    <p>博主国家</p>
                    <el-input class="mb8" v-model="form.code" :rows="5" type="textarea" placeholder="输入国家代码，用空格隔开" />
                </div>

                <div>
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
import { ref, reactive, defineProps, defineEmits } from 'vue'
const props = defineProps({
    isShow: Boolean,
    categoryList: Array
})

const emits = defineEmits(['handleClose'])

const loading = ref(false)

const form = reactive({
    startNum: '',
    uid: '',
    code: '',
    min: '',
    max: ''
})

const handleDragOver = (event) => {
    event.preventDefault();
}

const handleDrop = async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const fileList = Array.from(files); // 将文件列表转换为数组
    // const filePaths = fileList.map(file => file.path); // 获取文件路径
    await handleFileList(fileList);
}

const handleFileList = async (fileList) => {
    console.log(fileList);
    fileList.forEach(async i => {
        const res = await readeFile(i)
        form.uid += '\n'
        form.uid += res
        form.uid = form.uid.replace(/^\s*[\r\n]/gm, '')
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

const handleClose = () => {
    emits('handleClose')
    form.startNum = ''
    form.uid = ''
    form.code = ''
    form.min = ''
    form.max = ''
    loading.value = false
}

const handleConfim = async () => {
    console.log(form)
}

</script>

<style lang="scss" scoped>
.mb8 {
    margin-bottom: 8px;
}

.content {
    >div {
        margin-bottom: 20px;

        p:nth-of-type(1) {
            margin-bottom: 8px;
        }
    }
}
</style>