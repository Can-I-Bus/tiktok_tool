<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="`包装账号`" width="520" :before-close="handleClose"
            style="border-radius: 8px;">
            <p style="position: absolute;top: 22px;left: 100px;color: #409eff">当前包装账号: {{ props.selectArr.length }}个</p>
            <p v-show="loading" style="text-align: center;margin-bottom: 14px">包装进度: {{ progressData.packageTaskTotal +
            ' / ' + progressData.packageTaskProgress }}...</p>
            <p v-show="loading" style="text-align: center;margin-bottom: 14px">tip: 任务总量 = 选中账号 * 需包装项 <br />
                (如选中10个账号，包装头像 + 简介，则任务总量为20)</p>
            <div v-loading="loading" class="content">
                <div @dragover="handleDragOver" @drop="e => handleDrop('avatar', e)">
                    <p>包装头像</p>
                    <img class="mb8" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
                    <p style="font-size: 12px;color: #f32d22" class="mb8">将头像拖入即可</p>
                    <p style="color: #409eff">头像数量：{{ avatarList.length }}个</p>
                </div>

                <div @dragover="handleDragOver" @drop="e => handleDrop('nickName', e)">
                    <p>包装昵称</p>
                    <el-input class="mb8" v-model="form.nickName" :rows="5" type="textarea"
                        placeholder="将包装昵称txt文件拖入或手动输入，一行一个" />
                    <p style="color: #409eff">昵称数量：{{ nickNameLen }}个</p>
                </div>

                <div @dragover="handleDragOver" @drop="e => handleDrop('desc', e)">
                    <p>包装简介</p>
                    <el-input class="mb8" v-model="form.desc" :rows="5" type="textarea"
                        placeholder="将包装简介txt文件拖入或手动输入，一行一个" />
                    <p style="color: #409eff">简介数量：{{ descLen }}个</p>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">
                        取消
                    </el-button>
                    <el-button :loading="loading" type="primary" @click="packageAction">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, defineProps, defineEmits, getCurrentInstance, computed } from 'vue'
import { removeEmptyValues } from '@/utils'
const { $api } = getCurrentInstance().proxy

const props = defineProps({
    isShow: Boolean,
    tokenList: Array,
    selectArr: Array,
    selectedTokenList: Array
})

const emits = defineEmits(['handleClose'])

const loading = ref(false)

const avatarList = ref([])

const form = reactive({
    nickName: '',
    desc: ''
})

const progressData = reactive({
    packageTaskTotal: 0,
    packageTaskProgress: 0
})

const avatarGetter = ref([])

const nicknameGetter = ref([])

const descGetter = ref([])

const nickNameLen = computed(() => {
    let nicknameList = []
    const hasNewline = form.nickName.includes('\n');
    const hasCarriageReturn = form.nickName.includes('\r');

    if (hasNewline) {
        nicknameList = form.nickName.split('\n')
    } else if (hasCarriageReturn) {
        nicknameList = form.nickName.split('\r')
    }
    return nicknameList.length
})

const descLen = computed(() => {
    let descList = []
    const hasNewline = form.desc.includes('\n');
    const hasCarriageReturn = form.desc.includes('\r');

    if (hasNewline) {
        descList = form.desc.split('\n')
    } else if (hasCarriageReturn) {
        descList = form.desc.split('\r')
    }
    return descList.length
})

const handleDragOver = (event) => {
    event.preventDefault();
}

const handleDrop = async (type, event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const fileList = Array.from(files); // 将文件列表转换为数组
    await handleFileList(fileList, type);
}

const handleFileList = async (fileList, type) => {
    console.log(fileList, type);
    if (type === 'avatar') {
        avatarList.value.push(...fileList)
        for (let i = 0; i < fileList.length; i++) {
            const file = await fileToBase64(fileList[i])
            const data = { file, canUse: false, idx: avatarGetter.value.length }
            console.log(data, '=======')
            avatarGetter.value.push(data)
        }
        return
    }
    fileList.forEach(async i => {
        const res = await readeFile(i)
        console.log(res, '=====')
        if (type === 'nickName') {
            form.nickName += '\n'
            form.nickName += res
            form.nickName = form.nickName.replace(/^\s*[\r\n]/gm, '')


        } else if (type === 'desc') {
            form.desc += '\n'
            form.desc += res
            form.desc = form.desc.replace(/^\s*[\r\n]/gm, '')

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

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            const base64String = reader.result.split(",")[1];
            resolve(base64String);
        };
        reader.onerror = function () {
            reject(new Error("Failed to load file"));
        };
    });
}

const handleClose = () => {
    emits('handleClose')
    form.nickName = ''
    form.desc = ''
    loading.value = false
    avatarList.value = []
    nicknameGetter.value = []
    descGetter.value = []
    avatarGetter.value = []
    progressData.packageTaskProgress = 0
    progressData.packageTaskTotal = 0
}


//包装账号集成
const packageAction = async () => {
    loading.value = true
    let nicknameList = []
    let descList = []
    const hasNewline = form.nickName.includes('\n');
    const hasCarriageReturn = form.nickName.includes('\r');

    const descHasNewline = form.desc.includes('\n');
    const descHasCarriageReturn = form.desc.includes('\r');

    if (hasNewline) {
        nicknameList = form.nickName.split('\n')
    } else if (hasCarriageReturn) {
        nicknameList = form.nickName.split('\r')
    }
    console.log(nicknameList, '=======')

    if (descHasNewline) {
        descList = form.desc.split('\n')
    } else if (descHasCarriageReturn) {
        descList = form.desc.split('\r')
    }
    console.log(descList, '=======')

    for (let i = 0; i < nicknameList.length; i++) {
        const data = { file: nicknameList[i], canUse: false, idx: i }
        console.log(data, '=======')
        nicknameGetter.value.push(data)
    }

    for (let i = 0; i < descList.length; i++) {
        const data = { file: descList[i], canUse: false, idx: i }
        console.log(data, '=======')
        descGetter.value.push(data)
    }

    //获取包装账号数据数组
    const requestArr = await assemblePackageInfoArr()
    console.log(' request数据:  ', requestArr)
    progressData.packageTaskTotal = requestArr.length
    //获取并发数量
    const concurrency = 100

    const result = []

    const runBatch = async (batch) => {
        await Promise.all(batch.map(async (task, index) => {
            try {
                const res = await packageAcc(task, index)
                result.push(res)
            } catch (error) {
                console.error(error)
                result.push({})
            }
            progressData.packageTaskProgress++
            // 更新进度
            // loading.setText(`包装中... \n 请完成后再进行其他操作 \n ${progressData.packageTaskProgress} / ${progressData.packageTaskTotal}`)
        }))
    }

    for (let i = 0; i < requestArr.length; i += concurrency) {
        const batch = requestArr.slice(i, i + concurrency)
        await runBatch(batch)
    }

    console.log("包装回调： ", result)
    loading.value = false
    const successNum = result.filter(i => { return i?.code === 0 }).length
    handleClose()
    ElMessage.success({
        message: `包装完成，任务总量: ${result.length}个,成功: ${successNum}个，失败: ${result.length - successNum}个`,
        duration: 0,
        showClose: true
    })
}


//创建单个账号数据
const getCanUseMe = async (type) => {
    console.log('======================')
    const typeMap = {
        'image': avatarGetter.value,
        'nickname': nicknameGetter.value,
        'signature': descGetter.value
    }
    if (typeMap[type].length === 0) {
        return null
    }
    const canUseItem = typeMap[type].filter(i => { return i.canUse })[0]
    console.log("type:   ", type, "素材:  ", typeMap[type])
    //如果没找到可以使用的头像的话，代表是第一次循环，取第一个
    if (!canUseItem) {
        //如果存在下一项的话
        if (typeMap[type][1]) {
            typeMap[type][0].canUse = false
            typeMap[type][1].canUse = true
        } else {
            //不存在下一项的话那就说明数组走到了尽头，重新设置下标为0，设置第一个头像的canUse为true
            typeMap[type][0].canUse = true
        }
        return typeMap[type][0].file
    } else {
        //如果找到可以使用的头像的话，找到并返回，并且获取当前项的下标，设置当前项的下一个的canUse为true
        const currIdx = canUseItem.idx
        console.log("可用素材:  ", typeMap[type][currIdx])
        //如果存在下一项的话
        if (typeMap[type][currIdx + 1]) {
            typeMap[type][currIdx + 1].canUse = true
        } else {
            //不存在下一项的话那就说明数组走到了尽头，重新设置下标为0，设置第一个头像的canUse为true
            typeMap[type][0].canUse = true
        }
        typeMap[type][currIdx].canUse = false
        return canUseItem.file
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
        newObj[param[0]] = param[1];
    }
    const carrier_region = newObj?.carrier_region
    const op_region = newObj?.op_region
    const residence = newObj?.residence
    console.log('common-params object: ', newObj)
    console.log('地址obj: ', { carrier_region, op_region, residence })
    region = carrier_region || op_region || residence
    return `http://${acc}-zone-custom-region-${region}-session-${uid}-sessTime-30:${pwd}@${addr}`
}


//组装数据  如果包装数据小于选中账号的话，循环去使用   如果只有一个，那就全去用这一个
const assemblePackageInfoArr = async () => {
    const infoArr = []

    let image, nickname, signature

    for (let i = 0; i < props.selectArr.length; i++) {

        image = await getCanUseMe('image')
        nickname = await getCanUseMe('nickname')
        signature = await getCanUseMe('signature')
        console.log({ image, nickname, signature })
        const meData = removeEmptyValues({ image, nickname, signature })
        //将素材转换成数组，循环添加promise任务队列
        Object.entries(meData).forEach(j => {
            let data = {
                token: props.selectedTokenList[i],
                proxy: getProxyLink(props.selectedTokenList[i]),
                params: {
                    [j[0]]: j[1],
                }
            }
            console.log("账号需要包装的素材数据:  ", data)
            data = removeEmptyValues(data)

            infoArr.push(data)
        })

    }
    return infoArr
}

//包装账号
const packageAcc = async (data, idx) => {
    try {
        const res = await $api({ type: 'packageAcc', data })
        return Object.assign(res, { idx })
    } catch (error) {
        console.error(error);
        return {}
    }
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

    >div:nth-of-type(1) {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
</style>