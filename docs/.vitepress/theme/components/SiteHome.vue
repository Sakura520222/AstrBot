<script setup>
import InstallCommands from './InstallCommands.vue'

const guides = [
  { link: '/docs/platform/start', title: '消息平台', detail: 'QQ、Telegram、飞书、Discord 等平台的接入方式。' },
  { link: '/docs/config/model-config', title: '模型配置', detail: '选择模型服务，为不同会话设置模型。' },
  { link: '/docs/use/plugin', title: '插件', detail: '安装插件，接入 MCP 工具和 Skills。' },
  { link: '/docs/use/knowledge-base', title: '知识库', detail: '导入文档，让回答附上引用。' },
]
</script>

<template>
  <div class="site-home">
    <section class="masthead" aria-labelledby="site-title">
      <h1 id="site-title">AstrBot</h1>
      <div class="intro">
        <p>部署自己的聊天机器人，把你选的模型接入 QQ、Telegram、飞书等平台。</p>
        <div class="home-links">
          <a class="install-link" href="/docs/deploy/astrbot/package">安装 AstrBot</a>
          <a href="/docs/">阅读文档</a>
        </div>
      </div>
    </section>

    <div class="product-row">
      <figure class="preview">
        <a href="/images/plugin-views/context-workbench.jpg" aria-label="查看完整的 AstrBot ChatUI 截图">
          <img src="/images/plugin-views/context-workbench.jpg" width="1281" height="769"
            alt="AstrBot ChatUI 中的模型回复和上下文用量面板" fetchpriority="high" />
        </a>
        <figcaption><a href="/docs/use/webui">ChatUI 与上下文用量</a></figcaption>
      </figure>
      <section class="guide-index" aria-labelledby="guide-title">
        <h2 id="guide-title">使用指南</h2>
        <ul>
          <li v-for="guide in guides" :key="guide.link">
            <a :href="guide.link">
              <strong>{{ guide.title }}</strong>
              <span>{{ guide.detail }}</span>
            </a>
          </li>
        </ul>
      </section>
    </div>

    <section class="deployment" aria-labelledby="deploy-title">
      <div>
        <h2 id="deploy-title">本地与服务器部署</h2>
        <p>从源码运行需要 Git、uv 和 Python 3.12+。已有实例请先备份 <code>data/</code>。</p>
        <div class="home-links">
          <a href="/docs/deploy/astrbot/cli">源码部署说明</a>
          <a href="/docs/deploy/astrbot/docker">Docker 部署说明</a>
        </div>
      </div>
      <InstallCommands />
    </section>

    <div class="release-row">
      <a href="https://github.com/Sakura520222/AstrBot/releases">下载与版本说明</a>
      <a href="https://github.com/Sakura520222/AstrBot/blob/master/LICENSE">AGPL-3.0</a>
    </div>
  </div>
</template>

<style scoped>
:global(.astrbot-homepage .VPHome) {
  padding-bottom: 28px;
}

.site-home {
  width: min(1232px, calc(100% - 96px));
  margin: 0 auto;
  padding: 46px 0 24px;
}

.masthead, .product-row, .deployment {
  display: grid;
  min-width: 0;
  gap: clamp(28px, 5vw, 72px);
}

.masthead {
  grid-template-columns: 1.2fr 1fr;
  align-items: end;
  padding: 18px 0 40px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.masthead h1 {
  margin: 0;
  font-size: clamp(4.5rem, 8.5vw, 8rem);
  line-height: .93;
  letter-spacing: -.04em;
  font-weight: 750;
}

.intro {
  max-width: 410px;
}

.intro p {
  font-size: clamp(1.02rem, 1.8vw, 1.35rem);
  line-height: 1.55;
}

.home-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  align-items: center;
  margin-top: 16px;
}

.site-home a:not(.install-link) {
  color: var(--vp-c-brand-1);
}

.site-home a:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.home-links a, .release-row a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-size: .9rem;
  font-weight: 600;
}

.install-link {
  padding: 8px 16px;
  border-radius: 4px;
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
}

.install-link:hover {
  background: var(--vp-button-brand-hover-bg);
}

.product-row {
  grid-template-columns: minmax(0, 2.55fr) minmax(220px, 1fr);
  align-items: start;
  margin-top: 32px;
}

.preview {
  margin: 0;
  min-width: 0;
}

.preview > a {
  display: block;
}

.preview img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
}

.preview figcaption {
  margin: 10px 0 0;
  font-size: .85rem;
}

.guide-index h2,
.deployment h2 {
  margin: 0;
  font-size: 1.45rem;
  line-height: 1.3;
  letter-spacing: -.02em;
}

.guide-index ul {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.guide-index li {
  border-top: 1px solid var(--vp-c-divider);
}

.guide-index li a {
  display: block;
  padding: 13px 0;
}

.guide-index span {
  display: block;
  margin-top: 3px;
  color: var(--vp-c-text-2);
  font-size: .88rem;
}

.deployment {
  grid-template-columns: minmax(0, .85fr) minmax(0, 1fr);
  margin-top: 48px;
  padding: 30px 0;
  border-top: 1px solid var(--vp-c-divider);
}

.deployment p {
  margin-top: 12px;
  max-width: 340px;
  color: var(--vp-c-text-2);
}

.release-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 24px;
  padding: 12px 0;
  border-top: 1px solid var(--vp-c-divider);
}

@media (max-width: 860px) {
  .site-home {
    width: calc(100% - 48px);
  }

  .product-row {
    grid-template-columns: minmax(0, 1fr);
  }

  .guide-index ul {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 24px;
  }
}

@media (max-width: 620px) {
  .site-home {
    width: calc(100% - 36px);
    padding-top: 30px;
  }

  .masthead, .deployment {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }

  .masthead {
    padding-bottom: 24px;
  }

  .product-row {
    margin-top: 22px;
  }

  .deployment {
    margin-top: 30px;
  }
}
</style>
