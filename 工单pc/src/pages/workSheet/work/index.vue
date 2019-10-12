<template>
	<div class="work-page">
		<div class="tabs">
			<a
				:class="{'item':true,'active':item.isActive==true}"
				v-for="(item,index) in tabs"
				:key="index"
				@click="tabsChange(item.val,item.isActive,item)"
			>{{item.txt}}</a>
			<el-popover class="app-hover" placement="right" trigger="hover">
				<img class="app-bg" src="../../../assets/img/dl.png">
				<span slot="reference" class="item">
					下载APP<span class="el-icon-download"></span>
				</span>
			</el-popover>
		</div>
		<div class="option">
			<div class="left">
				<el-button type="primary" @click="createWork" size="small">新建工单</el-button>
				<el-button v-if="this.searchParams.status==3" @click="batchCompletion" size="small">批量完成工单</el-button>
			</div>
			<div class="right">
				<el-select style="width: 120px;" v-model="searchType" placeholder="请选择" size="small">
					<el-option v-for="(item,index) in searchOption" :key="index" :label="item.val" :value="item.key"></el-option>
				</el-select>
				<el-input v-if="searchType!=2" class="serach-w" placeholder="安装人员、车主、车牌号、设备号" v-model="searchParams.searchValues" size="small"></el-input>
				<el-autocomplete
				v-if="searchType==2"
				class="inline-input"
				v-model="searchParams.searchValues"
				size="small"
				:fetch-suggestions="querySearch"
				:trigger-on-focus="false"
				placeholder="安装人员"
				@select="handleSelect"
				>
					<template slot-scope="{ item }">
						<span>{{ item.value }}</span>
						<a v-if="item.flag==2" class="terminal-type">(已删除)</a>
					</template>
				</el-autocomplete>
				<el-select style="width: 150px;" v-model="searchParams.terminalType" placeholder="请选择设备型号" size="small">
					<el-option
						v-for="(item,index) in terminalList"
						:key="index"
						:label="item.typemap"
						:value="item.type"
					></el-option>
				</el-select>
				<el-date-picker
					v-model="times"
					format="yyyy-MM-dd"
					value-format="yyyy-MM-dd"
					type="daterange"
					size="small"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:picker-options="pickerOptions"
				></el-date-picker>

				<el-button
					type="primary"
					style="margin-left:10px;"
					:loading="this.isLoading"
					size="small"
					@click="btnSearch()"
				>查询</el-button>
			</div>
		</div>
		<div class="content">
			<div class="table">
				<el-table
					v-loading="isLoading"
					:data="tableData"
					style="width: 100%;"
					height="100%"
					size="small"
					:stripe="true"
					@selection-change="SelectionChange"
				>
					<el-table-column type="selection" width="50"></el-table-column>
					<el-table-column v-for="(item,index) in displayTbleCols" :label="item.title" :key="index" :fixed="item.fixed" :align="item.align"  :width="item.width">
						<template slot-scope="scope">
							<template v-if="item.key==='status'">
								<el-tag :type="computedTagType(scope.row[item.key])">{{scope.row[item.key] | filterStatus}}</el-tag>
							</template>
							<template v-else-if="item.key==='installWorkerName'">
									<a>{{scope.row.installWorkerName}}</a>
									<br v-if="scope.row.installWorkerFlag===2">
									<a v-if="scope.row.installWorkerFlag===2" style="color:#999999;font-size:12px;"> (已删除)</a>
							</template>
							<template v-else-if="item.key==='workSheetDeviceVo'">
								<template v-if="scope.row.workSheetDeviceVo">
									<div v-for="(obj,index) in scope.row.workSheetDeviceVo" :key="index">
										<el-tooltip :content="'设备号：'+obj.terminalNo" placement="bottom-start">
											<span class="terminal-number">
												<a>{{scope.row.vehicleFlag == 0?obj.plate:''}}</a>
												<a class="terminal-type">({{obj.terminalType}})</a>
											</span>
										</el-tooltip>
									</div>
								</template>
								
							</template>
							<template v-else-if="item.key==='workSheetDeviceVoImgs'">
								<imgs-show class="imgs-show" :data="getImgUrl(scope.row.workSheetDeviceVo,scope.row.vehicleFlag)"></imgs-show>
							</template>
							<template v-else-if="item.key==='edit'">
								<el-button @click="editShow(scope.row,true)" type="text" size="small">查看</el-button>							
								<span v-if="scope.row.installWorkerFlag!=2">
									<el-button
										v-if="scope.row.status<3"
										@click="editShow(scope.row,false)"
										type="text"
										size="small"
									>修改</el-button>
									<span></span>
									<el-button
										v-if="scope.row.status==3"
										@click="changeStatus(scope.row,4)"
										type="text"
										size="small"
									>完成</el-button>
									<span></span>
									<el-button
										v-if="scope.row.status<3"
										@click="changeStatus(scope.row,5)"
										type="text"
										size="small"
									>取消</el-button>
								</span>
							</template>
							<template v-else>
								{{scope.row[item.key] |filterDisplayValue}}
							</template>
						
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="table-page">
				<el-pagination
					@current-change="changePage"
					:current-page.sync="searchParams.pageNumber"
					:page-size="searchParams.pageSize"
					layout="total, prev, pager, next"
					:total="total"
				></el-pagination>
			</div>
		</div>

		<el-dialog :title="isAdd==true?'新建工单':'编辑工单'" :visible.sync="dialogFormVisible" width="700px">
			<el-form
				:model="form"
				:rules="rules"
				ref="userForm"
				label-width="100px"
				class="ruleForm"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="车主姓名" prop="carOwner">
							<el-input v-model="form.carOwner" placeholder="请填写车主姓名" :clearable="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系电话" prop="phone">
							<el-input v-model="form.phone" placeholder="请填写联系电话" :clearable="true"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="安装人员" prop="installWorker">
							<el-select v-model="form.installWorker" placeholder="请选择">
								<el-option
									v-if="item.flag==1"
									v-for="(item,index) in userList"
									:key="index"
									:label="item.name"
									:value="item.userId"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="预安装时间" prop="installTime">
							<el-date-picker
								type="datetime"
								placeholder="选择日期"
								format="yyyy-MM-dd HH:mm:ss"
								value-format="yyyy-MM-dd HH:mm:ss"
								v-model="form.installTime"
								style="width: 100%;"
							></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-checkbox v-model="checked" class="checkbox"></el-checkbox>
				<el-form-item label="安装设备">
					<el-input v-show="false" type="textarea" v-model="form.address"></el-input>
					<div :class="{'selectVeh':selectVehList.length>0}">
						<template v-if="dialogFormVisible">
							<el-tag
								v-for="(tag,index) in selectVehList"
								:key="index"
								closable
								:disable-transitions="false"
								@close="handleClose(tag)"
							>{{tag.plate}}</el-tag>
						</template>
					</div>
					<div class="my-selectVeh">
						<selectVeh
						    :checked="checked"
							v-if="dialogFormVisible"
							top="11px"
							left="100%"
							placeholder="请输入车牌号"
							:shadow="false"
							:inputType="inputType"
							:isShowTree.sync="isShowTree"
							@change="vehChange"
							@getValue= "getValue"
						></selectVeh>
					</div>
				</el-form-item>
				<el-form-item label="安装地点" prop="address">
					<el-input type="textarea" v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="备注信息" prop="remark">
					<el-input type="textarea" v-model="form.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="right">
				<el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
				<el-button v-if="isAdd" type="primary" @click="InsertWorkSheet" size="small" :loading="btnLoading">确 定</el-button>
				<el-button v-else type="primary" @click="confirmEdit" size="small" :loading="btnLoading">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="查看工单" :visible.sync="isShowInfo" width="700px">
			<el-form
				label-width="100px"
				class="ruleForm"
				v-if="isShowInfo"
				:disabled='true'
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="车主姓名">
							<el-input v-model="form.carOwner" placeholder="请填写车主姓名" :clearable="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系电话">
							<el-input v-model="form.phone" placeholder="请填写联系电话" :clearable="true"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="安装人员">
							<el-select v-model="form.installWorker" placeholder="请选择">
								<el-option
									v-for="(item,index) in userList"
									:key="index"
									:label="item.name"
									:value="item.userId"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="预安装时间">
							<el-date-picker
								type="datetime"
								placeholder="选择日期"
								format="yyyy-MM-dd HH:mm:ss"
								value-format="yyyy-MM-dd HH:mm:ss"
								v-model="form.installTime"
								style="width: 100%;"
							></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="安装设备" v-show="isShowDeviceInfo">
					<div :class="{'selectVeh':selectVehList.length>0}">
						<el-tag
							v-for="(tag,index) in selectVehList"
							:key="index"
							:disable-transitions="false"
							@close="handleClose(tag)"
						>{{tag.plate}}</el-tag>
					</div>
				</el-form-item>
				<el-form-item label="安装地点">
					<el-input type="textarea" v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="备注信息">
					<el-input type="textarea" v-model="form.remark"></el-input>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import imgsShow from "@/components/imgsShow.vue";
import selectVeh from "@/components/selectVeh/selectVeh.vue";
export default {
	components: { imgsShow, selectVeh },
	props: {},
	data() {
		var validateRemark = (rule, value, callback) => {
        if (!this.checked&&(this.form.remark == null || this.form.remark == '')) {
          callback(new Error('请备注设备信息（设备名称，设备号）'));
        } else {
          callback();
        }
      };
		var baseTableColsConfig={
			index:{
				title:"序号",
				key:"index",
				width:50
			},
			createTime:{
				title:"创建时间",
				key:"createTime",
				width:160
			},
			installTime:{
				title:"预安装时间",
				key:"installTime",
				width:160
			},
			confirmTime:{
				title:"确认时间",
				key:"confirmTime",
				width:160
			},
			status:{
				title:"工单状态",
				key:"status",
				width:80
			},
			installWorkerName:{
				title:"安装人员",
				key:"installWorkerName"
			},
			carOwner:{
				title:"车主",
				key:"carOwner"
			},
			phone:{
				title:"车主联系电话",
				key:"phone",
				width:130
			},
			workSheetDeviceVo:{
				title:"车辆列表",
				key:"workSheetDeviceVo",
				width:180
			},
			workSheetDeviceVoImgs:{
				title:"安装位置",
				key:"workSheetDeviceVoImgs",
				width:160
			},
			address:{
				title:"安装地点",
				key:"address",
				width:200
			},
			installedTime:{
				title:"上传安装信息时间",
				key:"installedTime",
				width:160
			},
			finishTime:{
				title:"完成时间",
				key:"finishTime",
				width:160
			},
			cancelTime:{
				title:"取消时间",
				key:"cancelTime",
				width:160
			},
			remark:{
				title:"备注",
				key:"remark"
			},
			edit:{
				title:"操作",
				key:"edit",
				align:"center",
				width:120,
				fixed:"right"
			}
		}
		return {
			checked:false,
			changeFlag:true,
			selectValue:null,
			isLoading: false,
			btnLoading: false,
			tabs: {
				0: {
					val: 0,
					txt: "全部",
					isActive: true
				},
				1: {
					val: 1,
					txt: "待确认",
					isActive: false
				},
				2: {
					val: 2,
					txt: "待安装",
					isActive: false
				},
				3: {
					val: 3,
					txt: "已安装",
					isActive: false
				},
				4: {
					val: 4,
					txt: "已完成",
					isActive: false
				},
				5: {
					val: 5,
					txt: "已取消",
					isActive: false
				}
			},
			activeTabIndex:0,
			isAdd: true,
			total: 0,
			searchOption: [
				{
					key: 0,
					val: "全部"
				},
				{
					key: 1,
					val: "车主名称"
				},
				{
					key: 2,
					val: "安装人员"
				},
				{
					key: 3,
					val: "车牌号"
				},
				{
					key: 4,
					val: "设备号"
				}
			],
			times: "",
			searchType: 0,
			searchParams: {
				userId: -1,
				pageSize: 50,
				pageNumber: 1,
				status: 0,
				searchType: 0,
				searchValues: "",
				startTime: "",
				endTime: "",
				terminalType: ""
			},
			pickerOptions: {
				shortcuts: [
					{
						text: "最近一周",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit("pick", [start, end]);
						}
					},
					{
						text: "最近一个月",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit("pick", [start, end]);
						}
					},
					{
						text: "最近三个月",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit("pick", [start, end]);
						}
					}
				]
			},
			terminalList: [],
			userList: [],
			inputType: ["vehicle"],
			isShowTree: false,
			tableData: [],
			form: {
				address: "",
				majorIds: "",
				carOwner: "",
				devices: "",
				installTime: "",
				installWorker: "",
				phone: "",
				remark: "",
				VehIds:"",
				vehicleFlag:1
			},
			rules: {
				carOwner: [
					// { required: true, message: "请输入车主姓名", trigger: "blur" },
					{
						pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]{2,8}$/,
						message: "姓名2~8个字符"
					}
				],
				phone: [
					{ required: true, message: "请输入正确的手机号", trigger: "blur" },
					{
						pattern: /^1[3456789]\d{9}$/,
						message: "目前只支持中国大陆的手机号码"
					}
				],
				installWorker: [
					{ required: true, message: "请选择安装人员", trigger: "blur" }
				],
				installTime: [
					{ required: true, message: "请选择安装时间", trigger: "blur" }
				],
				devices: [
					{ required: true, message: "请选择安装设备", trigger: "blur" }
				],
				address: [
					{ required: true, message: "请输入安装地址", trigger: "blur" },
					{ min: 0, max: 100, message: '安装地址字符长度不能超过100'},
					// {
					// 	pattern: /^[a-zA-Z0-9\u4E00-\u9FA5\,\.\，\。]/,
					// 	message: "禁止输入特殊字符"
					// }
				],
				remark: [
					{ validator: validateRemark, trigger: 'blur' },
					{min: 0, max: 100, message: '安装备注字符长度不能超过100'},
					// { required: true, min: 0, max: 100, message: '请备注设备信息'},
					// {
					// 	pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]/,
					// 	message: "安装备注字符长度不能超过100"
					// }
				]
			},
			isShowInfo: false,
			isShowDeviceInfo:true,
			dialogFormVisible: false,
			selectionRow: [],
			selectVehList: {},
			restaurants: [],
			isSelect:true,
			isConfirm:false,
			isInstall:true,
			isCancel:false,
			pageConfigs:{
				tableCols:{
					0:[
						baseTableColsConfig["index"],
						baseTableColsConfig["createTime"],
						baseTableColsConfig["installTime"],
						baseTableColsConfig["confirmTime"],
						baseTableColsConfig["installedTime"],
						baseTableColsConfig["finishTime"],
						baseTableColsConfig["cancelTime"],
						baseTableColsConfig["status"],
						baseTableColsConfig["installWorkerName"],
						baseTableColsConfig["carOwner"],
						baseTableColsConfig["workSheetDeviceVo"],
						baseTableColsConfig["workSheetDeviceVoImgs"],
						baseTableColsConfig["address"],
						baseTableColsConfig["remark"],
						baseTableColsConfig["edit"],
					],
					1:[
						baseTableColsConfig["index"],
						baseTableColsConfig["createTime"],
						baseTableColsConfig["installTime"],
						baseTableColsConfig["status"],
						baseTableColsConfig["installWorkerName"],
						baseTableColsConfig["carOwner"],
						baseTableColsConfig["workSheetDeviceVo"],
						// baseTableColsConfig["workSheetDeviceVoImgs"],
						baseTableColsConfig["address"],
						baseTableColsConfig["remark"],
						baseTableColsConfig["edit"],
					],
					2:[
						baseTableColsConfig["index"],
						baseTableColsConfig["createTime"],
						baseTableColsConfig["installTime"],
						baseTableColsConfig["confirmTime"],
						baseTableColsConfig["status"],
						baseTableColsConfig["installWorkerName"],
						baseTableColsConfig["carOwner"],
						baseTableColsConfig["workSheetDeviceVo"],
						baseTableColsConfig["address"],
						baseTableColsConfig["remark"],
						baseTableColsConfig["edit"],
					],
					3:[
						baseTableColsConfig["index"],
						baseTableColsConfig["createTime"],
						baseTableColsConfig["installTime"],
						baseTableColsConfig["confirmTime"],
						baseTableColsConfig["installedTime"],
						baseTableColsConfig["status"],
						baseTableColsConfig["installWorkerName"],
						baseTableColsConfig["carOwner"],
						baseTableColsConfig["workSheetDeviceVo"],
						baseTableColsConfig["workSheetDeviceVoImgs"],
						baseTableColsConfig["address"],
						baseTableColsConfig["remark"],
						baseTableColsConfig["edit"],
					],
					4:[
						baseTableColsConfig["index"],
						baseTableColsConfig["createTime"],
						baseTableColsConfig["installTime"],
						baseTableColsConfig["confirmTime"],
						baseTableColsConfig["installedTime"],
						baseTableColsConfig["finishTime"],
						baseTableColsConfig["status"],
						baseTableColsConfig["installWorkerName"],
						baseTableColsConfig["carOwner"],
						baseTableColsConfig["workSheetDeviceVo"],
						baseTableColsConfig["workSheetDeviceVoImgs"],
						baseTableColsConfig["address"],
						baseTableColsConfig["remark"],
						baseTableColsConfig["edit"],
					],
					5:[
						baseTableColsConfig["index"],
						baseTableColsConfig["createTime"],
						baseTableColsConfig["installTime"],
						baseTableColsConfig["cancelTime"],
						baseTableColsConfig["status"],
						baseTableColsConfig["installWorkerName"],
						baseTableColsConfig["carOwner"],
						baseTableColsConfig["workSheetDeviceVo"],
						baseTableColsConfig["remark"],
						baseTableColsConfig["edit"],
					]
				}
			}
		};
	},
	watch: {
		checked(newval,oldval){
			if (!newval) {
				this.selectVehList = {};
			}
		},
		times(newVal, oldVal) {
			this.searchParams.startTime = newVal[0] + " 00:00:00";
			this.searchParams.endTime = newVal[1] + " 23:59:59";
		},
		pageNumber(newVal, oldVal) {
			this.searchParams.pageNumber = newVal;
		},
		dialogFormVisible(val) {
			if (!val) {
				this.isShowTree = false;
			}
		},
		selectVehList:{
			handler(newVal, oldVal) {
				console.log("VehList:",newVal)
			},
			deep: true,
		}
	},
	filters:{
		filterStatus(val){
			var result=""
			switch(Number(val)){
				case 1:
					result="待确认"
					break;
				case 2:
					result="待安装"
					break;
				case 3:
					result="已安装"
					break;
				case 4:
					result="已完成"
					break;
				case 5:
					result="已取消"
					break;
				default:
					result="其他"
					break;
			}
			return result
			
		},
		filterDisplayValue(val) {
			if (val === undefined || val === null) {
				return "--";
			} else {
				return val;
			}
		}
	},
	computed: {
		displayTbleCols(){
			return this.pageConfigs.tableCols[this.activeTabIndex] ||[];
		}
	},
	methods: {
		getValue(data) {
			this.selectValue = data;
		},
		computedTagType(val){
			var result=""
			switch(Number(val)){
				case 1:
					result="warning"
					break;
				case 2:
					result="danger"
					break;
				case 3:
					result=""
					break;
				case 4:
					result="success"
					break;
				case 5:
					result="info"
					break;
				default:
					result="info"
					break;
			}
			return result
		},
		querySearch(queryString, cb) {
			debugger
			this.isSelect=false;
			var queryStr=queryString.toString();
			var restaurants = this.restaurants;
			var results = queryStr ? restaurants.filter(this.createFilter(queryStr)) : restaurants;
			console.log('results:',results)
			// 调用 callback 返回建议列表的数据
			cb(results);
		},
		createFilter(queryString) {
			return (restaurant) => {
			return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
			};
		},
		handleSelect(item) {
			this.searchParams.userId=-1;
			this.searchParams.userId=item.userId;
			this.isSelect=true;
			console.log(item);
		},
		tabsChange(val, isActive,obj) {
			if (!isActive) {
				this.tableData=[];
				this.isLoading=true;
				Object.keys(this.tabs).forEach(key => {
					if (this.tabs[key].val == val) {
						this.tabs[key].isActive = true;
						this.searchParams.status = this.tabs[key].val;
					} else {
						this.tabs[key].isActive = false;
					}
				});
				this.activeTabIndex=obj.val
				// console.log('val:',val)
				// switch (obj.txt) {
				// 	case "待确认":
				// 		this.isConfirm=false;
				// 	case "待安装":
				// 		this.isConfirm=true;
				// 		this.isInstall=false;
				// 		break;
				// 	case "已取消":
				// 		this.isConfirm=false;
				// 		this.isInstall=false;
				// 		this.isCancel=true;
				// 		break;
				// 	default:
				// 		this.isConfirm=true;
				// 		this.isInstall=true;
				// 		break;
				// }
				this.searchParams.pageNumber=1;
				this.SelectWorkSheetListByCondition(this.searchParams);
			}
		},
		SelectionChange(row) {
			this.selectionRow = row;
		},
		getImgUrl(arr,flag) {
			let imgUrlList = [];
			if(arr){
				arr.forEach(item => {
					if (item.installPosition&&flag == 0) {
						imgUrlList.push({
							title: item.installPosition,
							path: item.pictureUrl
						});
					}else {
						imgUrlList.push({
							title: null,
							path: item.pictureUrl
						});
					}
				});
			}
			return imgUrlList;
		},
		getUserList() {
			this.$http({
				url: this.HOST + "/http/InstallWorker/SelectInstallWorker.json"
			})
				.then(res => {
					if (res.flag === 1) {
						this.userList = res.obj;
						var tempArr=[];
						res.obj.forEach(item => {
							tempArr.push({value:item.name,userId:item.userId,flag:item.flag});
						});
						this.restaurants=tempArr;
					} else {
						this.$message({
							showClose: true,
							message: res.msg,
							type: "warning"
						});
					}
				})
				.catch(e => {
					console.error(e);
					this.$message("网络异常，请稍后再试", {
						// showClose: false,
						// showConfirmButton: false
					});
				});
		},
		checkTerminal(obj) {
			this.$http({
				url: this.HOST + "/http/WorkSheet/CheckTerminalTypeStatus.json",
				params: {vehicleId:obj.vehicleId}
			})
				.then(res => {
					if (res.flag === 1) {
						this.$set(this.selectVehList,obj.plate+"_"+obj.vehicleId,{
							vehId: obj.vehicleId,
							plate: obj.plate
						})
						// this.selectVehList[obj.plate+"_"+obj.vehicleId] = {
						// 	vehId: obj.vehicleId,
						// 	plate: obj.plate
						// };
						if(res.obj==1){
							this.$message({
								showClose: true,
								message: "设备"+obj.plate+res.msg+",再次安装将覆盖之前的安装信息",
								type: "warning"
							});
						}
					} else {
						this.$message({
							showClose: true,
							message: res.msg,
							type: "warning"
						});
					}
				})
				.catch(e => {
					console.error(e);
					this.$message("网络异常，请稍后再试", {
						// showClose: false,
						// showConfirmButton: false
					});
				});
		},
		getTerminalList() {
			this.$http({
				url: this.HOST + "/http/User/GetTerminalMap.json"
			})
				.then(res => {
					if (res.flag === 1) {
						this.terminalList = res.obj;
						this.terminalList.unshift({ type: "", typemap: "全部设备" });
					} else {
						this.$message({
							showClose: true,
							message: res.msg,
							type: "warning"
						});
					}
				})
				.catch(e => {
					console.error(e);
					this.$message("网络异常，请稍后再试", {
						// showClose: false,
						// showConfirmButton: false
					});
				});
		},
		clearParams() {
			let obj = {
				searchType: 0,
				searchValues: "",
				startTime: "",
				endTime: "",
				terminalType: ""
			};
			this.times = "";
			this.searchParams = Object.assign(this.searchParams, obj);
		},
		btnSearch(){
			this.searchParams.pageNumber=1;
			if(this.searchType==2&&this.searchParams.searchValues==""){
				this.$message({
					showClose: true,
					message: "安装人员不能为空",
					type: "warning"
				});
				return false;
			}
			if(!this.isSelect){
				this.$message({
					showClose: true,
					message: "请从候选列表选择安装人员",
					type: "warning"
				});
				return false;
			}
			this.SelectWorkSheetListByCondition(this.searchParams);
		},
		SelectWorkSheetListByUserId(params) {
			this.isLoading = true;
			this.$http({
				url: this.HOST + "/http/WorkSheet/SelectWorkSheetListByUserId.json",
				params: params
			})
				.then(res => {
					// this.clearParams();
					this.isLoading = false;
					if (res.flag === 1) {
						this.total = res.total;
						let count = (params.pageNumber - 1) * params.pageSize;
						res.rows.forEach((row, index) => {
							row.index = count + index + 1;
						});
						this.tableData = res.rows;
					} else {
						this.$message({
							showClose: true,
							message: res.msg,
							type: "warning"
						});
					}
				})
				.catch(e => {
					this.isLoading = false;
					console.error(e);
					this.$message("网络异常，请稍后再试", {
						// showClose: false,
						// showConfirmButton: false
					});
				});
		},
		SelectWorkSheetListByCondition(params) {
			console.log("SelectWorkShee_params", params);
			var dateDiff=1;
			if(params.startTime!=""&&params.endTime!=""){
				var start = new Date(params.startTime);
				var end = new Date(params.endTime);
				console.log("start", start);
				console.log("end", end);
				dateDiff = end - start;
			}
			console.log("dateDiff", dateDiff);
			if (dateDiff <= 0) {
				this.$message({
					showClose: true,
					message: "起始时间大于结束时间",
					type: "warning"
				});
				return false;
			}

			this.isLoading = true;
			if (params.searchValues == "") {
				params.searchType = -1;
			} else {
				params.searchType = this.searchType;
			}
			this.$http({
				url: this.HOST + "/http/WorkSheet/SelectWorkSheetListByCondition.json",
				params: params
			})
				.then(res => {
					// this.clearParams();
					this.isLoading = false;
					this.$message({message: "查询成功",type: "success",duration:1000});
					if (res.flag === 1) {
						this.total = res.total;
						let count = (params.pageNumber - 1) * params.pageSize;
						res.rows.forEach((row, index) => {
							row.index = count + index + 1;
							if(!row.confirmTime){
								row.confirmTime="";
							}
						});
						this.tableData = res.rows;
					} else {
						this.$message({
							showClose: true,
							message: res.msg,
							type: "warning"
						});
					}
				})
				.catch(e => {
					this.isLoading = false;
					console.error(e);
					this.$message({message: "网络异常，请稍后再试",type: "warning"});
				});
		},
		changePage(val) {
			console.log(`当前页: ${val}`);
			this.SelectWorkSheetListByCondition(this.searchParams);
		},
		clearForm() {
			for (const key in this.form) {
				if (this.form.hasOwnProperty(key)) {
					this.form[key] = "";
				}
			}
		},
		vehChange(obj) {
			if(obj){
				this.checkTerminal(obj);
				// if(this.selectVehList.length<10){
				// 	this.checkTerminal(obj);
				// }else{
				// 	this.$message({message: "安装设备一次不能超过十台",type: "warning"});
				// }
			}
			// this.selectVehList[obj.plate+"_"+obj.vehicleId] = {
			// 	vehId: obj.vehicleId,
			// 	plate: obj.plate
			// };
		},
		handleClose(tag) {
			Vue.delete(this.selectVehList, tag.plate+"_"+tag.vehId);
		},
		createWork() {
			this.checked = false;
			this.getUserList();
			this.isAdd = true;
			this.clearForm();
			this.dialogFormVisible = true;
			this.selectVehList = {};
		},
		InsertWorkSheet() {
			// if (this.checked == true&&this.selectValue == null||this.selectValue == ''){
			// 	this.$message({
			// 		message: "请备注信息！",
			// 		type: "warning"
			// 	})
			// }else
			this.$refs["userForm"].validate(valid => {
				if (valid) {
					let devices = [];
					Object.keys(this.selectVehList).forEach(key => {
						console.log("key:",key)
						devices.push(this.selectVehList[key].vehId);
					});
					if(devices.length==0&&this.checked){
						this.$message({
							showClose: true,
							message: "请从选择安装设备",
							type: "warning"
						});
						return false;
					}

					this.form.devices = devices.join(",");
					this.form.vehicleFlag = this.checked?0:1;
					this.btnLoading = true;
					this.$http({
						url: this.HOST + "/http/WorkSheet/InsertWorkSheet.json",
						params: this.form
					})
						.then(rst => {
							this.btnLoading = false;
							if (rst.flag === 1) {
								this.dialogFormVisible = false;
								this.SelectWorkSheetListByCondition(this.searchParams);
								this.$message({
									showClose: true,
									message: "添加成功",
									type: "success"
								});
							} else {
								let temp=this.selectVehList;
								let arr=[];
								Object.keys(temp).forEach(key => {
									if(rst.obj.indexOf(temp[key].vehId)!=-1){
										arr.push(temp[key].plate);
									}
								});
								
								this.$message("存在正在安装设备："+arr.join(',')+"。请核实", {});
							}
							// this.isloadingApi = false;
						})
						.catch(e => {
							// this.isloadingApi = false;
							console.error(e);
							this.$message("网络异常，请稍后再试", {});
						});
				} else {
					return false;
				}
			});
		},
		changeStatus(row, status) {
			let tip = "是否完成该工单（该操作不可逆）？";
			if (status == 5) {
				tip = "是否取消该工单（该操作不可逆）？";
			}
			this.$confirm(tip, "确认信息", {
				distinguishCancelAndClose: true,
				confirmButtonText: "确认",
				cancelButtonText: "取消"
			})
				.then(() => {
					this.confirmUpStatus(row.id, status);
				})
				.catch(action => {});
		},
		confirmUpStatus(id, status) {
			this.$http({
				url: this.HOST + "/http/WorkSheet/UpdateWorkSheetStatus.json",
				params: { id: id, status: status }
			})
				.then(rst => {
					if (rst.flag === 1) {
						this.dialogFormVisible = false;
						this.SelectWorkSheetListByCondition(this.searchParams);
						this.$message({
							showClose: true,
							message: "操作完成",
							type: "success"
						});
					} else {
						this.$message({
							showClose: true,
							message: "操作失败，" + rst.msg,
							type: "warning"
						});
					}
				})
				.catch(e => {
					console.error(e);
					this.$message("网络异常，请稍后再试", {});
				});
		},
		editShow(row, flag) {
			if (!flag) {
				this.checked = row.vehicleFlag == 0?true:false;
			}
			// this.changeFlag = flag;
			console.log(row);
			let devices = {};
			for (const key in this.form) {
				if (this.form.hasOwnProperty(key)) {
					this.form[key] = row[key];
				}
			}
			if(row.workSheetDeviceVo){
				row.workSheetDeviceVo.forEach(item => {
					devices[item.plate+"_"+item.deviceId] = { vehId: item.deviceId, plate: item.plate };
				});
			}
			this.selectVehList = devices;
			if (flag) {
				this.isShowInfo = true;
				this.isShowDeviceInfo = row.vehicleFlag == 0?true:false;
			} else {
				this.currentId = row.id;
				this.dialogFormVisible = true;
				this.isAdd = false;
			}
		},
		confirmEdit() {
			this.form.id = this.currentId;
			let devices = [];
			Object.keys(this.selectVehList).forEach(key => {
				devices.push(this.selectVehList[key].vehId);
			});
			this.form.devices = devices.join(",");
			this.form.vehicleFlag = this.checked?0:1;
			this.btnLoading = true;
			this.$refs["userForm"].validate(valid => {
				if (valid) {
					this.$http({
						url: this.HOST + "/http/WorkSheet/UpdateWorkSheet.json",
						params: this.form
					})
						.then(res => {
							this.btnLoading = false;
							if (res.flag === 1) {
								this.dialogFormVisible = false;
								this.SelectWorkSheetListByCondition(this.searchParams);
								this.$message({
									showClose: true,
									message: "修改成功",
									type: "success"
								});
							} else {
								this.$message({
									showClose: true,
									message: res.msg,
									type: "warning"
								});
							}
						})
						.catch(e => {
							console.error(e);
							this.$message("网络异常，请稍后再试", {});
						});
				} else {
					return false;
				}
			});
		},
		batchCompletion() {
			if (this.selectionRow.length == 0) {
				this.$message({
					showClose: true,
					message: "请先勾选要处理的工单",
					type: "warning"
				});
				return false;
			}
			let ids = [];
			this.selectionRow.forEach(item => {
				ids.push(item.id);
			});
			this.$http({
				url: this.HOST + "/http/WorkSheet/UpdateStatusByList.json",
				params: { ids: ids.join(","), status: 4 }
			})
				.then(res => {
					if (res.flag === 1) {
						this.SelectWorkSheetListByCondition(this.searchParams);
					} else {
						this.$message({
							showClose: true,
							message: res.msg,
							type: "warning"
						});
					}
				})
				.catch(e => {
					console.error(e);
					this.$message("网络异常，请稍后再试", {
					});
				});
		}
	},
	created() {},
	mounted() {
		this.getUserList();
		this.getTerminalList();
		if (this.$route.params.userId) {
			console.log("$route.params",this.$route.params)
			this.clearForm();
			this.searchType=2;
			this.searchParams.userId=this.$route.params.userId;
			this.searchParams.searchType=2;
			this.searchParams.searchValues=this.$route.params.name;
			let status=this.$route.params.status;
			this.tabsChange(status, false,this.tabs[status]);
			setTimeout(() => {
				parent.$("#workSheet-work a").addClass("active");
				parent.$("#workSheet-user a").removeClass("active");
				this.SelectWorkSheetListByCondition(this.searchParams);
			}, 800);
		} else {
			this.SelectWorkSheetListByCondition(this.searchParams);
		}
	}
};
</script>
<style lang="less" scoped>
.work-page {
	position: relative;
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	/deep/.el-dialog__title {
		font-size: 18px;
		font-family: PingFang-SC-Bold;
		font-weight: bold;
		color: #1184e5;
	}
	/deep/.el-table--striped
		.el-table__body
		tr.el-table__row--striped.el-table__row--striped.el-table__row--striped
		td {
		background-color: #f5f8fc; /*替换为你需要的颜色，觉得优先级不够就加!important*/
	}
	.tabs {
		width: 100%;
		height: 50px;
		line-height: 50px;
		border-bottom: 1px solid #e8e8e8;
		.item {
			padding: 13px 36px;
			font-size: 14px;
			font-family: PingFang-SC-Bold;
			font-weight: bold;
			color: #acb0b7;
			cursor: pointer;
		}
		.active {
			color: #1184e5;
			border-bottom: 3px solid #1184e5;
		}
		.app-hover{
			position: absolute;
			right: 0px;
		}
	}
	.option {
		line-height: 65px;
		padding: 0px 13px;
		/deep/.el-input {
			max-width: 200px;
		}
	}
	.left {
		float: left;
	}
	.right {
		text-align: right;
		.serach-w{
			max-width: 230px !important;
			width: 230px !important;
		}
	}
	.content {
		flex: 1;
		padding: 0px 10px;
		display: flex;
		flex-direction: column;
		.table {
			width: 100%;
			// height: 100%;
			flex: 1;
			border: 1px solid #e8e8e8;
			position: relative;
			/deep/.el-table__fixed-right::before,
			.el-table__fixed::before {
				background-color: transparent;
			}
			.el-table {
				position: absolute;
			}
			.terminal-number{
				cursor: pointer;
				a{
					color: #409EFF;
				}
				.terminal-type {
					color: #999999;
					font-size: 12px;
				}
			}
		}
		.table-page {
			text-align: right;
			padding: 10px;
		}
	}
	.my-selectVeh{
		display: inline-block;
	}
	/deep/.el-autocomplete-suggestion li{
		a{
				color: #999999;
				font-size: 12px;
		}
	}
	/deep/.el-select{
		width: 100%;
	}
}
.checkbox{
	position: fixed;
	margin-top: 10px;
	margin-left: 15px;
}
</style>