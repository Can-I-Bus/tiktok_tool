<template>
    <div class="account_wrap">
        <div class="top">
            <div class="left">
                <el-button @click="showToken = true">导入Token</el-button>
                <!-- <el-button @click="showConcurrency = true">并发控制</el-button> -->
                <el-button @click="handleClick(0)">暂停选中任务</el-button>
                <el-button @click="handleClick(1)">开始选中任务</el-button>
                <el-button @click="handleGetData">查看选中裂变</el-button>
                <el-button @click="editTaskConfig">修改选中任务</el-button>
                <el-button style="margin-right: 12px" @click="() => {
                    if (selectArr.length === 0) {
                        return ElMessage.warning('请先选中任务');
                    }
                    showExportTask = true
                }">导出选中任务</el-button>

                <span v-show="loading && blogList.length > 0"
                    style="margin-left: 20px;line-height: 32px;font-size: 14px">博主解析进度: {{ progressData.total + ' / '
                    +
                    progressData.progress
                    }}...</span>
            </div>
            <div class="right">
                <el-select @change="getTaskList" clearable style="width: 100px" placeholder="选择分类" v-model="category">
                    <el-option v-for="item in categoryList" :key="item.id" :label="item.class_name" :value="item.id" />
                </el-select>
                <el-button @click="showCategoryControl = true" style="margin-left: 12px">分类管理</el-button>
            </div>
        </div>

        <div ref="resizeElement" style="display: flex;flex-wrap: wrap;font-size: 14px;">
            <div style="display: flex;align-items: center;margin-bottom: 10px;margin-right: 30px">
                <span style="white-space: nowrap;margin-right: 10px;">筛选国家: </span>
                <el-input v-model="queryData.region" placeholder="输入筛选国家码,空格隔开" style="width:210px"></el-input>
            </div>
            <div style="display: flex;align-items: center;margin-bottom: 10px;margin-right: 30px">
                <span style="margin-right: 10px;">粉丝范围: </span>
                <div style="display: flex;align-items: center;">
                    <el-input v-model="queryData.follower_count_min_num" style="width: 100px;"></el-input>
                    <span>-</span>
                    <el-input v-model="queryData.follower_count_max_num" style="width: 100px;"></el-input>
                </div>
            </div>
            <div style="display: flex;align-items: center;margin-bottom: 10px;margin-right: 30px">
                <span style="margin-right: 10px;">视频范围: </span>
                <div style="display: flex;align-items: center;">
                    <el-input v-model="queryData.aweme_count_min_num" style="width: 100px;"></el-input>
                    <span>-</span>
                    <el-input v-model="queryData.aweme_count_max_num" style="width: 100px;"></el-input>
                </div>
            </div>
            <div style="display: flex;align-items: center;margin-bottom: 10px;margin-right: 30px">
                <span style="margin-right: 10px;">关注范围: </span>
                <div style="display: flex;align-items: center;">
                    <el-input v-model="queryData.following_count_min_num" style="width: 100px"></el-input>
                    <span>-</span>
                    <el-input v-model="queryData.following_count_max_num" style="width: 100px"></el-input>
                </div>
            </div>
            <div style="display: flex;align-items: center;margin-bottom: 10px;margin-right: 30px">
                <span style="margin-right: 10px;">获赞范围: </span>
                <div style="display: flex;align-items: center;">
                    <el-input v-model="queryData.total_favorited_min_num" style="width: 100px;"></el-input>
                    <span>-</span>
                    <el-input v-model="queryData.total_favorited_max_num" style="width: 100px;"></el-input>
                </div>
            </div>
            <div style="display: flex;align-items: center;margin-bottom: 10px;margin-right: 30px">
                <span style="margin-right: 10px;">私密状态: </span>
                <div style="display: flex;align-items: center;">
                    <el-input v-model="queryData.secret" style="width: 100px;"></el-input>
                </div>
            </div>
            <div style="margin-bottom: 10px">
                <el-button @click="handleSearch">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>
            </div>

        </div>
        <div style="display: flex;align-items: center;">
            <p style="margin-bottom: 10px;font-size: 14px;margin-right: 10px">任务总量: {{ taskTotal }}</p>
            <p v-show="isFilter" style="margin-bottom: 10px;font-size: 14px">筛选数量: {{ filterData.length }}</p>
        </div>

        <div v-loading="loading" @dragover="handleDragOver" @drop="handleDrop"
            :style="{ height: `calc(100vh - 40px - 52px - 60px - ${searchHeight}px - 10px)` }">
            <el-auto-resizer>
                <template #default="{ height, width }">
                    <vxe-table style="margin-bottom: 10px" ref="tableRef" @checkbox-all="selectAllChange"
                        @checkbox-change="selectChange" empty-text="暂无裂变任务，将链接txt文件拖入即可获取用于创建裂变任务的博主列表" border
                        show-overflow :scroll-x="{ enabled: true }" :width="width" :height="height"
                        :row-config="{ isHover: true, useKey: true }" :data="isFilter ? filterData : taskList"
                        :scroll-y="{ enabled: true }">
                        <vxe-column :fixed="'left'" type="checkbox" width="50"></vxe-column>

                        <vxe-column type="seq" title="分类" :fixed="'left'" width="100" align="center">
                            <template #default="{ row }">
                                <span>{{ getCategoryText(row?.class_id) }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column type="seq" title="昵称" :fixed="'left'" width="150" align="center">
                            <template #default="{ row }">
                                <a target="_blank" :href="`https://www.tiktok.com/@${row?.user?.unique_id}`">
                                    <p style="color: #409eff;text-decoration: underline;cursor: pointer;">{{
                    row?.user?.nickname ? row.user.nickname : '暂无昵称' }}</p>
                                </a>
                            </template>
                        </vxe-column>
                        <vxe-column field="unique_id" width="150" title="unique_id" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.user?.unique_id ? row.user.unique_id : '暂无' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column type="seq" title="签名" width="150" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.user?.signature ? row.user.signature : '暂无签名' }}</span>
                            </template>
                        </vxe-column>

                        <vxe-column field="ins_id" width="150" title="ins_id" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.user?.ins_id ? row.user.ins_id : '暂无' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="twitter_name" width="150" title="twitter_name" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.user?.twitter_name ? row.user.twitter_name : '暂无' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="youtube_channel_title" width="200" title="youtube_channel_title"
                            align="center">
                            <template #default="{ row }">
                                <span>{{ row?.user?.youtube_channel_title ? row.user.youtube_channel_title : '暂无'
                                    }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="region" width="150" title="采集目标国家" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.region ? row.region.join('、') : '暂无国家' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="region" width="150" title="账号国家" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.user?.region ? row.user.region : '暂无国家' }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="follower_count" width="150" title="粉丝" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.user?.follower_count ? parseNum(row.user.follower_count) : 0 }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="following_count" width="150" title="关注" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.user?.following_count ? parseNum(row.user.following_count) : 0 }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="aweme_count" width="150" title="作品数量" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.user?.aweme_count ? parseNum(row.user.aweme_count) : 0 }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="total_favorited" width="150" title="获赞数量" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.user?.total_favorited ? parseNum(row.user.total_favorited) : 0 }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="spider_count" width="150" title="裂变数量" align="center">
                            <template #default="{ row }">
                                <span @click="hanldeFetchSpiderData(row?.uid)"
                                    style="color: #409eff;cursor: pointer;">{{
                    row?.spider_count
                        ? parseNum(row.spider_count) : 0 }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="secret" width="150" title="secret" align="center">
                            <template #default="{ row }">
                                <span>{{ row?.user?.secret ? row.user.secret : 0 }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="status" width="150" title="任务状态" align="center">
                            <template #default="{ row }">
                                <span>{{ (row?.status === 0 ? '未启动' : '已启动') }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="is_active" width="150" title="监控状态" align="center">
                            <template #default="{ row }">
                                <span>{{ (row?.is_active === 0 ? '未监控' : '已监控') }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column field="is_active" width="200" title="刷新时间" align="center">
                            <template #default="{ row }">
                                <span>{{ parseTime(row?.user?.refresh_time) }}</span>
                            </template>
                        </vxe-column>
                        <vxe-column :fixed="'right'" field="is_active" width="200" title="操作" align="center">
                            <template #default="{ row }">
                                <el-button type="primary" link @click="taskAction(row.is_active, row?.uid)">
                                    {{ row?.is_active === 0 ? '开启监控' : '停止监控' }}
                                </el-button>
                                <el-button type="primary" link @click="hanldeDeleteSpider(row?.uid)">删除</el-button>

                                <el-popover :visible="row?.visible" placement="top" :width="200">
                                    <p>请选择导出类型</p>
                                    <div style="text-align: right; margin: 0"
                                        v-click-outside="() => { taskList.map(i => i.visible = false) }">
                                        <el-button type="primary" size="small" link
                                            @click="handleExport(row.uid, 1)">粉丝</el-button>
                                        <el-button type="primary" size="small" link @click="handleExport(row.uid, 2)">
                                            关注
                                        </el-button>
                                        <el-button type="primary" size="small" link @click="handleExport(row.uid, 0)">
                                            全部
                                        </el-button>
                                    </div>
                                    <template #reference>
                                        <el-button type="primary" link @click="changeRowVis(row.uid)">导出</el-button>
                                    </template>
                                </el-popover>


                            </template>
                        </vxe-column>
                    </vxe-table>
                    <el-pagination style="float: right;" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" :current-page="apiData.page"
                        :page-sizes="[20, 50, 100, 200, 500]" :page-size="apiData.limit"
                        layout="sizes, prev, pager, next" :total="taskTotal" background>
                    </el-pagination>
                </template>
            </el-auto-resizer>
        </div>
        <Token :isShow="showToken" @handleClose="showToken = false" />
        <!-- <Proxy :isShow="showProxy" @handleClose="showProxy = false" /> -->
        <Blog :categoryList="categoryList" :isShow="showBlog" @handleClose="handleCloseBlog" :tableData="blogInfoList"
            @closeAfterCreateTaskSuccess="closeAfterCreateTaskSuccess" @updateCategory="getBlogCategoryList" />
        <Concurrent :isShow="showConcurrency" @handleClose="showConcurrency = false" />
        <ExportTask :isShow="showExportTask" @handleClose="showExportTask = false" :uidList="blogInfoUidList" />
        <FissionData :categoryList="categoryList" :isShow="showFissionData" @updateCategory="getBlogCategoryList"
            @handleClose="() => { fissionDataList = []; showFissionData = false }" :tableData="fissionDataList"
            @closeAfterCreateTaskSuccess="closeAfterCreateTaskSuccess" />
        <CategoryControl @getCategoryList="getBlogCategoryList" :isShow="showCategoryControl"
            :categoryList="categoryList" @handleClose="showCategoryControl = false" />
        <Fission :is-show="showFission" @handleClose="showFission = false" :uidList="selectArrUidList"
            :category-list="categoryList" />
    </div>
</template>

<script setup>
import axios from 'axios'
import Fission from '../components/Blog/Fission.vue'
import Token from '../components/Blog/Token.vue'
import Blog from '../components/Blog/ImportBlog.vue'
import Concurrent from '../components/Base/Concurrent.vue'
import ExportTask from '../components/Blog/ExportTask.vue'
import FissionData from '../components/Blog/FissionData.vue'
import CategoryControl from '../components/Blog/CategoryControl.vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { ref, reactive, onMounted, getCurrentInstance, computed, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus';
import { getDifferentItems, parseNum, removeEmptyValues, parseTime } from '@/utils'

onMounted(() => {
    const cacheLimit = localStorage.getItem('blog_limit')
    const cachePage = localStorage.getItem('blog_page')
    const cacheCategoryId = localStorage.getItem('blog_category_id')
    if (cacheLimit) {
        apiData.limit = Number(cacheLimit)
    }
    if (cachePage) {
        apiData.page = Number(cachePage)
    }
    if (cacheCategoryId) {
        category.value = Number(cacheCategoryId)
    }
    getTaskList()
    getBlogCategoryList()

    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            searchHeight.value = entry.contentRect.height;
        }
    });

    if (resizeElement.value) {
        observer.observe(resizeElement.value);
    }

    // 清除观察者
    onBeforeUnmount(() => {
        if (resizeElement.value) {
            observer.unobserve(resizeElement.value);
        }
    });
})

const { $api } = getCurrentInstance().proxy

const loading = ref(false)

const showCategoryControl = ref(false)

const showConcurrency = ref(false)

const showExportTask = ref(false)

const showFissionData = ref(false)

const showFission = ref(false)

const showToken = ref(false)

const showBlog = ref(false)

const isFilter = ref(false)

const tableRef = ref(null)

const resizeElement = ref(null);

const searchHeight = ref(0);

const filterData = ref([])

const categoryList = ref([])    //博主分类列表

const taskList = ref([])    //任务列表

const blogList = ref([])   //博主链接

const blogInfoList = ref([])     //博主信息列表

const selectArr = ref([])

const fissionDataList = ref([]) //裂变数据

const taskTotal = ref(0)

const category = ref('')

// const 

const progressData = reactive({
    total: 0,
    progress: 0
})

const queryData = reactive({
    region: '',
    follower_count_min_num: '',
    follower_count_max_num: '',
    aweme_count_min_num: '',
    aweme_count_max_num: '',
    following_count_min_num: '',
    following_count_max_num: '',
    total_favorited_min_num: '',
    total_favorited_max_num: '',
    secret: ''
})

const apiData = reactive({
    page: 1,
    limit: 20
})

const count = computed(() => {
    return apiData.limit
})

const offset = computed(() => {
    return (apiData.page - 1) * apiData.limit
})

const uniqueIdList = computed(() => {   //基于导入博主处理后的uniqueIdList
    return extractTikTokUsername(blogList.value)
})

const concurrency = computed(() => {    //并发数量
    const serverNum = Number(localStorage.getItem('server_concurrency_size')) || 0
    const sysNum = Number(localStorage.getItem('system_concurrency_size')) || 0
    return Math.max(Math.min(serverNum, sysNum), 0)
})

const blogInfoUidList = computed(() => {    //基于表格数据处理返回的uid
    return taskList.value.reduce((acc, curr) => {
        acc.push(curr.uid)
        return acc
    }, [])
})

const selectArrUidList = computed(() => {
    return selectArr.value.reduce((acc, curr) => {
        acc.push(curr.uid)
        return acc
    }, [])
})

const changeRowVis = (uid) => {
    taskList.value = taskList.value.map(item => {
        if (item.uid === uid) {
            item.visible = !item.visible;
        } else {
            item.visible = false; // 确保其他行的 `visible` 属性设置为 `false`
        }
        return item;
    });
}

const handleExport = async (uid, type) => {
    try {
        taskList.value.map(i => {
            i.visible = false
            return i
        })
        const data = {
            uids: [uid],
            export_type: type
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
        }).catch((error) => {
            console.error('Download error:', error);
        })

    } catch (error) {
        console.error(error);
    }
}

const taskAction = (type, uid) => {
    if (type == 0) {
        startActive({ uids: [uid] })
    } else {
        stopActive({ uids: [uid] })
    }
}

const startActive = async (data) => {
    try {
        const res = await $api({ type: 'startActive', data })
        if (res.code === 0) {
            ElMessage.success('开启成功')
            getTaskList()
        } else {
            ElMessage.error('开启失败')
        }
    } catch (error) {
        console.error(error);
        ElMessage.error('开启失败')
    }
}

const stopActive = async (data) => {
    try {
        const res = await $api({ type: 'stopActive', data })
        if (res.code === 0) {
            ElMessage.success('暂停成功')
            getTaskList()
        } else {
            ElMessage.error('暂停失败')
        }
    } catch (error) {
        console.error(error);
        ElMessage.error('暂停失败')
    }
}

//解析博主链接
const extractTikTokUsername = (urls) => {
    let usernames = [];
    const pattern = /(?:https?:\/\/(?:www\.)?tiktok\.com\/@)?([^\/?]+)/i;
    if (typeof urls === 'string') {
        urls = [urls];
    }
    urls.forEach(url => {
        const match = url.match(pattern);
        if (match && match[1]) {
            usernames.push(match[1].trim().replace('\r', ''));
        }
    });

    return usernames;
}

const getCategoryText = (id) => {
    // console.log(categoryList.value.filter(i => i.id === id))
    return categoryList.value.filter(i => i.id === id)[0]?.class_name ?? '暂无分类'
}

const handleGetData = async () => {
    try {
        if (selectArr.value.length === 0) {
            return ElMessage.warning('请先选择任务');
        }

        loading.value = true;

        const uids = selectArr.value.map(item => item.uid);
        const data = { uids, export_type: 0 };

        const res = await $api({ type: 'fetchSpiderData', data });

        if (res.code === 0) {
            if (res.users && Array.isArray(res.users)) {
                const chunkSize = 1000; // 每次处理 1000 个用户
                for (let i = 0; i < res.users.length; i += chunkSize) {
                    const chunk = res.users.slice(i, i + chunkSize);
                    console.log('切片数组: ,', chunk)
                    fissionDataList.value.push(...chunk);
                }
            }
            showFissionData.value = true;
        }

        loading.value = false;
    } catch (error) {
        console.error(error);
        loading.value = false;
    }
};


const hanldeFetchSpiderData = async (uid) => {
    if (!uid || uid === '') {
        return ElMessage.warning('所选择的任务UID为空')
    }
    try {
        loading.value = true
        const data = {
            uids: [uid],
            export_type: 0
        }
        const res = await $api({ type: 'fetchSpiderData', data })
        if (res.code === 0) {
            fissionDataList.value.push(...res?.users ?? [])
            showFissionData.value = true
        }
        loading.value = false
    } catch (error) {
        loading.value = false
        console.error(error);
    }
}

const selectAllChange = ({ checked }) => {
    const $table = tableRef.value
    if ($table) {
        const records = $table.getCheckboxRecords()
        selectArr.value = records
        console.log(checked ? '所有勾选事件' : '所有取消事件', records)
    }
}

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

const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const fileList = Array.from(files); // 将文件列表转换为数组
    handleFileList(fileList);
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

//筛选
const handleSearch = async () => {
    loading.value = true
    let filterQueryData = removeEmptyValues(queryData)

    await new Promise((resolve, reject) => {
        const res = taskList.value.filter(item => {
            let isValid = true;

            // 国家筛选，支持多个
            const countries = filterQueryData?.region?.split(' ').map(i => i.toUpperCase());
            if (countries?.length > 0) {
                isValid &= countries.includes((item?.user?.region).toUpperCase());
            }

            //私密筛选
            const secret = filterQueryData?.secret && Number(filterQueryData?.secret)
            if (Number.isFinite(secret)) {
                isValid &= item.user.secret === secret
            }

            // 遍历筛选对象的每一个字段
            Object.keys(filterQueryData).forEach(key => {

                const filterValue = Number(filterQueryData[key]);
                if (!isNaN(filterValue)) {
                    if (key.endsWith('_min_num')) {
                        const attrKey = key.replace('_min_num', '');
                        isValid &= item.user[attrKey] >= filterValue;
                    } else if (key.endsWith('_max_num')) {
                        const attrKey = key.replace('_max_num', '');
                        isValid &= item.user[attrKey] <= filterValue;
                    }
                }
            });

            return isValid;
        });
        filterData.value = []
        filterData.value.push(...res)
        isFilter.value = true
        resolve(true)
    })
    loading.value = false
    ElMessage.success(`搜索完毕，筛选符合条件任务共${filterData.value.length}个`)
}

const handleReset = () => {
    queryData.region = ''
    queryData.follower_count_min_num = ''
    queryData.follower_count_max_num = ''
    queryData.aweme_count_min_num = ''
    queryData.aweme_count_max_num = ''
    queryData.following_count_min_num = ''
    queryData.following_count_max_num = ''
    queryData.total_favorited_min_num = ''
    queryData.total_favorited_max_num = ''
    queryData.secret = ''
    filterData.value = []
    isFilter.value = false
}

const getTaskList = async () => {
    try {
        if (category.value !== '' && category.value !== undefined) {
            localStorage.setItem('blog_category_id', category.value)
        } else {
            localStorage.removeItem('blog_category_id')
        }
        loading.value = true
        const data = {
            class_id: category.value === '' ? 0 : category.value,
            count: count.value,
            offset: offset.value
        }
        const res = await $api({ type: 'getTaskList', data })
        if (res.code === 0) {
            taskList.value = res.users
            taskList.value.map(i => i.visible = false)
            taskTotal.value = res.total
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false
    }
}

const handleFileList = async (fileList) => {
    try {
        loading.value = true
        // const isImported = localStorage.getItem('server_concurrency_size')
        // if (!isImported || isImported === '0') {
        //     return ElMessage.warning('请先导入游客token用于采集')
        // }
        //另存一份uniqueIdList用于后续获取本次查询userinfo没有返回的unique_id
        const currUniqueIdList = []

        for (let i = 0; i < fileList.length; i++) {
            //读取博主链接
            const res = await readeFile(fileList[i])
            progressData.total = res.split('\n').length
            // console.log(res, '========')
            currUniqueIdList.push(...res.split('\n').reduce((acc, curr) => {
                acc.push(extractTikTokUsername(curr)[0])
                return acc
            }, []))
            res.split('\n').forEach(i => {
                //如果不存在才导入
                if (!blogList.value.find(j => { return j === i })) {
                    blogList.value.push(i)
                }
            })
        }

        const data = { unique_ids: currUniqueIdList }
        const res = await getUserInfo(data)
        const currBlogUniqueList = res.reduce((acc, curr) => {
            acc.push(curr.unique_id)
            return acc
        }, [])
        blogInfoList.value.push(...res)
        progressData.progress += blogInfoList.value.length
        console.log("当前的导入博主并返回的uniqueIdList:  ", currBlogUniqueList)
        console.log("当前导入的所有博主uniqueIdList:  ", currUniqueIdList)
        const transRes = await transFormuid(currBlogUniqueList, currUniqueIdList)
        console.log("转换uid回调:  ", transRes)
        //有效值
        const effectiveResList = []
        transRes.forEach(i => {
            if (i !== undefined && i !== null && i?.code === 0) {
                effectiveResList.push(i?.user)
            }
        })
        console.log("转换回调中的有效值:   ", effectiveResList)
        blogInfoList.value.push(...effectiveResList)
        if (blogInfoList.value.length === 0) {
            ElMessage.warning('没有有效的博主数据')
        } else {
            showBlog.value = true
            ElMessage.success(`博主解析完毕，成功：${blogInfoList.value.length}个，失败：${blogList.value.length - blogInfoList.value.length}个`)
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false
    }
}

const stopTask = async (data) => {
    try {
        const res = await $api({ type: 'stopTask', data })
        if (res.code === 0) {
            ElMessage.success('任务暂停成功')
        } else {
            ElMessage.error(res?.message ?? '任务暂停失败')
        }
    } catch (error) {
        console.error(error);
    }
}

const startTask = async (data) => {
    try {
        const res = await $api({ type: 'startSpidertask', data })
        if (res.code === 0) {
            ElMessage.success('任务启动成功')
        } else {
            ElMessage.error(res?.message ?? '任务启动失败')
        }
    } catch (error) {
        console.error(error);
    }
}


const handleClick = async (type) => {
    if (selectArr.value.length === 0) {
        return ElMessage.warning('请选择需要操作的任务')
    }
    if (type === 0) {
        const isAllPass = selectArr.value.every(item => item.status === 0)
        if (isAllPass) {
            return ElMessage.warning('当前选中任务列表中未包含已启动的任务')
        }
        const passItemList = selectArr.value.filter(item => item.status === 1).reduce((acc, curr) => {
            acc.push(curr.uid)
            return acc
        }, [])
        await stopTask({ uids: passItemList })
        await getTaskList()
    } else if (type === 1) {
        const isAllStart = selectArr.value.every(item => item.status === 1)
        if (isAllStart) {
            return ElMessage.warning('当前选中任务列表中未包含已暂停的任务')
        }
        const startItemList = selectArr.value.filter(item => item.status === 0).reduce((acc, curr) => {
            acc.push(curr.uid)
            return acc
        }, [])
        await startTask({ uids: startItemList })
        await getTaskList()
    }
}

const handleCloseBlog = () => {
    showBlog.value = false
    blogInfoList.value = []
    blogList.value = []
    // apiData.page = 1
    // apiData.limit = 20
    // getTaskList()
}


const closeAfterCreateTaskSuccess = () => {
    showBlog.value = false
    showFissionData.value = false
    blogInfoList.value = []
    fissionDataList.value = []
    blogList.value = []
    apiData.page = 1
    apiData.limit = 20
    getTaskList()
}

//在获取用户信息的回调中与当前导入博主中 找出未返回的unique_id来转换uid
const transFormuid = async (currUnique, currBlogUnique) => {
    const diffUniqueIdList = getDifferentItems(currUnique, currBlogUnique)
    console.log('===================导入但是未返回的博主==================')
    console.log("未返回的博主unique_id:  ", diffUniqueIdList)
    const infoArr = []
    diffUniqueIdList.forEach(i => {
        infoArr.push({
            params: {
                "unique_id": i
            }
        })
    })

    let index = 0;
    const results = [];

    while (index < infoArr.length) {
        // 从指定下标处开始取出并发量个任务
        const batch = infoArr.slice(index, index + 100);
        // 用 Promise.all 来并行执行这一批任务
        const batchResults = await Promise.all(batch.map((i, idx) => transFormToUid(i, idx)));
        console.log('并发下标:  ', index, '====', '转换uid任务队列回调:  ', batchResults);
        // 将这一批任务的结果添加到总结果数组中
        results.push(...batchResults);
        // 更新下标，准备处理下一批任务
        index += 100;
        progressData.progress += 100
    }
    return results;

}

const handleCurrentChange = async (val) => {
    apiData.page = val
    localStorage.setItem('blog_page', apiData.page)
    await getTaskList()
    if (isFilter.value || Object.keys(removeEmptyValues(queryData)).length > 0) {
        await handleSearch()
    }
}

const handleSizeChange = (val) => {
    console.log(val)
    apiData.limit = val
    localStorage.setItem('blog_limit', apiData.limit)
    getTaskList()
}

const transFormToUid = async (data, idx) => {
    try {
        const res = await $api({ type: 'transformToUid', data })
        const finallyRes = JSON.parse(JSON.stringify(Object.assign(res, { idx })))
        return finallyRes
    } catch (error) {
        console.error(error);
    }
}

const getUserInfo = async (data) => {
    try {
        const res = await $api({ type: 'getUserInfo', data })
        console.log(res)
        return res?.users
    } catch (error) {
        console.error(error);
    }
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

const editTaskConfig = async () => {
    try {
        if (selectArr.value.length === 0) {
            return ElMessage.warning('请选择需要操作的任务')
        }
        showFission.value = true
    } catch (error) {
        console.error(error);
    }
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
        // width: 100vw;
    }
}
</style>
