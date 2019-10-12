<template>
  <div class="ctable">
    <div
      v-for="(item,index) in data"
      :key="index"
      class="row_table"
      :style="formatStyle(index)"
    >
      <span
        v-for="(cdata,cindex) in item.itemData"
        :key="cindex"
        class="col_item"
      >
        {{cdata}}
      </span>
    </div>
    <div
      v-for="(item,index) in data"
      :key="index"
    >
      <div
        v-for="(allData,index) in item.tableData"
        :key="index"
        class="tableBox"
        :style="formatStyle(index+1)"
      >
        <template v-if="type == 1">
          <span>
            {{allData.plate}}
          </span>
          <span>
            {{allData.time}}
          </span>
          <span>
            {{allData.speed}}
          </span>
          <span>
            {{local(allData.lat,allData.lon)}}
          </span>
        </template>

        <template v-if="type == 2">
          <span>
            {{allData.plate}}
          </span>
          <span :style="columnStyle2(color)">
            {{allData.examineDate}}
          </span>
          <span>
            {{allData.examineType}}
          </span>
        </template>

        <template v-if="type == 3">
          <span>
            {{allData.plate}}
          </span>
          <span :style="columnStyle(allData.overdueDay)">
            {{Dataformat(allData.repaymentDate)}}
          </span>
          <span>
            {{allData.overdueDay}}
          </span>
        </template>

        <template v-if="type == 4">
          <span>
            {{allData.P}}
          </span>
          <span>
            {{allData.T}}
          </span>
          <span>
            {{Dataformat(allData.D)}}
          </span>
        </template>

        <!-- <span>
          {{item.tableData[index].carLicense}}
        </span>
        <span>
          {{item.tableData[index].annualTime}}
        </span>
        <span>
          {{item.tableData[index].annualType}}
        </span> -->
      </div>
    </div>

  </div>
</template>

<script>
import addressUtil from "@/common/js/addressUtil";
export default {
  data() {
    return {
      place: null
    };
  },
  props: {
    data: {
      type: Array
    },
    type: {
      type: Number
    },
    color: {
      type: Number
    }
  },

  mounted() {},
  methods: {
    //经纬度转地名
    local(lat, lon) {
      var itemPosList = [];
      itemPosList.push({
        lat: lat,
        lon: lon
      });
      addressUtil
        .getGeoItem({
          async: false,
          itemParams: {
            param: {
              posList: itemPosList
            }
          },
          itemUserCancelToken: ""
        })
        .then(res => {
          this.place = JSON.stringify(res.obj[0].regeocode.formatted_address);
        });

      //return this.place.split('"')[1].split("区")[0];
      //截断地址第一个区字出现前的字符串
      if (this.place) {
        if (this.place.split('"')[1].indexOf("区") != -1) {
          return this.place
            .split('"')[1]
            .slice(0, this.place.split('"')[1].indexOf("区") + 1);
        }
        return this.place.split('"')[1];
      }
      return "无";
    },
    //日期截断
    Dataformat(data) {
      if (data) {
        return data.split(" ")[0];
      }
      return "无";
    },
    //时间戳转日期
    TimeStamp(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return (Y + M + D + h + m + s).split(" ")[1];
    },
    formatStyle(index) {
      return {
        background: index % 2 === 0 ? "#002A67" : "#002457",
        color: index === 0 ? "#6192D7" : "#fff"
      };
    },
    columnStyle(data) {
      if (parseInt(data) > 0) {
        return {
          color: "red"
        };
      }
    },
    columnStyle2(data) {
      if (data == 1) {
        return {
          color: "red"
        };
      }
    }
  }
};
</script>


<style lang="less" scoped>
.ctable {
  margin: 0 7px;
  .row_table {
    display: flex;
    align-items: center;
    height: 33px;
    .col_item {
      flex: 1;
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .tableBox {
    display: flex;
    align-items: center;
    height: 33px;
    span {
      flex: 1;
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      color: white;
      font-family: Microsoft YaHei;
    }
  }
}
</style>

