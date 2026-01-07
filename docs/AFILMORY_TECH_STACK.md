# Afilmory 技术栈完全解析

## 🎯 核心技术栈

### 地图相关
```json
{
  "maplibre-gl": "^5.15.0",           // ✅ 我们也用
  "react-map-gl": "^8.1.0",           // ✅ 我们也用
  "@maplibre/maplibre-gl-geocoder": "^1.9.4"  // ❌ 我们未用（地理编码）
}
```

### UI 框架
```json
{
  "react": "19.2.3",                  // ✅ 我们用 19.1.0
  "react-dom": "19.2.3",              // ✅ 我们用 19.1.0
  "motion": "12.23.26",               // ✅ 我们也用
  "react-router": "7.10.1",           // ⚠️ 我们用 Next.js
}
```

### 状态管理
```json
{
  "jotai": "2.16.0",                  // ❌ 我们未用
  "zustand": "5.0.9"                  // ❌ 我们未用
}
```

### UI 组件库
```json
{
  "@radix-ui/react-avatar": "1.1.11",
  "@radix-ui/react-dropdown-menu": "2.1.16",
  "@headlessui/react": "2.2.9"
}
```

## 📁 afilmory 的架构设计

### 1. MapProvider 模式（适配器模式）

```
src/modules/map/
├── MapProvider.tsx        # Context 提供者
├── MapLibreAdapter.tsx    # MapLibre 适配器
└── MapSection.tsx         # 主地图区域组件
```

**核心设计：**
- 使用 Context 提供地图实例
- 适配器模式支持多个地图引擎
- 解耦地图实现和业务逻辑

### 2. 组件结构

```
src/components/ui/map/
├── MapLibre.tsx              # 主地图组件
├── MapLibreStyle.json        # 完整的 2813 行样式定义
├── ClusterPhotoGrid.tsx      # 聚类照片网格
├── MapBackButton.tsx         # 返回按钮
├── MapInfoPanel.tsx          # 信息面板
├── MapLoadingState.tsx       # 加载状态
├── GenericMap.tsx            # 通用地图接口
└── shared/
    ├── ClusterMarker.tsx     # 聚类标记（带照片预览）
    ├── PhotoMarkerPin.tsx    # 单照片标记（HoverCard）
    ├── MapControls.tsx       # 地图控制（自定义）
    ├── GeoJsonLayer.tsx      # GeoJSON 图层
    ├── clustering.ts         # 聚类算法
    └── types.ts              # 类型定义
```

### 3. 聚类算法

**afilmory 实现：**
```typescript
export function clusterMarkers(markers: PhotoMarker[], zoom: number): ClusterPoint[] {
  // 1. 高缩放级别不聚类（zoom >= 15）
  if (zoom >= 15) return markers;
  
  // 2. 基于距离的简单聚类
  const threshold = Math.max(0.001, 0.01 / Math.pow(2, zoom - 10));
  
  // 3. 计算聚类中心（平均位置）
  // 4. 返回 GeoJSON Feature 格式
}
```

**我们的实现：**
```typescript
export function clusterMarkers(markers: PhotoMarker[], zoom: number): ClusteredMarker[] {
  // 基于精度的聚类（toFixed）
  const precision = getClusterPrecision(zoom);
  // zoom >= 15: precision = 4 (~11m)
  // zoom >= 12: precision = 3 (~111m)
  // ...
}
```

**对比：**
| 特性 | afilmory | 我们 |
|-----|---------|------|
| 算法 | 距离计算 | 精度截断 |
| 性能 | O(n²) | O(n) |
| 输出格式 | GeoJSON Feature | 自定义对象 |

## 🎨 UI 设计差异

### 1. 标记样式

**afilmory ClusterMarker:**
- 🔲 动态大小：`Math.min(64, Math.max(40, 32 + Math.log(pointCount) * 8))`
- 🖼️ 照片马赛克预览（最多4张）
- 🎨 玻璃态效果（backdrop-blur-md）
- ✨ 脉冲动画提示
- 📱 HoverCard 展示照片网格

**我们的实现：**
- ⭕ 固定大小：单点40px，聚类46px
- 🎨 渐变色区分（紫色/粉红）
- ✨ 悬停放大动画
- 📱 Popup 展示照片列表

### 2. 地图控制

**afilmory：**
- 自定义控制按钮（左下角）
- 玻璃态设计
- 使用 `useMap()` hook 控制
- 包括：缩放、指南针、定位

**我们：**
- MapLibre 内置控制
- NavigationControl + GeolocateControl + FullscreenControl
- 右上角位置

### 3. PhotoMarkerPin（afilmory独有）

```typescript
<PhotoMarkerPin 
  marker={marker}
  isSelected={isSelected}
  onClick={handleClick}
  onClose={handleClose}
/>
```

**特点：**
- 📷 相机图标
- 🖼️ 照片缩略图背景（透明度40%）
- 🔵 选中状态脉冲环
- 📋 HoverCard 显示完整 EXIF 信息
- 🔗 点击跳转照片详情页
- ❌ 选中时显示关闭按钮

## 🔍 关键差异分析

### 1. 没有使用 Leaflet

**确认：** afilmory **完全不使用 Leaflet**
- 纯 MapLibre GL + react-map-gl
- 无 Leaflet 依赖

### 2. 样式定义方式

**afilmory：**
```typescript
// 2813 行完整 JSON
import BUILTIN_MAP_STYLE from './MapLibreStyle.json'
```

**我们：**
```typescript
// TypeScript 对象（~150 行）
export const darkMapStyle: MapStyle = { ... }
```

### 3. 状态管理

**afilmory：**
- Jotai (原子化状态)
- Zustand (照片数据)
- React Context (地图实例)

**我们：**
- React State
- URL SearchParams（部分）
- 无全局状态管理

### 4. 路由系统

**afilmory：**
- React Router 7
- `/explory` 页面路由
- URL 参数：`?photoId=xxx`

**我们：**
- Next.js App Router
- `/map` 页面路由
- 未实现 URL 状态

## ✅ 完全复刻需要实现的功能

### 高优先级（核心功能）

1. **ClusterMarker 照片预览**
   - [ ] 动态大小计算
   - [ ] 4张照片马赛克
   - [ ] HoverCard 照片网格
   - [ ] 玻璃态效果

2. **PhotoMarkerPin 单照片标记**
   - [ ] 相机图标设计
   - [ ] 照片背景预览
   - [ ] EXIF 信息展示
   - [ ] 选中状态管理

3. **自定义地图控制**
   - [ ] 左下角控制组
   - [ ] 玻璃态设计
   - [ ] useMap hook 集成

4. **URL 状态管理**
   - [ ] photoId 参数
   - [ ] 自动定位到选中照片
   - [ ] 浏览器前进后退支持

5. **完整样式文件**
   - [ ] 使用完整 JSON 定义
   - [ ] 所有图层详细配置

### 中优先级（体验优化）

6. **聚类算法优化**
   - [ ] 改为距离计算方式
   - [ ] 返回 GeoJSON Feature 格式

7. **动画效果**
   - [ ] 标记弹出动画（spring）
   - [ ] 悬停放大效果
   - [ ] 选中状态脉冲

8. **MapProvider 架构**
   - [ ] Context 提供者
   - [ ] 适配器模式
   - [ ] 支持多地图引擎

### 低优先级（扩展功能）

9. **地理编码**
   - [ ] 搜索框
   - [ ] 地址转坐标

10. **GeoJSON 支持**
    - [ ] 自定义图层
    - [ ] 区域高亮

## 📊 完整度对比

| 功能模块 | afilmory | 我们当前 | 完成度 |
|---------|---------|---------|-------|
| **核心地图** |
| MapLibre GL | ✅ | ✅ | 100% |
| 矢量瓦片 | ✅ | ✅ | 100% |
| 基础聚类 | ✅ | ✅ | 80% |
| **标记样式** |
| ClusterMarker | ✅ 照片预览 | ⚠️ 简单圆圈 | 40% |
| PhotoMarkerPin | ✅ 完整EXIF | ❌ 无 | 0% |
| 动态大小 | ✅ | ❌ | 0% |
| **交互功能** |
| HoverCard | ✅ | ❌ | 0% |
| 选中状态 | ✅ | ⚠️ 部分 | 50% |
| URL状态 | ✅ | ❌ | 0% |
| **地图控制** |
| 自定义控制 | ✅ | ❌ | 0% |
| 内置控制 | ⚠️ 无 | ✅ | 100% |
| **样式定义** |
| 完整JSON | ✅ 2813行 | ⚠️ 150行 | 30% |
| 自定义图层 | ✅ | ⚠️ 基础 | 40% |
| **架构设计** |
| MapProvider | ✅ | ❌ | 0% |
| 适配器模式 | ✅ | ❌ | 0% |

**总体完成度：约 45%**

## 🚀 下一步行动计划

### Phase 1: 核心功能复刻（1-2周）

1. **ClusterMarker 升级**
   - 照片马赛克预览
   - HoverCard 组件集成
   - 动态大小计算

2. **PhotoMarkerPin 实现**
   - 相机图标标记
   - EXIF 信息展示
   - 选中状态管理

3. **URL 状态管理**
   - Next.js SearchParams 集成
   - photoId 参数处理

### Phase 2: UI/UX 优化（1周）

4. **自定义地图控制**
   - 左下角控制组
   - 玻璃态设计

5. **动画效果**
   - Spring 动画
   - 脉冲效果

### Phase 3: 架构优化（可选）

6. **MapProvider 重构**
   - Context 架构
   - 适配器模式

7. **完整样式文件**
   - 完整 JSON 定义

## 📝 技术要点总结

### afilmory 的优势设计

1. ✅ **适配器模式** - 可扩展多地图引擎
2. ✅ **照片预览** - 直观的聚类展示
3. ✅ **HoverCard** - 优雅的信息展示
4. ✅ **URL 状态** - 可分享的定位
5. ✅ **完整样式** - 精细的地图样式控制

### 我们需要学习的

1. 📚 照片马赛克技术
2. 📚 HoverCard 交互设计
3. 📚 URL 状态同步
4. 📚 自定义地图控制实现
5. 📚 适配器模式架构

### 可以保持的

1. ✅ 矢量瓦片实现
2. ✅ MapLibre GL 集成
3. ✅ 基础聚类功能
4. ✅ Motion 动画库

---

**结论：** afilmory 使用的是 **MapLibre GL + react-map-gl**，完全没有 Leaflet。他们的实现更注重 UI/UX 细节和架构设计，我们需要学习他们的组件设计和交互模式。
