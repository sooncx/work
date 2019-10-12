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
  Menu,
  MenuItem,
  Button,
  Upload,
  RadioGroup,
  Select,
  Option,
  Table,
  TableColumn,
  Popover,
  Pagination,
  Dialog,
  Message,
  MessageBox,
  Radio,
  DatePicker,
  Loading,
  Checkbox
} from "element-ui";

Vue.component("el-row", Row);
Vue.component("el-col", Col);
Vue.component("el-dropdown", Dropdown);
Vue.component("el-dropdown-menu", DropdownMenu);
Vue.component("el-dropdown-item", DropdownItem);
Vue.component("el-input", Input);
Vue.component("el-menu",Menu);
Vue.component("el-menu-item",MenuItem);
Vue.component("el-tree", Tree);
Vue.component("el-radio", Radio);
Vue.component("el-radio-group",RadioGroup)
Vue.component("el-button", Button);
Vue.component("el-select", Select);
Vue.component("el-option", Option);
Vue.component("el-table", Table);
Vue.component("el-table-column", TableColumn);
Vue.component("el-pagination", Pagination);
Vue.component("el-popover",Popover);
Vue.component("el-dialog", Dialog);
Vue.component("el-date-picker", DatePicker);
Vue.component("el-checkbox", Checkbox);
Vue.use(Loading.directive);
Vue.use(Upload)
Vue.prototype.$loading = Loading.service;
Vue.prototype.$API = API;
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$prompt = MessageBox.prompt;
export default Vue;
