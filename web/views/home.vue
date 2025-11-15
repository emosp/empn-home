<template>
  <div class="home p-40 max-sm:p-10">
    <n-card title="欢迎">
      <template #header-extra>
        <n-button text @click="() => storeSign.signOut()"> 退出登录 </n-button>
      </template>
      <n-list>
        <template #header>
          <code class="text-4xl overflow-hidden text-ellipsis">
            {{ storeSign.user_username }}
          </code>
        </template>
        <template #footer>
          <p class="mt-1">
            感谢 <n-button text> <span class="font-bold">@Jack🥰</span> </n-button> 大力支持
          </p>
          <p class="mt-1">
            感谢 <n-button text> <span class="font-bold">@yzhazha</span> </n-button> 大力支持
          </p>
        </template>
        <n-list-item>
          <n-thing>
            <template #header>
              <div
                :style="{
                  display: loading ? 'unset' : 'flex',
                }">
                <p>登录域名:</p>
                <div class="ml-2">
                  <n-skeleton v-if="loading" text :repeat="1" />
                  <p v-else>
                    <code>{{ data.emby_url }}</code>
                  </p>
                </div>
              </div>
            </template>
            <template #description>
              <p>不知道如何使用或加群请点 <n-button text tag="a" target="_blank" href="https://t.me/emosnsfw"> 这里 </n-button></p>
              <p>
                也欢迎使用
                <n-button
                  text
                  @click="
                    () =>
                      router.push({
                        name: 'Upload',
                      })
                  ">
                  自助上传
                </n-button>
              </p>
            </template>
          </n-thing>
        </n-list-item>
      </n-list>
      <template #footer>
        <n-collapse @update:expanded-names="collapseExpanded" accordion>
          <n-collapse-item title="资源库" name="library">
            <n-list>
              <n-list-item v-for="row in library_datas" :key="row.library_id">
                <n-thing :title="row.name">
                  <template #header-extra>
                    <n-switch :value="row.is_select" :loading="row.loading" @update:value="librarySwitch(row)" />
                  </template>
                </n-thing>
              </n-list-item>
            </n-list>
          </n-collapse-item>
        </n-collapse>
      </template>
    </n-card>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import instance from '@/utils/ky'
  import signStore from '@/stores/sign.ts'
  import { nMessage } from '@/utils/naive'

  const storeSign = signStore(),
    router = useRouter()

  const loading = ref(true),
    data = ref({}),
    getData = async () => {
      loading.value = true
      data.value = await instance.get('/api/home').json()
      loading.value = false
    }

  getData()

  const library_datas = ref([]),
    libraryGet = async () => {
      let data = await instance.get('/api/library').json()
      library_datas.value = data.libraries
    },
    librarySwitch = async (row) => {
      row.loading = true
      nMessage().info(`正在切换 ${row.name} 可见状态`)
      let is_select = !row.is_select
      await instance.put('/api/library', {
        json: {
          library_id: row.library_id,
          is_select,
        },
      })

      row.is_select = is_select
      row.loading = false
    }

  const collapseExpanded = (expanded_names?: array) => {
    if (expanded_names.includes('library') && !library_datas.value.length) {
      nMessage().info('加载资源库中')
      libraryGet()
    }
  }
</script>
<style scoped lang="stylus"></style>
