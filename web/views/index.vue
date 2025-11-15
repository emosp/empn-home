<template>
  <div
    class="relative min-h-screen"
    :style="{
      background,
    }">
    <div class="main absolute top-0 left-0 right-0 z-10 pt-60 px-4 md:px-6 text-center md:text-left md:ml-40 lg:ml-64">
      <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
        empn -> nsfw
        <span>
          <template v-for="index in waiting_number">~</template>
        </span>
      </h1>
      <n-button
        quaternary
        round
        size="large"
        style="border: 1px solid rgba(255, 255, 255, 0.4)"
        @click="
          () => {
            storeSign.is_sign
              ? router.push({
                  name: 'Home',
                })
              : storeSign.toLogin()
          }
        ">
        <template #icon>
          <n-icon>
            <Play />
          </n-icon>
        </template>
        点击进入
      </n-button>
    </div>
    <div class="absolute w-full bottom-1 text-center">
      © {{ dayjs().format('YYYY') }}
      <a href="/">{{ domain }}</a>
    </div>
  </div>
</template>
<script setup lang="tsx">
  import { Bars, Play } from '@vicons/fa'
  import { ref } from 'vue'
  import { dayjs } from '@common/dayjs'

  import signStore from '@/stores/sign.ts'
  const storeSign = signStore()

  import { useRoute, useRouter } from 'vue-router'
  const router = useRouter(),
    route = useRoute()

  const menu_mobile_show = ref(false),
    menuMobileTrigger = () => {
      menu_mobile_show.value = !menu_mobile_show.value
    }

  const background = ref(),
    backgroundMatch = () => {
      // https://github.com/docsifyjs/docsify/blob/v4.13.1/src/core/render/index.js
      let degrees = Math.round((Math.random() * 120) / 2),
        hue1 = Math.round(Math.random() * 360),
        hue2 = Math.round(Math.random() * 360)

      if (Math.abs(hue1 - hue2) < 50) {
        let hueShift = Math.round(Math.random() * 25) + 25
        hue1 = Math.max(hue1, hue2) + hueShift
        hue2 = Math.min(hue1, hue2) - hueShift
      }

      background.value = `linear-gradient(
        ${degrees}deg,
        oklch(90% 20% ${hue1}) 0%,
        oklch(90% 20% ${hue2}) 100%
      )`.replace(/\s+/g, ' ')
    }

  backgroundMatch()

  const waiting_number = Array.from({
    length: Math.floor(Math.random() * 10),
  })

  const domain = window.location.host
</script>
<style scoped lang="stylus"></style>
