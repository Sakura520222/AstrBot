<script setup>
import { onMounted, ref } from 'vue'

const commands = [
  'git clone https://github.com/Sakura520222/AstrBot.git',
  'cd AstrBot',
  'uv sync --locked --inexact',
  'uv run --no-sync main.py',
].join('\n')

const canCopy = ref(false)
const status = ref('')
const source = ref(null)

onMounted(() => {
  canCopy.value = Boolean(navigator.clipboard?.writeText)
})

async function copyCommands() {
  try {
    await navigator.clipboard.writeText(commands)
    status.value = '已复制命令'
  } catch {
    const selection = window.getSelection()
    if (selection && source.value) {
      const range = document.createRange()
      range.selectNodeContents(source.value)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    status.value = '请手动复制'
  }
}
</script>

<template>
  <div class="terminal">
    <div class="terminal-bar">
      <span>源码启动</span>
      <button v-if="canCopy" type="button" @click="copyCommands">复制命令</button>
    </div>
    <pre><code ref="source">{{ commands }}</code></pre>
    <div class="terminal-bar">
      <a href="http://localhost:6185">localhost:6185</a>
      <span role="status">{{ status }}</span>
    </div>
  </div>
</template>

<style scoped>
.terminal {
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
}

.terminal-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0 8px;
  min-height: 48px;
  padding: 0 16px;
  font-size: .84rem;
}

.terminal-bar button,
.terminal-bar a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--vp-c-brand-1);
}

.terminal-bar button:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

pre {
  margin: 0;
  padding: 16px;
  border-block: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-size: .82rem;
  line-height: 1.75;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
