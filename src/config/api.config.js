export default {
    //获取用户信息（导入账号时使用）
    getUserInfo: {
        url: '/fetch_user_info',
        method: 'POST',
    },
    //刷新用户
    refreshUser: {
        url: '/refresh_user_info',
        method: 'POST',
    },
    //包装账号
    packageAcc: {
        url: '/edit_user_info',
        method: 'POST',
    },
    //导入token
    importToken: {
        url: '/import_guest_token',
        method: 'POST',
    },
    //转换博主uid
    transformToUid: {
        url: '/transform_to_uid',
        method: 'POST',
    },
    //创建裂变任务
    createSpidertask: {
        url: '/create_spider_task',
        method: 'POST',
    },
    //继续裂变任务
    startSpidertask: {
        url: '/start_spider_task',
        method: 'POST',
    },
    //暂停裂变任务
    stopTask: {
        url: '/stop_spider_task',
        method: 'POST',
    },
    //获取裂变任务
    getTaskList: {
        url: '/fetch_spider_task',
        method: 'POST',
    },
    //导出采集任务
    exportTask: {
        url: '/export_spider_data',
        method: 'POST',
    },
    //查询裂变博主信息
    fetchSpiderData: {
        url: '/fetch_spider_data',
        method: 'POST',
    },
    //获取博主分类
    fetchBlogCategoryList: {
        url: '/fetch_blogger_class_list',
        method: 'POST',
    },
    //新建博主分类
    createBlogCategory: {
        url: '/create_blogger_class',
        method: 'POST',
    },
    //删除博主分类
    deleteBlogCategory: {
        url: '/delete_blogger_class',
        method: 'POST',
    },
    //修改博主分类
    updateBlogCategory: {
        url: '/update_blogger_class',
        method: 'POST',
    },
    //创建评论任务
    createCommentTask: {
        url: '/create_comment_task',
        method: 'POST',
    },
    //开启博主监控
    startMonitor: {
        url: '/start_monitor_task',
        method: 'POST',
    },
    //暂停博主监控
    stopMonitor: {
        url: '/stop_monitor_task',
        method: 'POST',
    },
    //获取数据增长
    getChartData: {
        url: '/query_data_growth',
        method: 'POST',
    },
    //查询用户统计
    getDataview: {
        url: '/query_user_stats',
        method: 'POST',
    },
    //查询用户视频
    getBloggerVideos: {
        url: '/query_user_videos',
        method: 'POST',
    },
    //查询分类下博主UID列表
    fetchClassBloggerUids: {
        url: '/fetch_class_blogger',
        method: 'POST',
    },
    //根据UID获取博主信息
    fetchBloggerList: {
        url: '/query_user_infos',
        method: 'POST',
    },
    //获取数据概述
    fetchVideoStats: {
        url: 'query_video_stats',
        method: 'POST',
    },
    //配置低粉爆文
    setLowExplosiveConfig: {
        url: '/update_low_follower_explosive_article',
        method: 'POST',
    },
    //配置爆粉账号
    setExplosiveAccConfig: {
        url: '/update_explosive_growth_account',
        method: 'POST',
    },
    //配置七天爆文账号
    setSevenDayExplosiveConfig: {
        url: '/update_seven_day_explosive_accounts',
        method: 'POST',
    },
    //配置常规爆文
    setExplosiveConfig: {
        url: '/update_explosive_article',
        method: 'POST',
    },
    //获取低粉爆文配置
    fetchLowExplosiveConfig: {
        url: '/fetch_low_follower_explosive_article',
        method: 'POST',
    },
    //获取爆粉账号配置
    fetchExplosiveAccConfig: {
        url: '/fetch_explosive_growth_account',
        method: 'POST',
    },
    //获取七天爆文账号配置
    fetchSevenDayExplosiveConfig: {
        url: '/fetch_seven_day_explosive_accounts',
        method: 'POST',
    },
    //获取常规爆文配置
    fetchExplosiveConfig: {
        url: '/fetch_explosive_article',
        method: 'POST',
    },
    //分析选中视频
    anVideo: {
        url: '/query_video_data_growth',
        method: 'POST',
    },
    //开启监控
    startActive: {
        url: '/start_active_task',
        method: 'POST',
    },
    //关闭监控
    stopActive: {
        url: '/stop_active_task',
        method: 'POST',
    },
    //查询粉丝结构
    fetchFansTree: {
        url: '/query_follower_region',
        method: 'POST',
    },
    //筛选低粉爆文
    fileterLowArticle: {
        url: '/filter_low_follower_explosive_article',
        method: 'POST',
    },
    //筛选常规爆文
    filterExplosiveArticle: {
        url: '/filter_explosive_article',
        method: 'POST',
    },
    //筛选七天爆文
    filterSevenDayExplosiveArticle: {
        url: '/filter_seven_day_explosive_accounts',
        method: 'POST',
    },
    //筛选爆粉爆文
    filterExplosiveGrowthAccount: {
        url: '/filter_explosive_growth_account',
        method: 'POST',
    },
};
