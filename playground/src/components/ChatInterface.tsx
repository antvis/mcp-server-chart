import { useState, useEffect, useCallback } from "react";
import { mastraClient } from "../lib/mastra";
import { GPTVis } from "@antv/gpt-vis";
import {
  Bubble,
  Prompts,
  Sender,
  Welcome,
  Conversations,
} from "@ant-design/x";
import {
  Avatar,
  Space,
  Button,
  message as antMessage,
} from "antd";
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { GetProp } from "antd";
import dayjs from "dayjs";
import "./ChatInterface.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: "loading" | "success" | "error";
}

interface Conversation {
  key: string;
  label: string;
  group?: string;
  messages: Message[];
  createdAt: number;
}

// 快捷提示词
const CHART_PROMPTS: GetProp<typeof Prompts, "items"> = [
  {
    key: "1",
    label: "趋势分析",
    icon: <LineChartOutlined />,
    description: "生成折线图展示近 5 年人口增长趋势",
  },
  {
    key: "2",
    label: "占比分析",
    icon: <PieChartOutlined />,
    description: "创建饼图展示油车和新能源车市场份额分布",
  },
  {
    key: "3",
    label: "数据对比",
    icon: <BarChartOutlined />,
    description: "用柱状图对比各季度销售额",
  },
];

// 欢迎页面示例
const WELCOME_EXAMPLES = {
  key: "1",
  label: "快速开始",
  children: [
    {
      key: "1-1",
      label: "趋势分析",
      description: "生成折线图展示近 5 年人口增长趋势",
      icon: <LineChartOutlined style={{ fontSize: 20, color: "#1677ff" }} />,
    },
    {
      key: "1-2",
      label: "占比分析",
      description: "创建饼图展示市场份额分布",
      icon: <PieChartOutlined style={{ fontSize: 20, color: "#52c41a" }} />,
    },
    {
      key: "1-3",
      label: "数据对比",
      description: "用柱状图对比各季度销售额",
      icon: <BarChartOutlined style={{ fontSize: 20, color: "#faad14" }} />,
    }
  ],
};

// 本地存储 key
const STORAGE_KEY = "mastra_chart_conversations";

// 获取日期分组
const getDateGroup = (timestamp: number) => {
  const now = dayjs();
  const date = dayjs(timestamp);
  const diffDays = now.diff(date, "day");

  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays <= 7) return "最近7天";
  if (diffDays <= 30) return "最近30天";
  return "更早";
};

export function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationKey, setActiveConversationKey] = useState<string>("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 当前对话的消息
  const currentConversation = conversations.find(
    (c) => c.key === activeConversationKey
  );
  const messages = currentConversation?.messages || [];

  // 流式更新消息内容
  const updateStreamingMessage = useCallback((messageId: string, content: string, status: "loading" | "success" | "error" = "loading") => {
    console.log("更新流式消息:", messageId, content, status);
    setConversations((prev) =>
      prev.map((c) =>
        c.key === activeConversationKey
          ? {
              ...c,
              messages: c.messages.map((msg) =>
                msg.id === messageId
                  ? { ...msg, content, status }
                  : msg
              ),
            }
          : c
      )
    );
  }, [activeConversationKey]);

  // 初始化：从本地存储加载对话
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if(!Array.isArray(parsed)) throw new Error("Invalid data");
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveConversationKey(parsed[0].key);
        }
      } catch (e) {
        console.error("Failed to load conversations:", e);
      }
    }
  }, []);

  // 保存对话到本地存储
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  // 创建新对话
  const createNewConversation = () => {
    if (messages.length === 0) {
      antMessage.info("当前已是新会话");
      return;
    }

    const now = Date.now();
    const newConv: Conversation = {
      key: now.toString(),
      label: `新对话 ${conversations.length + 1}`,
      group: getDateGroup(now),
      messages: [],
      createdAt: now,
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationKey(newConv.key);
  };

  // 删除对话
  const deleteConversation = (key: string) => {
    const newConvs = conversations.filter((c) => c.key !== key);
    setConversations(newConvs);

    if (key === activeConversationKey) {
      setActiveConversationKey(newConvs[0]?.key || "");
    }
  };

  // 重命名对话
  const renameConversation = (key: string, newLabel: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.key === key ? { ...c, label: newLabel } : c))
    );
  };

  // 更新当前对话的消息
  const updateMessages = (updater: (prev: Message[]) => Message[]) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.key === activeConversationKey
          ? { ...c, messages: updater(c.messages) }
          : c
      )
    );
  };

  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // 如果没有活动对话，创建一个
    if (!activeConversationKey) {
      const now = Date.now();
      const newConv: Conversation = {
        key: now.toString(),
        label: "新对话",
        group: getDateGroup(now),
        messages: [],
        createdAt: now,
      };
      setConversations([newConv]);
      setActiveConversationKey(newConv.key);
    }

    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: content.trim(),
      status: "success",
    };

    updateMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // 添加加载中的 AI 消息
    const assistantMessageId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "正在生成图表...",
      status: "loading",
    };
    updateMessages((prev) => [...prev, loadingMessage]);

    // 自动更新对话标题（使用第一条用户消息）
    if (messages.length === 0) {
      const title = content.slice(0, 20) + (content.length > 20 ? "..." : "");
      renameConversation(activeConversationKey, title);
    }

    try {
      const agent = mastraClient.getAgent("chartAgent");
      const streamResponse = await agent.stream({
        messages: [{ role: "user", content }],
      });

      // 流式处理响应
      let streamedText = "";
      const charts: string[] = [];

      await streamResponse.processDataStream({
        onChunk: (chunk) => {
          // 处理文本块 - Mastra 的 chunk 结构
          if (chunk.type === "text-delta" && chunk.payload?.text) {
            streamedText += chunk.payload.text;
            
            // 实时更新消息内容 - 打字机效果
            updateStreamingMessage(assistantMessageId, streamedText, "success");
          }

          // 处理工具调用结果
          if (chunk.type === "tool-result" && chunk.payload) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const toolResult = chunk.payload as any;
            
            if (toolResult?.chart) {
              charts.push(toolResult.chart);
              // 在文本后添加图表
              const contentWithChart = streamedText + '\n\n' + toolResult.chart;
              updateStreamingMessage(assistantMessageId, contentWithChart, "loading");
            }
          }
        },
      });

      // 流式完成后的最终处理
      let finalContent = streamedText;
      
      // 如果有图表数据，确保添加到内容中
      if (charts.length > 0) {
        // 如果文本为空，添加默认说明
        if (!finalContent.trim()) {
          finalContent = "已为您生成图表：";
        }
        
        // 移除可能存在的图片 Markdown 语法
        const imageMarkdownRegex = /!\[.*?\]\(.*?\)/g;
        finalContent = finalContent.replace(imageMarkdownRegex, '').trim();
        
        // 添加图表（如果还没有包含）
        if (!finalContent.includes(charts[0])) {
          finalContent = finalContent + '\n\n' + charts[0];
        }
      } else if (!finalContent.trim()) {
        // 既没有文本也没有图表
        finalContent = "未能生成回复，请重试";
      }

      // 最终更新消息状态为成功
      updateStreamingMessage(assistantMessageId, finalContent, "success");
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating response:", error);
      antMessage.error("生成图表失败，请重试");

      // 更新错误消息
      updateStreamingMessage(
        assistantMessageId,
        `❌ 错误: ${error instanceof Error ? error.message : "未知错误"}`,
        "error"
      );
      setIsLoading(false);
    }
  };

  // console.log("渲染对话组件，当前对话:", currentConversation, "消息数:", messages.length, isLoading);

  return (
    <div className="chat-layout">
      {/* 侧边栏 */}
      <div className="chat-sider">
        <div className="chat-logo">
          <BarChartOutlined style={{ fontSize: 24, color: "#667eea" }} />
          <span> AntV 数据图表可视化</span>
        </div>

        <Button
          icon={<PlusOutlined />}
          onClick={createNewConversation}
          className="new-conversation-btn"
          block
        >
          新建对话
        </Button>

        <Conversations
          items={conversations.map((c) => ({
            key: c.key,
            label:
              c.key === activeConversationKey
                ? `[当前] ${c.label}`
                : c.label,
            group: c.group,
          }))}
          className="conversations-list"
          activeKey={activeConversationKey}
          onActiveChange={setActiveConversationKey}
          groupable
          styles={{
            item: { padding: "8px 12px" },
          }}
          menu={(conversation) => ({
            items: [
              {
                label: "重命名",
                key: "rename",
                icon: <EditOutlined />,
                onClick: () => {
                  const labelStr = String(conversation.label).replace('[当前] ', '');
                  const newLabel = prompt("请输入新名称:", labelStr);
                  if (newLabel && newLabel.trim()) {
                    renameConversation(conversation.key, newLabel.trim());
                  }
                },
              },
              {
                label: "删除",
                key: "delete",
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => deleteConversation(conversation.key),
              },
            ],
          })}
        />

        <div className="chat-sider-footer">
          <Avatar size={28} icon={<UserOutlined />} />
          <Button
            type="text"
            size="small"
            icon={<QuestionCircleOutlined />}
          />
        </div>
      </div>

      {/* 主聊天区域 */}
      <div className="chat-main">
        <div className="chat-content-x">
        {messages.length === 0 ? (
          <Space direction="vertical" size={24} className="welcome-container">
            <Welcome
              variant="borderless"
              icon={
                <BarChartOutlined
                  style={{ fontSize: 58, color: "#667eea" }}
                />
              }
              title="你好，我是可视化分析助手"
              description="基于 MCP Server Chart 和 Mastra，为您提供数据可视化服务"
            />
            <Prompts
              items={[WELCOME_EXAMPLES]}
              styles={{
                list: { width: "100%", maxWidth: 800 },
                item: {
                  flex: 1,
                  background: "linear-gradient(to right, #f0f2fc 0%, #ebebff 100%)",
                  borderRadius: 12,
                  border: "none",
                },
              }}
              onItemClick={(info) => {
                const desc = info.data?.description as string | undefined;
                if (desc) handleSubmit(desc);
              }}
            />
          </Space>
        ) : (
          <Bubble.List
            items={messages.map((msg) => (
             {
              key: msg.id,
              role: msg.role,
              content:
                msg.role === "assistant" ? (
                  <GPTVis>{msg.content}</GPTVis>
                ) : (
                  msg.content
                ),
              avatar:
                msg.role === "assistant" ? (
                  <Avatar
                    icon={<BarChartOutlined />}
                    style={{ background: "#667eea" }}
                  />
                ) : (
                  <Avatar style={{ background: "#87d068" }}>U</Avatar>
                ),
              placement: msg.role === "assistant" ? "start" : "end",
              loading: msg.status === "loading",
            }))}
          />
        )}
        </div>

        <div className="chat-footer-x">
          <Prompts
            items={CHART_PROMPTS}
            onItemClick={(info) => {
              const item = CHART_PROMPTS.find((p) => p.key === info.data.key);
              if (item?.description && typeof item.description === 'string') {
                handleSubmit(item.description);
              }
            }}
            styles={{
              item: { padding: "6px 12px" },
            }}
          />
          <Sender
            value={input}
            onChange={setInput}
            onSubmit={(val) => {
              handleSubmit(val);
            }}
            onCancel={() => {
              setIsLoading(false);
            }}
            loading={isLoading}
            placeholder="请描述您想生成的图表..."
          />
        </div>
      </div>
    </div>
  );
}
