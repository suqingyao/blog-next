# macOS Tahoe (Concept) 设计系统规范

基于 **VisionOS 空间设计语言** 融合的下一代 macOS 概念风格。

核心理念：**Spatial（空间感）** • **Immersion（沉浸感）** • **Radiance（光感）**

---

## 💎 核心材质系统 (Material System)

Tahoe 风格的核心不再是简单的"模糊"，而是**"晶体感"**。通过混合模糊、饱和度提升、内发光和噪点来模拟真实玻璃质感。

### Glass Materials (玻璃材质)

```css
/* Base Glass - 基础玻璃（用于窗口背景） */
--material-glass-base: rgba(255, 255, 255, 0.65);
--material-glass-base-dark: rgba(30, 30, 30, 0.60);

/* Overlay Glass - 悬浮玻璃（用于卡片/面板） */
--material-glass-overlay: rgba(255, 255, 255, 0.75);
--material-glass-overlay-dark: rgba(45, 45, 45, 0.70);

/* Heavy Glass - 厚玻璃（用于侧边栏/Dock） */
--material-glass-heavy: rgba(245, 245, 245, 0.85);
--material-glass-heavy-dark: rgba(20, 20, 20, 0.85);
```

### Optical Effects (光学效果)

Tahoe 风格的关键在于**边缘高光**（模拟光线穿过玻璃边缘）。

```css
/* 玻璃边缘高光 - 替代传统边框 */
.glass-edge {
  box-shadow: 
    inset 0 0 0 1px rgba(255, 255, 255, 0.4), /* 内发光 */
    0 0 0 1px rgba(0, 0, 0, 0.05);            /* 外轮廓 */
}

/* Dark Mode 边缘 */
.glass-edge-dark {
  box-shadow: 
    inset 0 0 0 1px rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.2);
}

/* 混合模式滤镜 */
.glass-filter {
  backdrop-filter: blur(50px) saturate(200%) brightness(1.1);
  -webkit-backdrop-filter: blur(50px) saturate(200%) brightness(1.1);
}
```

---\n
## 📐 空间布局 (Spatial Layout)

Tahoe 风格抛弃了紧贴边缘的布局，全面转向**"岛式悬浮" (Floating Island)** 设计。

### Floating Windows (悬浮窗口)

所有主内容区域都应该"悬浮"在背景之上，留出更大的边距。

```css
/* 页面容器 */
.page-container {
  padding: 20px; /* 更大的外边距 */
  background: transparent; /* 背景透出 */
}

/* 悬浮岛 */
.floating-island {
  border-radius: 24px; /* 更大的圆角 */
  background: var(--material-glass-base);
  backdrop-filter: blur(50px);
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.15), /* 深度阴影 */
    0 0 0 1px rgba(255, 255, 255, 0.4) inset; /* 边缘光 */
}
```

### Z-Axis Depth (Z轴深度)

定义明确的 Z 轴层级，层级越高，材质越透，阴影越深。

- **Level 0**: 壁纸/桌面
- **Level 1**: 应用程序窗口 (Base Glass)
- **Level 2**: 侧边栏/导航 (Heavy Glass)
- **Level 3**: 悬浮卡片/列表项 (Overlay Glass)
- **Level 4**: 弹出层/模态框 (Luminous Glass)

---

## 🔲 圆角与形态 (Geometry)

Tahoe 风格使用**超椭圆 (Superellipse)** 和更大的圆角半径，手感更加圆润。

```css
/* 圆角系统 - 整体加大 */
--radius-xs: 6px;    /* 标签 */
--radius-sm: 10px;   /* 按钮 */
--radius-md: 16px;   /* 小卡片 */
--radius-lg: 20px;   /* 侧边栏/面板 */
--radius-xl: 24px;   /* 窗口/主区域 */
--radius-2xl: 32px;  /* 独立浮层 */
--radius-full: 9999px;

/* 按钮形态 */
.tahoe-button {
  border-radius: 9999px; /* 全圆角按钮回归 */
  padding: 8px 20px;
}
```

---

## 🎨 动态色彩 (Vibrant Colors)

受 visionOS 启发，强调色不再是平涂，而是带有**渐变**和**辉光**。

### Glowing Gradients (发光渐变)

```css
/* 蓝色光感 */
--glow-blue: linear-gradient(135deg, rgba(0, 122, 255, 0.8), rgba(0, 198, 255, 0.8));
--glow-shadow-blue: 0 8px 20px rgba(0, 122, 255, 0.3);

/* 选中状态 */
.item-selected {
  background: rgba(255, 255, 255, 0.2); /* 更亮的选中态 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
}
```

---

## 🧩 Tahoe 组件库 (Component Library)

### 1. The Glass Container (晶体容器)

替代普通的 `div` 或 `card`，这是 Tahoe 风格的基础构建块。

```tsx
<div className="
  relative overflow-hidden
  rounded-[24px]
  bg-white/60 dark:bg-black/40
  backdrop-blur-[50px] backdrop-saturate-[180%]
  shadow-[0_20px_40px_rgba(0,0,0,0.12)]
  border border-white/40 dark:border-white/10
  group
">
  {/* 内部高光层 */}
  <div className="absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/40 pointer-events-none" />
  {children}
</div>
```

### 2. Floating Sidebar (悬浮侧边栏)

侧边栏不再贴边，而是作为一个悬浮在左侧的胶囊。

```css
.sidebar-floating {
  position: fixed;
  left: 16px;
  top: 16px;
  bottom: 16px;
  width: 260px;
  
  border-radius: 20px;
  background: rgba(245, 245, 245, 0.75);
  backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
```

### 3. Spatial Button (空间感按钮)

按钮具有微弱的厚度感和光泽。

```css
.button-spatial {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.05),
    0 1px 0 rgba(255, 255, 255, 0.5) inset; /* 顶部高光 */
  border-radius: 999px;
  
  transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}

.button-spatial:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.8) inset;
}
```

---

## 🌓 Dark Mode 特化 (Luminous Dark)

Tahoe 的深色模式不是纯黑，而是**"发光的黑"**。

- **背景**: 不使用 `#000000`，使用深灰色 `rgba(20, 20, 20, 0.8)` 叠加模糊。
- **文字**: 使用高亮白 `rgba(255, 255, 255, 0.95)` 并带微弱发光 `text-shadow`。
- **高光**: 边缘高光在深色模式下更加明显（白色的 10-15% 透明度）。

```css
.dark-mode-surface {
  background: linear-gradient(
    145deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.03) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.4);
}
```

---

## 🎬 动画 (Spatial Motion)

动画强调**物理属性**和**空间滞后**。

### Fluid Spring (流体弹性)

```css
/* 更加柔和、带有惯性的动画 */
--ease-tahoe: cubic-bezier(0.2, 0.8, 0.2, 1);
--duration-tahoe: 400ms;
```

### Parallax Hover (视差悬浮)

卡片内部元素在悬浮时产生轻微的视差移动。

```css
.card:hover .card-content {
  transform: translateY(-4px);
  transition-delay: 0.05s;
}

.card:hover .card-bg {
  transform: scale(1.05);
}
```

---

## 📱 Tailwind v4 配置扩充

```javascript
// tailwind.config.ts 补充配置
export default {
  theme: {
    extend: {
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glow': '0 0 20px rgba(255, 255, 255, 0.3)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
      },
    }
  }
}
```

---

**创建日期**：2026-01-13  
**适用风格**：macOS Tahoe (Concept) / VisionOS Inspired  
**版本**：2.0 (Tahoe Edition)
