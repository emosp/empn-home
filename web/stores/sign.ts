import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import router, { ROUTE_NAME_INDEX } from '@/router'

export default defineStore(
  'sign',
  () => {
    const toLogin = () => {
      let url = encodeURIComponent(`${window.location.origin}/oauth`)
      window.location.href = `https://emos.lol/api/link?uuid=d4dcd8f5-344e-4741-8457-e5207744e60e&name=empn&url=${url}`
    }

    const user_token = ref(),
      user_username = ref(),
      user_avatar = ref(),
      is_sign = computed(() => Boolean(user_token.value))

    const tokenRemove = () => {
        user_token.value = null
      },
      signEntry = (username: string, avatar: string, token: string) => {
        user_username.value = username
        user_avatar.value = avatar
        user_token.value = token
      },
      signOut = async () => {
        tokenRemove()
        await router.replace({
          name: ROUTE_NAME_INDEX,
        })
      }

    return {
      user_token,
      user_username,
      user_avatar,
      is_sign,
      toLogin,
      signEntry,
      signOut,
      tokenRemove,
    }
  },
  {
    persist: {
      pick: ['user_token', 'user_username', 'user_avatar'],
    },
  },
)
