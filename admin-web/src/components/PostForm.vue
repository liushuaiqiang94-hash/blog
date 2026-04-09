<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { AdminPostInput, PostStatus } from '../types/post'

const props = defineProps<{
  values: AdminPostInput
  submitLabel: string
  isSubmitting?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  submit: [payload: AdminPostInput]
  cancel: []
}>()

const form = reactive<AdminPostInput>({
  title: '',
  slug: '',
  summary: '',
  contentMarkdown: '',
  status: 'DRAFT',
})

watch(
  () => props.values,
  (value) => {
    form.title = value.title
    form.slug = value.slug
    form.summary = value.summary
    form.contentMarkdown = value.contentMarkdown
    form.status = value.status
  },
  { immediate: true, deep: true },
)

const statusOptions: PostStatus[] = ['DRAFT', 'PUBLISHED']
const isBusy = computed(() => Boolean(props.isSubmitting))

function submitForm() {
  emit('submit', {
    title: form.title.trim(),
    slug: form.slug.trim(),
    summary: form.summary.trim(),
    contentMarkdown: form.contentMarkdown,
    status: form.status,
  })
}
</script>

<template>
  <form class="post-form" @submit.prevent="submitForm">
    <div v-if="errorMessage" class="inline-alert" data-testid="post-form-error">
      {{ errorMessage }}
    </div>

    <div class="form-grid">
      <label class="field">
        <span class="field__label">标题</span>
        <input v-model="form.title" name="title" class="input" type="text" required />
      </label>

      <label class="field">
        <span class="field__label">slug</span>
        <input v-model="form.slug" name="slug" class="input" type="text" required />
      </label>

      <label class="field field--full">
        <span class="field__label">摘要</span>
        <textarea
          v-model="form.summary"
          name="summary"
          class="textarea textarea--summary"
          rows="3"
          required
        />
      </label>

      <label class="field field--full">
        <span class="field__label">Markdown 正文</span>
        <textarea
          v-model="form.contentMarkdown"
          name="contentMarkdown"
          class="textarea textarea--content"
          rows="12"
          required
        />
      </label>

      <label class="field">
        <span class="field__label">状态</span>
        <select v-model="form.status" name="status" class="select">
          <option v-for="option in statusOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>
    </div>

    <div class="form-actions">
      <button class="button button--ghost" type="button" @click="emit('cancel')">取消</button>
      <button class="button" type="submit" :disabled="isBusy">
        {{ isBusy ? '保存中…' : submitLabel }}
      </button>
    </div>
  </form>
</template>
