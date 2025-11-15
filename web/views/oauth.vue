<template>
  <div class="flex mt-10 justify-center">
    <n-spin size="large">
      <template #description> 登录中 </template>
    </n-spin>
  </div>
</template>
<script setup lang="ts">
  import { nMessage } from '@/utils/naive'
  import instance from '@/utils/ky'
  import signStore from '@/stores/sign.ts'
  import { useRouter, useRoute } from 'vue-router'
  import { ROUTE_NAME_HOME, ROUTE_NAME_INDEX } from '@/router'
  const storeSign = signStore(),
    route = useRoute(),
    router = useRouter()

  let query = route.query,
    token = query.token

  if (token) {
    instance
      .post('/api/sign/oauth', {
        json: {
          token,
        },
      })
      .then(async (res) => {
        let data = await res.json()

        let username = query.username

        nMessage().success(`欢迎回来 ${username}`, {
          showIcon: false,
        })

        storeSign.signEntry(username, query.avatar, data.token)
        await router.replace({
          name: ROUTE_NAME_HOME,
        })
      })
      .catch(async () => {
        nMessage().error('授权失败')
        await router.replace({
          name: ROUTE_NAME_INDEX,
        })
      })
  } else {
    nMessage().error('登录失败')
    storeSign.signOut()
  }
</script>
<style scoped lang="stylus"></style>
