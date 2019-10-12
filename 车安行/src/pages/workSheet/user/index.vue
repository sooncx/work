<template>
	<div class="work-page">
		<div class="option">
			<div class="left">
				<el-button type="primary" @click="createWork" size="small">新建人员</el-button>
				<el-button @click="batchDel" size="small">批量删除</el-button>
			</div>
			<div class="right">
				<el-input placeholder="请输入安装人员名称" suffix-icon="el-icon-search" v-model="searchParams.name"  size="small"></el-input>
				<el-date-picker
					v-model="times"
					format="yyyy-MM-dd"
					value-format="yyyy-MM-dd"
					type="daterange"
					size="small"
					range-separator="至"
					start-placeholder="请选择加入日期"
					end-placeholder="请选择加入日期"
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
					<el-table-column type="index" label="序号" width="50"></el-table-column>
					<el-table-column prop="name" label="姓名" width="100"></el-table-column>
					<el-table-column prop="phone" label="联系方式" width="120"></el-table-column>
					<el-table-column prop="createTime" label="加入日期" width="180"></el-table-column>
					<el-table-column prop="username" label="账号" width="120"></el-table-column>
					<el-table-column prop="password" label="密码" width="150"></el-table-column>
					<el-table-column prop="allCounts" label="订单数" width="120">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="toWork(scope.row,0)" >{{scope.row.allCounts}}</el-button>
						</template>
					</el-table-column>
					<el-table-column label="待确认订单数" width="120">
						<template slot-scope="scope">
							<el-button
								type="text"
								size="small"
								@click="toWork(scope.row,1)"
							>{{scope.row.confirmCounts}}</el-button>
						</template>
					</el-table-column>
					<el-table-column label="待安装订单数" width="120">
						<template slot-scope="scope">
							<el-button
								type="text"
								size="small"
								@click="toWork(scope.row,2)"
							>{{scope.row.processiveCounts}}</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="remark" label="备注" min-width="180"></el-table-column>
					<el-table-column fixed="right" label="操作" width="100">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="editShow(scope.row)">修改</el-button>
							<el-button type="text" size="small" @click="delShow(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="table-page">
				<el-pagination
					background
					layout="total, prev, pager, next"
					:page-size="searchParams.pageSize"
					:current-page.sync="searchParams.pageNumber"
					:total="total"
					@current-change="changePage"
				></el-pagination>
			</div>
		</div>

		<el-dialog :title="isAdd==true?'新建人员':'人员编辑'" :visible.sync="dialogFormVisible" width="700px">
			
			<el-form
				:model="userForm"
				:rules="rules"
				ref="userForm"
				label-width="100px"
				class="ruleForm"
				v-if="dialogFormVisible"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="人员姓名" prop="name">
							<el-input v-model="userForm.name" placeholder="请填写人员真实姓名" :clearable="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系方式" prop="phone">
							<el-input v-model="userForm.phone" placeholder="请填写联系方式" :clearable="true"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="账号" prop="username">
							<el-input v-model="userForm.username" placeholder="请填写账号,首字母英文" :clearable="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="密码" prop="password">
							<el-input v-model="userForm.password" placeholder="英文或数字，6-12位" :clearable="true"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="备注信息" prop="remark">
					<el-input type="textarea" v-model="userForm.remark"></el-input>
				</el-form-item>
				<el-form-item class="right">
					<el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
					<el-button size="small" v-if="isAdd" type="primary" @click="InstallWorker" :loading="btnLoading">确 定</el-button>
					<el-button size="small" v-else type="primary" @click="confirmEdit" :loading="btnLoading">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import imgsShow from "@/components/imgsShow.vue";
export default {
	components: { imgsShow },
	props: {},
	data() {
		return {
			isLoading: false,
			btnLoading: false,
			isAdd: true,
			total: 0,
			times: "",
			searchParams: {
				pageSize: 50,
				pageNumber: 1,
				name: "",
				startTime: "",
				endTime: ""
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
			currentId: "",
			tableData: [],
			userForm: {
				name: "",
				phone: "",
				username: "",
				password: "",
				remark: ""
			},
			rules: {
				name: [
					{ required: true, message: "请输入安装人员姓名", trigger: "blur" },
					{ pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]{2,4}$/, message: "姓名2~4个字符" }
				],
				phone: [
					{ required: true, message: "请输入正确的手机号", trigger: "blur" },
					{
						pattern: /^1[3456789]\d{9}$/,
						message: "目前只支持中国大陆的手机号码"
					}
				],
				username: [
					{ required: true, message: "请输入账号", trigger: "blur" },
					{ pattern: /^[a-zA-Z][a-zA-Z0-9_]{2,11}$/, message: "长度3-12位,首字母英文+英文字母和数字" }
				],
				password: [
					{ required: true, message: "请输入密码", trigger: "blur" },
					{ pattern: /^[a-zA-Z0-9]{6,12}$/, message: "长度6-12位,英文字母+数字" }
				],
				remark: [
					{ min: 0, max: 100, message: '备注字符长度不能超过100'},
					// { pattern: /^[a-zA-Z0-9\u4E00-\u9FA5]{0,100}$/, message: "备注字符长度不能超过100" }
				]
			},
			dialogFormVisible: false,
			selectionRow: []
		};
	},
	watch: {
		times(newVal, oldVal) {
			this.searchParams.startTime = newVal[0] + " 00:00:00";
			this.searchParams.endTime = newVal[1] + " 23:59:59";
		},
		pageNumber(newVal, oldVal) {
			this.searchParams.pageNumber = newVal;
		}
	},
	computed: {},
	methods: {
		toWork(row, status) {
			this.$router.push({
				name: "work",
				params: { status: status, userId: row.userId, name: row.name }
			});
		},
		SelectionChange(val) {
			this.selectionRow = val;
		},
		createWork() {
			this.isAdd = true;
			this.clearForm();
			this.dialogFormVisible = true;
		},
		clearParams() {
			let obj = {
				name: "",
				startTime: "",
				endTime: ""
			};
			this.times = "";
			this.searchParams = Object.assign(this.searchParams, obj);
		},
		btnSearch(){
			this.searchParams.pageNumber=1;
			this.SelectInstallWorkerByCondition(this.searchParams);
		},
		SelectInstallWorkerByCondition(params) {
			console.log("SelectInstallWorker_params", params);
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
			this.$http({
				url:
					this.HOST + "/http/InstallWorker/SelectInstallWorkerByCondition.json",
				params: params
			})
				.then(res => {
					// this.clearParams();
					this.$message({message: "查询成功",type: "success",duration:1000});
					this.isLoading = false;
					if (res.flag === 1) {
						this.tableData = res.rows;
						this.total = res.total;
					} else {
						debugger;
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
			this.SelectInstallWorkerByCondition(this.searchParams);
		},
		clearForm() {
			for (const key in this.userForm) {
				if (this.userForm.hasOwnProperty(key)) {
					this.userForm[key] = "";
				}
			}
		},
		InstallWorker() {
			this.$refs["userForm"].validate(valid => {
				if (valid) {
					this.btnLoading=true;
					this.$http({
						url: this.HOST + "/http/InstallWorker/AddInstallWorker.json",
						params: this.userForm
					})
						.then(rst => {
							this.btnLoading=false;
							if (rst.flag === 1) {
								this.dialogFormVisible = false;
								this.SelectInstallWorkerByCondition(this.searchParams);
								this.$message({
									showClose: true,
									message: "添加成功",
									type: "success"
								});
							} else {
								this.$message({
									showClose: true,
									message: rst.msg,
									type: "warning"
								});
							}
							// this.isloadingApi = false;
						})
						.catch(e => {
							// this.isloadingApi = false;
							console.error(e);
							this.$message("网络异常，请稍后再试", {
								// showClose: false,
								// showConfirmButton: false
							});
						});
				} else {
					return false;
				}
			});
		},
		batchDel() {
			if (this.selectionRow.length == 0) {
				this.$message({
					showClose: true,
					message: "请先勾选要删除的安装人员",
					type: "warning"
				});
				return false;
			}
			this.$confirm("是否批量删除所选用户？", "确认信息", {
				distinguishCancelAndClose: true,
				confirmButtonText: "批量删除",
				cancelButtonText: "取消删除"
			})
				.then(() => {
					let userIds = [];
					this.selectionRow.forEach(item => {
						userIds.push(item.userId);
					});
					this.confirmBatchDel(userIds);
				})
				.catch(action => {});
		},
		confirmBatchDel(Ids) {
			this.$http({
				url: this.HOST + "/http/InstallWorker/DeleteInstallWorkerByList.json",
				params: { userIds: Ids.join(",") }
			})
				.then(rst => {
					if (rst.flag === 1) {
						this.SelectInstallWorkerByCondition(this.searchParams);
					} else {
						this.$message({
							showClose: true,
							message: "删除失败，" + rst.msg,
							type: "warning"
						});
					}
					// this.isloadingApi = false;
				})
				.catch(e => {
					// this.isloadingApi = false;
					console.error(e);
					this.$message("网络异常，请稍后再试", {
						// showClose: false,
						// showConfirmButton: false
					});
				});
		},
		delShow(row) {
			let userId = row.userId;
			this.$confirm("是否删除用户" + row.name + "？", "确认信息", {
				distinguishCancelAndClose: true,
				confirmButtonText: "确认删除",
				cancelButtonText: "取消删除"
			})
				.then(() => {
					this.confirmDel(userId);
				})
				.catch(action => {});
		},
		confirmDel(userId) {
			this.$http({
				url:
					this.HOST +
					"/http/InstallWorker/DeleteInstallWorker.json?userId=" +
					userId
			})
				.then(rst => {
					if (rst.flag === 1) {
						this.dialogFormVisible = false;
						this.$message({
							showClose: true,
							message: "删除成功",
							type: "success"
						});
						setTimeout(() => {
							this.SelectInstallWorkerByCondition(this.searchParams);
						}, 800);
					} else {
						debugger;
						this.$message({
							showClose: true,
							message: "删除失败，" + rst.msg,
							type: "warning"
						});
					}
					// this.isloadingApi = false;
				})
				.catch(e => {
					// this.isloadingApi = false;
					console.error(e);
					this.$message("网络异常，请稍后再试", {
						// showClose: false,
						// showConfirmButton: false
					});
				});
		},
		editShow(row) {
			for (const key in this.userForm) {
				if (this.userForm.hasOwnProperty(key)) {
					this.userForm[key] = row[key];
				}
			}
			this.currentId = row.userId;
			this.dialogFormVisible = true;
			this.isAdd = false;
		},
		confirmEdit() {
			this.$refs["userForm"].validate(valid => {
				if (valid) {
					this.btnLoading=true;
					this.$http({
						url: this.HOST + "/http/InstallWorker/UpdateInstallWorker.json",
						params: this.userForm
					})
						.then(res => {
							this.btnLoading=false;
							if (res.flag === 1) {
								this.dialogFormVisible = false;
								this.SelectInstallWorkerByCondition(this.searchParams);
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
							// this.isloadingApi = false;
						})
						.catch(e => {
							// this.isloadingApi = false;
							console.error(e);
							this.$message("网络异常，请稍后再试", {
								// showClose: false,
								// showConfirmButton: false
							});
						});
				} else {
					return false;
				}
			});
			this.userForm.userId = this.currentId;
		}
	},
	created() {},
	mounted() {
		this.SelectInstallWorkerByCondition(this.searchParams);
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
	.option {
		line-height: 65px;
		padding: 0px 13px;
		.left {
			float: left;
		}
		.right {
			float: right;
		}
		/deep/.el-input {
			max-width: 200px;
		}
	}
	.content {
		flex: 1;
		padding: 0px 10px;
		display: flex;
		flex-direction: column;
		.table {
			width: 100%;
			height: 100%;
			border: 1px solid #e8e8e8;
			position: relative;
			/deep/.el-table__fixed-right::before,
			.el-table__fixed::before {
				background-color: transparent;
			}
			.el-table {
				position: absolute;
			}
		}
		.table-page {
			text-align: right;
			padding: 10px;
		}
	}

	.new-work {
		display: flex;
		flex-direction: column;
		justify-content: center;
		/deep/.el-input {
			max-width: 200px;
		}
		/deep/.el-textarea {
			flex: 1;
		}
		.row {
			padding: 12px 15px;
			.item {
				display: flex;
				line-height: 30px;
				font-size: 12px;
				font-family: PingFang-SC-Bold;
				font-weight: bold;
				label {
					margin-right: 18px;
					min-width: 50px;
				}
				span {
					color: skyblue;
				}
			}
			.left {
				float: left;
			}
			.right {
				float: right;
			}
			.center {
				display: block;
				text-align: center;
				margin-top: 15px;
			}
		}
	}
	.ruleForm{
		.el-form-item{
			margin-bottom: 30px;
		}
	}
	.right {
		text-align: right;
	}
}
</style>