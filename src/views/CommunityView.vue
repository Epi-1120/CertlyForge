<template>
  <div class="p-8 max-w-3xl mx-auto">
    <router-link to="/" class="text-sm text-gray-500">back</router-link>
    <h1 class="text-2xl font-bold mt-4 mb-2">Community</h1>
    <p class="text-gray-500 mb-6">Discuss questions, share tips.</p>
    <div v-if="loading" class="text-gray-400">Loading...</div>
    <div v-else>
      <div v-for="post in posts" :key="post.id" class="border rounded-lg p-4 mb-3">
        <div class="flex justify-between"><h3 class="font-semibold">{{post.title}}</h3><span v-if="post.certTag" class="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">{{post.certTag}}</span></div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{post.content}}</p>
        <div class="flex gap-4 mt-2 text-xs text-gray-400"><span>{{post.authorName}}</span><span>{{post.likes}} likes</span><span>{{post.replyCount}} replies</span></div>
      </div>
      <p v-if="posts.length===0" class="text-gray-400">No posts yet.</p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getPosts } from '../lib/community.js'
const posts = ref([])
const loading = ref(true)
onMounted(async () => { try { posts.value = await getPosts() } catch(e) { console.warn('posts:', e.message) } finally { loading.value = false } })
</script>
