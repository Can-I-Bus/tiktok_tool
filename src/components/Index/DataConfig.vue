<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="'热门数据配置'" width="550" :before-close="handleClose"
            style="border-radius: 8px;">
            <el-select @change="handleClick" clearable style="width: 100px" placeholder="数据分类" v-model="category">
                <el-option v-for="item in props.categoryList" :key="item.id" :label="item.class_name"
                    :value="item.id" />
            </el-select>
            <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
                <el-tab-pane label="低粉爆文" name="first">
                    <ModuleOne ref="moduleOne" :categoryId="category" />
                </el-tab-pane>
                <el-tab-pane label="爆粉账号" name="second">
                    <ModuleTwo ref="moduleTwo" :categoryId="category" />
                </el-tab-pane>
                <el-tab-pane label="7天爆文账号" name="third">
                    <ModuleThree ref="moduleThree" :categoryId="category" />
                </el-tab-pane>
                <el-tab-pane label="常规爆文" name="fourth">
                    <ModuleFour ref="moduleFour" :categoryId="category" />
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, defineProps, defineEmits, getCurrentInstance, watch } from 'vue'
import ModuleOne from './DataConfigCom/ModuleOne.vue'
import ModuleTwo from './DataConfigCom/ModuleTwo.vue'
import ModuleThree from './DataConfigCom/ModuleThree.vue'
import ModuleFour from './DataConfigCom/ModuleFour.vue'
const { $api } = getCurrentInstance().proxy
const props = defineProps({
    isShow: Boolean,
    categoryList: Array,
    currCategory: Number
})

const category = ref('')

const moduleOne = ref(null)

const moduleTwo = ref(null)

const moduleThree = ref(null)

const moduleFour = ref(null)

const activeName = ref('first')

const handleClick = () => {
    if (category.value !== '' && category.value !== undefined) {
        if (activeName.value === 'first') {
            setTimeout(() => {
                moduleOne.value.fetchLowExplosiveConfig()
            }, 100)
        } else if (activeName.value === 'second') {
            setTimeout(() => {
                moduleTwo.value.fetchExplosiveAccConfig()
            }, 100)
        } else if (activeName.value === 'third') {
            setTimeout(() => {
                moduleThree.value.fetchSevenDayExplosiveConfig()
            }, 100)
        } else if (activeName.value === 'fourth') {
            setTimeout(() => {
                moduleFour.value.fetchExplosiveConfig()
            }, 100)
        }
    } else {
        moduleOne.value.clearFrom()
        moduleTwo.value.clearFrom()
        moduleThree.value.clearFrom()
        moduleFour.value.clearFrom()
    }
}


const handleClose = () => {
    moduleOne.value.clearFrom()
    moduleTwo.value.clearFrom()
    moduleThree.value.clearFrom()
    moduleFour.value.clearFrom()
    category.value = ''
    emits('handleClose')
}

const emits = defineEmits(['handleClose'])

watch(() => props.isShow, (val) => {
    if (val) {
        if (props.currCategory !== '' && props.currCategory !== undefined) {
            category.value = props.currCategory
            handleClick()
        }
    }
})
</script>
<style scoped lang='scss'></style>