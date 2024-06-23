
import { getDOMByVNode, updateDOMTreeByVNode } from './react-dom'
export let updateQueue = {
  isBatch: false,
  updaters: new Set()
}
export function flushUpdaterQueue() {
  // debugger
  updateQueue.isBatch = false
  for (let updater of updateQueue.updaters) { 
    updater.launchUpdate()
  }
  updateQueue.updaters.clear()
}
class Updater { 
  constructor(ClassComponentInstance) { 
    this.ClassComponentInstance = ClassComponentInstance
    this.pendingStates = []
  }
  addState(partialState) { 
    this.pendingStates.push(partialState)
    this.preHandleForUpdate()
  }
  preHandleForUpdate() { 
    if (updateQueue.isBatch) {
      updateQueue.updaters.add(this)
    } else { 
      this.launchUpdate()
    }
    
  }
  launchUpdate() { 
    const { ClassComponentInstance, pendingStates } = this
    if (pendingStates.length === 0) { 
      return
    }
    const state = pendingStates.reduce((preStates, curState) => {
      return {...preStates, ...curState}
     }, ClassComponentInstance.state)
    ClassComponentInstance.state = state
    // 快速使数组为空数组
    this.pendingStates.length = 0
    ClassComponentInstance.update()
  }

}
export class Component { 
  static IS_CLASS_COMPONENT = true
  constructor(props) { 
    this.updater = new Updater(this)
    this.props = props
    this.state = {}
  }
  setState(partialState) { 
    // 合并属性
    this.updater.addState(partialState)
    // 重新渲染更新
    this.updater.preHandleForUpdate()


  }
  update() { 
    // 1. 获取重新执行render函数后的新虚拟dom
    // 2. 根据新的虚拟dom创建真实dom
    // 3. 将真实dom挂载到页面上
    // debugger
    const oldVNode = this.oldVNode
    const newVNode = this.render()
    const oldDOM = getDOMByVNode(oldVNode)
    // todo： 调用新的updateDOMTreeByVNode：
    updateDOMTreeByVNode(oldDOM, newVNode, oldVNode.parentVNode.dom)
    this.oldVNode = newVNode
  }
}