// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//import Vue from 'vue'
import Axios from "axios"
import App from './App'
//import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale';
import router from './router/index.test'
import store from "./state/index"
import ElementUI from 'element-ui'
import { MessageBox } from 'element-ui';
import messages from "./config/lang";
import 'element-ui/lib/theme-chalk/index.css'
import "babel-polyfill";
// import enLocale from 'element-ui/lib/locale/lang/en'
// import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
Vue.use(VueI18n)
Vue.use(ElementUI)
Vue.config.productionTip = false
const i18n = new VueI18n({
    locale: 'CN', // 语言标识
    messages: messages
})
locale.i18n((key, value) => i18n.t(key, value))
    // Vue.config.lang = 'zh-cn'
    // Vue.locale('zh-cn', zhLocale)
    // Vue.locale('en', enLocale)
Vue.prototype.$http = Axios;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
    /* eslint-disable no-new */

import {
    Button,
    Select,
    Dialog,
    Pagination,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Input,
    InputNumber,
    Table,
    TableColumn,
    Tooltip,
    Form,
    FormItem,
    Loading,
    Message,
} from 'element-ui';
Vue.use(Button);
Vue.use(Select);
Vue.use(Dialog);
Vue.use(Pagination);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tooltip);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
new Vue({
    el: '#app',
    router,
    store,
    i18n,
    components: { App },
    template: '<App/>'
})