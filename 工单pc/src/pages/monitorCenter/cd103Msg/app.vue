<template>
	<div class="app-wrap">
		<div class="bsj-layer-tab photo-tab">
			<div class="tab-header">
				<div class="col-left">
					<div class="header-nav">
						<div class="header-nav-item active">短信下发</div>
					</div>
				</div>
				<div class="col-right">
					<div class="closeLayer-btn" @click="doCloseLayer">
						<i class="iconfont icon-guanbi1"></i>
					</div>
				</div>
			</div>
			<div class="tab-cont" ref="tabCont">
				<div class="tab-contChild">
					<div class="check" v-if="step==0">
						<div class="check-tip">
							<p class="p1">请确认要下发短信的车组 (共 {{vehTotal}} 台设备)</p>
							<p class="p2">一次最多下发100台设备</p>
						</div>
						<el-checkbox-group v-model="checkedVal" @change="handleCheckedChange">
							<el-checkbox
								v-for="item in groups"
								:label="item.id"
								:key="item.name"
								border
							>{{item.name}}(共 {{item.count}} 台)</el-checkbox>
						</el-checkbox-group>
					</div>
					<div v-if="step==1">
						<div class="item" v-for="(item,i) in list" :key="i">
							<div class="item-info">
								<div class="left">{{item.tip}}</div>
								<div class="right">
									<span>{{item.txt1}}</span>
									<span v-if="item.isInput==true">XX</span>
									<span>{{item.txt2}}</span>
								</div>
							</div>
							<div class="item-check" @click="check(item.index)">
								<span class="radio" :class="{'on':item.index==index,'el-icon-success':item.index==index}"></span>
							</div>
						</div>
					</div>
					<div v-if="step==2">
						<div class="item">
							<div class="step2">
								<p class="tip">{{list[index].tip}}</p>
								<span class="txt">{{list[index].txt1}}</span>
								<input v-if="list[index].isInput" type="text" v-model="address" class="fill">
								<span class="txt">{{list[index].txt2}}</span>
							</div>
						</div>
					</div>
					<div class="send" v-if="step==3">
						<p class="tip">如下所示是即将进行短信发送的设备列表</p>
						<el-table class="table" :data="tableList[currentPage-1]" max-height="350" border>
							<el-table-column prop="groupName" label="车组名称"></el-table-column>
							<el-table-column prop="plate" label="车牌号码"></el-table-column>
							<el-table-column prop="terminalNo" label="终端编号"></el-table-column>
							<el-table-column prop="phone" label="手机号码"></el-table-column>
						</el-table>
						<el-pagination
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
							:current-page.sync="currentPage"
							:page-size="pageSize"
							layout="total, prev, pager, next, jumper"
							:total="tableTotal"
						></el-pagination>
					</div>
				</div>
			</div>
			<div class="tab-footer">
				<el-button v-if="step>0&&step<=2" type="primary" size="small" plain @click="step--">上一步</el-button>
				<el-button
					v-if="step<3"
					type="primary"
					size="small"
					plain
					@click="nextStep"
					:disabled="!(vehTotal>0&&vehTotal<=1000)"
				>下一步</el-button>
				<el-button v-if="step==3" type="danger" size="small" @click="confirmDel">取消下发</el-button>
				<el-button v-if="step==3" type="success" size="small" @click="SendGroupSms">确认下发</el-button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			groupObj: {},
			groups: [],
			vehTotal: 0,
			step: 0,
			index: 0,
			list: [
				{
					index: 0,
					tip: "突发事件模板：",
					txt1: "尊敬的驾驶员，目前",
					txt2:
						"地区仓库提出新的收货要求，要求到达仓库后在厂门口耐心按序等待，驾驶员可进厂到仓库登记，请熟知，按要求进行。",
					isInput: true
				},
				{
					index: 1,
					tip: "路况模板：",
					txt1: "尊敬的驾驶员，目前长株潭地区",
					txt2:
						"高速发生交通事故，道路封闭，请提前规划线路，在确保安全的前提下按时到达装卸货仓库，配合仓库开展装卸作业，谢谢。",
					isInput: true
				},
				{
					index: 2,
					tip: "安全预警模板：",
					txt1:
						"尊敬的驾驶员，国内近期发生多起货运车辆自燃导致车上货物发生重大损失事故，",
					txt2:
						"请引起足够重视，装车前做好车辆检查、维护、保养，确保承运货物期间无事故发生。",
					isInput: false
				},
				{
					index: 3,
					tip: "天气预警模板：",
					txt1: "尊敬的驾驶员，目前",
					txt2:
						"地区有降雨，请提前预防，采取防范措施，避免货物水湿和交通事故发生。",
					isInput: true
				}
			],
			pageSize: 50,
			currentPage: 1,
			smsGroup: "",
			smsType: "",
			address: "",
			tableList: [],
			tableTotal: 0,
			checkedVal: []
		};
	},
	components: {},
	mounted() {
		let vehGroupObj = {};
		let vehGroupList = [];
		let groupsList = [];
		let total = 0;
		let arr = getQueryString("str").split(",");
		arr.forEach(item => {
			vehGroupObj[parseInt(item.split("-")[0])] = {
				id: parseInt(item.split("-")[0]),
				name: item.split("-")[1],
				count: parseInt(item.split("-")[2])
			};
			vehGroupList.push({
				id: parseInt(item.split("-")[0]),
				name: item.split("-")[1],
				count: parseInt(item.split("-")[2])
			});
			groupsList.push(parseInt(item.split("-")[0]));
			total += parseInt(item.split("-")[2]);
		});
		this.groupObj = vehGroupObj;
		this.groups = vehGroupList;
		this.checkedVal = groupsList;
		this.vehTotal = total;

		this.CheckGroupSms();
	},
	methods: {
		doCloseLayer() {
			if (parent.CD103Msg) {
				parent.CD103Msg.close();
			}
		},
		chunk(arr, size) {
			var arr2 = [];
			for (var i = 0; i < arr.length; i = i + size) {
				arr2.push(arr.slice(i, i + size));
			}
			return arr2;
		},
		handleSizeChange() {},
		handleCurrentChange() {},
		check(index) {
			this.index = index;
			console.log("index", index);
		},
		handleCheckedChange(value) {
			let total = 0;
			value.forEach(val => {
				total += this.groupObj[val].count;
			});
			this.vehTotal = total;
		},
		nextStep() {
			if (this.step == 2) {
				this.GetGroupSms();
			} else {
				this.step++;
			}
		},
		CheckGroupSms() {
			//短信发送-检查是否已存在需要发送的车辆信息
			this.$http({
				url:
					this.HOST + "/specialClient/jskj/ServiceController/CheckGroupSms.json"
			})
				.then(res => {
					//1为不存在，2为存在
					if (res.flag === 1) {
						this.step = 0;
					} else if (res.flag === 2) {
						this.smsGroup = res.extend.smsGroup;
						this.smsType = res.extend.smsType;
						this.address = res.extend.address;
						this.tableTotal = res.obj.length;
						this.tableList = this.chunk(res.obj, this.pageSize);
						this.step = 3;
					} else {
						this.$message.error(res.msg || this.$msg.error);
					}
				})
				.catch(e => {
					this.$message.error(this.$msg.error);
				});
		},
		GetGroupSms() {
			if (this.list[this.index].isInput == true && this.address == "") {
				this.$message("地区不能为空");
				return false;
			}
			this.$http({
				url:
					this.HOST + "/specialClient/jskj/ServiceController/GetGroupSms.json",
				params: {
					address: this.address,
					groupIds: this.checkedVal.join(","),
					smsType: this.index
				}
			})
				.then(res => {
					if (res.flag === 1) {
						this.smsGroup = res.extend.smsGroup;
						this.smsType = res.extend.smsType;
						this.address = res.extend.address;
						this.tableTotal = res.obj.length;
						this.tableList = this.chunk(res.obj, this.pageSize);
						this.step = 3;
					} else {
						this.$message.error(res.msg || this.$msg.error);
					}
				})
				.catch(e => {
					this.$message.error(this.$msg.error);
				});
		},
		SendGroupSms() {
			this.$http({
				url:
					this.HOST + "/specialClient/jskj/ServiceController/SendGroupSms.json",
				params: {
					smsGroup: this.smsGroup
				}
			})
				.then(res => {
					if (res.flag === 1) {
						this.$message.success(res.msg || this.$msg.error);
						this.doCloseLayer();
					} else {
						this.$message.error(res.msg || this.$msg.error);
					}
				})
				.catch(e => {
					this.$message.error(this.$msg.error);
				});
		},
		confirmDel() {
			this.$alert("是否确认取消当前批次短信下发", "警告", {
				confirmButtonText: "确认",
				callback: action => {
					debugger
					if(action=="confirm"){
						this.DelGroupSms();
					}
				}
			});
		},
		DelGroupSms() {
			this.$http({
				url:
					this.HOST + "/specialClient/jskj/ServiceController/DelGroupSms.json",
				params: {
					smsGroup: this.smsGroup
				}
			})
				.then(res => {
					if (res.flag === 1) {
						this.smsGroup = "";
						this.smsType = "";
						this.address = "";
						this.tableTotal = 0;
						this.tableList = [];
						this.step = 0;
						this.doCloseLayer();
					} else {
						this.$message.error(res.msg || this.$msg.error);
					}
				})
				.catch(e => {
					this.$message.error(this.$msg.error);
				});
		}
	}
};
</script>
<style lang="less">
@import "~@/assets/css/style";
body {
	background-color: #ffffff;
}
</style>

<style lang="less" scoped>
@import "~@/assets/css/lessKey";
.app-wrap {
	height: 100%;
}
.photo-tab .col-left {
	display: flex;
}
.header-nav-item {
	font-size: 23px;
}
.header-nav-item.active {
	color: #1184e5;
	font-weight: 600;
}
.tab-cont {
	position: relative;
	.tab-contChild {
		width: 100%;
		height: 100%;
		padding: 15px 35px;
		overflow: hidden;
		position: absolute;
		.check {
			.check-tip {
				p {
					padding: 5px 10px;
				}
				.p1 {
					font-weight: bold;
					font-size: 24px;
					color: #5794d2;
				}
				.p2 {
					font-size: 16px;
					color: #878c90;
				}
			}
			/deep/.el-checkbox.is-bordered {
				margin: 10px;
			}
		}
		.item {
			display: flex;
			align-items: center;
			font-size: 12px;
			.step2 {
				font-size: 12px;
				line-height: 29px;
				.tip {
					font-weight: bold;
					color: #288be1;
				}
				.txt {
					font-weight: Medium;
					color: #666666;
				}
				.fill {
					width: 100px;
					border-bottom: 1px solid #288be1;
				}
			}
			.item-info {
				flex: 1;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				padding: 15px;
				margin: 10px 0px;
				background-color: #eaf9ff;
				.left {
					font-weight: bold;
					color: #288be1;
				}
				.right {
					flex: 1;
					font-weight: Medium;
					color: #666666;
				}
			}
			.item-check {
				padding: 10px;
				margin-left: 20px;
				.radio {
					width: 25px;
					height: 25px;
					display: inline-block;
					cursor: pointer;
					border: 1px solid #cecece;
					border-radius: 50%;
				}
				.on {
					background-size: 100% 100%;
				}
				/deep/.el-icon-success {
					font-size: 23px;
					color: #3592e3;
				}
			}
		}
		.send {
			.tip {
				font-size: 16px;
				color: #878c90;
				padding: 10px 0px;
			}
			.table {
			}
			/deep/.el-pagination {
				text-align: right;
				padding: 10px;
			}
		}
	}
}
.tab-footer {
	text-align: center;
	button {
		margin: 20px;
	}
}
</style>


