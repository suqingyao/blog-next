import { useEffect, useRef } from 'react'

/**
 * 自定义Hook：管理body滚动锁定
 * 使用data属性和直接样式操作，避免水合错误
 * @param isLocked - 是否锁定滚动
 */
export function useBodyScrollLock(isLocked: boolean) {
  const originalStylesRef = useRef<{
    overflow: string
    position: string
    top: string
    width: string
  } | null>(null)
  const scrollPositionRef = useRef<number>(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const body = document.body
    
    if (isLocked) {
      // 保存原始样式
      originalStylesRef.current = {
        overflow: body.style.overflow || '',
        position: body.style.position || '',
        top: body.style.top || '',
        width: body.style.width || ''
      }
      
      // 保存当前滚动位置
      scrollPositionRef.current = window.scrollY
      
      // 设置data属性用于CSS选择器
      body.setAttribute('data-scroll-locked', 'true')
      
      // 直接设置样式
      body.style.overflow = 'hidden'
      body.style.position = 'fixed'
      body.style.top = `-${scrollPositionRef.current}px`
      body.style.width = '100%'
    } else {
      // 移除data属性
      body.removeAttribute('data-scroll-locked')
      
      // 恢复原始样式
      if (originalStylesRef.current) {
        body.style.overflow = originalStylesRef.current.overflow
        body.style.position = originalStylesRef.current.position
        body.style.top = originalStylesRef.current.top
        body.style.width = originalStylesRef.current.width
      }
      
      // 恢复滚动位置，禁用平滑滚动避免动画
      window.scrollTo({
        top: scrollPositionRef.current,
        left: 0,
        behavior: 'instant'
      })
    }

    return () => {
      // 清理函数：确保组件卸载时恢复滚动
      if (isLocked) {
        body.removeAttribute('data-scroll-locked')
        
        if (originalStylesRef.current) {
          body.style.overflow = originalStylesRef.current.overflow
          body.style.position = originalStylesRef.current.position
          body.style.top = originalStylesRef.current.top
          body.style.width = originalStylesRef.current.width
        }
        
        window.scrollTo({
          top: scrollPositionRef.current,
          left: 0,
          behavior: 'instant'
        })
      }
    }
  }, [isLocked])
}