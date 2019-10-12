// 注册插件  按需引入 减小包大小
//  @element-ui  地址  http://element-cn.eleme.io/#/zh-CN

import Vue from "vue";
import API from "../api/httpApi";
import '@/public/css/reset.scss';
import '@/public/css/ele-reset.scss';
import {
  Row,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Tree,
  Button,
  Select,
  Option,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Message,
  MessageBox,
  Radio,
  DatePicker,
  Upload,
  Checkbox,
  Loading,
  Popover 
} from "element-ui";

Vue.component("el-row", Row);
Vue.component("el-col", Col);
Vue.component("el-dropdown", Dropdown);
Vue.component("el-dropdown-menu", DropdownMenu);
Vue.component("el-dropdown-item", DropdownItem);
Vue.component("el-input", Input);
Vue.component("el-tree", Tree);
Vue.component("el-radio", Radio);
Vue.component("el-button", Button);
Vue.component("el-select", Select);
Vue.component("el-option", Option);
Vue.component("el-table", Table);
Vue.component("el-table-column", TableColumn);
Vue.component("el-pagination", Pagination);
Vue.component("el-dialog", Dialog);
Vue.component("el-date-picker", DatePicker);
Vue.component("el-upload", Upload);
Vue.component("el-checkbox", Checkbox);
Vue.component("el-popover", Popover);
Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$API = API;
Vue.prototype.$msg = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

export default Vue;
