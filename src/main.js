import 'element-plus/dist/index.css';
import './assets/reset.scss';
import 'vxe-table/lib/style.css';

import { createApp } from 'vue';
import VXETable from 'vxe-table';
import { VxeInput } from 'vxe-table';
import ElementPlus from 'element-plus';
import Http from './api/http';
import App from './App.vue';
import router from './router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// import echarts from './utils/echarts';
function useTable(app) {
    app.use(VXETable);
    app.use(VxeInput);
}
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.config.globalProperties.$ELEMENT = {
    size: 'small',
};
app.config.globalProperties.$api = Http;
// app.config.globalProperties.$echarts = echarts;
app.use(ElementPlus);
app.use(useTable);
app.use(router);

app.mount('#app');
