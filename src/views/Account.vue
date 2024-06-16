<template>
    <div class="account_wrap">
        <div class="top">
            <div class="left">
                <el-button @click="handlePackage">包装选中账号</el-button>
                <el-button @click="showStart = true">选中账号去收藏</el-button>
                <el-button @click="showComment = true">选中账号去评论</el-button>
                <span v-show="refreshData.refreshTotal > 0 && loading"
                    style="margin-left: 20px;line-height: 32px;font-size: 14px">刷新进度: {{ refreshData.refreshTotal + '/'
                    + refreshData.refreshProgress
                    }}...</span>
            </div>
            <div class="right">
                <el-button @click="showConcurrency = true">并发控制</el-button>
                <el-button :loading="refreshLoading" @click="refreshAction">刷新账号</el-button>
                <el-button @click="showProxy = true">代理配置</el-button>
            </div>
        </div>
        <p style="margin-bottom: 10px;font-size:14px">账号总量: {{ tableData.length }}</p>

        <div v-loading="loading" @dragover="handleDragOver" @drop="handleDrop"
            style="height: calc(100vh - 40px - 52px - 20px)">
            <el-auto-resizer>
                <template #default="{ height, width }">
                    <vxe-table ref="tableRef" @checkbox-all="selectAllChange" @checkbox-change="selectChange"
                        empty-text="暂无数据，将链接txt文件拖入即可获取数据" border show-overflow :scroll-x="{ enabled: true, gt: 20 }"
                        :width="width" :height="height" :row-config="{ isHover: true }" :data="tableData"
                        :scroll-y="{ enabled: true }">
                        <vxe-column :fixed="'left'" type="checkbox" width="50"></vxe-column>
                        <vxe-column :fixed="'left'" type="seq" title="头像" width="150" align="center">
                            <template #default="{ row }">
                                <a target="_blank" :href="`https://www.tiktok.com/@${row?.unique_id}`">
                                    <el-image style="width: 40px; height: 40px; border-radius: 50%"
                                        :src="row.avatar_url"></el-image>
                                </a>
                            </template>
                        </vxe-column>
                        <vxe-column :fixed="'left'" width="150" field="name" title="昵称" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.nickname ? row.nickname : '暂无昵称' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column width="150" field="name" title="unique_id" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.unique_id ? row.unique_id : '暂无' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column width="150" field="role" title="个人简介" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.signature ? row.signature : '暂无简介' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="name" width="150" title="ins_id" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.ins_id ? row.ins_id : '暂无' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="name" width="150" title="twitter_name" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.twitter_name ? row.twitter_name : '暂无' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="name" width="200" title="youtube_channel_title" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.youtube_channel_title ? row.youtube_channel_title : '暂无'
                                    }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column width="150" field="sex" title="粉丝" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.follower_count ? parseNum(row.follower_count) : 0 }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column width="150" field="sex" title="关注" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.following_count ? parseNum(row.following_count) : 0 }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column width="150" field="sex" title="作品数量" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.aweme_count ? parseNum(row.aweme_count) : 0 }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column width="200" fixed="right" field="sex" title="刷新时间" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.refresh_time ? parseTime(row.refresh_time) : '暂无刷新时间' }}</span>
                            </template>
                        </vxe-column>

                    </vxe-table>
                </template>
            </el-auto-resizer>
        </div>

        <Proxy :isShow="showProxy" @handleClose="showProxy = false" />
        <PackageAcc :isShow="showPackageAcc" :tokenList="tokenList" :selectArr="selectArr"
            @handleClose="showPackageAcc = false" :selectedTokenList="selectedTokenList" />
        <Start :isShow="showStart" @handleClose="showStart = false" />
        <Comment :isShow="showComment" @handleClose="showComment = false" :selectArr="selectArr" />
        <Concurrent :isShow="showConcurrency" @handleClose="showConcurrency = false" />
    </div>
</template>

<script setup>
import Start from '../components/Account/Start.vue'
import Comment from '../components/Account/Comment.vue'
import Proxy from '../components/Account/Proxy.vue'
import PackageAcc from '../components/Account/PackageAcc.vue'
import Concurrent from '../components/Base/Concurrent.vue'
import { ref, getCurrentInstance, computed, reactive, onMounted } from 'vue'
import { getDifferentItems, parseTime, parseNum } from '@/utils'
import { ElMessage } from 'element-plus'
onMounted(() => {
    const val = localStorage.getItem('system_concurrency_size')
    // console.log(val, '====')
    concurrency.value = val
})

const { proxy } = getCurrentInstance()
const { $api } = proxy

const selectArr = ref([])

const tableRef = ref(null)

const refreshLoading = ref(false)

const showConcurrency = ref(false)

const loading = ref(false)

const showComment = ref(false)

const showStart = ref(false)

const showProxy = ref(false)

const showPackageAcc = ref(false)

const concurrency = ref(0)

const tableData = ref([])

const tokenList = ref([])   //token列表

const refreshData = reactive({
    refreshTotal: 0,
    refreshProgress: 0
})

const selectedTokenList = computed(() => {  //选中账号对应的Token
    return selectArr.value.reduce((acc, curr) => {
        const sameToken = tokenList.value.find(i => { return i.user.uid === curr.uid })
        acc.push(sameToken)
        return acc
    }, [])
})

//选择全部事件
const selectAllChange = ({ checked }) => {
    const $table = tableRef.value
    if ($table) {
        const records = $table.getCheckboxRecords()
        selectArr.value = records
        console.log(checked ? '所有勾选事件' : '所有取消事件', records)
    }
}

//选择事件
const selectChange = ({ checked }) => {
    const $table = tableRef.value
    if ($table) {
        const records = $table.getCheckboxRecords()
        selectArr.value = records
        console.log(checked ? '勾选事件' : '取消事件', records)
    }
}

const handleDragOver = (event) => {
    event.preventDefault();
}


//读取拖入文件内容
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

const handleDrop = async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const fileList = Array.from(files); // 将文件列表转换为数组
    // console.log(fileList, '====')
    await handleFileList(fileList);
}


//处理token文件并获取用户信息
const handleFileList = async (fileList) => {
    try {
        loading.value = true
        const beforeLen = tokenList.value.length
        //当前导入的token，不包含之前的
        const currTokenList = []
        for (let i = 0; i < fileList.length; i++) {
            const res = await readeFile(fileList[i])
            // console.log(res.split('\n').filter(i => i !== '' && i !== null && i !== undefined))
            // console.log(res.split('\n').filter(i => { return i !== '' && i !== null && i !== undefined }).map(i => { return JSON.parse(i.replace(/[^\x20-\x7E\u4E00-\u9FFF]+/g, "")) }))
            res.split('\n').filter(i => { return i !== '' && i !== null && i !== undefined }).map(i => { return JSON.parse(i.replace(/[^\x20-\x7E\u4E00-\u9FFF]+/g, "")) }).forEach(i => {
                console.log(tokenList.value, '=====')

                if (!tokenList.value.find(j => { return j.user.uid === i.user.uid })) {
                    tokenList.value.push(i)
                }
                currTokenList.push(i)
            })
        }
        const afterLen = tokenList.value.length
        //如果处理前后数组长度相同的话则代表导入的全是已存在的token，不做处理，只有在长度不想等的时候才进行下一步
        if (beforeLen != afterLen) {
            console.log("当前导入的token： ", currTokenList)
            //当前导入token的unique_id
            const currUniqueIdList = currTokenList.reduce((acc, curr) => {
                acc.push(curr.user.unique_id)
                return acc
            }, [])
            const data = {
                unique_ids: currUniqueIdList
            }
            const res = await getUserInfo(data)
            tableData.value.push(...res)
            //提取unique_id提取出来
            const resUniqueIdList = res.reduce((acc, curr) => {
                acc.push(curr.unique_id)
                return acc
            }, [])
            console.log("fetch_user_info返回的 uniqueIdList:   ", resUniqueIdList)
            //判断当前导入的token中是否存在有未返回的项
            const diffUniqueList = getDifferentItems(resUniqueIdList, currUniqueIdList)
            console.log("fetch_user_info未返回的 uniqueIdList: ", diffUniqueList)
            //如果存在未返回值的话
            if (diffUniqueList.length > 0) {
                const infoArr = []
                diffUniqueList.forEach((i) => {
                    //找到对应的token
                    const sameToken = currTokenList.filter(j => { return i === j.user.unique_id })[0]
                    const proxy = getProxyLink(sameToken)
                    infoArr.push({ token: sameToken, proxy: proxy })
                })
                if (infoArr.length === 0) {
                    return false
                }
                const batchRes = []
                let index = 0;
                //任务队列
                while (index < infoArr.length) {
                    // 从指定下标处开始取出并发量个任务
                    const batchInfo = infoArr.slice(index, index + concurrency.value);
                    console.log("任务数组:  ", batchInfo)
                    const batchPromise = batchInfo.map((i, idx) => handleRefresh(i, idx))
                    const result = await Promise.all(batchPromise)
                    // console.log("刷新回调:  ", result)
                    console.log('并发下标:  ', index, '====', '刷新任务队列回调:  ', result);
                    batchRes.push(...result)
                    const cbUserInfo = result.reduce((acc, curr) => {
                        if (curr?.code === 0) {
                            acc.push(curr.user)
                            return acc
                        }
                    }, [])
                    console.log("任务队列有效user数组:  ", cbUserInfo)
                    // await replaceTableData(cbUserInfo)
                    if (cbUserInfo) {
                        tableData.value.push(...cbUserInfo)
                    }
                    // 更新下标，准备处理下一批任务
                    index += concurrency.value;
                }
                console.log('刷新任务总回调:  ', batchRes)
                // const successRes = batchRes.filter(i => { return i.code === 0 })
                // const successNum = successRes.length + resUniqueIdList.length
                // const failNum = batchRes.length - successNum
                // ElMessage.success(`账号获取成功，成功: ${successNum},失败: ${successNum}个`)
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false
    }

}

//获取代理链接
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

//获取用户信息
const getUserInfo = async (data) => {
    try {
        loading.value = true
        const res = await $api({ type: 'getUserInfo', data })
        console.log(res)
        return res?.users
    } catch (error) {
        console.error(error);
        ElMessage.error(error?.message ?? '获取用户信息失败')
    } finally {
        loading.value = false
    }
}

//处理刷新回调
const handleRefreshActionCb = async (res) => {

    for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < tableData.value.length; j++) {
            if (!tableData.value.find(j => { return j?.uid === res[i]?.user?.uid }) && res[i]?.code === 0) {
                tableData.value.push(res[i]?.user)
            }
            if (res[i]?.user?.uid === tableData.value[j]?.uid) {
                setTimeout(() => {
                    tableData.value[j] = Object.assign(tableData.value[j], res[i].user); // 通过索引修改数组元素的值
                }, 0)
            }
        }
    }

};

//刷新集成  [刷新按钮]
const refreshAction = async () => {
    try {
        const acc = localStorage.getItem('tool_proxy_acc')
        const pwd = localStorage.getItem('tool_proxy_pwd')
        const addr = localStorage.getItem('tool_proxy_addr')
        if (!acc && !pwd && !addr) {
            return ElMessage.warning('请先设置代理账号和代理密码')
        }
        loading.value = true
        refreshData.refreshTotal = selectArr.value.length

        let index = 0;
        const result = []
        const requestArr = await assembleRefreshInfoArr()

        console.log(requestArr, '=====')

        while (index < requestArr.length) {
            // 从指定下标处开始取出并发量个任务
            const batch = requestArr.slice(index, index + concurrency.value);
            const batchPromise = await batch.map((i, idx) => handleRefresh(i, idx))
            // 用 Promise.all 来并行执行这一批任务
            const batchResults = await Promise.all(batchPromise)

            result.push(...batchResults)
            console.log('并发下标:  ', index, '====', '刷新任务队列回调:  ', batchResults);
            //处理回调
            await handleRefreshActionCb(batchResults)
            // 更新下标，准备处理下一批任务
            index += concurrency.value;
            console.log(index, '=======')
            refreshData.refreshProgress += concurrency.value
        }
        const successNum = result.filter(i => { return i.code === 0 }).length
        loading.value = false
        ElMessage.success(`刷新任务完成，成功: ${successNum}个，失败: ${refreshData.refreshTotal - successNum}个`)
        refreshData.refreshProgress = 0
        refreshData.refreshTotal = 0
    } catch (error) {
        console.error(error);
        loading.value = false
    }
}

//组装需要刷新账号的信息数组
const assembleRefreshInfoArr = async (origin = selectArr.value) => {
    const infoArr = []
    origin.forEach((i) => {
        //找到对应的token
        const sameToken = tokenList.value.filter(j => { return i.unique_id === j.user.unique_id })[0]
        const proxy = getProxyLink(sameToken)
        infoArr.push({ token: sameToken, proxy: proxy })
    })
    //处理成请求数组
    // const batchPromises = infoArr.map((i, idx) => handleRefresh(i, idx))
    return infoArr
}

const handleRefresh = async (data, idx) => {
    try {
        const res = await $api({ type: 'refreshUser', data })
        const finallyRes = JSON.parse(JSON.stringify(Object.assign(res, { idx })))
        return finallyRes
    } catch (error) {
        console.error(error);
        return {};
    }
}

const handlePackage = () => {
    if (selectArr.value.length === 0) {
        return ElMessage.warning('请先选中账号')
    }
    showPackageAcc.value = true
}

</script>
<style scoped lang='scss'>
.account_wrap {
    padding: 20px;
    height: 100vh;
    overflow-y: hidden;
}

.top {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;

    .left,
    .right {
        display: flex;
    }
}
</style>
