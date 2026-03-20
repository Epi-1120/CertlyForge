import { db } from './firebase.js'
import { ref, get, set, push, remove, update } from 'firebase/database'

export async function getPosts() {
  if (!db) return []
  const snap = await get(ref(db, 'community/posts'))
  if (!snap.exists()) return []
  return Object.entries(snap.val())
    .map(([id, v]) => ({ id, authorId: v.authorId||'', authorName: v.authorName||'anon', title: v.title||'', content: v.content||'', certTag: v.certTag, likes: v.likes||0, replyCount: v.replyCount||0, createdAt: v.createdAt||new Date().toISOString() }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function createPost(post) {
  if (!db) throw new Error('db not available')
  const postRef = push(ref(db, 'community/posts'))
  await set(postRef, { authorId: post.authorId, authorName: post.authorName, title: post.title, content: post.content, certTag: post.certTag || null, likes: 0, replyCount: 0, createdAt: new Date().toISOString() })
  return postRef.key
}

export async function getReplies(postId) {
  if (!db) return []
  const snap = await get(ref(db, `community/replies/${postId}`))
  if (!snap.exists()) return []
  return Object.entries(snap.val()).map(([id, v]) => ({ id, authorName: v.authorName||'anon', content: v.content||'', likes: v.likes||0, createdAt: v.createdAt||'' })).sort((a,b) => a.createdAt.localeCompare(b.createdAt))
}

export async function createReply(postId, reply) {
  if (!db) return
  const replyRef = push(ref(db, `community/replies/${postId}`))
  await set(replyRef, { authorId: reply.authorId, authorName: reply.authorName, content: reply.content, likes: 0, createdAt: new Date().toISOString() })
  const snap = await get(ref(db, `community/posts/${postId}/replyCount`))
  await update(ref(db, `community/posts/${postId}`), { replyCount: (snap.val()||0) + 1 })
}
