<template>
  <div class="flex justify-center min-md:mt-10">
    <n-card class="min-md:max-w-2/3" title="资源上传">
      <template #header-extra>
        <n-button
          text
          @click="
            () => {
              router.push({
                name: ROUTE_NAME_HOME,
              })
            }
          ">
          回主页
        </n-button>
      </template>
      <template #default>
        <n-form ref="form_ref" :model="form_data" :rules="form_rules" label-placement="left" :label-width="70">
          <n-form-item label="媒体库" path="library_id">
            <n-select v-model:value="form_data.library_id" placeholder="请选择要上传的媒体库" :options="libraries" label-field="name" value-field="library_id" filterable />
          </n-form-item>

          <n-form-item label="名称" path="video_title">
            <n-input v-model:value="form_data.video_title" type="text" placeholder="请输入名称" :maxlength="50" clearable />
          </n-form-item>
          <n-form-item label="简介" path="video_description">
            <n-input v-model:value="form_data.video_description" type="textarea" placeholder="请输入描述啥的" :maxlength="200" show-count clearable />
          </n-form-item>
          <n-form-item label="封面图" path="cover_path" v-if="form_data.library_id">
            <n-upload
              :max="1"
              accept="image/*"
              @update-file-list="
                (file_lists) => {
                  form_data.cover_path = file_lists[0]?.fullPath
                }
              "
              :custom-request="uploadFileRequest"
              list-type="image-card">
              点击上传
            </n-upload>
          </n-form-item>

          <n-form-item path="video_file_id" v-if="form_data.library_id">
            <n-upload
              directory-dnd
              :max="1"
              accept="video/*,.mkv"
              @update:file-list="
                (file_lists) => {
                  form_data.video_file_id = file_lists[0]?.fullPath
                }
              "
              :custom-request="uploadFileRequest">
              <n-upload-dragger>
                <div class="mt-4">
                  <n-icon size="48" :depth="3">
                    <Upload />
                  </n-icon>
                </div>
                <n-text style="font-size: 16px"> 点击或者拖动视频文件到该区域来上传 </n-text>
                <n-p depth="3" class="mt-8"> 请勿上传人神共怒的视频 </n-p>
              </n-upload-dragger>
            </n-upload>
          </n-form-item>
        </n-form>
        <n-button type="primary" block secondary strong :loading="form_loading" @click="formSubmit">提交</n-button>
      </template>
    </n-card>
  </div>
</template>
<script setup lang="ts">
  import { Upload } from '@vicons/fa'
  import { useDebounceFn } from '@vueuse/core'
  import { computed, ref } from 'vue'
  import instance from '@/utils/ky'
  import { uploadFileRequest } from '@/utils/file'

  import { useRouter } from 'vue-router'
  import { FormInst, FormRules } from 'naive-ui'
  import { nNotification } from '@/utils/naive'
  import { ROUTE_NAME_HOME } from '@/router'
  const router = useRouter()

  const form_ref = ref<FormInst | null>(null),
    form_data_default = {
      library_id: null,
      video_title: null,
      video_description: null,
      cover_path: null,
      video_file_id: null,
    },
    form_data = ref({}),
    form_rules: FormRules = {
      library_id: [
        {
          required: true,
          trigger: ['change', 'blur'],
          message: '',
        },
      ],
      video_title: [
        {
          required: true,
          trigger: ['input'],
          type: 'string',
          message: '',
        },
      ],
      video_file_id: [
        {
          required: true,
          trigger: ['change', 'blur'],
          type: 'string',
          message: '需要上传视频',
        },
      ],
    },
    form_loading = ref(false),
    formReset = () => {
      form_data.value = Object.assign({}, form_data_default)
    },
    formSubmit = async () => {
      await form_ref.value?.validate()
      form_loading.value = true

      let data = form_data.value

      instance
        .post('/api/upload/save', {
          json: data,
        })
        .then(async (res) => {
          let { count } = await res.json()

          nNotification().success({
            title: '提交成功',
            description: `这是您提交的第 ${count} 个资源`,
            duration: 3000,
          })

          formReset()
        })
        .finally(() => {
          form_loading.value = false
        })
    }

  const libraries = ref([]),
    getLibrary = async () => {
      let data = await instance.get('/api/library').json()
      libraries.value = data.libraries.map((row) => {
        return {
          ...row,
          library_id: row.library_id.toString(),
        }
      })
    }

  formReset()
  getLibrary()
</script>
<style scoped lang="stylus"></style>
