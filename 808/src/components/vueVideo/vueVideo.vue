<template>
  <div class="">
    <video
      ref="video"
      class="video-js vjs-big-play-centered"
      controls
      preload="none"
      :poster="displayData.poster"
    >
      <template v-if="displayData.sources">
        <source v-for="(item,index) in data.sources" :key="index" :src="item.src" :type="item.type"></source>
      </template>
      <p class="vjs-no-js">
        视频无法加载
        <a href="https://videojs.com/html5-video-support/" target="_blank" />
      </p>
    </video>
  </div>
</template>
<script>
import videojs from 'video.js'
import { merge } from 'lodash'
require('video.js/dist/video-js.min.css')
export default {
  props: {
    data: {
      type: Object
      // {
      //     sources: [{
      //         src: 'http://covteam.u.qiniudn.com/oceans.mp4',
      //         type: 'video/mp4'
      //     }],
      //     options: {
      //         autoplay: true,
      //         volume: 0.6,
      //         poster: 'http://covteam.u.qiniudn.com/poster.png'
      //     }
      // }
    }
  },
  data() {
    return {
      player: null,
      defaultData: {
        defaultPoster: '//vjs.zencdn.net/v/oceans.png',
        options: {
          width: '300px',
          height: '200px',
          muted: true,
          controls: true
        }
      }
    }
  },
  computed: {
    displayData() {
      return merge({}, this.defaultData, this.data)
    }
  },
  mounted() {
    this.init()
    console.log(this.data,1232123)
  },
  beforeDestroy() {
    this.playDestroy()
  },
  methods: {
    init() {
      this.player = videojs(this.$refs['video'], this.displayData.options)
    },
    pause() {
      this.player && this.player.pause()
    },
    play() {
      this.player && this.player.play()
    },
    playDestroy() {
      this.player && this.player.dispose()
    }
  }
}
</script>
