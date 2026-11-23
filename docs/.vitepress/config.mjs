import { defineConfig } from "vitepress";
import { head } from "./config/head";

export default defineConfig({
  title: "PyaBot",
  description: "PyaBot 部署、消息平台接入、模型配置、插件开发与使用文档",
  head,
  rewrites: {
    "zh/:rest*": "docs/:rest*",
    "en/:rest*": "docs/en/:rest*",
  },
  sitemap: {
    hostname: "https://pyabot.pyabunny.com/",
  },
  lastUpdated: true,
  ignoreDeadLinks: false,
  markdown: {
    config(md) {
      // Absolute links in guides previously inherited the /docs/ VitePress base.
      const docRoute = /^\/(?:en(?:\/|$)|(?:config|deploy|dev|others|platform|providers|use)(?:\/|$)|(?:community|faq|what-is-astrbot)(?:[.#?]|$))/;
      const renderLink = md.renderer.rules.link_open;
      md.renderer.rules.link_open = (tokens, index, options, env, self) => {
        const token = tokens[index];
        const href = token.attrGet("href");
        if (href && docRoute.test(href)) token.attrSet("href", `/docs${href}`);
        return renderLink(tokens, index, options, env, self);
      };
    },
  },
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-Hans",
      link: "/docs/",
      themeConfig: {
        nav: [
          {
            text: "首页",
            link: "/",
          },
          {
            text: "文档",
            link: "/docs/",
            activeMatch: "^/docs/",
          },
          {
            text: "版本发布",
            link: "https://github.com/Sakura520222/PyaBot/releases",
          },
          {
            text: "HTTP API",
            link: "/scalar.html",
            target: "_blank",
          },
        ],
        sidebar: [
          {
            text: "简介",
            items: [
              {
                text: "关于 PyaBot",
                link: "/docs/what-is-astrbot",
              },
              {
                text: "交流与反馈",
                link: "/docs/community",
              },
              {
                text: "常见问题",
                link: "/docs/faq",
              },
            ],
          },
          {
            text: "部署",
            base: "/docs/deploy",
            collapsed: false,
            items: [
              {
                text: "脚本安装",
                link: "/astrbot/package",
              },
              {
                text: "Docker 部署",
                link: "/astrbot/docker",
              },
              {
                text: "Kubernetes 部署",
                link: "/astrbot/kubernetes",
              },
              {
                text: "宝塔面板部署",
                link: "/astrbot/btpanel",
              },
              {
                text: "1Panel 部署",
                link: "/astrbot/1panel",
              },
              {
                text: "源码部署",
                link: "/astrbot/cli",
              },
              {
                text: "其他部署方式",
                collapsed: true,
                items: [
                  {
                    text: "CasaOS 部署",
                    link: "/astrbot/casaos",
                  },
                ],
              },
            ],
          },
          {
            text: "接入消息平台",
            base: "/docs/platform",
            items: [
              {
                text: "快速接入指南",
                link: "/start",
              },
              {
                text: "QQ 官方机器人",
                link: "/qqofficial",
                collapsed: true,
                items: [
                  {
                    text: "Websockets 方式(推荐)",
                    link: "/qqofficial/websockets",
                  },
                  {
                    text: "Webhook 方式",
                    link: "/qqofficial/webhook",
                  },
                ],
              },
              {
                text: "OneBot v11",
                link: "/aiocqhttp",
              },
              {
                text: "企微应用",
                link: "/wecom",
              },
              {
                text: "企微智能机器人",
                link: "/wecom_ai_bot",
              },
              {
                text: "微信公众号",
                link: "/weixin-official-account",
              },
              {
                text: "个人微信",
                link: "/weixin_oc",
              },
              {
                text: "飞书",
                link: "/lark",
              },
              {
                text: "钉钉",
                link: "/dingtalk",
              },
              {
                text: "Telegram",
                link: "/telegram",
              },
              {
                text: "LINE",
                link: "/line",
              },
              {
                text: "Slack",
                link: "/slack",
              },
              {
                text: "Mattermost",
                link: "/mattermost",
              },
              {
                text: "Misskey",
                link: "/misskey",
              },
              {
                text: "Discord",
                link: "/discord",
              },
              {
                text: "KOOK",
                link: "/kook",
              },
              {
                text: "Satori",
                base: "/docs/platform/satori",
                collapsed: true,
                items: [
                  {
                    text: "接入 Satori",
                    link: "/guide",
                  },
                  {
                    text: "使用 server-satori",
                    link: "/server-satori",
                  },
                ],
              },
              {
                text: "社区提供",
                collapsed: false,
                items: [
                  {
                    text: "Matrix",
                    link: "/matrix",
                  },
                  {
                    text: "VoceChat",
                    link: "/vocechat",
                  },
                ],
              },
            ],
          },
          {
            text: "接入 AI",
            base: "/docs/providers",
            items: [
              {
                text: "模型服务",
                link: "/start",
                collapsed: true,
                items: [
                  {
                    text: "MiraRouter",
                    link: "/mirarouter",
                  },
                  {
                    text: "NewAPI",
                    link: "/newapi",
                  },
                  {
                    text: "胜算云",
                    link: "/shengsuanyun",
                  },
                  {
                    text: "AIHubMix",
                    link: "/aihubmix",
                  },
                  {
                    text: "PPIO 派欧云",
                    link: "/ppio",
                  },
                  {
                    text: "硅基流动",
                    link: "/siliconflow",
                  },
                  {
                    text: "小马算力",
                    link: "/tokenpony",
                  },
                  {
                    text: "302.AI",
                    link: "/302ai",
                  },
                  { text: "DeepSeek TTS", link: "/deepseek-tts" },
                  { text: "DeepSeek STT", link: "/deepseek-stt" },
                  {
                    text: "Ollama",
                    link: "/provider-ollama",
                  },
                  {
                    text: "LMStudio",
                    link: "/provider-lmstudio",
                  },
                ],
              },
              {
                text: "Agent 执行器",
                link: "/agent-runners",
                collapsed: false,
                items: [
                  {
                    text: "内置 Agent 执行器",
                    link: "/agent-runners/astrbot-agent-runner",
                  },
                  {
                    text: "Dify",
                    link: "/agent-runners/dify",
                  },
                  {
                    text: "扣子 Coze",
                    link: "/agent-runners/coze",
                  },
                  {
                    text: "阿里云百炼应用",
                    link: "/agent-runners/dashscope",
                  },
                  {
                    text: "DeerFlow",
                    link: "/agent-runners/deerflow",
                  },
                ],
              },
            ],
          },
          {
            text: "使用",
            base: "/docs/use",
            items: [
              {
                text: "WebUI",
                link: "/webui",
              },
              {
                text: "PyaBot CLI",
                link: "/cli",
              },
              {
                text: "内置指令",
                link: "/command",
              },
              {
                text: "插件",
                collapsed: false,
                items: [
                  {
                    text: "插件",
                    link: "/plugin",
                  },
                  {
                    text: "MCP",
                    link: "/mcp",
                  },
                  {
                    text: "技能 Skills",
                    link: "/skills",
                  },
                ],
              },
              {
                text: "PyaBot 内置 AI",
                collapsed: false,
                items: [
                  {
                    text: "Agent 沙盒环境",
                    link: "/astrbot-agent-sandbox",
                  },
                  {
                    text: "SubAgent 编排",
                    link: "/subagent",
                  },
                  {
                    text: "主动型能力",
                    link: "/proactive-agent",
                  },
                  {
                    text: "网页搜索",
                    link: "/websearch",
                    collapsed: true,
                    items: [
                      {
                        text: "SerpApi",
                        link: "/websearch/serpapi",
                      },
                      {
                        text: "DeepSeek Search API",
                        link: "/websearch/deepseek",
                      },
                    ],
                  },
                  {
                    text: "知识库",
                    link: "/knowledge-base",
                  },
                  {
                    text: "上下文压缩",
                    link: "/context-compress",
                  },
                ],
              },
              {
                text: "自定义规则",
                link: "/custom-rules",
              },
              {
                text: "Agent 执行方式",
                link: "/agent-runner",
              },
              {
                text: "统一 Webhook 模式",
                link: "/unified-webhook",
              },
            ],
          },
          {
            text: "开发",
            base: "/docs/dev",
            collapsed: true,
            items: [
              {
                text: "插件开发",
                base: "/docs/dev/star",
                collapsed: true,
                items: [
                  {
                    text: "🌠 从这里开始",
                    link: "/plugin-new",
                  },
                  {
                    text: "最小实例",
                    link: "/guides/simple",
                  },
                  {
                    text: "接收消息事件",
                    link: "/guides/listen-message-event",
                  },
                  {
                    text: "发送消息",
                    link: "/guides/send-message",
                  },
                  {
                    text: "插件配置",
                    link: "/guides/plugin-config",
                  },
                  {
                    text: "插件可视化视图",
                    collapsed: true,
                    items: [
                      { text: "概览", link: "/guides/plugin-views/" },
                      { text: "独立插件页面", link: "/guides/plugin-views/plugin-page" },
                      { text: "消息交互组件", link: "/guides/plugin-views/chat-message" },
                      { text: "工作台页面", link: "/guides/plugin-views/workbench" },
                      { text: "共享 Bridge API", link: "/guides/plugin-views/bridge" },
                      { text: "后端 Web API", link: "/guides/plugin-views/web-api" },
                    ],
                  },
                  {
                    text: "插件国际化",
                    link: "/guides/plugin-i18n",
                  },
                  {
                    text: "AI",
                    link: "/guides/ai",
                    collapsed: true,
                    items: [
                      { text: "模型", link: "/guides/ai/models" },
                      { text: "Agent", link: "/guides/ai/agent" },
                      { text: "工具", link: "/guides/ai/tools" },
                      { text: "会话与对话", link: "/guides/ai/conversations" },
                      { text: "其他", link: "/guides/ai/other" },
                    ],
                  },
                  {
                    text: "存储",
                    link: "/guides/storage",
                  },
                  {
                    text: "文转图",
                    link: "/guides/html-to-pic",
                  },
                  {
                    text: "会话控制器",
                    link: "/guides/session-control",
                  },
                  {
                    text: "杂项",
                    link: "/guides/other",
                  },
                  {
                    text: "发布插件",
                    link: "/plugin-publish",
                  },
                ],
              },
              {
                text: "插件市场规范",
                base: "/docs/dev/plugin-market",
                collapsed: true,
                items: [
                  {
                    text: "版本列表",
                    link: "/",
                  },
                  {
                    text: "2026-06-27",
                    link: "/2026-06-27",
                  },
                ],
              },
              {
                text: "接入平台适配器",
                link: "/plugin-platform-adapter",
              },
              {
                text: "PyaBot HTTP API",
                link: "/openapi",
              },
              {
                text: "API Scope 与接口对照",
                link: "/openapi-scopes",
              },
              {
                text: "PyaBot 配置文件",
                link: "/astrbot-config",
              },
            ],
          },
          {
            text: "其他",
            base: "/docs/others",
            collapsed: true,
            items: [
              {
                text: "异常诊断",
                link: "/diagnostics",
              },
              {
                text: "自部署文转图",
                link: "/self-host-t2i",
              },
              {
                text: "插件下载不了?试试自建 GitHub 加速服务",
                link: "/github-proxy",
              },
            ],
          },
        ],
        outline: {
          level: "deep",
          label: "目录",
        },
        darkModeSwitchLabel: "切换日光/暗黑模式",
        sidebarMenuLabel: "文章",
        returnToTopLabel: "返回顶部",
        docFooter: {
          prev: "上一篇",
          next: "下一篇",
        },
        editLink: {
          pattern:
            "https://github.com/Sakura520222/PyaBot/edit/master/docs/:path",
          text: "发现文档有问题？在 GitHub 上编辑此页",
        },
        logo: "/favicon.svg",
        socialLinks: [
          {
            icon: "github",
            link: "https://github.com/Sakura520222/PyaBot",
          },
        ],
        footer: {
          message:
            'Sakura520222 维护 · 基于 <a href="https://github.com/AstrBotDevs/AstrBot">AstrBot</a> · AGPL-3.0-or-later',
        },
      },
    },
    "docs/en": {
      label: "English",
      lang: "en-US",
      themeConfig: {
        nav: [
          {
            text: "Home",
            link: "/",
          },
          {
            text: "Docs",
            link: "/docs/en/",
            activeMatch: "^/docs/en/",
          },
          {
            text: "Releases",
            link: "https://github.com/Sakura520222/PyaBot/releases",
          },
          {
            text: "HTTP API",
            link: "/scalar.html",
            target: "_blank",
          },
        ],
        sidebar: [
          {
            text: "Introduction",
            items: [
              {
                text: "What is PyaBot",
                link: "/docs/en/what-is-astrbot",
              },
              {
                text: "Feedback",
                link: "/docs/en/community",
              },
              {
                text: "FAQ",
                link: "/docs/en/faq",
              },
            ],
          },
          {
            text: "Deployment",
            base: "/docs/en/deploy",
            collapsed: false,
            items: [
              {
                text: "Script installation",
                link: "/astrbot/package",
              },
              {
                text: "Docker",
                link: "/astrbot/docker",
              },
              {
                text: "Kubernetes",
                link: "/astrbot/kubernetes",
              },
              {
                text: "BT Panel",
                link: "/astrbot/btpanel",
              },
              {
                text: "1Panel",
                link: "/astrbot/1panel",
              },
              {
                text: "Source Deployment",
                link: "/astrbot/cli",
              },
              {
                text: "Other Deployments",
                collapsed: true,
                items: [
                  {
                    text: "CasaOS",
                    link: "/astrbot/casaos",
                  },
                ],
              },
            ],
          },
          {
            text: "Messaging Platforms",
            base: "/docs/en/platform",
            collapsed: false,
            items: [
              {
                text: "Quick Start",
                link: "/start",
              },
              {
                text: "QQ Official Bot",
                link: "/qqofficial",
                collapsed: true,
                items: [
                  {
                    text: "Websockets",
                    link: "/qqofficial/websockets",
                  },
                  {
                    text: "Webhook",
                    link: "/qqofficial/webhook",
                  },
                ],
              },
              {
                text: "OneBot v11",
                link: "/aiocqhttp",
              },
              {
                text: "WeCom Application",
                link: "/wecom",
              },
              {
                text: "WeCom AI Bot",
                link: "/wecom_ai_bot",
              },
              {
                text: "WeChat Official Account",
                link: "/weixin-official-account",
              },
              {
                text: "Personal WeChat",
                link: "/weixin_oc",
              },
              {
                text: "Lark",
                link: "/lark",
              },
              {
                text: "DingTalk",
                link: "/dingtalk",
              },
              {
                text: "Telegram",
                link: "/telegram",
              },
              {
                text: "LINE",
                link: "/line",
              },
              {
                text: "Slack",
                link: "/slack",
              },
              {
                text: "Mattermost",
                link: "/mattermost",
              },
              {
                text: "Misskey",
                link: "/misskey",
              },
              {
                text: "Discord",
                link: "/discord",
              },
              {
                text: "KOOK",
                link: "/kook",
              },
              {
                text: "Satori",
                base: "/docs/en/platform/satori",
                collapsed: true,
                items: [
                  {
                    text: "Connect Satori",
                    link: "/guide",
                  },
                  {
                    text: "Using server-satori",
                    link: "/server-satori",
                  },
                ],
              },
              {
                text: "Community-provided",
                collapsed: false,
                items: [
                  {
                    text: "Matrix",
                    link: "/matrix",
                  },
                  {
                    text: "VoceChat",
                    link: "/vocechat",
                  },
                ],
              },
            ],
          },
          {
            text: "AI Integration",
            base: "/docs/en/providers",
            collapsed: false,
            items: [
              {
                text: "✨ Model Providers",
                link: "/start",
                collapsed: true,
                items: [
                  {
                    text: "MiraRouter",
                    link: "/mirarouter",
                  },
                  {
                    text: "NewAPI",
                    link: "/newapi",
                  },
                  {
                    text: "ShengSuanYun",
                    link: "/shengsuanyun",
                  },
                  {
                    text: "AIHubMix",
                    link: "/aihubmix",
                  },
                  {
                    text: "PPIO Cloud",
                    link: "/ppio",
                  },
                  {
                    text: "SiliconFlow",
                    link: "/siliconflow",
                  },
                  {
                    text: "TokenPony",
                    link: "/tokenpony",
                  },
                  {
                    text: "302.AI",
                    link: "/302ai",
                  },
                  { text: "DeepSeek TTS", link: "/deepseek-tts" },
                  { text: "DeepSeek STT", link: "/deepseek-stt" },
                  {
                    text: "Ollama",
                    link: "/provider-ollama",
                  },
                  {
                    text: "LMStudio",
                    link: "/provider-lmstudio",
                  },
                ],
              },
              {
                text: "⚙️ Agent Runners",
                link: "/agent-runners",
                collapsed: false,
                items: [
                  {
                    text: "Built-in Agent Runner",
                    link: "/agent-runners/astrbot-agent-runner",
                  },
                  {
                    text: "Dify",
                    link: "/agent-runners/dify",
                  },
                  {
                    text: "Coze",
                    link: "/agent-runners/coze",
                  },
                  {
                    text: "Alibaba Bailian",
                    link: "/agent-runners/dashscope",
                  },
                  {
                    text: "DeerFlow",
                    link: "/agent-runners/deerflow",
                  },
                ],
              },
            ],
          },
          {
            text: "Usage",
            base: "/docs/en/use",
            collapsed: true,
            items: [
              {
                text: "WebUI",
                link: "/webui",
              },
              {
                text: "PyaBot CLI",
                link: "/cli",
              },
              {
                text: "Built-in Commands",
                link: "/command",
              },
              {
                text: "Plugins",
                collapsed: false,
                items: [
                  {
                    text: "Plugins",
                    link: "/plugin",
                  },
                  {
                    text: "MCP",
                    link: "/mcp",
                  },
                  {
                    text: "Skills",
                    link: "/skills",
                  },
                ],
              },
              {
                text: "PyaBot Built-in AI",
                collapsed: false,
                items: [
                  {
                    text: "Agent Sandbox",
                    link: "/astrbot-agent-sandbox",
                  },
                  {
                    text: "SubAgent Orchestration",
                    link: "/subagent",
                  },
                  {
                    text: "Proactive Capabilities",
                    link: "/proactive-agent",
                  },
                  {
                    text: "Web Search",
                    link: "/websearch",
                    collapsed: true,
                    items: [
                      {
                        text: "SerpApi",
                        link: "/websearch/serpapi",
                      },
                      {
                        text: "DeepSeek Search API",
                        link: "/websearch/deepseek",
                      },
                    ],
                  },
                  {
                    text: "Knowledge Base",
                    link: "/knowledge-base",
                  },
                  {
                    text: "Context Compression",
                    link: "/context-compress",
                  },
                ],
              },
              {
                text: "Custom Rules",
                link: "/custom-rules",
              },
              {
                text: "Agent Execution Mode",
                link: "/agent-runner",
              },
              {
                text: "Unified Webhook Mode",
                link: "/unified-webhook",
              },
            ],
          },
          {
            text: "Development",
            base: "/docs/en/dev",
            collapsed: true,
            items: [
              {
                text: "Plugin Development",
                base: "/docs/en/dev/star",
                collapsed: true,
                items: [
                  {
                    text: "🌠 Getting Started",
                    link: "/plugin-new",
                  },
                  {
                    text: "Minimal Example",
                    link: "/guides/simple",
                  },
                  {
                    text: "Listen to Message Events",
                    link: "/guides/listen-message-event",
                  },
                  {
                    text: "Send Messages",
                    link: "/guides/send-message",
                  },
                  {
                    text: "Plugin Configuration",
                    link: "/guides/plugin-config",
                  },
                  {
                    text: "Plugin Views",
                    collapsed: true,
                    items: [
                      { text: "Overview", link: "/guides/plugin-views/" },
                      { text: "Standalone Plugin Page", link: "/guides/plugin-views/plugin-page" },
                      { text: "Interactive Message Component", link: "/guides/plugin-views/chat-message" },
                      { text: "Workbench Page", link: "/guides/plugin-views/workbench" },
                      { text: "Shared Bridge API", link: "/guides/plugin-views/bridge" },
                      { text: "Backend Web APIs", link: "/guides/plugin-views/web-api" },
                    ],
                  },
                  {
                    text: "Plugin Internationalization",
                    link: "/guides/plugin-i18n",
                  },
                  {
                    text: "AI",
                    link: "/guides/ai",
                    collapsed: true,
                    items: [
                      { text: "Models", link: "/guides/ai/models" },
                      { text: "Agents", link: "/guides/ai/agent" },
                      { text: "Tools", link: "/guides/ai/tools" },
                      { text: "Sessions and Conversations", link: "/guides/ai/conversations" },
                      { text: "Other APIs", link: "/guides/ai/other" },
                    ],
                  },
                  {
                    text: "Storage",
                    link: "/guides/storage",
                  },
                  {
                    text: "HTML to Image",
                    link: "/guides/html-to-pic",
                  },
                  {
                    text: "Session Control",
                    link: "/guides/session-control",
                  },
                  {
                    text: "Publish Plugin",
                    link: "/plugin-publish",
                  },
                ],
              },
              {
                text: "Plugin Market Specification",
                base: "/docs/en/dev/plugin-market",
                collapsed: true,
                items: [
                  {
                    text: "Versions",
                    link: "/",
                  },
                  {
                    text: "2026-06-27",
                    link: "/2026-06-27",
                  },
                ],
              },
              {
                text: "Platform Adapter Integration",
                link: "/plugin-platform-adapter",
              },
              {
                text: "PyaBot HTTP API",
                link: "/openapi",
              },
              {
                text: "API Scope–Endpoint Reference",
                link: "/openapi-scopes",
              },
              {
                text: "PyaBot Configuration File",
                link: "/astrbot-config",
              },
            ],
          },
          {
            text: "Others",
            base: "/docs/en/others",
            collapsed: true,
            items: [
              {
                text: "Diagnostics",
                link: "/diagnostics",
              },
              {
                text: "Self-hosted HTML to Image",
                link: "/self-host-t2i",
              },
            ],
          },
        ],
        outline: {
          level: "deep",
          label: "On this page",
        },
        darkModeSwitchLabel: "Toggle dark mode",
        sidebarMenuLabel: "Menu",
        returnToTopLabel: "Return to top",
        docFooter: {
          prev: "Previous",
          next: "Next",
        },
        editLink: {
          pattern:
            "https://github.com/Sakura520222/PyaBot/edit/master/docs/:path",
          text: "Edit this page on GitHub",
        },
        logo: "/favicon.svg",
        socialLinks: [
          {
            icon: "github",
            link: "https://github.com/Sakura520222/PyaBot",
          },
        ],
        footer: {
          message:
            'Maintained by Sakura520222 · Based on <a href="https://github.com/AstrBotDevs/AstrBot">AstrBot</a> · AGPL-3.0-or-later',
        },
      },
      title: "PyaBot documentation",
      description:
        "PyaBot deployment, configuration, messaging platforms, models, plugins, and tools.",
    },
  },
  themeConfig: {
    siteTitle: "PyaBot",
    logoLink: "/",
    i18nRouting: false,
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },
  },
  srcExclude: ["README.md", "scripts/**"],
});
