<template>
    <div class="index_wrap">
        <div class="top">
            <div>
                <el-select @change="handleCategoryChange" clearable style="width: 100px;margin-right: 10px"
                    placeholder="数据分类" v-model="category">
                    <el-option v-for="item in categoryList" :key="item.id" :label="item.class_name" :value="item.id" />
                </el-select>
                <el-select @change="articleChange" :disabled="category === '' || category === undefined" clearable
                    style="width: 100px;margin-right: 10px" placeholder="爆文类型" v-model="article">
                    <el-option v-for="item in bwList" :key="item.label" :label="item.label" :value="item.value" />
                </el-select>

                <!-- <el-input placeholder="粉丝量大于" style="width: 100px;margin-right: 10px"></el-input>
                <el-input placeholder="播放量大于" style="width: 100px;margin-right: 10px"></el-input>
                <el-input placeholder="评论量大于" style="width: 100px;margin-right: 10px"></el-input> -->
                <!-- <el-button>查询</el-button> -->
                <p class="tip">tip: 当<span>下拉框选项变化后</span>或<span>输入框焦点失去后</span>自动查询</p>
            </div>

            <div>
                <el-button @click="handleShowDataConfig">热门数据配置</el-button>
                <el-button @click="handleShowDataAn">数据分析</el-button>
            </div>

        </div>
        <div v-loading="loading" style="height: calc(100vh - 20px - 92px)">
            <el-auto-resizer>
                <template #default="{ height, width }">
                    <vxe-table style="margin-bottom: 10px" @checkbox-all="selectAllChange"
                        @checkbox-change="selectChange" ref="tableRef" empty-text="暂无数据" border show-overflow
                        :scroll-x="{ enabled: true, gt: 20 }" :width="width" :height="height"
                        :row-config="{ isHover: true, useKey: true }" :data="bloggerList" :scroll-y="{ enabled: true }">
                        <vxe-column :fixed="'left'" type="checkbox" width="50"></vxe-column>

                        <vxe-column type="seq" title="头像" :fixed="'left'" width="100" align="center">
                            <template #default="{ row }">
                                <a target="_blank" :href="`https://www.tiktok.com/@${row?.unique_id}`">
                                    <el-image style="width: 40px; height: 40px; border-radius: 50%"
                                        :src="row?.avatar_url"></el-image>
                                </a>
                            </template>
                        </vxe-column>
                        <vxe-column type="seq" title="昵称" :fixed="'left'" width="100" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.nickname ? row.nickname : '暂无昵称' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column type="seq" field="videos" title="视频链接" :fixed="'left'" width="100" align="center">
                            <template #default="{ row }">
                                <p style="color: #409eff;text-decoration: underline;cursor: pointer;"
                                    @click="videosDetail(row)">点击查看</p>
                            </template>
                        </vxe-column>
                        <vxe-column type="seq" title="签名" width="100" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.signature ? row.signature : '暂无签名' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="unique_id" width="100" title="unique_id" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.unique_id ? row.unique_id : '暂无unique_id' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="region" width="100" title="账号国家" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.region ? row.region : '暂无国家' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="first_follower_count" sortable title="初始粉丝" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.first_follower_count ? parseNum(row.first_follower_count) : '暂无数据'
                                    }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="follower_count" sortable title="当前粉丝" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.follower_count ? parseNum(row.follower_count) : '暂无数据' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="follower_increase" sortable title="日涨粉丝" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.follower_increase ? parseNum(row.follower_increase) : '暂无数据' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="following_count" sortable title="关注量" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.following_count ? parseNum(row.following_count) : '暂无数据' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="total_favorited" sortable title="收藏量" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.total_favorited ? parseNum(row.total_favorited) : '暂无数据' }}</span>
                            </template>
                        </vxe-column>

                        <vxe-column field="aweme_count" sortable title="视频数量" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.aweme_count ? parseNum(row.aweme_count) : '暂无数据' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="name" width="200" title="刷新时间" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.refresh_time ? parseTime(row.refresh_time) : '暂无时间' }}</span>
                            </template>
                        </vxe-column>

                    </vxe-table>
                </template>
            </el-auto-resizer>
        </div>
        <DataAn :isShow="showDataAn" @handleClose="showDataAn = false" :selectedUids="selectedUids"
            :selectedUuniqueIds="selectedUuniqueIds" />
        <DataConfig :isShow="showDataConfig" :categoryList="categoryList" :selectedUids="selectedUids"
            @handleClose="showDataConfig = false" :currCategory="category" />
        <VideoDialog :isShow="showVideoDialog" :videoList="currVideoList" @handleClose="showVideoDialog = false" />
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import DataAn from '../components/Index/DataAn.vue';
import DataConfig from '../components/Index/DataConfig.vue';
import VideoDialog from '../components/Index/VideoDialog.vue';
import { parseNum, parseTime } from '@/utils'
import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue'

const { $api } = getCurrentInstance().proxy

const currCategoryUidList = ref([]) //存储所选分类下的uidList

const currVideoList = ref([])   //当前选中账号的视频列表

const selectArr = ref([])

const tableRef = ref(null)

const showDataAn = ref(false)

const showVideoDialog = ref(false)

const bloggerList = ref([])

const showDataConfig = ref(false)

const loading = ref(false)

const categoryList = ref([])

const category = ref('')

const article = ref('')

const bwList = ref([
    { label: '低粉爆文', value: 0 },
    { label: '爆粉爆文', value: 1 },
    { label: '7天爆文', value: 2 },
    { label: '常规爆文', value: 3 },
])

const selectedUids = computed(() => {
    return selectArr.value.reduce((acc, curr) => {
        acc.push(curr.uid)
        return acc
    }, [])
})

const selectedUuniqueIds = computed(() => {
    return selectArr.value.reduce((acc, curr) => {
        acc.push(curr.unique_id)
        return acc
    }, [])
})

const articleChange = async () => {
    localStorage.setItem('index_article_id', article.value)
    if (article.value !== undefined) {
        if (article.value === 0) {
            await fileterLowArticle()
        } else if (article.value === 1) {
            await filterExplosiveGrowthAccount()
        } else if (article.value === 2) {
            await filterSevenDayExplosiveArticle()
        } else if (article.value === 3) {
            await filterExplosiveArticle()
        }
        showColumn()
    } else {
        hideColumn()
    }
}

//筛选低粉爆文
const fileterLowArticle = async () => {
    try {
        const data = { class_id: category.value, uids: currCategoryUidList.value }
        console.log('获取低粉爆文')
        const res = await $api({ type: 'fileterLowArticle', data })
        if (res.code === 0) {
            setUserVideos(res.data)

        }
    } catch (error) {
        console.error(error);
    }
}

//筛选常规爆文
const filterExplosiveArticle = async () => {
    try {
        const data = { class_id: category.value, uids: currCategoryUidList.value }
        console.log('获取常规爆文')
        const res = await $api({ type: 'filterExplosiveArticle', data })
        if (res.code === 0) {
            setUserVideos(res.data)

        }
    } catch (error) {
        console.error(error);
    }
}

//筛选七天爆文
const filterSevenDayExplosiveArticle = async () => {
    try {
        const data = { class_id: category.value, uids: currCategoryUidList.value }
        console.log('获取七天爆文')
        const res = await $api({ type: 'filterSevenDayExplosiveArticle', data })
        if (res.code === 0) {
            setUserVideos(res.data)
        }
    } catch (error) {
        console.error(error);
    }
}

//筛选爆粉爆文
const filterExplosiveGrowthAccount = async () => {
    try {
        const data = { class_id: category.value, uids: currCategoryUidList.value }
        console.log('获取爆粉爆文')
        const res = await $api({ type: 'filterExplosiveGrowthAccount', data })
        if (res.code === 0) {
            setUserVideos(res.data)
        }
    } catch (error) {
        console.error(error);
    }
}

const setUserVideos = (data) => {
    Object.keys(data).forEach(key => {
        bloggerList.value.map(i => {
            if (i.uid === key) {
                data[key].map(j => {
                    j.video_link = `https://www.tiktok.com/@${i.unique_id}/video/${j.aweme_id}`
                    return j
                })

                i.videos = [...data[key].reverse()]
                console.log('博主UID: ', i.uid)
                console.log('视频链接: ', i.videos)
            }
            return i
        })
    })
}

const videosDetail = (row) => {
    currVideoList.value = row.videos
    showVideoDialog.value = true
}

const selectAllChange = ({ checked }) => {
    const $table = tableRef.value
    if ($table) {
        const records = $table.getCheckboxRecords()
        selectArr.value = records
        // console.log(checked ? '所有勾选事件' : '所有取消事件', records)
    }
}

const selectChange = ({ checked }) => {
    const $table = tableRef.value
    if ($table) {
        const records = $table.getCheckboxRecords()
        selectArr.value = records
        // console.log(checked ? '勾选事件' : '取消事件', records)
    }
}

const getCategoryList = async () => {
    try {
        const res = await $api({ type: 'fetchBlogCategoryList', data: {} })
        if (res.code === 0) {
            categoryList.value = res?.class_list ?? []
        }
    } catch (error) {
        console.error(error);
    }
}

const handleShowDataConfig = () => {
    showDataConfig.value = true
}

const handleShowDataAn = () => {
    if (selectArr.value.length === 0) {
        return ElMessage.warning('请选择需要分析的博主')
    }
    showDataAn.value = true
}

//获取分类下的博主UID
const getClassBloggerUids = async () => {
    try {
        const uids = []
        const data = { class_id: category.value }
        const res = await $api({ type: 'fetchClassBloggerUids', data })
        if (res.code === 0) {
            uids.push(...res.uids.map(i => i.uid))
        }
        return uids
    } catch (error) {
        console.error(error);
    }
}

//获取用户信息列表
const getUserInfoList = async (data) => {
    try {
        const res = await $api({ type: 'fetchBloggerList', data })
        if (res.code === 0) {
            // bloggerTotal.value = res.total
            bloggerList.value = res.user_infos ?? []
        }
    } catch (error) {
        console.error(error);
    }
}

const handleCategoryChange = async () => {
    try {
        localStorage.setItem('index_category_id', category.value)
        if (category.value !== '' && category.value !== undefined) {
            loading.value = true
            const uids = await getClassBloggerUids()
            console.log('分类下UID列表: ', uids)
            currCategoryUidList.value = uids
            const data = { uids }
            await getUserInfoList(data)
            loading.value = false
        } else {
            article.value = ''
            localStorage.removeItem('index_category_id')
            localStorage.removeItem('index_article_id')
            bloggerList.value = []
        }
    } catch (error) {
        console.error(error);
        loading.value = false
    }
}

const hideColumn = () => {
    const $table = tableRef.value
    if ($table) {
        $table.hideColumn('videos')
    }
}

const showColumn = () => {
    const $table = tableRef.value
    if ($table) {
        $table.showColumn('videos')
    }
}

const initView = async () => {
    const categoryId = localStorage.getItem('index_category_id')
    const articleId = localStorage.getItem('index_article_id')
    if (categoryId) {
        category.value = Number(categoryId)
    }
    if (articleId) {
        article.value = Number(articleId)
    }
    await handleCategoryChange()
    await articleChange()
}

onMounted(() => {
    setTimeout(() => {
        hideColumn()
    }, 0)
    getCategoryList()
    initView()
})
</script>
<style scoped lang='scss'>
.tip {
    position: absolute;
    top: 38px;
    font-size: 13px;
    color: #413f3f;

    span {
        color: #409eff
    }
}

.index_wrap {
    padding: 20px;
}

.top {
    position: relative;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;

    >div {
        display: flex;
    }
}
</style>