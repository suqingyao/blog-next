# 地图升级指南

## 为什么要升级到 MapLibre GL？

原来使用的 **Leaflet** 是基于 DOM 的栅格瓦片地图，存在以下问题：
- ❌ 缩放时会出现白块（瓦片加载延迟）
- ❌ 性能较差，尤其是在移动设备上
- ❌ 动画不够流畅
- ❌ 无法使用矢量瓦片

**MapLibre GL** 是基于 WebGL 的现代地图库：
- ✅ 使用矢量瓦片，缩放无白块
- ✅ GPU 加速，性能极佳
- ✅ 流畅的动画和过渡效果
- ✅ 支持 3D 地形和建筑
- ✅ 与 afilmory 使用相同的技术栈

## 安装依赖

```bash
pnpm add maplibre-gl react-map-gl
```

或者使用 npm/yarn：
```bash
npm install maplibre-gl react-map-gl
# 或
yarn add maplibre-gl react-map-gl
```

## 已完成的改进

### 1. 新组件
- ✅ `MapLibreMap.tsx` - 使用 MapLibre GL 的新地图组件
- ✅ 使用深色主题的 CartoDB 瓦片服务
- ✅ 自定义圆形标记（紫色渐变）
- ✅ 位置聚合功能

### 2. 样式更新
- ✅ 更新 `globals.css` 适配 MapLibre
- ✅ 优化 Popup 样式
- ✅ 深色模式支持

### 3. 性能优化
- ✅ WebGL 渲染，GPU 加速
- ✅ 矢量瓦片，无加载白块
- ✅ 平滑的缩放和平移

## 使用方法

安装完依赖后，直接访问 `/map` 页面即可看到新地图。

## 对比

| 特性 | Leaflet (旧) | MapLibre GL (新) |
|------|--------------|------------------|
| 渲染方式 | DOM | WebGL |
| 瓦片类型 | 栅格 | 矢量 |
| 缩放体验 | 有白块 | 无缝平滑 |
| 性能 | 一般 | 优秀 |
| 动画 | 较慢 | 流畅 |
| 3D 支持 | 否 | 是 |

## 如果安装失败

如果网络问题导致安装失败，可以尝试：

1. 使用淘宝镜像：
```bash
pnpm config set registry https://registry.npmmirror.com
pnpm add maplibre-gl react-map-gl
```

2. 或者使用代理：
```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
pnpm add maplibre-gl react-map-gl
```

## 参考

- [MapLibre GL 官方文档](https://maplibre.org/maplibre-gl-js/docs/)
- [react-map-gl 文档](https://visgl.github.io/react-map-gl/)
- [Afilmory 源码参考](https://github.com/Afilmory/Afilmory)
