/**
 * 简单的事件发射器类，用于实现事件监听和触发
 * 主要用于实现页面间、组件间的消息通信
 */
class EventEmitter {
  constructor() {
    // 事件监听器映射
    this._events = new Map();
  }

  /**
   * 监听事件
   * @param {string} event 事件名称
   * @param {Function} listener 事件监听函数
   * @returns {EventEmitter} 当前实例，支持链式调用
   */
  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('The listener must be a function');
    }

    if (!this._events.has(event)) {
      this._events.set(event, []);
    }

    this._events.get(event).push(listener);
    return this;
  }

  /**
   * 监听事件，但仅触发一次
   * @param {string} event 事件名称
   * @param {Function} listener 事件监听函数
   * @returns {EventEmitter} 当前实例，支持链式调用
   */
  once(event, listener) {
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener.apply(this, args);
    };
    
    onceWrapper.originalListener = listener;
    this.on(event, onceWrapper);
    return this;
  }

  /**
   * 移除事件监听
   * @param {string} event 事件名称
   * @param {Function} listener 事件监听函数
   * @returns {EventEmitter} 当前实例，支持链式调用
   */
  off(event, listener) {
    if (!this._events.has(event)) {
      return this;
    }

    if (!listener) {
      this._events.delete(event);
      return this;
    }

    const listeners = this._events.get(event);
    for (let i = 0; i < listeners.length; i++) {
      const currentListener = listeners[i];
      
      // 检查是否是原始的监听函数或包装过的once函数
      if (currentListener === listener || 
         (currentListener.originalListener && currentListener.originalListener === listener)) {
        listeners.splice(i, 1);
        i--;
      }
    }

    // 如果没有更多监听器，则移除整个事件
    if (listeners.length === 0) {
      this._events.delete(event);
    }

    return this;
  }

  /**
   * 触发事件
   * @param {string} event 事件名称
   * @param  {...any} args 传递给监听器的参数
   * @returns {boolean} 是否有监听器处理了此事件
   */
  emit(event, ...args) {
    if (!this._events.has(event)) {
      return false;
    }

    const listeners = this._events.get(event).slice(); // 创建副本，避免回调中的事件注册或移除影响遍历
    for (const listener of listeners) {
      try {
        listener.apply(this, args);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    }

    return true;
  }

  /**
   * 获取事件的所有监听器
   * @param {string} event 事件名称
   * @returns {Function[]} 监听器数组
   */
  listeners(event) {
    return this._events.has(event) ? [...this._events.get(event)] : [];
  }

  /**
   * 移除所有事件监听
   * @returns {EventEmitter} 当前实例，支持链式调用
   */
  removeAllListeners() {
    this._events.clear();
    return this;
  }
}

module.exports = EventEmitter; 