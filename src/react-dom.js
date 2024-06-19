import { REACT_ELEMENT, REACT_FORWARD_REF, REACT_TEXT } from './utils'
import { addEvent } from './event'
// const root = React.createRoot(document.getElementById('root'))
// root.render(JSX/React.createElement(type, props, ...children))

// 1. 将vNode创建为真实dom，2. 将创建的真实dom挂在在root上面
function render(vNode, root) { 
  mount(vNode, root)
}


function mount(vNode, containerDOM) { 
  if (!vNode) return
  const dom = createDOM(vNode)
  console.log('dom______', dom, vNode)
  containerDOM.appendChild(dom)
}

function createDOM(vNode) { 

  // 1. 创建元素 2. 处理属性 3. 处理子元素
  const { type, props, ref } = vNode

  let dom;
  if (type && type.$$typeof === REACT_FORWARD_REF) { 
    return getDOMByForwardRefFunction(vNode)
  }else if (typeof type === 'function' && vNode.$$typeof === REACT_ELEMENT && type.IS_CLASS_COMPONENT) { 
    return getDOMByClassComponent(vNode)
  }else if (typeof type === 'function' && vNode.$$typeof === REACT_ELEMENT) { 
    return getDOMFromFunctionComponent(vNode)
  } else if (vNode.$$typeof === REACT_TEXT) {
    dom = document.createTextNode(vNode.props.text)
   }else if (type === REACT_ELEMENT) {
    dom = document.createElement(props.text)
  }
  if (props && dom) { 
    const children = props.children
    setPropsForDOM(dom, props)
    if (typeof children === 'object') {
      mount(children, dom)
      children.parentVNode = vNode
    } else if (Array.isArray(children)) {
      children.forEach((child, index) => { 
        child.index = index
        child.parentVNode = vNode
        mount(child, dom)
      })
    }  
  }
  vNode.dom = dom;
  if (ref) { 
    ref.current = dom
  }
  return dom

}
function setPropsForDOM(dom, VNodeProps = {}) { 
  // 处理属性值，children、on事件、style、其他属性
  if (!dom) return 
  for (let key in VNodeProps) { 
    if (key === 'children') {
      continue
    } 
    if ((/^on[A-Z].*$/.test(key))) { 
      addEvent(dom, key.toLocaleLowerCase(), VNodeProps[key])
      continue
    }
    if (key === 'style') { 
      const styles = VNodeProps['style']
      Object.keys(styles).forEach((styleName) => {   
        dom.style[styleName] = styles[styleName]
      })
      continue  
    }
    dom[key] = VNodeProps[key]

  }
}
function getDOMFromFunctionComponent(VNode) { 
  const { type, props } = VNode
  const  renderVNode = type(props)
  if (!renderVNode) return null
  VNode.dom = createDOM(renderVNode)
  return VNode

}

function getDOMByClassComponent(VNode) { 
  const { type, props, ref } = VNode
  const instance = new type(props)
  const renderVNode = instance.render()
  if (ref) { 
    ref.current = instance
  }
  instance.oldVNode = renderVNode
  if (!renderVNode) return null
  renderVNode.dom = createDOM(renderVNode)
  return renderVNode.dom
}
function getDOMByForwardRefFunction(VNode) { 
  const { type, props, ref } = VNode
  const renderVNode = type.render(props, ref)
  if (!renderVNode) return null
  return createDOM(renderVNode)
}
export function updateDOMTreeByVNode(oldVNode, newVNode, parentNode) {
  // const parentNode = oldDOM.parentNode
  // 新节点、旧节点不存在
  // 新节点存在，旧节点不存在
  // 新节点不存在，旧节点存在
  // 新、旧节点都存在，类型不一样
  // 新、旧节点都存在，类型一样
  const typeMap = {
    NO_OPERATE: !oldVNode && !newVNode,
    ADD: !oldVNode && newVNode,
    DELETE: oldVNode && !newVNode,
    REPLACE: oldVNode && newVNode && oldVNode.type !== newVNode.type
  }
  const typeKey = Object.keys(typeMap).find(key => typeMap[key])
  switch (typeKey) { 
    case 'NO_OPERATE': { 
      break
    }
    case 'ADD': { 
      parentNode.appendChild(createDOM(newVNode))
      break
    }
    case 'DELETE': { 
      removeVNode(oldVNode)
      break
    }
    case 'REPLACE': {
      removeVNode(oldVNode)
      parentNode.appendChild(newVNode)
      break
      }
    default: { 
      // 深度dom，diff，
      deepDOMDiff(oldVNode, newVNode)
    }
  }
}
function removeVNode(VNode) { 
  const currentDOM = getDOMByVNode(VNode)
  if (currentDOM) { 
    currentDOM.remove()
  }
}
function deepDOMDiff(oldVNode, newVNode) { 

}

export function getDOMByVNode(VNode) { 
  if (!VNode) return null
  return VNode.dom || null
}

const ReactDOM = {
  render
}
export default ReactDOM