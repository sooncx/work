<template>
	<div class="img-show">
		<div class="tip" v-show="tip1">不能再放大了哦！</div>
		<!-- <div class="tip" v-show="pageShow">{{imageIndex+1+"/"+data.length}}</div> -->
		<div class="tip" v-show="tip1">不能再放大了哦！</div>
		<div class="tip" v-show="tip2">不能再缩小了哦！</div>
		<div class="tip" v-show="tip3">前面已经没有了！</div>
		<div class="tip" v-show="tip4">已经是最后一张了哦！</div>
		<div class="guanbi" v-show="pageShow" @click="enSmallImg">
			<span class="el-icon-circle-close-outline"></span>
		</div>
		<div v-for="(item,index) in data">
			<a class="img-name" title="点击查看图片" v-if="item.path&&item.path!=''" @click="enlargeImg(index,item.path,item.title)">{{item.title}}</a>
			<a class="img-name-disabled" v-else disabled>{{item.title}}</a>
		</div>
		<div v-if="imgBox" class="imgBox">
			<div class="fl sideClick">
				<div @click="prevImg">
					<span class="clickArrow iconfont icon-xiangzuo"></span>
				</div>
			</div>
			<div class="box-image-wrapper fl" @click="enSmallImg">
				<img
					id="myImg"
					:src="enlargeImgUrl"
					class="mainImg"
					:style="{maxWidth: mWidth,width: widthImg}"
					:class="{rotate90:rotate==1,rotate180:rotate==2,rotate270:rotate==3,rotate0:rotate==0}"
					v-on:click.stop="doThis"
				>
				<canvas id="myCanvas" class="mainImg" style="z-index:-22;position: absolute;"></canvas>
				<br>
			</div>
			<div class="fr sideClickR">
				<div @click="nextImg">
					<span class="clickArrow iconfont icon-xiangyou"></span>
				</div>
			</div>
			<div class="bottom" v-if="imgBox">
				<span class="rotate iconfont icon-fangda" @click="largeImg"></span>
				<span class="rotate iconfont icon-suoxiao" @click="smallImg"></span>
				<span class="rotate iconfont icon-rotate" @click="rotateImg"></span>
				<span class="rotate iconfont" v-show="pageShow">{{imageIndex+1+"/"+data.length}}</span>
				<!-- <span class="rotate iconfont icon-rotate rotate180" @click="rotateImgBack"></span> -->
				<!-- <a :href="enlargeImgUrl" :download="imageName+'.jpg'" target="view_window">
					<span class="rotate iconfont icon-xiazai"></span>
				</a> -->
				<!-- <span class="rotate iconfont icon-xiazai" @click="downloadIamge(enlargeImgUrl,imageName)"></span> -->
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "enlargeImg",
	data() {
		return {
			imgBox: false,
			enlargeImgUrl: "",
			imageIndex: "",
			imageName: "",
			preImgUrl: "",
			nextImgUrl: "",
			rotate: 0,
			tip1: false,
			tip2: false,
			tip3: false,
			tip4: false,
			mWidth: "60%",
			widthImg: "60%",
			pageShow: false
		};
	},
	props: {
		data: {
			type: Array
		}
	},
	watch: {
		tip1(res) {}
	},
	methods: {
		enlargeImg(i, url, name) {
			this.pageShow = true;
			this.imageIndex = i;
			this.enlargeImgUrl = url;
			this.imageName = name;
			this.imgBox = true;
			this.mWidth = "60%";
			this.widthImg = "60%";
		},
		rotateImg() {
			if (this.rotate == 0) {
				this.rotate = 1;
			} else if (this.rotate == 1) {
				this.rotate = 2;
			} else if (this.rotate == 2) {
				this.rotate = 3;
			} else {
				this.rotate = 0;
			}
		},
		rotateImgBack() {
			if (this.rotate == 0) {
				this.rotate = 3;
			} else if (this.rotate == 1) {
				this.rotate = 0;
			} else if (this.rotate == 2) {
				this.rotate = 1;
			} else {
				this.rotate = 2;
			}
		},
		largeImg() {
			if (this.mWidth == "100.0%") {
				this.tip1 = true;
				setTimeout(() => {
					this.tip1 = false;
				}, 1500);
			} else {
				this.mWidth = parseFloat(this.mWidth) + 10;
				this.widthImg = parseFloat(this.widthImg) + 10;
				this.mWidth = Number(this.mWidth).toFixed(1);
				this.mWidth += "%";
				this.widthImg = Number(this.widthImg).toFixed(1);
				this.widthImg += "%";
			}
		},
		smallImg() {
			if (this.mWidth == "10.0%") {
				this.tip2 = true;
				setTimeout(() => {
					this.tip2 = false;
				}, 1500);
			} else {
				this.mWidth = parseFloat(this.mWidth) - 10;
				this.widthImg = parseFloat(this.widthImg) - 10;
				this.mWidth = Number(this.mWidth).toFixed(1);
				this.mWidth += "%";
				this.widthImg = Number(this.widthImg).toFixed(1);
				this.widthImg += "%";
			}
		},
		enSmallImg() {
			this.pageShow = false;
			this.imgBox = false;
			// this.mWidth = "50%";
			// this.widthImg = "50%";
			this.rotate = 0;
		},
		prevImg() {
			// this.mWidth = "50%";
			// this.widthImg = "50%";
			if (this.imageIndex == 0) {
				this.tip3 = true;
				setTimeout(() => {
					this.tip3 = false;
				}, 1500);
			} else {
				this.imageIndex = this.imageIndex - 1;
				this.enlargeImgUrl = this.data[this.imageIndex].path;
				this.imageName = this.data[this.imageIndex].title;
			}
		},
		nextImg() {
			// this.mWidth = "50%";
			// this.widthImg = "50%";
			if (this.imageIndex == this.data.length - 1) {
				this.tip4 = true;
				setTimeout(() => {
					this.tip4 = false;
				}, 1500);
			} else {
				this.imageIndex = this.imageIndex + 1;
				this.enlargeImgUrl = this.data[this.imageIndex].path;
				this.imageName = this.data[this.imageIndex].title;
			}
		},
		doThis() {
			console.log("doThis");
		},
		downloadIamge(imgsrc, name) {
			//下载图片地址和图片名
			var image = new Image();
			// 解决跨域 Canvas 污染问题
			image.src = imgsrc;
			image.setAttribute("crossOrigin", "anonymous");
			image.onload = function() {
				var canvas = document.createElement("canvas");
				var context = canvas.getContext("2d");
				context.drawImage(image, 0, 0, image.width, image.height);
				var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
				debugger;
				var a = document.createElement("a"); // 生成一个a元素
				var event = new MouseEvent("click"); // 创建一个单击事件
				a.download = name || "photo"; // 设置图片名称
				a.href = url; // 将生成的URL设置为a.href属性
				a.dispatchEvent(event); // 触发a的单击事件
			};
		},
		downloadCanvasIamge(path, name) {
			debugger;
			// 通过选择器获取canvas元素
			let base64 = "";
			var canvas = document.querySelector("#myCanvas");
			var cxt = canvas.getContext("2d");
			var img = new Image();
			// img.src = path;
			img.crossOrigin = "Anonymous";
			// img.setAttribute("crossOrigin", "Anonymous");
			img = document.getElementById("myImg");
			// 使用toDataURL方法将图像转换被base64编码的URL字符串
			img.onload = function() {
				//图片加载完，再draw 和 toDataURL
				debugger;
				cxt.drawImage(img, 0, 0, img.width, img.height);
				base64 = canvas.toDataURL("image/png");
				// 生成一个a元素
				var a = document.createElement("a");
				// 创建一个单击事件
				var event = new MouseEvent("click");

				// 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
				a.download = name || "下载图片名称";
				// 将生成的URL设置为a.href属性
				a.href = base64;

				// 触发a的单击事件
				a.dispatchEvent(event);
			};

			debugger;
			cxt.drawImage(img, 0, 0, img.width, img.height);
			base64 = canvas.toDataURL("image/png");
			// 生成一个a元素
			var a = document.createElement("a");
			// 创建一个单击事件
			var event = new MouseEvent("click");

			// 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
			a.download = name || "下载图片名称";
			// 将生成的URL设置为a.href属性
			a.href = base64;

			// 触发a的单击事件
			a.dispatchEvent(event);
		}
	}
};
</script>

<style>
.imgBox {
	top: 0;
	right: 0;
	left: 0;
	position: fixed;
	width: 100%;
	height: -webkit-fill-available;
	height: fill-available;
	background-color: rgba(55, 55, 55, 0.9);
	z-index: 9999;
	overflow: auto;
	box-sizing: border-box;
}
.box-image-wrapper {
	top: 0;
	position: fixed;
	width: 100%;
	height: -webkit-fill-available;
	height: fill-available;
	z-index: 9999;
	text-align: center;
	overflow-y: auto;
	display: flex;
	padding-bottom: 60px;
}
.img-show {
	margin-top: 0px;
	z-index: 9999;
}
.mainImg {
	cursor: pointer;
	position: relative;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
}
.largeImg60 {
	max-width: 60%;
	width: 60%;
}
.largeImg70 {
	max-width: 70%;
	width: 70%;
}
.largeImg80 {
	max-width: 80%;
	width: 80%;
}
.largeImg90 {
	max-width: 90%;
	width: 90%;
}
.largeImg100 {
	max-width: 100%;
	width: 100%;
}
.smallImg {
	height: 80px;
	width: 80px;
	float: left;
	margin-left: 20px;
	cursor: pointer;
}
.sideClick {
	height: 100%;
	width: 6%;
	cursor: pointer;
}
.sideClickR {
	height: 100%;
	width: 6%;
	cursor: pointer;
}
.sideClick div {
	position: fixed;
	z-index: 99999;
	background-color: rgba(40, 40, 40, 0.8);
	height: 75px;
	width: 60px;
	top: 0;
	bottom: 0;
	margin: auto;
	margin-left: 20px;
}
.sideClickR div {
	position: fixed;
	z-index: 99999;
	background-color: rgba(40, 40, 40, 0.8);
	height: 75px;
	width: 60px;
	top: 0;
	bottom: 0;
	margin: auto;
	right: 20px;
}
.clickArrow {
	text-align: center;
	padding-top: 28px;
	font-size: 36px;
	color: #949494;
	display: block;
}

.rotate0 {
	transform: rotate(0deg);
}
.rotate90 {
	transform: rotate(90deg);
}
.rotate180 {
	transform: rotate(180deg);
}
.rotate270 {
	transform: rotate(270deg);
}
.fr {
	float: right;
}
.fl {
	float: left;
}
.rotate {
	height: 30px;
	cursor: pointer;
	/* display: none; */
}
.rotateR {
	height: 30px;
	cursor: pointer;
	transform: rotateY(180deg);
}
.bottom {
	width: 100%;
	position: fixed;
	z-index: 9999;
	bottom: 0;
	padding: 15px 0;
	margin-left: -8px;
	background-color: #464646;
	text-align: center;
}
.bottom span {
	font-size: 28px;
	color: #949494;
	margin: 0px 10px;
	z-index: 9999;
}
.tip {
	position: fixed;
	top: 200px;
	margin: auto;
	left: 0;
	right: 0;
	background-color: #888;
	color: #fff;
	height: 30px;
	font-size: 14px;
	line-height: 30px;
	max-width: 150px;
	text-align: center;
	padding: 0 5px;
	border-radius: 6px;
	z-index: 99999;
}
.guanbi {
	position: fixed;
	top: 15px;
	right: 15px;
	color: #fff;
	font-size: 24px;
	text-align: right;
	padding: 0 5px;
	border-radius: 6px;
	z-index: 99999;
}
.img-name {
	font-size: 14px;
	font-family: PingFang-SC-Medium;
	font-weight: 500;
	color: #1184e5;
	cursor: pointer;
}
.img-name-disabled {
	font-size: 14px;
	font-family: PingFang-SC-Medium;
	font-weight: 500;
	color: #999999;
}
</style>
