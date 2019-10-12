<template>
	<div class="work-wrap">
		<!-- <div class="left">
			<el-menu default-active="1" background-color="#f1f5f9" active-text-color="#999999">
				<el-menu-item class="menu" index="1" @click="toPath('/work')">
					<span class="iconfont icon-kxborder"></span>
					<span slot="title">工单管理</span>
				</el-menu-item>

				<el-menu-item class="menu" index="2" @click="toPath('/user')">
					<span class="iconfont icon-gerenzhongxin"></span>
					<span slot="title">安装人员管理</span>
				</el-menu-item>
			</el-menu>
			<div class="app-download">
				<el-popover class="app-hover" placement="right" trigger="hover">
					<img class="app-bg" src="../../assets/img/dl.png">
					<span slot="reference">
						<span class="el-icon-download"></span>下载APP
					</span>
				</el-popover>
			</div>
		</div> -->
		<div class="main">
			<div class="conten">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	components: {},
	data() {
		return {
			
		};
	},
	created() {
		this.getGroupData();
	},
	mounted() {
		if(this.$route&&!this.$route.name){
			this.$router.push({ path: "/work" });
		}
	
	},
	methods: {
		// toPath(path) {
		// 	this.$router.push({ path: path });
		// },
		getGroupData() {
			this.$api.loadGroups({
					concernNeed: true
				})
				.then(rst => {
					if (rst.flag === 1) {
						this.$store.commit("setGroupData", rst.obj.data);
					} else if (rst.msg.indexOf("登录") === -1) {
						setTimeout(() => {
							this.getGroupData();
						}, 2000);
					}
				})
				.catch(e => {
					setTimeout(() => {
						this.getGroupData();
					}, 2000);
				});
		}
	}
};
</script>

<style lang="less" scoped >
@import "~@/assets/css/lessKey";
.work-wrap {
	height: 100%;
	display: flex;
	flex-direction: row;
	background-color: #ffffff;
	.left {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 190px;
		height: 100%;
		background-color: #f1f5f9;
		border-right: 2px solid #cfcfcf;
		.el-menu{
			border-right:0px;
		}
		.menu {
			font-size: 14px;
			font-family: PingFang-SC-Bold;
			font-weight: bold;
		}
	}
	.active {
		background-color: #ffffff;
		li {
			background-color: #ffffff;
		}
	}
	.main {
		flex: 1;
		display: flex;
		flex-direction: row;
		height: 100%;
		padding: 13px 17px;
		background-color: #f1f2f7;
		.conten {
			flex: 1;
			height: 100%;
			background-color: #ffffff;
		}
	}
	.app-download{
		position: absolute;
    	bottom: 20px;
		color: #333333;
		padding: 10px 25px;
		.app-hover{
			background-color: #E4E8ED;
			font-size: 14px;
			padding: 10px 25px;
		}
		.app-bg{
			max-width: 200px;
		}
	}
}
</style>



