<template>
	<div class="trackPlay-wrap">
		<section class="select-chunk">
			<trackSelect v-model="formData" @toggleMapType="toggleMapType" @doSearch="doSearch" :isShowCar="false" :loading="getMongoStatus==='loading'" :mapType="mapType">
				<div slot="footer">
					<transition name="el-zoom-in-top">
						<playControl
							v-show="map&&trackMongoDataList.length>0"
							v-model="playProgress"
							@toggle="doTogglePlay"
							@change="changeProgress"
							:isPlaying.sync="isPlaying"
							:speed.sync="playSpeed"
							class="fot-playcontrol noBoxShadow"
						/>
					 </transition>
				</div>
			</trackSelect>
		</section>
		<div class="cont">
			<bsjMap class="cont-map" :mapType="mapType" @mapInited="mapInited"/>
		</div>
		<div class="fot-control" ref="fotControl" :class="['size-'+fotContorlSizeStatus]">
			<section class="header-filter" ref="fotControlHeader">
				<ul class="col-tab-nav">
					<li :class="{'active':showTableType==='mongo'}" @click="showTableType='mongo'">轨迹详情</li>
					<!-- <li :class="{'active':showTableType==='alarm'}" @click="showTableType='alarm'">报警详情</li>
					<li :class="{'active':showTableType==='stopPoint'}" @click="showTableType='stopPoint'">

					</li>
					<li :class="{'active':showTableType==='fence'}" @click="showTableType='fence'">围栏</li> -->
				</ul>
				<!-- <div class="filter-showType">
					<span class="title">显示：</span>
					<el-popover popper-class="poperSize-mini" placement="top-end" title="请选择报警类型显示" width="530" trigger="hover">
						<div class="checkAlarmTypes-box">
							<el-checkbox-group v-model="selectedAlarmList">
								<el-checkbox
									v-for="item in checkAlarmTypes"
									:key="item.label"
									size="mini"
									:label="item.label"
								></el-checkbox>
							</el-checkbox-group>
							<div class></div>
						</div>
						<el-checkbox slot="reference" class="showAlarm-switch" v-model="isShowTypes.alarm">
							<i class="iconfont icon-shaixuan"></i>
							报警点
						</el-checkbox>
					</el-popover>
					<el-checkbox v-model="isShowTypes.mongo">轨迹</el-checkbox>
					<el-checkbox v-model="isShowTypes.shopPoint">经常停留点</el-checkbox>
					<el-checkbox v-model="isShowTypes.fence">围栏</el-checkbox>
				</div> -->
				<div class="col-right">
					<template>
						<!-- <el-popover popper-class="poperSize-mini" ref="popoverExport" placement="left-start" width="330" trigger="hover">
						
							<div  v-if="!getDownloadInfoError">
								<div class="zuijin-title">最近导出<span class="msg-sp">(记录大于2000条数据的导出记录)</span></div>
								<div class="loadInfoList-box" v-loading="isGetLoadInfoing" >
									<div class="downProgress-btn">
										<div class="loadInfoList-item" title="正在导出中"  v-if="exporProgressData">
											<div class="col-left">{{exporProgressData.name}}</div>
											<div class="col-right downProgress-num">
												{{exporProgressData.progress+"%"}}
									
											</div>
										</div>
										<div class="downEnd-bg" :style="{width:exporProgressData?exporProgressData.progress+'%':'0'}"></div>
										
									</div>
									
									<div class="loadInfoList-item" title="点击直接下载" @click="doDownLoadInfoFile(item)" v-for="(item,index) in downLoadInfoList" :key="index" v-show="index<10">
										<div class="col-left">{{item.name}}</div>
										<div class="col-right">
											<i class="ver-ali-m icon-icon iconfont"></i>
										</div>
									</div> 
							
								</div>
							</div>
							<div class="loadInfoList-errorBox" v-else  @click="getDownloadInfoList">
								{{getDownloadInfoError}},点此<span class="c-blue">重新获取</span>
							</div>
						</el-popover> -->
						 <span  class="ver-ali-m" v-popover:popoverExport>
							<span class="export-box" @click="doExport" v-if="!isExporting">
								<span class="export-btn">
									<!-- <i class="ver-ali-m icon-icon iconfont"></i> -->
									<span class="ver-ali-m">导出</span>
								</span>
							</span>
							<span class="export-box" v-else-if="isExporting">
								<span class="export-btn export-ing">
									<span class="down-mark-wrap ver-ali-m downExoprtTran">
										<span class="down-mark ver-ali-m ">
										<i class="ver-ali-m icon-xiazai1  iconfont"></i>
									</span>
									</span>
									<span class="ver-ali-m">正在导出中...</span>
								</span>
							</span>
						 </span>
						
					</template>
					<!-- <i
						class="iconfont btn-toggle"
						:class="[fotContorlSizeStatus==='mini'?'icon-top':'icon-bottom']"
						@click="toggleFotControl"
					></i> -->
				</div>
			</section>
			<div class="cont c_transition" >
				<section class="showData-chunk">
					<!-- 轨迹列表 -->
					<section class="full-chunk" v-show="showTableType==='mongo'">
						<div class="table-box">
							<div class="tableError-box" v-if="getMongoStatus==='error' ">
								<p>
									<i class="icon-exclaim iconfont error-icon"></i>
								</p>
								<p>
									{{getMongoErrorMsg||"查询失败"}}
									<span class="c-blue reset-sp" v-if="!getMongoErrorMsg" @click="doAgainGetMongo">点此重新加载</span>
								</p>
								<p></p>
							</div>
							<el-table
								id="table_el"
								@row-click="onTrackRowClick"
								highlight-current-row
								v-else
								v-loading="getMongoStatus==='loading' "
								:data="displayMongoTableData"
								stripe
								ref="mongoTable"
								:row-class-name="genMongoTableCellClassName"
								size="mini"
								height="100%"
								style="width: 100%"
							>
								<el-table-column prop="_index" label="序号" width="50"></el-table-column>
								<el-table-column prop="plate" label="车牌" width="130"></el-table-column>
								<el-table-column prop="date" min-width="180" label="时间"></el-table-column>
								<el-table-column  width="150" label="速度 km/h">
									<template slot-scope="scope">
										<div>
											{{scope.row.speed}}
											<span class="noLocation-sp" @click.stop="doShowNoLocation(scope.row)" v-if="scope.row.hasNoLocation">（包含不定位数据）</span>
										</div>
									</template>

								</el-table-column>
								<el-table-column prop="angle" width="100" label="方向"></el-table-column>
								<el-table-column prop="mileage" width="100" label="里程"></el-table-column>
								<el-table-column prop="componentStateTxt" width="200" label="部件状态"></el-table-column>
								<el-table-column v-if="isBD30" width="220" label="原始经纬度">
									<template slot-scope="scope">
										<div>{{"X:"+scope.row["o"]+",Y:"+scope.row["a"]}}</div>
									</template>
								</el-table-column>
								<el-table-column label="位置" width="800">
									<template slot-scope="scope">
										<div>{{saveMongoAddressList[scope.row["_index"]]}}</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<div class="pagination-box">
							<el-pagination
								:page-size.sync="trackMongoPageOptions.size"
								:page-sizes="[100, 200, 300, 400]"
								:pager-count="11"
								@size-change="trackMongoPageSizeChange"
								:current-page.sync="trackMongoPageIndex"
								layout="prev, pager, next,total,jumper,sizes"
								:total="trackMongoDataList.length"
							></el-pagination>
						</div>
					</section>
					<!-- 围栏 -->
					<section class="full-chunk" v-show="showTableType==='fence'">
						<div class="table-box">
							<div class="tableError-box" v-if="getFenceStatus==='error' ">
								<p>
									<i class="icon-exclaim iconfont error-icon"></i>
								</p>
								<p>
									加载失败，点此
									<span class="c-blue reset-sp" @click="doAgainGetFence">重新加载</span>
								</p>
							</div>
							<el-table
								@row-click="onFenceRowClick"
								v-else
								v-loading="getFenceStatus==='loading' "
								:data="fenceDataList"
								height="100%"
								style="width: 100%"
								stripe
							>
								<el-table-column label="围栏名称">
									<template slot-scope="scope">
										<span v-if="scope.row['_type'] === 'polygon' ">{{scope.row["pathName"] }}</span>
										<el-tag
											class="fenceTag"
										:type="scope.row['_type'] === 'polygon' ? 'primary' : 'warning'"
											size="mini"
											disable-transitions
										>{{scope.row["_typeTxt"]+"围栏"}}</el-tag>
									</template>
								</el-table-column>
								<!-- <el-table-column label="围栏类型" width="100">
									<template slot-scope="scope">
										<el-tag
											class="fenceTag"
											:type="scope.row['_type'] === 'polygon' ? 'primary' : 'warning'"
											disable-transitions
										>{{scope.row["_typeTxt"]}}</el-tag>
									</template>
								</el-table-column> -->
							</el-table>
						</div>
					</section>
					<!--  经常停留点-->
					<section class="full-chunk" v-show="showTableType==='stopPoint'">
						<div class="table-box">
							<div class="tableError-box" v-if="getStopPointStatus==='error' ">
								<p>
									<i class="icon-exclaim iconfont error-icon"></i>
								</p>
								<p>
									{{getStopPointErrorMsg||"加载失败，"}} 点此
									<span
										class="c-blue reset-sp"
										@click="doAgainGetStopReport"
									>重新加载</span>
								</p>
							</div>
							<el-table
								v-else
								@row-click="onStopPointRowClick"
								:data="displaystopReportList"
								v-loading="getStopPointStatus==='loading' "
								height="100%"
								style="width: 100%"
								stripe
							>
								<el-table-column prop="_index" label="序号" width="50"></el-table-column>
								<el-table-column >
									<template slot="header" slot-scope="scope">
									位置<span class="stopTableCol-msg">(最近一个月内停留时间大于30分钟且停车次数大于1次的经常停留点)</span>
									</template>
									<template slot-scope="scope">
										<div>
											<!-- <el-tag type="success" v-show="scope.row['type']==='home'">家</el-tag>
											<el-tag type="warning" v-show="scope.row['type']==='company'">公司</el-tag> -->
											 {{saveReportAddressList[scope.row["_index"]]||"正在获取中..."}}
										</div>
									</template>
								</el-table-column>
								<el-table-column label="停车时长"  width="120">
									<template slot-scope="scope">
										<span>{{scope.row["spaceTimeTotal"]}}</span>
									</template>
								</el-table-column>
								<el-table-column label="停车次数"  width="120">
									<template slot-scope="scope">
											<span class="c-blue" title="点击查看停车详情" @click.stop="doShowStopDetail(scope.row)">{{scope.row["n"]}}</span>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<div class="pagination-box">
							<el-pagination
								:page-size.sync="stopReportPageOptions.size"
								:page-sizes="[100, 200, 300, 400]"
								:current-page.sync="stopReportPageIndex"
								@size-change="stopReportPageSizeChange"
								layout="prev, pager, next,total,jumper,sizes"
								:total="stopReportList.length"
							></el-pagination>
						</div>
					</section>
					<!-- 报警详情 -->
					<section class="full-chunk" v-show="showTableType==='alarm'">
						<div class="table-box">
							<div class="tableError-box" v-if="getAlarmStatus==='error' ">
								<p>
									<i class="icon-exclaim iconfont error-icon"></i>
								</p>
								<p>
									{{getAlarmErrorMsg||"加载失败，"}} 点此
									<span class="c-blue reset-sp" @click="doAgainGetAlarm">重新加载</span>
								</p>
							</div>
							<el-table
								v-else
								@row-click="onAlarmRowClick"
								:data="displayAlarmDataList"
								v-loading="getAlarmStatus==='loading' "
								height="100%"
								style="width: 100%"
								stripe
							>
								<el-table-column prop="_index" label="序号" width="50"></el-table-column>
								<el-table-column prop="type" label="报警类型" width="150"></el-table-column>
								<el-table-column prop="timeBegin" label="开始时间" width="200"></el-table-column>
								<el-table-column prop="timeEnd" label="结束时间" width="200"></el-table-column>
								
								<el-table-column label="报警地点">
									<template slot-scope="scope">
										<div>{{saveAlarmAddressList[scope.row["_index"]]||"正在获取中..."}}</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<div class="pagination-box">
							<el-pagination
								:page-sizes="[100, 200, 300, 400]"
								:page-size.sync="alarmPageOptions.size"
								@size-change="alarmPageSizeChange"
								layout="total, sizes, prev, pager, next, jumper"
								:current-page.sync="alarmPageIndex"
								:total="alarmDataList.length">
							</el-pagination>
						</div>
					</section>
				</section>
			</div>
			<!-- <playControl
				v-show="map&&trackMongoDataList.length>0"
				v-model="playProgress"
				@toggle="doTogglePlay"
				@change="changeProgress"
				:isPlaying.sync="isPlaying"
				:speed.sync="playSpeed"
				class="fot-playcontrol"
			/> -->
		</div>
		<!-- infoWindow -->
		<div v-show="false">
			<!-- ----轨迹中停车点显示的infoWindow--- -->
			<div ref="mogoStopInfo">
				<div class="mogonStop-info-box">
					<div v-if="infoWindowData._showType==='mongoStop'">
						<div class="infoWindow-header " >
							<div class="infoWindow-header-title">轨迹停车点</div>
						</div>
						<div class="infoWindow-row">
							<div class="col-title">开始：</div>
							<div class="col-cont">{{infoWindowData.date.split("~~")[0]}}</div>
						</div>
						<div class="infoWindow-row">
							<div class="col-title">结束：</div>
							<div class="col-cont">{{infoWindowData.date.split("~~")[1]}}</div>
						</div>
						<div class="infoWindow-row"   >
							<div class="col-title">停车：</div>
							<div class="col-cont" >
								{{infoWindowData.speed.replace("静止","")}}
								<span  class="noLocation-sp" v-if="infoWindowData.hasNoLocation"  onmousedown="_DoShowNoLocation()" >（包含不定位数据）</span>
							</div>
						</div>
						<div class="infoWindow-row">
							<div class="col-title">里程：</div>
							<div class="col-cont">{{infoWindowData.mileage+"km"}}</div>
						</div>
						<div class="infoWindow-row">
							<div class="col-title">地址：</div>
							<div class="col-cont">{{ saveMongoAddressList[infoWindowData["_index"]]||'正在获取...'}}</div>
						</div>
					</div>
					<div v-else-if="infoWindowData._showType==='stopPoint'">
						<div class="infoWindow-header ">
							<div class="infoWindow-header-title">经常停留点</div>
						</div>
						<div class="infoWindow-row w62">
							<div class="col-title">停车时长：</div>
							<div class="col-cont">{{infoWindowData.spaceTimeTotal}}</div>
						</div>
						<div class="infoWindow-row w62">
							<div class="col-title">停车次数：</div>
							<div class="col-cont">{{infoWindowData.n}}</div>
						</div>
						
						<div class="infoWindow-row w62">
							<div class="col-title">停车地址：</div>
							<div class="col-cont">{{ saveReportAddressList[infoWindowData["_index"]]||'正在获取...'}}</div>
						</div>
						<div class="infoWindow-row infoWindow-msg">
							最近一个月内多次停留且时间较长
						</div>
					</div>
					<div v-else-if="infoWindowData._showType==='wifiPoint'">
						<div class="infoWindow-row w62">
							<div class="col-title">时间：</div>
							<div class="col-cont">{{infoWindowData.date}}</div>
						</div>
						<div class="infoWindow-row w62">
							<div class="col-title">速度：</div>
							<div class="col-cont">{{infoWindowData.speed+'km/h'}}</div>
						</div>
						<div class="infoWindow-row w62">
							<div class="col-title">里程：</div>
							<div class="col-cont">{{infoWindowData.mileage}}公里</div>
						</div>
						<div class="infoWindow-row w62">
							<div class="col-title">地址：</div>
							<div class="col-cont">{{ saveMongoAddressList[infoWindowData["_index"]]||'正在获取...'}}</div>
						</div>
					</div>
					<div v-else-if="infoWindowData._showType==='trackPoint'||infoWindowData._showType==='mongoStart'||infoWindowData._showType==='mongoEnd'">
						<!-- 点击轨迹表格显示 -->
						
						<div v-if="!infoWindowData.isStop" class="infoWindow-row ">
							<div class="col-title">时间：</div>
							<div class="col-cont">{{infoWindowData.date}}</div>
						</div>
						<div v-if="infoWindowData.isStop" class="infoWindow-row ">
							<div class="col-title">开始：</div>
							<div class="col-cont">{{infoWindowData.date.split("~~")[0]}}</div>
						</div>
						<div v-if="infoWindowData.isStop" class="infoWindow-row ">
							<div class="col-title">结束：</div>
							<div class="col-cont">{{infoWindowData.date.split("~~")[1]}}</div>
						</div>
						<div class="infoWindow-row ">
							<div class="col-title">{{!infoWindowData.isStop?'速度':'停车'}}：</div>
							<div
								class="col-cont"
							>
								{{!infoWindowData.isStop?infoWindowData.speed+'km/h':infoWindowData.speed.replace("静止","")}}
								<span  class="noLocation-sp" v-if="infoWindowData.hasNoLocation" onmousedown="_DoShowNoLocation()" >（包含不定位数据）</span>
							
							</div>
						</div>
						<div class="infoWindow-row ">
							<div class="col-title">里程：</div>
							<div class="col-cont">{{infoWindowData.mileage}}公里</div>
						</div>
						<div class="infoWindow-row ">
							<div class="col-title">地址：</div>
							<div class="col-cont">{{ saveMongoAddressList[infoWindowData["_index"]]||'正在获取...'}}</div>
						</div>
					</div>
					<div v-else-if="infoWindowData._showType==='alarm'">
						<div class="infoWindow-row w62">
							<div class="col-title">报警类型：</div>
							<div class="col-cont">{{infoWindowData.type}}</div>
						</div>
					
						<div class="infoWindow-row w62">
							<div class="col-title">开始时间：</div>
							<div class="col-cont">{{infoWindowData.timeBegin}}</div>
						</div>
						<div class="infoWindow-row w62">
							<div class="col-title">结束时间：</div>
							<div class="col-cont">{{infoWindowData.timeEnd}}</div>
						</div>
						<div class="infoWindow-row w62">
							<div class="col-title">报警地址：</div>
							<div class="col-cont">{{saveAlarmAddressList[infoWindowData['_index']]||'获取中...'}}</div>
						</div>
						
					</div>
				</div>
			</div>
		</div>
		<!-- 经常停留点详情 -->
		<el-dialog
			title="停车详情"
			class="stopDetailDialog"
			:visible.sync="stopDetailDialogVisible"
			width="800px">
			<div class="stopDetail-address">
					停车位置： {{saveReportAddressList[stopDetailDialogData["_index"]]||"正在获取中..."}}
			</div>
			<el-table
				:data="stopDetailDialogData.list"
				stripe
				size="mini"
				height="500px"
				style="width: 100%">
				<el-table-column
					prop="_index"
					label="序号"
					width="80">
				</el-table-column>
				<el-table-column
					prop="start"
					label="开始时间"
					>
				</el-table-column>
				
				<el-table-column
					prop="end"
					label="结束时间">
				</el-table-column>
				<el-table-column
					prop="diffTime"
					width="120"
					sortable
				
					label="停车时长">
					<template scope="scope">
					{{scope.row.duration}}
				</template>
				</el-table-column>
				
				
				
			</el-table>
		</el-dialog>
		<!-- 轨迹停车点包含不定位数据 详情 -->
		<el-dialog class="hasNoLocationDialog" title="包含不定位数据详情" size="mini" width="800px" :visible.sync="isShowNoLocationDetailList">
		
			<el-table height="500px" :data="noLocationDetailList" size="mini">
				<el-table-column type="index" width="60" label="序号" >
					
				</el-table-column>
				<el-table-column property="devTime" label="时间" ></el-table-column>
				<el-table-column property="speed" label="速度(km/h)" ></el-table-column>
				<el-table-column  label="是否定位" width="100">
					<template slot-scope="scope">
						<el-tag :type="scope.row.isPos===1?'warning':'danger'">{{scope.row.isPos===1?'定位':'不定位'}}</el-tag>
						
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>
<script>
import $BSJ_CONFIG from "@/bsjConfig/index";
import trackSelect from "@/components/trackSelect/trackSelect";
import bsjMap from "@/components/bsjmap/bsjMap.vue";
import dayJs, { Dayjs } from "dayjs";
import playControl from "@/components/playControl/playControl";
import customInfoWindow from "@/components/customInfoWindow/customInfoWindow";
import dragResize from "@/components/dragResize/dragResize";
import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
import { debounce, throttle } from "lodash";
export default {
	components: {
		bsjMap,
		trackSelect,
		playControl,
		customInfoWindow
	},
	data() {
		var loginuser=JSON.parse(localStorage.getItem("loginUser"));
		var mapType=getQueryString("mapType")
		if(mapType!=="amap"&&mapType!=="bdmap"){
			mapType="amap"
		}
		var cachePlaySppedKey = "trackPlaySpeed";
		var defaultTime=getQueryString("time")||dayJs()
		var defaultFormData = {
			vehicleId: getQueryString("terminalNo"),
			plate: getQueryString("plate"),
			from: dayJs(defaultTime)
				.set("hour", 0)
				.set("minute", 0)
				.set("second", 0)
				.toDate(),
			to: dayJs(defaultTime)
				.set("hour", 23)
				.set("minute", 59)
				.set("second", 59)
				.toDate()
		};
		var defaultMongoMArkerList={
			current:null, //当前播放点
			track:null,	//当前点击行
			start: null, //起点
			end: null, //终点
			park: {}, //有线停车点
			wifi: {}, //无线描点
			polyline: null, //轨迹线
			playedPolyline: null //已经播放完的轨迹线
		}
		var alarmTypes=[
				{
					label: "防拆除报警",
					value:"isIllegalRemove"
				},
				{
					label: "异常停留报警",
					value:"abnormalStayAlarm"
				},{
					label: "终端主电源掉电",
					value:"powerDown"
				},
				{
					label: "终端主电源欠压",
					value:"lowVoltage"
				},
				{
					label: "震动报警",
					value:"shockAlarm"
				},{
					label: "紧急报警",
					value:"emergencyAlarm"
				},
				{
					label: "Bcar拆除报警",
					value:"bcarIsAlarm"
				},{
					label: "碰撞报警",
					value:"collideAlarm"
				},
				{
					label: "二押点报警",
					value:"twoChargeAlarm"
				},
				{
					label: "分离报警",
					value:"separateAlarm"
				},{
					label: "光感报警",
					value:"lightAlarm"
				},{
					label: "超出区域报警",
					value:"outAdminAreaAlarm"
					// 这个就是出省报警
				},{
					label: "圆形区域报警",
					value:"outCircleAlarm"
				},{
					label: "进区域报警",
					value:"inRegionAlarm"
				},{
					label: "出区域报警",
					value:"outRegionAlarm"
				}
			];
		var alarmTypeVlues="";
		var selectedAlarmList=CacheUtil.get("track_selectedAlarmList");
		var allLabels=[]
		var cacheIsShowTypes=CacheUtil.get("track_isShowTypes");
		alarmTypes.map(item=>{
			allLabels.push(item.label)
			if(alarmTypeVlues!==""){
				alarmTypeVlues=alarmTypeVlues+","
			}
			alarmTypeVlues=alarmTypeVlues+item.value
		});
		if(!selectedAlarmList){
			selectedAlarmList=allLabels
		}
		var isBD30=false;
		if(loginuser&&(loginuser.userId===309670||loginuser.cuserId===309670)){
			isBD30=true;
		}
		return {
			defaultTime:getQueryString("time"),
			vehicleType: getQueryString("type"),
			$bsjMapUtil: null,
			mapType: mapType,
			cachePlaySppedKey: cachePlaySppedKey,
			map: null,
			infoWindow: null,
			KEY:'d84259f8-ded7-4387-a222-0e03ceb363bf',   // fc68秘钥
			infoWindowData: {},
			formData: defaultFormData,
			prevSearchFormData: {}, //上次搜索的值
			isBD30: isBD30,
			vehExtend:{},
			isShowTypes: cacheIsShowTypes?Object.assign({},cacheIsShowTypes,{	mongo: true}):{
				//在地图上显示
				mongo: false,
				alarm: false,
				shopPoint: false,
				fence: false
			},
			initMapTypes:{ //是否在地图上已经初始化这种类型的覆盖物
				mongo: false,
				alarm: false,
				shopPoint: false,
				fence: false
			},
			prevIsShowTypes:  cacheIsShowTypes?Object.assign({},cacheIsShowTypes,{	mongo: true}):{  //记录之前的状态
				
				mongo: false,
				alarm: false,
				shopPoint: false,
				fence: false
			},
			
			/*****轨迹****/
			currentMarker: "",
			currentInfoWindow: "",
			trackMongoData: {}, //请求轨迹api返回的整个data
			showTableType: "mongo", //显示的数据类型
			trackMongoDataList: [], //车辆的轨迹数据list
			trackMongoPageIndex: 1, //轨迹表格页码
			trackMongoPageOptions: {
				//轨迹表格分页
				size: 100
			},
			saveMongoAddressList: {}, //轨迹表格地址·
			getMongoStatus: "", //获取轨迹的api状态 loading  error success
			getMongoErrorMsg: "", // 获取轨迹的api失败服务器返回的提示
			playSpeed: Number(CacheUtil.get(cachePlaySppedKey) || 5), //1速度低 2 速度中 3速度快
			playIndex: 0, // 当前播放index
			playProgress: 0, //当前播放百分比进度
			curUsePolyline: [], //当前地图使用的全部轨迹线数组，
			curUsePolylineAllPath: [], //当前地图使用的全部轨迹线path
			isPlaying: false,
			playTimer: null,
			playBeforeStatus: {
				//播放之前记住页面状态
				fontContorSize: false
			},
			/************报警过滤筛选*********/
			selectedAlarmList: selectedAlarmList,
			checkAlarmTypes: alarmTypes,
			alarmTypeVlues:alarmTypeVlues,
			/*********报警报表************/
			getAlarmAddressTaskId: 1,
			getAlarmStatus: "",
			alarmDataList: [],
			saveAlarmAddressList: [],
			getAlarmErrorMsg: "",
			alarmPageOptions: {
				size: 100
			},
			alarmPageIndex: 1, //经常停留点
			alarmMakerList:[],
			/************经常停留点（数据报表）*********/
			// stopPointFormData: {
			// 	spaceTime: 30
			// },
			stopReportData: {}, //GetStopReport返回的整个数据
			stopReportList: [],
			saveReportAddressList: [],
			stopReportPageOptions: {
				size: 100
			},
			stopReportPageIndex: 1, //经常停留点
			getStopPointStatus: "",
			stopPointRules: {
				spaceTime: [
					{ required: true, trigger: "blur", message: "停留时间不能为空！" },
					{ min: 1, message: '停留时间不能为0'},
					{ validator: this.validatorSpaceTime, trigger: "change" }
				]
			},
			getStopPointStatus: "", //获取经常停留点的api状态 loading  error success
			getStopPointErrorMsg: "",

			/*************围栏****************/
			fenceDataList: [], //围栏列表
			getFenceStatus: "", //获取围栏的api状态 loading  error success
			/************停留点（家、公司）*********/
			specialStopPointData:{
				home:null,
				company:null
			},
			specialStopPointMarker:{
				home:null,
				company:null,
				_pathNameLabel:null
			},
			/**********地图************/
			playCarImg:"",
			handlerAddMap: [],
			defaultMongoMArkerList:defaultMongoMArkerList,
			mongoMarkerList:JSON.parse((JSON.stringify(defaultMongoMArkerList))),
			mongoPolylineData: [], //轨迹线的数组
			statrMarkerSize: {
				//起点和终点的markerSize
				icon: {
					w: 32,
					h: 32
				}
			},
			parkMarkerSize: {
				//停车点图标大小
				w: 16,
				h: 16
			},
			wifiMarkSize: {
				//无线设备描点图标大小
				w: 36,
				h: 36
			},
			stopPointMarkList: [], //经常停留点
			fenceMarkerList: {}, //围栏
			/*********************** */
			fotContorlSizeStatus: "small",
			throttleToggleFotControl: null, //节流放大缩小底部
			searchFormSizeStatus: "small",
			throttleToggleSearchForm: null, //节流放大缩小左菜单
			/************** */
			exportContSync:2000, //超过这个大小就异步导出
			isExporting:false, //是否在导出过程中
			downLoadInfoList:[], //最近导出文件列表
			getDownloadInfoError:"",  //获取最近导出文件列表失败
			isGetLoadInfoing:false,
			/**********导出中的数据********************/
			exporProgressData:null,
			/********经常停留点******* */
			stopDetailDialogVisible:false,
			stopDetailDialogData:[],
			zIndexConfig:{ //图标的zIndex配置
				start:6000, //起点
				end:6001, //终点
				playCar:6010, //播放的车辆
				alarm:4000, //报警
				stopReport:2000, //经常停留点
				
			},
			/*******轨迹停车点不定位详情******** */
			isShowNoLocationDetailList:false,
			noLocationDetailList:[],
		};
	},
	created() {
		$BSJ_CONFIG.update();
		this.getGroupData();
		this.checkIsJobs();
		this.getDownloadInfoList()
		this.throttleToggleFotControl = throttle(this.constToggleFotControl, 200);
		console.log(this.throttleToggleFotControl)
		this.throttleToggleSearchForm = throttle(this.constToggleFotControl, 200);
		window['_DoShowNoLocation']=()=>{ //兼容百度地图infoWindow里面的dom点击事件失效问题
			this.doShowNoLocation(this.infoWindowData)
		}
	},
	mounted(){
		new dragResize({
			wrapEl:this.$refs["fotControl"],
			dragEl:this.$refs["fotControlHeader"],
			topStart:true,
			minHeight:65,
			maxHeight:window.innerHeight-10
		})
	},
	computed: {
		displayMongoTableData() {
			//显示在table上的当前页数据
			console.log("trackMongoPageOptions.size",this.trackMongoPageOptions.size)
			var startIndex =
				this.trackMongoPageOptions.size * (this.trackMongoPageIndex - 1);
			var endIndex = this.trackMongoPageOptions.size * this.trackMongoPageIndex;
			return this.trackMongoDataList.slice(startIndex, endIndex);
		},
		displayAlarmDataList() {
			var startIndex =
				this.alarmPageOptions.size * (this.alarmPageIndex - 1);
			var endIndex = this.alarmPageOptions.size * this.alarmPageIndex;
			return this.alarmDataList.slice(startIndex, endIndex);
		},
		displaystopReportList() {
			//经常停留点显示在table上的当前页数据
			var startIndex =
				this.stopReportPageOptions.size * (this.stopReportPageIndex - 1);
			var endIndex = this.stopReportPageOptions.size * this.stopReportPageIndex;
			return this.stopReportList.slice(startIndex, endIndex);
		},
		mongoPolylinePlayedData() {
			//已经播放完的轨迹线的数组
			var len = this.curUsePolylineAllPath.length;
			return this.curUsePolylineAllPath.slice(0, this.playIndex);
		},
		curUsePlaySpeed() {
			return 570 / this.playSpeed;
		},
		infoWindowTitle() {
			if (this.infoWindowData._showType === "stopPoint") {
				return "经常停留点";
			} else {
				return "";
			}
		},
		fitViewAvoid() {
			//setFitView自动缩放地图到合适的视野级别的代表上下左右的像素避让宽
			var top = 0;
			var bottom = 0;
			var left = 0;
			var right = 0;
			if (this.fotContorlSizeStatus === "small") {
				bottom = 400;
			} else {
				bottom = 80;
			}
			if (this.searchFormSizeStatus === "small") {
				left = 360;
			} else {
				left = 0;
			}
			return [top, bottom, left, right];
		}
	},
	methods: {
		/*******操作显示界面 */
		getUrlVars(){ //获取url所有参数
			var vars = {}, hash;
				var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
				for (var i = 0; i < hashes.length; i++) {
					hash = hashes[i].split('=');
					// vars.push(hash[0]);
					vars[hash[0]] = hash[1];
				}
				return vars;
		},
		toggleMapType(){ //切换地图
			var location=window.location
			var toMapType= this.mapType==="amap" ? "bdmap":"amap"
			var urlVals=this.getUrlVars()
			var toUrlValStr="";
			if(!urlVals["mapType"]){
				urlVals["mapType"]=this.mapType
			}
			Object.keys(urlVals).map(key=>{
				var itemVal=urlVals[key]
				if(key==="mapType"){
					itemVal=toMapType
				}
				if(toUrlValStr!==""){
					toUrlValStr+="&"
				}
				toUrlValStr+=`${key}=${itemVal}`
			})
			window.location.href=window.location.href.split("?")[0]+"?"+toUrlValStr
		},
		    exportExcel () {
         /* generate workbook object from table */
         var wb = XLSX.utils.table_to_book(document.querySelector('#table_el'))
         /* get binary string as output */
         var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
         try {
             FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '轨迹报表.xlsx')
         } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
         return wbout
     },
		constToggleFotControl(toStatus) {
			if (toStatus) {
				this.fotContorlSizeStatus = toStatus;
			} else {
				switch (this.fotContorlSizeStatus) {
					case "mini":
						this.fotContorlSizeStatus = "small";
						break;
					case "small":
						this.fotContorlSizeStatus = "mini";
						break;
					default:
						this.fotContorlSizeStatus = "mini";
				}
			}
		},
		toggleFotControl() {
			this.throttleToggleFotControl();
		},
		constToggleSearchForm(toStatus) {
			if (toStatus) {
				this.searchFormSizeStatus = toStatus;
			} else {
				switch (this.searchFormSizeStatus) {
					case "mini":
						this.searchFormSizeStatus = "small";
						break;
					case "small":
						this.searchFormSizeStatus = "mini";
						break;
					default:
						this.searchFormSizeStatus = "mini";
				}
			}
		},
		toggleSearchForm() {
			this.throttleToggleSearchForm();
		},
		/*****地图***/
		mapInited({ map, $bsjMapUtil }) {
			this.map = map;
			this.$bsjMapUtil = $bsjMapUtil;
			this.genInfoWindow({ w: 0, h: -15 });
			
			this.handlerAddMap.map(item => {
				if (typeof item === "function") {
					item();
				}
			});
		
			this.$set(this, "handlerAddMap", []);
		},
		genInfoWindow(offset) {
			//生成地图信息框
			this.infoWindow = this.$bsjMapUtil.do("createInfoWindow", {
				map: this.map,
				isCustom: false,
				offset: offset
				// position:position,
			});
		},
		updateInfoWindow(data, showType) {
			this.infoWindowData = data;
			this.infoWindowData["_showType"] = showType;
			var offset = {};
			switch (showType) {
				case "mongoStart":
				case "mongoEnd":
					offset = {
						aMap:{
							w: 10,
							h: -10
						},
						bMap:{
							w: 0,
							h: -10
						}
					};
					break;
				case "mongoStop":
					offset = {
						aMap:{
							w: 0,
							h: -5
						},
						bMap:{
							w: 10,
							h: -15
						}
					};
					break;
				case "stopPoint":
					offset = {
						aMap:{
							w: 0,
							h: -15
						},
						bMap:{
							w: 10,
							h: -5
						}
					};
					break;
				case "trackPoint":
					offset = {
						aMap:{
							w: -5,
							h: -30
						},
						bMap:{
							w: 10,
							h: -15
						}
					};
					break;
				case "wifiPoint":
					offset = {
						aMap:{
							w: -5,
							h: -30
						},
						bMap:{
							w: 10,
							h: -15
						}
					};
					break;
				case "alarm":
					offset = {
						aMap:{
							w: 20,
							h: -3
						},
						bMap:{
							w: 10,
							h: -15
						}
					};
					break;
				default:
			}
			this.$nextTick(() => {
				this.genInfoWindow(offset, showType);
				//百度信息窗体没有setOffset方法，只有在创建的时候通过offset参数设置偏移量
				// this.infoWindow.$util.setOffset(offset); 
				this.infoWindow.$util.setContent(this.$refs["mogoStopInfo"]);
				this.infoWindow.$util.open(this.map, data.position);
			});
		},
		closeInfoWindow() {
			//百度信息窗体没有setOffset方法，只有在创建的时候通过offset参数设置偏移量
			if(this.infoWindow){
				this.$bsjMapUtil.do("remove", [
				this.infoWindow
			]);
			// this.infoWindow.$util.remove();
			this.infoWindow=null
			}
			
		},
		getGroupData() {
			//获取车组 在选择车辆store使用 后期转入公用
			this.$api
				.loadGroups({
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
		},
		doSearch(formData) {
			//按下搜索键
			Cookies.set("track_filterTime",formData.filterTime)
			Cookies.set("track_spaceTime",formData.spaceTime)
			if (typeof formData.from !== "string") {
				formData.from = dayJs(this.formData.from).format("YYYY-MM-DD HH:mm:00");
			}
			if (typeof formData.to !== "string") {
				formData.to = dayJs(this.formData.to).format("YYYY-MM-DD HH:mm:59");
			}
			this.currentMarker = "";
			this.currentInfoWindow = "";
			this.fotContorlSizeStatus = "small";
			this.getVehTrackMongo(formData);
			// this.getAllFence(formData.vehicleId);
			// this.doGetStopReportBefore(formData);
			// this.doGetAlarmInfoList(formData);
			// this.getVehicleStayPoint()
			this.stopReportPageIndex = 1;
			this.closeInfoWindow();
			this.doPause();
			this.prevSearchFormData = Object.assign({}, formData);
		},
		getMongoAddress(posList, taskId) {
			//获取地址 taskId为当前获取地址的任务id 每次都不一样；解决异步请求回来但是任务已取消
			this.saveMongoAddressList={}
			AddressUtil.getGeoProcess({
				params: {
					data: {
						posList: posList
					}
				},
				processCall:(rst)=>{
					if (rst.flag === 1 && rst.obj && rst.obj.length > 0) {
						var result = {};
						rst.obj.map(item => {
							result[item.tag] = AddressUtil.formatDisplayRow(item);
						});
						this.saveMongoAddressList=Object.assign(result,this.saveMongoAddressList)
					}
				}
			})
				
			// AddressUtil.getGeo({
			// 	params: {
			// 		data: {
			// 			posList: posList
			// 		}
			// 	}
			// })
			// 	.then(rst => {
			// 		if (this.trackMongoData.taskId === taskId) {
			// 			if (rst.flag === 1 && rst.obj && rst.obj.length > 0) {
			// 				var result = [];
			// 				rst.obj.map(item => {
			// 					result[item.tag] = AddressUtil.formatDisplayRow(item);
			// 				});
			// 				this.$set(this, "saveMongoAddressList", result);
			// 			}
			// 		} else {
			// 			console.log("");
			// 		}
			// 	})
			// 	.catch(e => {
			// 		if (this.trackMongoData.taskId === taskId) {
			// 			console.error("获取地址失败", e);
			// 		}
			// 	});
		},
		genMongoTableCellClassName({ row, column, rowIndex, columnIndex }) {
			// console.log("获取行内class",row["_index"])
			// if(row["_index"] ===this.mongoPolylinePlayedData.length){
			//   return "active "+"mogonRow-"+row["_index"]
			// }
			return "mogonRow-" + row["_index"];
		},
		getVehicleStayPoint() { 
			//获取家和公司停留点
			this.doEditAllSpecial("remove")
			this.$api
				.getVehicleStayPoint({
					groupId: this.formData.groupId,
					vehicleId: this.formData.vehicleId
				})
				.then(rst => {
					if (rst.flag === 1) {
						if (rst.obj) {
							var result = [];
							var objArr = rst.obj.split(";");
							objArr.map((item, index) => {
								if(item){
									var itemArr = item.split(",");
									if (Number(itemArr[0]) === 1) {
										this.$set(this.specialStopPointData, "home", {
											position: GPS.amapToPosition(itemArr[2], itemArr[1]),
											radii:itemArr[3]||1000,
											icon: {
												image: require("@/assets/img/map/locationHome.png"),
												size: { w: 25, h: 30 }
											},
											plate:this.formData.plate
										});
									} else {
										this.$set(this.specialStopPointData, "company", {
											position: GPS.amapToPosition(itemArr[2], itemArr[1]),
											radii:itemArr[3]||1000,
											icon: {
												image: require("@/assets/img/map/locationCompany.png"),
												size: { w: 25, h: 30 }
											},
											plate:this.formData.plate
										});
									}
								}
							});
							
							this.doAddAllSpecialStopPoint()
						}
					} else {
					}
				})
				.catch(e => {
					console.log(e, "获取经常停留点失败");
				});
		},
		getVehTrackMongo(formData) {
			//获取轨迹
				var prevDevTime=new Date().getTime()
					var nowDevTime=new Date().getTime()
			console.log("获取轨迹",prevDevTime)
			this.playProgress = 0;
			this.trackMongoPageIndex = 1;
			this.playProgress = 0;
			this.playIndex = 0;

			let params = {
				terminalNo:formData['vehicleId'],
				filterTime:formData['filterTime'],
				startTime:formData['from'],
				endTime:formData['to'],
				key:this.KEY
			}
			this.$set(this, "trackMongoDataList", []);
			this.$set(this, "saveMongoAddressList", {});
			this.$set(this, "trackMongoData", {});
			this.$set(this, "mongoPolylineData", []);
			this.$set(this, "curUsePolyline", []);
			this.clearPlayTimer();
			this.resetMongoMaker();
			this.getMongoStatus = "loading";
			this.$api
				.MkGetVehTrackMongo(params, {
					//获取当前轨迹详情
					isCanNotCancel: true
				})
				.then(rst => {
					nowDevTime=new Date().getTime()
					console.log("轨迹回来",nowDevTime-prevDevTime)
					prevDevTime=nowDevTime
					// console.log(rst)
					if (rst.flag === 1) {
						this.vehExtend=rst.extend
						this.computePlayCarImg()
						nowDevTime=new Date().getTime()
						console.log("轨迹遍历前",nowDevTime-prevDevTime)
						prevDevTime=nowDevTime
						if (rst.obj && rst.obj.length > 0) {
							
							var useList=[]; //过滤a或o为0的定位异常数据
							var posList = [];
							var taskId = new Date().getTime();
							var polylineData = [];
							rst.obj.map((item, index) => {
								if(item.a!==0||item.o!==0){//过滤a或o为0的定位异常数据
									item.vehType = rst.extend.terminalType;
									item.plate = rst.extend.plate;
									item.groupName = rst.extend.groupName;
									item.longStayTer = rst.extend.longStayTer;
									item = CarUtil.handerlMongo(item);
									console.log(item)
									useList.push(item)
									polylineData.push(item.position);
									item["_index"] = useList.length;
									posList.push({
										lat: item.position.aMap.y,
										lon: item.position.aMap.x,
										tag: item["_index"]
									});
								}
							});
							rst.obj=useList;
							this.$set(this, "mongoPolylineData", polylineData);
							this.$set(
								this,
								"trackMongoData",
								Object.assign(rst, {
									taskId: taskId
								})
							);
							nowDevTime=new Date().getTime()
							console.log("轨迹遍历后",nowDevTime-prevDevTime)
							prevDevTime=nowDevTime
							this.getMongoAddress(posList, taskId);
							this.$set(this, "trackMongoDataList", rst.obj);
							nowDevTime=new Date().getTime()
							console.log("settrackMongoDataList后",nowDevTime-prevDevTime)
							this.doAddAllMongoInMap();
						}
					
						this.getMongoStatus = "success";
					} else {
						this.getMongoStatus = "error";
						this.getMongoErrorMsg = rst.msg;
					}
				})
				.catch(e => {
					this.getMongoStatus = "error";
					console.error(e);
				});
		},
		getAllFence(vid) {
			//获取当前车辆的所有围栏-包括圆形围栏和多边形围栏
			this.getFenceStatus = "loading";
			this.$set(this, "fenceDataList", []);
			Promise.all([this.getPathIdByVehicleId(vid), this.getVehicleCircle(vid)])
				.then(rstList => {
					var polygonFence = rstList[0]; //多边形围栏
					var circleFence = rstList[1]; //圆形围栏

					if (circleFence.flag === 1 && polygonFence.flag === 1) {
						var result = [];
						if (polygonFence.obj && polygonFence.obj.length > 0) {
							polygonFence.obj.map(item => {
								item["_type"] = "polygon";
								item["_typeTxt"] = "多边形";

								item["position"] = GPS.defaultToPositionList({
									list: item.pointList,
									yKey: "oriLon",
									xKey: "oriLat"
								});
							});
							result = result.concat(polygonFence.obj);
						}
						if (circleFence.obj) {
							circleFence.obj["position"] = GPS.defaultToPosition(
								
								circleFence.obj.lat,
								circleFence.obj.lon
							);
							circleFence.obj["_type"] = "circle";
							circleFence.obj["_typeTxt"] = "圆形";
							circleFence.obj["pathId"] = "_circle";
							result.push(circleFence.obj);
						}
						this.getFenceStatus = "success";
						this.$set(this, "fenceDataList", result);
						this.doAddAllFence();
					} else {
						this.getFenceStatus = "error";
					}
				})
				.catch(e => {
					this.getFenceStatus = "error";
					console.error("e");
				});
		},
		doAgainGetMongo() {
			//重新轨迹详情
			this.getVehTrackMongo(this.prevSearchFormData);
		},
		/*********家和公司**********/
		doAddAllSpecialStopPoint(){
	
			if (!this.map) {
				this.handlerAddMap.push(this.doAddAllSpecialStopPoint);
				return;
			}
			this.doEditAllSpecial("remove"); //先删除之前的
			Object.keys(this.specialStopPointData).map(key => {
				var item=this.specialStopPointData[key];
		
				if(item){
					var fillColor="" //圈颜色
					var strokeColor="" //边框颜色
					var title=""
					if(key==="home"){
						fillColor="#67c23a" 
						strokeColor="#67c23a"
						title=item.plate+"经常停留点：家"
					}else if(key === "company"){
						fillColor="#ecf8ff" 
						strokeColor="#50bfff"
						title=item.plate+"经常停留点：公司"
					}
					var newMar = this.$bsjMapUtil.do("createMarker", {
						map: this.map,
						position: item.position,
						icon: item.icon,
						// offset: { w: -18, h: -18 }
					});
					
					this.specialStopPointMarker["_newMar"]=newMar;
					var newCircle = this.$bsjMapUtil.do(
						"createCircle",
						{
							map: this.map,
							title:title,
							radius: item.radii,
							center: item.position,
							position:item.position,
							fillColor: fillColor,
							strokeColor: strokeColor
						}
					);
					this.specialStopPointMarker[key]=newCircle
					this.specialStopPointMarker[key+"_label"]=this.$bsjMapUtil.do(
								"createText",
								{
									text: title,
									map: this.map,
									position: item.position,
									offset:{
										aMap:{
											w: 115,
											h: 0
										}
									}
								}
							);
					// newCircle.$bindEvent("mouseover", (data, e) => {
					// 	if (!this.specialStopPointMarker["_pathNameLabel"]) {
					// 		this.specialStopPointMarker["_pathNameLabel"] = this.$bsjMapUtil.do(
					// 			"createText",
					// 			{
					// 				text: data.title,
					// 				map: this.map,
					// 				position: e.position,
					// 				offset: {
					// 					w: 60,
					// 					h: 5
					// 				}
					// 			}
					// 		);
					// 	} else {
					// 		this.specialStopPointMarker["_pathNameLabel"].$util.setText(data.title);
					// 		this.specialStopPointMarker["_pathNameLabel"].$util.setPosition(e.position);
					// 		// this.specialStopPointMarker["_pathNameLabel"].$util.show();
					// 	}
					// });
					// newCircle.$bindEvent("mouseout", e => {
					// 	if (this.specialStopPointMarker["_pathNameLabel"]) {
					// 		// this.specialStopPointMarker["_pathNameLabel"].hide();
					// 	}
					// });
				}
			});
		},
		doEditAllSpecial(type) {
			//type:操作类型 remove show hide
			var markList = [];
			if(!this.initMapTypes.specialStop&&type==="show"){
				this.doEditAllSpecial()
			}
			
			Object.keys(this.specialStopPointMarker).map(key => {
				if(this.specialStopPointMarker[key]){
						markList.push(this.specialStopPointMarker[key]);
				}	
			});
			
		
			if (markList.length > 0) {
				this.$bsjMapUtil.do(type, {
					map: this.map,
					marker: markList
				});
				if(type==="remove"){
					Object.keys(this.specialStopPointMarker).map(key=>{
						this.specialStopPointMarker[key]=null
					})
					this.initMapTypes.specialStop=false
				}
			}
		},
		/************ 获取报警报表***/
		doAgainGetAlarm() {
			this.doGetAlarmInfoList(this.prevSearchFormData);
		},
		doGetAlarmInfoList(formData) {
			//获取报警列表
			this.$set(this, "alarmDataList", []);
			this.$set(this, "saveAlarmAddressList", []);
			this.getAlarmStatus = "loading";
			this.doEditAllAlarm("remove");
			window["A"]=this;
			this.$api
				.getAlarmInfoList({
					alarmTypes:this.alarmTypeVlues,
						// alarmTypes: "overSpeed,isIllegalRemove,GPSAntennaState,powerDown,lowVoltage,outAreaAlarm,inAreaAlarm,inRegionAlarm,outRegionAlarm,outAdminAreaAlarm,outCircleAlarm,abnormalStayAlarm,shockAlarm,emergencyAlarm,bcarIsAlarm,acarBts,bcarBts,pseudoLbs,collideAlarm,twoChargeAlarm,separateAlarm,lightAlarm",
					startTime: formData.from,
					endTime: formData.to,
					vehicleId: formData.vehicleId
				})
				.then(rst => {
					if (rst.flag === 1) {
						if (rst.obj && rst.obj.length > 0) {
							var taskId = new Date().getTime();
							this.getAlarmAddressTaskId = taskId;
							var posList = [];
							var newDataObj=[]
							rst.obj.map((item, index) => {
								if(item.latBegin&&item.lonBegin){
									item["_index"] = newDataObj.length+1;
									item.position = GPS.defaultToPosition(
										item.latBegin,
										item.lonBegin
									);
									newDataObj.push(item)
									posList.push({
										lat: item.position.aMap.y,
										lon: item.position.aMap.x,
										tag: item["_index"]
									});
								}
								
							});
							rst.obj=newDataObj;
							this.$set(this, "alarmDataList", rst.obj);
							this.getAlarmAddress(posList, taskId);
							this.doAddAllAlarm()
						}
						this.getAlarmStatus = "success";
					} else {
						this.getAlarmStatus = "error";
						this.getAlarmErrorMsg=rst.msg
					}
				})
				.catch(e => {
					this.getAlarmStatus = "error";
					console.error(e, "获取单个报警信息集合失败");
				});
		},
		getAlarmAddress(posList, taskId) {
			//获取地址 taskId为当前获取地址的任务id 每次都不一样；解决异步请求回来但是任务已取消
			AddressUtil.getGeo({
				params: {
					data: {
						posList: posList
					}
				}
			})
				.then(rst => {
					if (this.getAlarmAddressTaskId === taskId) {
						if (rst.flag === 1 && rst.obj && rst.obj.length > 0) {
							var result = [];
							rst.obj.map(item => {
								result[item.tag] = AddressUtil.formatDisplayRow(item);
							});
							this.$set(this, "saveAlarmAddressList", result);
						}
					} else {
						console.log("");
					}
				})
				.catch(e => {
					if (this.getAlarmAddressTaskId === taskId) {
						console.error("获取地址失败", e);
					}
				});
		},
		/****经常停留点***/
		doGetStopReport(vid, formData) {
			//获取经常停留点
			
			this.getStopPointStatus = "loading";
			
			this.doEditAllStopPointMark("remove");
			var params = {
				vehicleId: vid,
				spaceTime: formData.spaceTime,
				runStopBeginTime: dayJs().subtract(1,"month").format("YYYY-MM-DD HH:mm"),
				runStopEndTime:dayJs().format("YYYY-MM-DD HH:mm"),
				longStay: 0
			};
			this.$api
				.getStopReport(params)
				.then(rst => {
					if (rst.flag === 1) {
						if (rst.obj) {
							var taskId = new Date().getTime();
							var posList = [];
							var filterList=[]
							rst.obj.list.map((item, index) => {
								if(item.n>1){
									item.spaceTimeTotal=0
									item.details.map(spaceItem=>{
										item.spaceTimeTotal+=spaceItem.spaceTime
									})
									item.spaceTimeTotal=this.diffTime(item.spaceTimeTotal*1000)
									item["_index"] = filterList.length + 1;
									item.position = GPS.defaultToPosition(item.aB, item.oB);
									posList.push({
										tag: item["_index"],
										lat: item.position.aMap.y,
										lon: item.position.aMap.x
									});
									filterList.push(item)
								}
							});
							rst.obj.list=filterList
							this.stopReportData = rst.obj;
							this.stopReportList = rst.obj.list;
						
							this.getStopReportAddress(posList, taskId);
							this.doAddAllStopPointMark();
						} else {
							this.stopReportList = [];
						}
							this.getStopPointStatus = "success";
					
					} else {
						this.getStopPointErrorMsg = rst.msg;
						this.getStopPointStatus = "error";
						this.stopReportList = [];
					}
				})
				.catch(e => {
					this.getStopPointStatus = "error";
					this.stopReportList = [];
					console.error(e);
				});
		},
		doGetStopReportBefore(formData) {
			//查询当前车辆经常停留点
			formData = formData ? formData : this.prevSearchFormData;
			this.doGetStopReport(formData.vehicleId, formData);
			// this.$refs["stopPointform"].validate(valid => {
			// 	if (valid) {
			// 		if (formData.vehicleId) {
			// 			this.doGetStopReport(formData.vehicleId, formData);
			// 		} else {
			// 			this.getStopPointStatus = "error";
			// 			this.getStopPointErrorMsg = "请先在上方选择车辆后，";
			// 		}
			// 	}
			// });
		},
		doStopPointFormSubmit() {
			var formData = Object.assign({}, this.formData);
			if (typeof formData.from !== "string") {
				formData.from = dayJs(this.formData.from).format("YYYY-MM-DD HH:mm:00");
			}
			if (typeof formData.to !== "string") {
				formData.to = dayJs(this.formData.to).format("YYYY-MM-DD HH:mm:59");
			}
			this.stopReportPageIndex = 1;
			this.doGetStopReportBefore(
				JSON.stringify(this.prevSearchFormData) !== "{}"
					? this.prevSearchFormData
					: formData
			);
		},
		getStopReportAddress(posList, taskId) {
			AddressUtil.getGeo({
				params: {
					data: {
						posList: posList
					}
				}
			})
				.then(rst => {
					if (this.trackMongoData.taskId !== taskId) {
						// return;
					}
					if (rst.flag === 1 && rst.obj && rst.obj.length > 0) {
						var result = [];
						rst.obj.map(item => {
							result[item.tag] = AddressUtil.formatDisplayRow(item);
						});
						this.$set(this, "saveReportAddressList", result);
					} else {
						console.log("rst",rst);
					}
				})
				.catch(e => {
					console.error("获取地址失败", e);
					if (this.trackMongoData.taskId === taskId) {
						console.error("获取地址失败", e);
					}
				});
		},
		validatorSpaceTime(rule, value, callback) {
			if (/(^[1-9]\d*$)/.test(value)) {
				callback();
			} else {
				callback(new Error("请输入正整数"));
			}
		},
		doAgainGetStopReport() {
			//重新获取围栏详情
			this.doGetStopReport(this.prevSearchFormData.vehicleId,this.prevSearchFormData);
		},
		/***围栏***/
		doAgainGetFence() {
			//重新获取围栏详情
			this.getAllFence(this.prevSearchFormData.vehicleId);
		},
		getPathIdByVehicleId(vid) {
			//获取多边形围栏
			return this.$api.getPathIdByVehicleId({
				vehicleId: vid
			});
		},
		getVehicleCircle(vid) {
			//获取圆形围栏
			return this.$api.getVehicleCircle({
				vehicleId: vid
			});
		},
		trackMongoPageSizeChange(size){
			this.$set(this.trackMongoPageOptions,'size',size)
		},
		stopReportPageSizeChange(size){
			this.$set(this.stopReportPageOptions,'size',size)
		},
		alarmPageSizeChange(size){
			this.$set(this.alarmPageOptions,'size',size)
		},
		/********轨迹地图部分start******/
		computePlayCarImg(){
		
			this.playCarImg= $BSJ_CONFIG.getTrackMapImg({terminalType:this.vehExtend.terminalType})
		},
		doAddAllMongoInMap() {
			//把轨迹详情的点和线添加到地图上
			if(!this.isShowTypes.mongo){ //报警不显示
				return
			}
			if (this.map) {
				this.doAddMongoMarker();
				this.doAddMongoPolyline();
				this.doSetFitViewInMongo();
			} else {
				this.handlerAddMap.push(this.doAddAllMongoInMap);
			}
			this.initMapTypes.mongo=true
		},
		doSetFitViewInMongo() {
			//设置地图显示轨迹所有相关线
			var overlayList = [];
			Object.keys(this.mongoMarkerList).map(key => {
				var item = this.mongoMarkerList[key];
				if (item) {
					switch (key) {
						case "park":
						case "wifi":
							Object.keys(item).map(subKey => {
								var subItem = item[subKey];
								if (subItem) {
									overlayList.push(subItem);
								}
							});
							break;
						default:
							overlayList.push(item);
					}
				}
			});
			this.$bsjMapUtil.do("setFitView", {
				map: this.map,
				overlayList: overlayList,
				avoid: this.fitViewAvoid
			});
		},
		doAddMongoMarker() {
			//生成轨迹详情标识点到地图上
			if(this.trackMongoDataList.length===0){
				return
			}
			var listData = this.trackMongoDataList;
			var isWired = this.trackMongoDataList[0].isWired;
			listData.map((item, index) => {
				if (index === 0) {
					//起点
					this.doAddMongoStartMark(item);
				} else if (index === listData.length - 1) {
					//终点
					this.doAddMongoEndMark(item);
				} else if (isWired) {
					//有线设备只描停车点

					if (item.isStop) {
						this.doAddMongoStopMark(item);
					}
				} else {
					//无线设备打所有点
					this.doAddMongoWifiMark(item);
				}
			});
		},
		doAddMongoStartMark(data) {
			//添加起点
			if (!this.mongoMarkerList.start) {
				this.mongoMarkerList.start = this.$bsjMapUtil.do("createMarker", {
					map: this.map,
					position: data.position,
					zIndex:this.zIndexConfig.start,
					icon: {
						image: require("@/assets/img/map/track_start.png"),
						imageSize: this.statrMarkerSize.icon
					},
					offset: {
						aMap:{
							w:-12, h: -12
						}
						
					}
				});
				this.mongoMarkerList.start.$bindEvent("mouseover", (subData, e) => {
					this.updateInfoWindow(data, "mongoStart");
				});
				this.mongoMarkerList.start.$bindEvent("mouseout", e => {
					this.closeInfoWindow();
				});
			} else {
				this.mongoMarkerList.start.$util.setPosition(data.position);
				this.mongoMarkerList.start.$util.show();
			}
		},
		doAddMongoEndMark(data) {
			//添加终点
			if (!this.mongoMarkerList.end) {
				this.mongoMarkerList.end = this.$bsjMapUtil.do("createMarker", {
					map: this.map,
					zIndex:this.zIndexConfig.end,
					position: data.position,
					icon: {
						image: require("@/assets/img/map/track_end.png"),
						imageSize: this.statrMarkerSize.icon
					},
					offset: {
						aMap:{
								w:-12, h: -12
						}
					}
				});
				this.mongoMarkerList.end.$bindEvent("mouseover", (subData, e) => {
				
					this.updateInfoWindow(data, "mongoEnd");
				});
				this.mongoMarkerList.end.$bindEvent("mouseout", e => {
					this.closeInfoWindow();
				});
			} else {
				this.mongoMarkerList.end.$util.setPosition(data.position);
				this.mongoMarkerList.end.$util.show();
			}
		},
		doAddMongoStopMark(data) {
			//添加有线停车点

			var id = data["_index"];
			if (!this.mongoMarkerList.park[id]) {
				var defaultImg=require("@/assets/img/map/track_park.png");//包含不定位数据显示的图
				var noLocation=require("@/assets/img/map/track_park_noLocation.png"); //包含不定位数据显示的图
				var newMar=  this.$bsjMapUtil.do("createMarker", {
					map: this.map,
					position: data.position,
					zIndex:8000,
					icon: {
						image:data.hasNoLocation? noLocation:defaultImg,
						size: this.parkMarkerSize,
						imageSize:this.parkMarkerSize
					},
					offset: {
							aMap:{
								w: -7, h:-7 
							}
					
					}
				});
				newMar.$bindEvent("mouseover", (subData, e) => {
					this.updateInfoWindow(data, "mongoStop");
				});
				newMar.$bindEvent("mouseout", e => {
					this.closeInfoWindow();
				});
				newMar.$bindEvent("click",(subData,e) => {
					this.onMapSelectedMongoToShowTable(data)
				});
				this.mongoMarkerList.park[id]=newMar
			} else {
				this.mongoMarkerList.park[id].$util.setPosition(data.position);
			}
		},
		doAddMongoWifiMark(data) {
			//添加无线描点
			var id = data["_index"];
			if (!this.mongoMarkerList.wifi[id]) {
				this.mongoMarkerList.wifi[id] = this.$bsjMapUtil.do("createMarker", {
					map: this.map,
					position: data.position,
					icon: {
						image: require("@/assets/img/map/track_markImg.png"),
						size: this.wifiMarkSize,
						imageSize:this.wifiMarkSize
					},
					offset: {
						aMap:{
							w: -15,
							h: -36
						},
						bMap:{
							w: 5,
							h: -18
						}
					}
				});
				
				this.mongoMarkerList.wifi[id].$bindEvent("mouseover", (subData, e) => {
					this.updateInfoWindow(data, "wifiPoint");
				});
				this.mongoMarkerList.wifi[id].$bindEvent("mouseout", e => {
					this.closeInfoWindow();
				});
				this.mongoMarkerList.wifi[id].$bindEvent("click",(subData,e) => {
					this.onMapSelectedMongoToShowTable(data)
				});
			} else {
				this.mongoMarkerList.wifi[id].$bindEvent("mouseover", (subData, e) => {
					this.updateInfoWindow(data, "wifiPoint");
				});
				this.mongoMarkerList.wifi[id].$bindEvent("mouseout", e => {
					this.closeInfoWindow();
				});
				this.mongoMarkerList.wifi[id].$util.setPosition(data.position);
			}
		},
		doAddMongoPolyline() {
			// //生成轨迹详情线条到地图上
			if(this.trackMongoDataList.length===0){
				return
			}
			if (this.trackMongoDataList[0].isWired) {
				//有线设备才画线 无线设备描点
				this.mongoMarkerList["polyline"] = this.$bsjMapUtil.do("createPolyline", {
					map: this.map,
					path: GPS.positioListTran(this.mongoPolylineData)
				});
				this.curUsePolylineAllPath = this.mongoMarkerList["polyline"].getPath();
			}else{
				this.curUsePolylineAllPath = this.$bsjMapUtil.getUsePosition(this.mongoPolylineData)
			}
			
		},
		doShowPlayedPolyline() {
			//修改已经播放了的轨迹线
			if (!this.mongoMarkerList["playedPolyline"]) {
				this.mongoMarkerList["playedPolyline"] = this.$bsjMapUtil.do(
					"createPolyline",
					{
						map: this.map,
						path: this.mongoPolylinePlayedData,
						strokeColor: "#1ECC46",
						fillColor: "#1ECC46"
					}
				);
			} else {
				this.mongoMarkerList["playedPolyline"].setPath(
					this.mongoPolylinePlayedData
				);
			}
		},
		tableScrollToPlay() {
			//播放轨迹的时候自动滚动翻页表格
			this.showTableType === "mongo";
			this.$nextTick(() => {
				var index = this.mongoPolylinePlayedData.length;
				if (index !== 0) {
					let currentRow = this.trackMongoDataList[index - 1];
  
					const useAngle= $BSJ_CONFIG.getTrackMapAngle({terminalType:this.vehExtend.terminalType,angle:currentRow.angle})
					this.$refs["mongoTable"].setCurrentRow(currentRow);
					let container = this.$refs["mongoTable"].$el.querySelector(
						".el-table__body-wrapper"
					);
					container.scrollTop = container.querySelector(".mogonRow-" + index)
						? container.querySelector(".mogonRow-" + index).offsetTop - 10
						: 0;
					if (!this.mongoMarkerList.current) { //更新播放轨迹的时候绿色车
						this.mongoMarkerList.current = this.$bsjMapUtil.do("createMarker", {
							map: this.map,
							position: currentRow.position,
							zIndex:this.zIndexConfig.playCar,
							icon: {
								image: this.playCarImg,
								imageSize: { w: 32, h: 35 }
							},
							offset:{
								aMap:{
									w: -15, h:-18 
								}
								
							},
							angle:   useAngle
						});
					} else {
						let position = this.$bsjMapUtil.do(
							"positionToLanLat",
							currentRow.position
						);
						if(!this.$bsjMapUtil.do("IsContainPoint",{map: this.map,position})){
							this.$bsjMapUtil.do("setCenter",{map: this.map,position})
						}
						this.mongoMarkerList.current.$util.setPosition(position);
						this.mongoMarkerList.current.$util.setAngle(useAngle);
						this.mongoMarkerList.current.$util.show();
					}

				
				}
				
			});
		},
		onMapSelectedMongoToShowTable(itemData){ //在地图上选择轨迹点 自动跳到
			if(this.isPlaying){ //播放轨迹过程中 不执行
				return 
			}
			var index=itemData["_index"]
			this.trackMongoPageIndex = Math.max(
				1,
				Math.ceil(index / this.trackMongoPageOptions.size)
			);
			this.$nextTick(()=>{
				let currentRow = this.trackMongoDataList[index - 1];
				this.$refs["mongoTable"].setCurrentRow(currentRow);
				let container = this.$refs["mongoTable"].$el.querySelector(
					".el-table__body-wrapper"
				);
				container.scrollTop = container.querySelector(".mogonRow-" + index)
					? container.querySelector(".mogonRow-" + index).offsetTop - 10
					: 0;
			})
		},
		onTrackRowClick(row) {
			if (!this.map) {
				return;
			}
			if(this.isPlaying){
				console.log('轨迹回放时禁止点击')
				return false;
			}
			this.isShowTypes.mongo=true;
			this.$nextTick(()=>{
				if (!this.mongoMarkerList.track) {
					this.mongoMarkerList.track = this.$bsjMapUtil.do("createMarker", {
						map: this.map,
						position: row.position,
						icon: {
							image: require("@/assets/img/map/track_selectedMarkImg.png"),
							size:{ w: 36, h: 36},
							imageSize: { w: 36, h: 36 }
						},
						offset:{
							aMap:{
								w: -15, h: -36 
							},
							bMap:{
								w:5,
								h:-18
							}
						} 
					});
					this.mongoMarkerList.track.$bindEvent("click", (subData, e) => {
						this.updateInfoWindow(row, "trackPoint");
					});
				} else {
					let position = this.$bsjMapUtil.do("positionToLanLat", row.position);
					this.mongoMarkerList.track.$bindEvent("click", (subData, e) => {
						this.updateInfoWindow(row, "trackPoint");
					});
					this.mongoMarkerList.track.$util.setPosition(position);
					this.mongoMarkerList.track.$util.show();
				}
				this.updateInfoWindow(row, "trackPoint");
				this.$bsjMapUtil.do("setCenter", {
					map: this.map,
					position: row.position
				});
			})
			
		},
		editMongoAllMarker(eventType) {
			//隐藏、显示轨迹覆盖物
			if (!this.map) {
				return;
			}
			if(!this.initMapTypes.mongo&&eventType==="show"){
				this.doAddAllMongoInMap()
			}
			this.$nextTick(()=>{
				var markList = [];
				Object.keys(this.mongoMarkerList).map(key => {
					var item = this.mongoMarkerList[key];
					switch (key) {
						case "current":
						case "track":
						case "start":
						case "end":
						case "polyline":
						case "playedPolyline":
							item && markList.push(item);
							break;
						case "park":
						case "wifi":
							Object.keys(item).map(subkKey => {
								var subItem = item[subkKey];
								subItem && markList.push(subItem);
							});
							break;
						default:
							console.error("还有类型图标" + key + "没有隐藏");
					}
				});
				this.$bsjMapUtil.do(eventType, {
					map: this.map,
					marker: markList
				});
				if(eventType==="remove"){
					this.mongoMarkerList= JSON.parse((JSON.stringify(this.defaultMongoMArkerList)))
					this.initMapTypes.mongo=false
				}
			})
			
		},
		resetMongoMaker() {
			//重置当前的轨迹所有marker
			this.editMongoAllMarker("remove");
		},
		clearMongoPolyline() {
			//清除轨迹线
			this.$bsjMapUtil.do("remove", [
				this.mongoMarkerList.polyline,
				this.mongoMarkerList.playedPolyline
			]);
		},
		doTogglePlay() {
			if (this.isPlaying) {
				this.doPause();
			} else {
				if (this.playIndex === this.curUsePolylineAllPath.length) {
					this.playIndex = 0;
				}
				
				this.closeInfoWindow();
				this.doPlay();
			}
		},
		doPlay() {
			this.clearPlayTimer();
			if(!this.isPlaying){
				this.isShowTypes.mongo=true
			}
			this.isPlaying = true;
			this.playIndex++;
			if (this.playIndex < this.curUsePolylineAllPath.length) {
				this.playTimer = setTimeout(() => {
					this.doPlay();
				}, this.curUsePlaySpeed);
			} else {
				this.isPlaying = false;
			}
		},
		changeProgress(){ //用户手动拖动播放进入条
			switch(this.playProgress){
				case 0:
					this.playIndex=0;
					break;
				case 100:
					this.playIndex=this.curUsePolylineAllPath.length;
					break;
				default:
					this.playIndex=Number(this.playProgress*this.curUsePolylineAllPath.length/100).toFixed()
			}
		},
		doPause() {
			this.clearPlayTimer();
			this.isPlaying = false;
		},
		clearPlayTimer() {
			this.playTimer && clearTimeout(this.playTimer);
		},
		
		/********经常停留点start******/
		doAddAllStopPointMark() {
			if(!this.isShowTypes.shopPoint){
				return
			}
			if (!this.map) {
				this.handlerAddMap.push(this.doAddAllStopPointMark);
				return;
			}
			this.stopReportList.map(item => {
				var newStopMar = this.$bsjMapUtil.do("createMarker", {
					map: this.map,
					position: item.position,
					icon: {
						image: require("@/assets/img/map/track_stopReport.png"),
						size: {
							w: 24,
							h: 24
						},
						imageSize:{
							w: 24,
							h: 24
						}
					},
					offset: {
						aMap:{ w: -18, h: -18 }
						}
				});
				newStopMar.$bindEvent("mouseover", (subData, e) => {
					this.updateInfoWindow(item, "stopPoint");
				});
				newStopMar.$bindEvent("mouseout", e => {
					this.closeInfoWindow();
				});
				this.stopPointMarkList[item["_index"]] = newStopMar;
			});
			this.initMapTypes.shopPoint=true
		},
		doEditAllStopPointMark(type) {
			//type:操作类型 remove show hide
		
			if(!this.initMapTypes.shopPoint&&type==="show"){
				this.doAddAllStopPointMark()
			}
			if (this.map) {
				var markList = [];
				Object.keys(this.stopPointMarkList).map(index => {
					var item = this.stopPointMarkList[index];
					item && markList.push(item);
				});
				this.$bsjMapUtil.do(type, {
					map: this.map,
					marker: markList
				});
				if(type==="remove"){
					this.stopPointMarkList=[]
					this.initMapTypes.shopPoint=false
				}
			}
		},
		onStopPointRowClick(row) {
			if (!this.map) {
				return;
			}
			this.isShowTypes.shopPoint=true;
			if(	!this.initMapTypes.shopPoint){
				this.doAddAllStopPointMark();
			}
				
			this.$nextTick(()=>{
				this.$bsjMapUtil.do("setCenter", {
					map: this.map,
					position: row.position
				});
				this.updateInfoWindow(row,"stopPoint")
			});
		},
		/***************报警地图**************** */
		doAddAllAlarm(){
			if (!this.map) {
				this.handlerAddMap.push(this.doAddAllAlarm);
				return;
			}
			if(!this.isShowTypes.alarm){ //报警不显示
				return
			}else{
				this.doEditAllAlarm("remove"); //先删除之前的
			}
			this.$nextTick(()=>{
				this.alarmDataList.map(item => {
					var newMarker = this.$bsjMapUtil.do("createMarker", {
						map: this.map,
						position: item.position,
						icon: {
							image: require("@/assets/img/map/track_alarm.png"),
							size: {
								w:25,
								h:30
							},
							imageSize:{
								w:25,
								h:30
							}
						},
						offset: {
							aMap:{
								w:-10, h: -15
							},
							bMap:{
								w:3, h: 0
							}
							
						},
						label:{
							offset: {
								w:-25, h:32
							},
							labelTxt: item.type
						}
					});
					newMarker.$bindEvent("mouseover", (subData, e) => {
						this.updateInfoWindow(item, "alarm");
					});
					newMarker.$bindEvent("mouseout", e => {
						this.closeInfoWindow();
					});
					if(this.selectedAlarmList.indexOf(item.type)===-1){ //用户没有勾选在地图上显示这种报警类型
						newMarker.$util.hide()
					}
					this.alarmMakerList.push( newMarker);
				
				});
				this.initMapTypes.alarm=true
			})
			
		},
		doEditAllAlarm(type){
			if (!this.map) {
				return;
			}
			if(!this.initMapTypes.alarm&&type==="show"){
				this.doAddAllAlarm()
			}
			this.$nextTick(()=>{
				if (this.alarmMakerList.length > 0) {
					if(type!=="show"){
						this.$bsjMapUtil.do(type, {
							map: this.map,
							marker: this.alarmMakerList
						});
					}else{ //只显示已勾选类型的报警
						this.alarmMakerList.map(item=>{
							var labelTxt=item._data.label.labelTxt;
							if(this.selectedAlarmList.indexOf(labelTxt)===-1){
								item.$util.hide()
							}else{
								item.$util.show()
							}
						})
					}
					if(type==="remove"){
						this.alarmMakerList=[]
						this.initMapTypes.alarm=false
					}
				}
			})
			
		},
		onAlarmRowClick(row) {
			if (!this.map) {
				return;
			}
			this.isShowTypes.alarm=true;
			if(!this.initMapTypes.alarm){
				this.doAddAllAlarm();
			}
			
			if(this.selectedAlarmList.indexOf(row.type)===-1){
				this.selectedAlarmList.push(row.type);
			}
			this.$nextTick(()=>{
				this.updateInfoWindow(row, "alarm");
				this.$bsjMapUtil.do("setCenter", {
					map: this.map,
					position: row.position
				});
			})
			
		},
		/**************围栏*****************/
		onFenceRowClick(row, column, event) {
			//选中居中当前围栏
			if (!this.map) {
				return;
			}
			this.isShowTypes.fence=true;
			if(!this.initMapTypes.fence){
				this.doAddAllFence();
			}
			this.$nextTick(()=>{
				this.fenceMarkerList[row.pathId] &&
				this.$bsjMapUtil.do("setFitView", {
					map: this.map,
					overlayList: [this.fenceMarkerList[row.pathId]],
					avoid: this.fitViewAvoid
				});
			})
			
		},
		doAddAllFence() {
			if(!this.isShowTypes.fence){ //围栏不显示
				return
			}
			if (!this.map) {
				this.handlerAddMap.push(this.doAddAllFence);
				return;
			}
			this.doEditAllFence("remove"); //先删除之前的
			this.fenceDataList.map(item => {
				var type = item["_type"];
				var newFence = null;
				if (type === "polygon") {
					//生成多边形围栏
					newFence = this.$bsjMapUtil.do("createPolygon", {
						map: this.map,
						path: item.position,
						title: item.pathName
					});
				} else {
					//圆形围栏
					newFence= this.$bsjMapUtil.do(
						"createCircle",
						{
							map: this.map,
							title:"圆形围栏",
							radius: item.radii,
							center: item.position,
							fillColor: "#979591",
							strokeColor: "#979591"
						}
					);
				}
				newFence.$bindEvent("mouseover", (data, e) => {
					if (!this.fenceMarkerList["_pathNameLabel"]) {
						this.fenceMarkerList["_pathNameLabel"] = this.$bsjMapUtil.do(
							"createText",
							{
								text: data.title,
								map: this.map,
								position: e.position,
								offset: {
									w: 40,
									h: 5
								}
							}
						);
					} else {
						this.fenceMarkerList["_pathNameLabel"].$util.setText(data.title);
						this.fenceMarkerList["_pathNameLabel"].$util.setPosition(e.position);
						this.fenceMarkerList["_pathNameLabel"].$util.show();
					}
				});
				newFence.$bindEvent("mouseout", e => {
					if (this.fenceMarkerList["_pathNameLabel"]) {
						this.fenceMarkerList["_pathNameLabel"].hide();
					}
				});
				this.fenceMarkerList[item.pathId] = newFence;
			});
			this.initMapTypes.fence=true
			
		},
		doEditAllFence(type) {
			//type:操作类型 remove show hide
			var markList = [];
			if(!this.initMapTypes.fence&&type==="show"){
				this.doAddAllFence()
			}
			
			Object.keys(this.fenceMarkerList).map(key => {
				markList.push(this.fenceMarkerList[key]);
			});
			
		
			if (markList.length > 0) {
				this.$bsjMapUtil.do(type, {
					map: this.map,
					marker: markList
				});
				if(type==="remove"){
					this.alarmMakerList=[]
					this.initMapTypes.fence=false
				}
			}
		},
		/**************导出部分*********************/
		doExport(){
			this.exportExcel()
			return;
			if(this.trackMongoDataList.length===0){
				this.$message({
					message:"暂无轨迹数据，无法导出",
					type:"warning"
				})
				return
			}
			if(this.isExporting){
				return
			}
			this.isExporting=true
			var params=Object.assign({},this.formData);
			if (typeof params.from !== "string") {
				params.from = dayJs(params.from).format("YYYY-MM-DD HH:mm:00");
			}
			if (typeof params.to !== "string") {
				params.to = dayJs(params.to).format("YYYY-MM-DD HH:mm:59");
			}
			var paramsStr="";
			Object.keys(params).map(key=>{
				if(paramsStr!==""){
					paramsStr=paramsStr+"&"
				}
				paramsStr=paramsStr+key+"="+params[key]
			})
			if(this.isBD30){
				paramsStr+="&keys=latAndLon";
			}
			if( this.loginToken){ //如果是分离版
				paramsStr+="&sessionId="+JSON.parse(localStorage.getItem("sessionId"))+"&loginToken="+this.loginToken
			}
			if(this.trackMongoDataList.length>this.exportContSync){ //超过两千就异步导出
				this.downloadFile(this.HOST+"/monitor/export/trajectoryExport.json?"+paramsStr);
				this.GetProgressInfo()
			}else{ //同步导出，500毫秒内导出效果
				this.downloadFile(this.HOST+"/monitor/export/trajectorySimpleExport.json?"+paramsStr)
				this.getDownloadInfoList();
				
				setTimeout(()=>{
					this.isExporting=false
				},500)
			}
		},
		GetProgressInfo(){//获取异步导出进度
				this.$http({
					url:this.HOST+'/monitor/export/GetProgressInfo.json'
				}).then(rst=>{
					if(rst.flag===1&&rst.obj){
						if(rst.obj.progress){
							this.$set(this,"exporProgressData",rst.obj)
						}
						if(rst.obj.progress===100){
							this.exporProgressData=null
							this.$set(this,"exporProgressData",null)
							this.isExporting=false
							this.getDownloadInfoList();
							this.doDownLoadInfoFile(rst.obj)
						}else{
							setTimeout(()=>{
								this.GetProgressInfo()
							},2000)
							this.isExporting=true
						}
					}else{
						setTimeout(()=>{
							this.GetProgressInfo()
						},2000)
					}
				}).catch(e=>{
					setTimeout(()=>{
						this.GetProgressInfo()
					},2000)
					
					console.error(e,"获取导出进度失败")
				})
		},
		downloadFile(url) {   //下载文件
			try{ 
				var elemIF = document.createElement("iframe");   
				elemIF.src = url;   
				elemIF.style.display = "none";   
				document.body.appendChild(elemIF);   
			}catch(e){ 
	
			} 
		},
		checkIsJobs(){ //检查是佛在导出过程中
			this.$http({
				url:this.HOST+'/monitor/export/checkIsJobs.json'
			}).then(rst=>{
				if(rst&&rst.obj&&rst.obj.flag===1){
					this.isExporting=true
				}
			}).catch(e=>{
				console.error(e)
			})
		},
		getDownloadInfoList(isTimeout=false){ //获取最近下载
			let time=isTimeout?40:100; //请求失败的时候用户点击重新获取需要立即获取，不需要延时
			this.isGetLoadInfoing=true
			setTimeout(()=>{ //延迟一秒获取，防止服务器同步下载卡顿或其他异常情况
				this.getDownloadInfoError=""
				this.$http({
					url:this.HOST+"/monitor/export/getDownloadInfoList.json"
				}).then(rst=>{
					if(rst&&rst.flag===1){
						this.$set(this,"downLoadInfoList",rst.obj||[])
					}else{
						this.getDownloadInfoError=rst.msg
					}
					this.isGetLoadInfoing=false
				}).catch(e=>{
					this.isGetLoadInfoing=false
					this.getDownloadInfoError="网络异常"
					console.error("获取最近下载列表失败",e)
				})
			},time)
		},
		doDownLoadInfoFile(itemData){ //下载最近下载的文件
			this.downloadFile(this.HOST+"/monitor/export/getDownload.json?filename="+itemData.name)
		},
		/***********查看停车详情***** */
		doShowStopDetail(itemData){
			var list=[];
			itemData.timeDetails.map((item,index)=>{
				var splitArr=item.split(",")
				var diffTime= dayJs(splitArr[1]).diff(dayJs(splitArr[0]));
				list.push({
					start:splitArr[0],
					end:splitArr[1],
					_index:index+1,
					duration:this.diffTime(diffTime),
					diffTime:diffTime
				})
			})
			this.$set(this,"stopDetailDialogData",{_index:itemData['_index'],list});
			this.$nextTick(()=>{
				this.stopDetailDialogVisible=true;
			})
		},
		diffTime(diffTime) {
			// var diff = endDate.getTime() - startDate.getTime(); //时间差的毫秒数
			//计算出相差天数
			var days = Math.floor(diffTime / (24 * 3600 * 1000));
			//计算出小时数
			var leave1 = diffTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
			var hours = Math.floor(leave1 / (3600 * 1000));
			//计算相差分钟数
			var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
			var minutes = Math.floor(leave2 / (60 * 1000));
			//计算相差秒数
			var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
			var seconds = Math.round(leave3 / 1000);
			var ret = 0;
			if (minutes > 0) {
				ret += minutes;
			}
			if (hours > 0) {
				ret += hours * 60;
			}
			if (days > 0) {
				ret += days * 24 * 60;
			}
			var returnStr = ""; //seconds + "秒";
			if (minutes > 0) {
				returnStr = minutes + "分" + returnStr;
			}
			if (hours > 0) {
				returnStr = hours + "小时" + returnStr;
			}
			if (days > 0) {
				returnStr = days + "天" + returnStr;
			}
			return returnStr;
		},
		doShowNoLocation(data){ //点击查看不定位数据时间间隔
			this.noLocationDetailList=data.extend.snp;
			this.$nextTick(function(){
				this.isShowNoLocationDetailList=true
			})
		}
	},
	watch: {
		isShowTypes: {
			handler(val,oldVal) {
				CacheUtil.set("track_isShowTypes",val)
				if (val.mongo !== this.prevIsShowTypes.mongo) {
					if (val.mongo) {
						this.editMongoAllMarker("show");
					} else {
						if(this.isPlaying){
							this.doPause()
						}
						this.editMongoAllMarker("hide");
					}
				}
				if (val.shopPoint !== this.prevIsShowTypes.shopPoint) {
					if (val.shopPoint) {
						

						this.doEditAllStopPointMark("show");
					} else {
						this.doEditAllStopPointMark("hide");
					}
				}
				if (val.alarm !== this.prevIsShowTypes.alarm) {
					if (val.alarm) {
						this.doEditAllAlarm("show");
					} else {
						this.doEditAllAlarm("hide");
					}
				}
				if (val.fence !== this.prevIsShowTypes.fence) {
					if (val.fence) {
						this.doEditAllFence("show");
					} else {
						this.doEditAllFence("hide");
					}
				}
				this.prevIsShowTypes = Object({}, val);
			},
			deep: true
		},
		playSpeed(val) {
			CacheUtil.set(this.cachePlaySppedKey, val);
		},
		isPlaying(val) {
			if (val) {
				this.playBeforeStatus.fontContorSize = this.fotContorlSizeStatus;
				this.throttleToggleFotControl("mini");
			} else {
				if (
					this.playBeforeStatus.fontContorSize !== this.fotContorlSizeStatus
				) {
					this.throttleToggleFotControl(this.playBeforeStatus.fontContorSize);
				}
			}
		},
		playIndex(val) {
			var len = this.curUsePolylineAllPath.length;
			this.playProgress = Math.ceil((val / len) * 100);
			this.trackMongoPageIndex = Math.max(
				1,
				Math.ceil(val / this.trackMongoPageOptions.size)
			);
			this.doShowPlayedPolyline();
			this.tableScrollToPlay();
		},
		selectedAlarmList:{
			deep:true,
			handler(val){
				CacheUtil.set("track_selectedAlarmList",val)
				if(val.length===0){
					this.isShowTypes.alarm=false
					this.doEditAllAlarm("hide");
				}else{
					this.isShowTypes.alarm=true;
					if(!this.initMapTypes.alarm){
						this.doAddAllAlarm()
					}
					this.alarmMakerList.map(item=>{
						var labelTxt=item._data.label.labelTxt;
						if(val.indexOf(labelTxt)===-1){
							item.$util.hide()
						}else{
							item.$util.show()
						}
					})
				}
			}
		},
		fotContorlSizeStatus(val){
			switch(val){
				case "mini":
						if(this.$refs["fotControl"]){
							this.$refs["fotControl"].dataset.defaultheight=this.$refs["fotControl"].offsetHeight
							this.$refs["fotControl"].style.height="65px"
						}
					break;
				default:
					if(this.$refs["fotControl"]){
							this.$refs["fotControl"].style.height=(this.$refs["fotControl"].dataset.defaultheight||340)+"px";
					}
				
					
			}
		}
	}
};
</script>
<style>
.poperSize-mini .el-popover__title{
  font-size: 12px
}
</style>
<style lang="less" scoped >
@import "~@/assets/css/lessKey";
.trackPlay-wrap {
	height: 100%;
	min-width: 1250px;
	display: flex;
	position: relative;
	flex-direction: column;
	.select-chunk {
		z-index: 2000;
		position: absolute;
		left: 10px;
		top: 10px;
		width: 350px;
	}
	.cont {
		flex: 1;
		position: relative;
		.cont-map{
			position: absolute;
			left: 0;
			top:0;
		}
	}
}
.fot-control {
	position: absolute;

	width: 100%;
	z-index: 500;
	bottom: 0;
	left: 0;
	padding: 10px;
	height:340px;
	display: flex;
	    flex-direction: column;
	.header-filter {
		background: #fff;
		height: 44px;
		line-height: 44px;
		display: flex;
		.col-tab-nav {
			&:after {
				display: block;
				clear: both;
				content: "";
			}
			li {
				font-size: 14px;
				font-weight: 600;
				color: #acb0b7;
				width: 120px;
				text-align: center;
				float: left;
				position: relative;
				cursor: pointer;
				&:after {
					position: absolute;
					width: 100%;
					height: 2px;
					background: #1184e5;
					display: none;
					content: "";
					bottom: 0;
					left: 0;
				}
				&:hover {
					color: #1184e5;
				}
				&.active {
					color: #1184e5;
					&:after {
						display: block;
					}
				}
			}
		}
		.filter-showType {
			margin-left: 20px;
			flex: 1;
			> .title {
				color: #333;
				font-weight: 600;
			}
		}
		.col-right {
			.btn-toggle {
				color: #1184e5;
				padding: 10px;
				font-size: 18px;
				cursor: pointer;
				&.rotate-top {
					transform: rotate(90deg);
				}
			}
			.export-btn {
				display: inline-block;
				line-height: 26px;
				padding: 0px 20px;
				cursor: pointer;
				&.export-ing{
					.down-mark-wrap{
						display: inline-block;
						height: 18px;
						overflow: hidden;
					}
					.down-mark{
						display: inline-block;
							color: #1184e5;
					}
				}
				&:hover {
					background-color: #f7f7f7;
					color: #1184e5;
					.iconfont {
						color: #1184e5;
					}
				}
				.iconfont {
					margin-right: 3px;
				}
			}
		}
	}
	> .cont {
		flex:1;
		width: 100%;
		transform: transition3d(0, 0, 0);
		background-color: #fff;
		display: flex;
		flex-direction: column;

		&.c_transition {
			transition: height 0.5s;
		}
		// &.size-small {
		// 	height: 280px;
		// }
		// &.size-mini {
		// 	height: 0;
		// }

		.showData-chunk {
			flex: 1;
			background-color: #f8f8f8;
			overflow: hidden;
			position: relative;
			> .full-chunk {
				height: 100%;
				width: 100%;
				display: flex;
				position: absolute;
				left:0;
				top:0;
				flex-direction: column;
			}
			.table-box {
				flex: 1;
				position: relative;
				.el-table {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					/deep/ th {
						background-color: #f5f8fc;
					}
					/deep/ td {
						cursor: pointer;
					}
				}
			}
			.pagination-box {
				padding: 5px 0;
				background: #fff;
				text-align: center;
				border-top: 1px solid #dedede;
			}
		}
	}
	/deep/ .el-table {
		tr.el-table__row.current-row td {
			background-color: #3c93f4;
			color: #fff;
		}
	}
}
.downExoprtTran{
	animation:downExoprtTran 1s  infinite linear;
}

@keyframes downExoprtTran
{
	0%    { transform: translate(0,-80%) }
	100%  {  transform: translate(0,80%)}
}
@keyframes progressTran
{
	0%    { left:0%;
	opacity: 0;
	background-color: #ddebf1;
	}
	100%  {  
		background-color: #cbe1ea;
		left:100%;opacity: 0.5;
	}
}
.fenceTag {
	width: 70px;
	text-align: center;
}
.tableError-box {
	display: flex;
	height: 100%;
	width: 100%;
	flex-direction: column;
	justify-content: center;
	align-content: center;
	text-align: center;
	.error-icon {
		font-size: 50px;
		color: red;
	}
	.reset-sp {
		cursor: pointer;
	}
}
/deep/ .input-style .el-input-group__append,
/deep/ .input-style .el-input-group__prepend {
	border: 1px solid transparent;
	background-color: #cbcdd4;
	color: #fff;
	padding: 0 10px;
}
/deep/ .input-style > input:focus {
	border-color: #e6a23c;
}
.checkAlarmTypes-box /deep/ .el-checkbox {
	width: 30%;
	margin-bottom: 10px;
	margin-left: 10px;
	&:nth-child(3n + 1) {
		margin-left: 0px;
	}
}
.showAlarm-switch {
	margin-left: 30px;
	margin-right: 30px;
}
.fot-playcontrol {
	// position: absolute;
	// top: -50px;
	// right: 10px;
	width: 100%!important;
	position: relative;
	z-index: 12;
	&.noBoxShadow{
		box-shadow: none;
		border-top:1px solid #dedede;

	}
}
.mogonStop-info-box {
	width: 300px;
	background: #fff;
	// padding: 0 10px 10px 10px;
}
.infoWindow-header-title{
	color: #333;
	font-size: 16px;
	    margin-bottom: 8px;
}
div.infoWindow-msg{
	color:#e6a23c;
	font-size: 12px;
	margin-top:4px;
}
.infoWindow-row {
	display: table;

	color: #999;
	> .col-title {
		width: 40px;
		text-align: right;
		display: table-cell;
	}
	> .col-cont {
		color: #666;
		display: table-cell;
	}
}
.infoWindow-row.w62 {
	> .col-title {
		width: 62px;
	}
}
.loadInfoList-box{
	min-height: 100px;
}
.loadInfoList-item{
	display: flex;
	width: 100%;
	font-size: 12px;
	padding: 10px;
	cursor: pointer;
	background-color: #F5F6F6;
	&+.loadInfoList-item{
		margin-top:10px;
	}
	&:hover{
		    color: #409EFF;
	}
	>.col-left{
		flex:1
	}
}
.loadInfoList-errorBox{
	font-size: 12px;
	padding: 20px 0;
	text-align: center;
	cursor: pointer;
}
.el-table td.is-center, .el-table th.is-center {
    text-align: left !important;
}
.zuijin-title{
	line-height: 20px;
	margin-bottom: 10px;
	.msg-sp{
		color: #999;
		font-size: 12px;
	}
}
.downProgress-btn{
	position: relative;
	margin-bottom: 10px;
	.downProgress-num{
		color: #333
	}
	.downEnd-bg{
		position: absolute;
		background-color: #01B1FA;
		height: 100%;
		left:0;top:0;
		&:after,&:before{
			height: 100%;
			width: 2px;
			z-index: 12;
			position: absolute;
			left:0;top:0;
			content: "";
			
			animation:progressTran 1s  infinite ease-in;
		}
		&:before{
			animation-delay: 0.8s;
		}
	}
	.loadInfoList-item{
		
		cursor: progress;
		color: #fff;
		>.col-left,.col-right{
			position: relative;
			z-index: 10;
		}
		&:hover{
			color: #fff;
		}
	}
}
/deep/ .stopTableCol-msg{
	font-size: 12px;
	color: #a9a9a9;
}
.stopDetailDialog{
	/deep/ .el-dialog__header{
			padding-bottom: 0;
			.el-dialog__title{
		font-size: 16px;
	
	}
	} 
	/deep/ .el-dialog__body{
		padding: 0 10px;
	}
}
.stopDetail-address{
	color: #999;
	font-size: 12px;
	padding-left: 10px;
    padding-top: 5px;
}
.noLocation-sp{
	color:#E57511;cursor: pointer;
}
.hasNoLocationDialog /deep/ .el-dialog__body{
	padding-top: 0px;
}
</style>



