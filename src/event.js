import { updateQueue, flushUpdaterQueue } from "./Component"
export function addEvent(DOM, eventName, bindFunction) { 
  DOM.attach = DOM.attach || {}
  DOM.attach[eventName] = bindFunction
  // 事件合成机制：将事件绑定在document上
  if (document[eventName]) return
  // 给事件绑定在document上
  document[eventName] = dispatchEvent
}

function dispatchEvent(nativeEvent) {
  // debugger
  updateQueue.isBatch = true
  // 事件合成机制：屏蔽浏览器之间的事件差异
  const syntheticEvent = createSyntheticEvent(nativeEvent)
  let target = nativeEvent.target
  while (target) { 
    syntheticEvent.currentTarget = target
    const eventName = `on${nativeEvent.type}`
    const bindFunction = target.attach && target.attach[eventName]
    bindFunction && bindFunction(syntheticEvent)
    if (!this.isPropagationStopped) { 
      syntheticEvent.stopPropagation()
    }
    target = target.parentNode
  }
  
  flushUpdaterQueue()
}

function createSyntheticEvent(nativeEvent) { 
  let nativeEventKeyValues = {}
  for (const key in nativeEvent) { 
    nativeEventKeyValues[key] = typeof nativeEvent[key] === 'function' ? nativeEvent[key].bind(nativeEvent
    ) : nativeEvent[key]
  }
  const syntheticEvent = Object.assign(nativeEventKeyValues, {
    nativeEvent,
    isDefaultPrevented: false,
    isPropagationStopped: false,
    preventDefault() { 
      this.isDefaultPrevented = true
      if (this.nativeEvent.preventDefault) {
        this.nativeEvent.preventDefault()
      } else { 
        this.nativeEvent.returnValue = false
      }
    },
    stopPropagation() { 
      this.isPropagationStopped = true
      if (this.nativeEvent.stopPropagation) {
        this.nativeEvent.stopPropagation()
      } else { 
        this.nativeEvent.cancelBubble = true
      }
    }
  })
  return syntheticEvent
}
