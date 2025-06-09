export const MindMapSchema = {
  type: "mind-map",
  data: {
    name: "剪映视频剪辑指南",
    children: [
      {
        name: "基础操作",
        children: [
          {
            name: "项目创建",
            children: [
              { name: "新建项目" },
              { name: "选择比例" },
              { name: "导入素材" },
            ],
          },
          {
            name: "时间轴操作",
            children: [
              { name: "拖拽排序" },
              { name: "缩放时间轴" },
              { name: "分割素材" },
            ],
          },
          {
            name: "剪辑工具",
            children: [
              { name: "剪切" },
              { name: "复制" },
              { name: "删除" },
              { name: "替换" },
            ],
          },
        ],
      },
      {
        name: "进阶剪辑",
        children: [
          {
            name: "转场效果",
            children: [
              { name: "基础转场" },
              { name: "运镜转场" },
              { name: "特效转场" },
            ],
          },
          {
            name: "调色调光",
            children: [
              { name: "亮度对比度" },
              { name: "色彩平衡" },
              { name: "滤镜应用" },
            ],
          },
          {
            name: "关键帧动画",
            children: [
              { name: "位置动画" },
              { name: "缩放动画" },
              { name: "透明度动画" },
            ],
          },
        ],
      },
      {
        name: "特效素材",
        children: [
          {
            name: "视觉特效",
            children: [
              { name: "粒子特效" },
              { name: "光效" },
              { name: "变形特效" },
            ],
          },
          {
            name: "贴纸素材",
            children: [
              { name: "文字贴纸" },
              { name: "表情贴纸" },
              { name: "装饰贴纸" },
            ],
          },
          {
            name: "模板套用",
            children: [
              { name: "卡点模板" },
              { name: "文字动画" },
              { name: "片头片尾" },
            ],
          },
        ],
      },
      {
        name: "音频处理",
        children: [
          {
            name: "音乐配音",
            children: [
              { name: "背景音乐" },
              { name: "音效添加" },
              { name: "录音功能" },
            ],
          },
          {
            name: "音频调节",
            children: [
              { name: "音量调节" },
              { name: "淡入淡出" },
              { name: "音频同步" },
            ],
          },
          {
            name: "语音功能",
            children: [
              { name: "文字转语音" },
              { name: "语音识别" },
              { name: "字幕自动生成" },
            ],
          },
        ],
      },
      {
        name: "文字字幕",
        children: [
          {
            name: "字幕制作",
            children: [
              { name: "手动添加" },
              { name: "自动识别" },
              { name: "字幕样式" },
            ],
          },
          {
            name: "文字动效",
            children: [
              { name: "打字机效果" },
              { name: "弹幕样式" },
              { name: "文字动画" },
            ],
          },
        ],
      },
      {
        name: "导出分享",
        children: [
          {
            name: "导出设置",
            children: [
              { name: "分辨率选择" },
              { name: "帧率设置" },
              { name: "画质调节" },
            ],
          },
          {
            name: "平台适配",
            children: [
              { name: "抖音格式" },
              { name: "微信朋友圈" },
              { name: "其他平台" },
            ],
          },
        ],
      },
    ],
  },
  width: 1000,
  height: 600,
  source: "mcp-server-chart",
};

export const FlowDiagramSchema = {
  type: "network-graph",
  data: {
    nodes: [
      {
        name: "Agent",
      },
      {
        name: "File",
      },
      {
        name: "KnowledgeBaseItem",
      },
      {
        name: "KnowledgeBase",
      },
      {
        name: "Model",
      },
      {
        name: "Provider",
      },
      {
        name: "Permission",
      },
      {
        name: "Role",
      },
      {
        name: "Setting",
      },
      {
        name: "Token",
      },
      {
        name: "User",
      },
      {
        name: "MinApp",
      },
    ],
    edges: [
      {
        source: "KnowledgeBaseItem",
        target: "File",
        name: "file",
      },
      {
        source: "KnowledgeBaseItem",
        target: "KnowledgeBase",
        name: "knowledgeBase",
      },
      {
        source: "KnowledgeBase",
        target: "Model",
        name: "model",
      },
      {
        source: "KnowledgeBase",
        target: "Model",
        name: "rerank_model",
      },
      {
        source: "Model",
        target: "Provider",
        name: "provider",
      },
      {
        source: "User",
        target: "Role",
        name: "roles",
      },
      {
        source: "User",
        target: "Token",
        name: "token",
      },
      {
        source: "Role",
        target: "Permission",
        name: "permissions",
      },
      {
        source: "MinApp",
        target: "File",
        name: "file",
      },
    ],
  },
  theme: "default",
  width: 800,
  height: 600,
  source: "mcp-server-chart",
};
