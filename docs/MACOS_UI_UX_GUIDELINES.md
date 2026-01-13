# macOS Tahoe (Concept) UI/UX 最佳实践指南

基于 **VisionOS 融合风格** 的下一代 macOS 概念设计实战指南。

核心特征：**Spatial（空间感）** • **Floating（悬浮感）** • **Immersion（沉浸感）**

---

## 📋 目录

1. [核心视觉特征](#核心视觉特征)
2. [组件实战规范](#组件实战规范)
3. [交互与动效](#交互与动效)
4. [深色模式特化](#深色模式特化)
5. [常见误区](#常见误区)
6. [交付检查清单](#交付检查清单)

---

## 💎 核心视觉特征

### 1. 晶体玻璃质感 (Crystal Glass)

区别于传统的平面磨砂玻璃，Tahoe 风格强调**厚度感**和**边缘光**。

#### ❌ 传统平面玻璃
```css
/* 旧风格：平淡，无厚度 */
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
}
```

#### ✅ Tahoe 晶体玻璃
```tsx
/* 新风格：透亮，带内发光和边缘光 */
<div className="
  bg-white/60 dark:bg-black/40             /* 基底更透 */
  backdrop-blur-[50px] backdrop-saturate-[180%] /* 模糊度更高，色彩更鲜艳 */
  rounded-[24px]                           /* 超大圆角 */
  border border-white/40 dark:border-white/10   /* 物理边缘 */
  shadow-[0_20px_40px_rgba(0,0,0,0.12)]    /* 深度阴影 */
  ring-1 ring-white/40 ring-inset          /* 内发光高光 */
">
</div>
```

### 2. 岛式悬浮布局 (Floating Islands)

抛弃贴边布局，所有面板都应该是悬浮在壁纸之上的“岛屿”。

#### ❌ 贴边侧边栏
```tsx
/* 旧风格：直角，贴边 */
<aside className="fixed left-0 top-0 h-full border-r border-gray-200">
```

#### ✅ 悬浮胶囊侧边栏
```tsx
/* 新风格：全圆角，四周留白 */
<aside className="
  fixed left-4 top-4 bottom-4 w-[260px]
  rounded-[20px]
  bg-white/70 dark:bg-gray-900/60
  backdrop-blur-2xl
  border border-white/20
  shadow-xl
">
```

---

## 🧩 组件实战规范

### 1. 空间感卡片 (Spatial Card)

卡片不再是简单的矩形，而是具有微弱凸起感的光学切片。

```tsx
export function TahoeCard({ children, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="
        group relative
        rounded-[24px]
        bg-gradient-to-br from-white/80 to-white/40 
        dark:from-white/10 dark:to-white/5
        backdrop-blur-[40px]
        border border-white/50 dark:border-white/10
        shadow-lg hover:shadow-2xl
        transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
        hover:scale-[1.02] hover:-translate-y-1
        cursor-pointer
      "
    >
      {/* 顶部高光条 (Specular Highlight) */}
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-50" />
      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
```

### 2. 沉浸式按钮 (Immersion Button)

按钮回归全圆角，且带有类似于宝石的质感。

```tsx
export function TahoeButton({ children, primary }) {
  if (primary) {
    return (
      <button className="
        relative overflow-hidden
        px-6 py-2.5
        rounded-full
        bg-black/80 dark:bg-white/90
        text-white dark:text-black
        font-medium
        shadow-lg shadow-black/20 dark:shadow-white/20
        transition-transform active:scale-95
        hover:bg-black dark:hover:bg-white
      ">
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
  
  return (
    <button className="
      px-6 py-2.5
      rounded-full
      bg-white/50 dark:bg-white/10
      hover:bg-white/80 dark:hover:bg-white/20
      text-gray-900 dark:text-white
      backdrop-blur-md
      border border-white/20
      shadow-sm
      transition-all
    ">
      {children}
    </button>
  );
}
```

### 3. 悬浮导航坞 (Floating Dock)

类似于 macOS Dock 或 visionOS 的底部操作栏。

```tsx
export function TahoeDock({ items }) {
  return (
    <nav className="
      fixed bottom-6 left-1/2 -translate-x-1/2
      flex items-center gap-2
      p-2
      rounded-full
      bg-white/40 dark:bg-black/40
      backdrop-blur-[60px]
      border border-white/30 dark:border-white/10
      shadow-[0_20px_60px_rgba(0,0,0,0.2)]
      ring-1 ring-white/20
    ">
      {items.map(item => (
        <button className="
          p-3 rounded-full
          hover:bg-white/50 dark:hover:bg-white/20
          transition-colors
          active:scale-90
        ">
          {item.icon}
        </button>
      ))}
    </nav>
  );
}
```

---

## 🎬 交互与动效

Tahoe 风格的动效强调**物理惯性**和**空间滞后**。

### 1. 视差悬浮 (Parallax Hover)

不仅是放大，还要产生 Z 轴上的位移感。

```css
.tahoe-hover {
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), 
              box-shadow 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.tahoe-hover:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2);
}
```

### 2. 弹性点击 (Spring Press)

```css
.tahoe-press:active {
  transform: scale(0.94);
  transition: transform 0.1s ease-out; /* 按下要快 */
}
```

---

## 🌓 深色模式特化

Tahoe 的深色模式不是简单的“变黑”，而是**“幽光”**。

### 1. 避免纯黑
背景使用深灰+噪点，而不是 `#000000`。
```css
.bg-tahoe-dark {
  background-color: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(50px);
}
```

### 2. 强化边缘光
在深色模式下，物体的轮廓光（Rim Light）需要更亮，以区分层级。
```css
.border-tahoe-dark {
  border: 1px solid rgba(255, 255, 255, 0.15); /* 比浅色模式更明显的边框 */
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05); /* 内发光 */
}
```

---

## ❌ 常见误区

### 1. 模糊度太低
**错误**：`backdrop-filter: blur(10px)` —— 看起来像脏玻璃。
**正确**：`backdrop-filter: blur(40px)` 或更高 —— 看起来像磨砂晶体。

### 2. 阴影太生硬
**错误**：黑色高透明度阴影 `rgba(0,0,0,0.5)`。
**正确**：大扩散、低透明度的彩色阴影或多层阴影。

### 3. 边距太小
**错误**：元素紧贴容器边缘。
**正确**：Tahoe 风格需要大量的呼吸空间，内边距通常在 `24px` 或 `32px`。

---

## ✅ 交付检查清单

- [ ] **圆角检查**：是否使用了大圆角（20px+）？
- [ ] **透光检查**：背景是否使用了 `backdrop-blur` 且能隐约透出底层颜色？
- [ ] **边缘检查**：是否添加了 1px 的半透明边框（border-white/xx）来模拟厚度？
- [ ] **悬浮检查**：侧边栏和主内容是否与其容器边缘有间距（Floating）？
- [ ] **光感检查**：深色模式下边缘是否有微弱的高光？
- [ ] **动效检查**：悬停时是否有优雅的放大和上浮效果？

---

**创建日期**：2026-01-13  
**适用风格**：macOS Tahoe (Concept)  
**配套文档**：请结合 `docs/MACOS_DESIGN_SYSTEM.md` 使用
