import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  FileSearchOutlined,
  ProductOutlined,
  ScheduleOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import { Bubble, Sender, Welcome, Prompts } from '@ant-design/x';
import { GPTVis } from '@antv/gpt-vis';
import { ConfigProvider, theme, Space, Flex, Spin } from 'antd';
import type { GetProp } from 'antd';
import { createStyles } from 'antd-style';
import { mcpClient } from './mcpClient';
import { LLMService } from './llmService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'loading' | 'success' | 'error';
}

// 示例问题列表
const SENDER_PROMPTS: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: '生成折线图,显示最近5年的销售趋势',
    icon: <ScheduleOutlined />,
  },
  {
    key: '2',
    description: '创建饼图,展示市场份额分布',
    icon: <ProductOutlined />,
  },
  {
    key: '3',
    description: '绘制柱状图,对比不同产品的销量',
    icon: <FileSearchOutlined />,
  },
  {
    key: '4',
    description: '制作思维导图,展示新手入门指南',
    icon: <AppstoreAddOutlined />,
  },
];

// 快速开始示例
const QUICK_START_PROMPTS = {
  key: '1',
  label: '快速开始',
  children: [
    {
      key: '1-1',
      description: '生成折线图,显示最近5年的销售趋势',
      icon: <span style={{ color: '#1677ff', fontWeight: 600 }}>📈</span>,
    },
    {
      key: '1-2',
      description: '创建饼图,展示市场份额分布',
      icon: <span style={{ color: '#52c41a', fontWeight: 600 }}>🥧</span>,
    },
    {
      key: '1-3',
      description: '绘制柱状图,对比不同产品的销量',
      icon: <span style={{ color: '#faad14', fontWeight: 600 }}>📊</span>,
    },
    {
      key: '1-4',
      description: '制作思维导图,展示新手入门指南',
      icon: <span style={{ color: '#722ed1', fontWeight: 600 }}>🎯</span>,
    },
  ],
};

// 图表类型说明
const CHART_TYPES_GUIDE = {
  key: '2',
  label: '支持的图表类型',
  children: [
    {
      key: '2-1',
      icon: <span>📈</span>,
      label: '趋势分析',
      description: '折线图、面积图 - 展示数据随时间变化趋势',
    },
    {
      key: '2-2',
      icon: <span>📊</span>,
      label: '对比分析',
      description: '柱状图、条形图 - 对比不同类别的数据',
    },
    {
      key: '2-3',
      icon: <span>🥧</span>,
      label: '占比分析',
      description: '饼图、环形图 - 展示各部分占比关系',
    },
    {
      key: '2-4',
      icon: <span>🌍</span>,
      label: '地理分析',
      description: '地图、热力图 - 地理位置相关数据可视化',
    },
  ],
};

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
    `,
    chat: css`
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-block: ${token.paddingLG}px;
      gap: 16px;
    `,
    chatPrompt: css`
      .ant-prompts-label {
        color: #000000e0 !important;
      }
      .ant-prompts-desc {
        color: #000000a6 !important;
        width: 100%;
      }
      .ant-prompts-icon {
        color: #000000a6 !important;
      }
    `,
    chatList: css`
      flex: 1;
      overflow: auto;
    `,
    loadingMessage: css`
      background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
      background-size: 100% 2px;
      background-repeat: no-repeat;
      background-position: bottom;
    `,
    placeholder: css`
      padding-top: 0%;
    `,
    sender: css`
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
    `,
    senderPrompt: css`
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      color: ${token.colorText};
    `,
  };
});

const App: React.FC = () => {
  const { styles } = useStyle();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const llmServiceRef = useRef<LLMService | null>(null);

  // 初始化 LLM 服务
  useEffect(() => {
    llmServiceRef.current = new LLMService(mcpClient);
  }, []);

  // 处理发送消息
  const handleSend = useCallback(async (content: string) => {
    const text = content.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      status: 'success',
    };

    // 添加用户消息和加载中的助手消息
    const loadingMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: loadingMessageId,
        role: 'assistant',
        content: '',
        status: 'loading',
      },
    ]);

    setInputText('');
    setLoading(true);

    try {
      if (!llmServiceRef.current) {
        throw new Error('LLM 服务未初始化');
      }

      const assistantContent = await llmServiceRef.current.processMessage(text);

      // 更新加载消息为实际内容
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? { ...msg, content: assistantContent, status: 'success' }
            : msg
        )
      );
    } catch (error) {
      console.error('发送消息失败:', error);
      // 更新为错误消息
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                ...msg,
                content: '抱歉,处理您的请求时出现了错误。请稍后重试。',
                status: 'error',
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);


  const chatList = (
    <div className={styles.chatList}>
      {messages?.length ? (
        <Bubble.List
          items={messages.map((msg) => ({
            key: msg.id,
            role: msg.role,
            content: msg.role === 'assistant' ? <GPTVis>{msg.content}</GPTVis> : msg.content,
            classNames: {
              content: msg.status === 'loading' ? styles.loadingMessage : '',
            },
            typing: msg.status === 'loading' ? { step: 5, interval: 20 } : false,
          }))}
          style={{ height: '100%', paddingInline: 'calc(calc(100% - 700px) / 2)' }}
          roles={{
            assistant: {
              placement: 'start',
              avatar: {
                src: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp',
              },
              loadingRender: () => <Spin size="small" />,
            },
            user: {
              placement: 'end',
              avatar: { style: { background: '#87d068' } },
            },
          }}
        />
      ) : (
        <Space
          direction="vertical"
          size={8}
          style={{ paddingInline: 'calc(calc(100% - 700px) / 2)' }}
          className={styles.placeholder}
        >
          <Welcome
            variant="borderless"
            icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            title="MCP Chart 对话助手"
            description="基于 MCP Server Chart 和 GPT-Vis,通过自然语言生成专业的数据可视化图表~"
          />
          <Flex gap={16}>
            <Prompts
              items={[QUICK_START_PROMPTS]}
              styles={{
                list: { height: '100%' },
                item: {
                  flex: 1,
                  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                  borderRadius: 12,
                  border: 'none',
                },
                subItem: { padding: 0, background: 'transparent' },
              }}
              onItemClick={(info) => {
                handleSend(info.data.description as string);
              }}
              className={styles.chatPrompt}
            />

            <Prompts
              items={[CHART_TYPES_GUIDE]}
              styles={{
                item: {
                  flex: 1,
                  backgroundImage: 'linear-gradient(123deg, #e5f4ff 0%, #efe7ff 100%)',
                  borderRadius: 12,
                  border: 'none',
                },
                subItem: { background: '#ffffffa6' },
              }}
              onItemClick={(info) => {
                handleSend(info.data.description as string);
              }}
              className={styles.chatPrompt}
            />
          </Flex>
        </Space>
      )}
    </div>
  );

  const chatSender = (
    <>
      <Prompts
        items={SENDER_PROMPTS}
        onItemClick={(info) => {
          handleSend(info.data.description as string);
        }}
        styles={{
          item: { padding: '6px 12px' },
        }}
        className={styles.senderPrompt}
      />
      <Sender
        value={inputText}
        onSubmit={() => {
          handleSend(inputText);
        }}
        onChange={setInputText}
        loading={loading}
        className={styles.sender}
        placeholder="描述您想要的图表,例如:生成一个折线图显示销售趋势..."
      />
    </>
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <div className={styles.layout}>
        <div className={styles.chat}>
          {chatList}
          {chatSender}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;
