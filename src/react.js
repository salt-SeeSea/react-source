import { Component} from './Component'
import { REACT_ELEMENT, REACT_FORWARD_REF, toVNode} from './utils';
export function createElement(type, props, ...children) {
  let resolvedChildren;
  if (arguments.length === 3) { 
    resolvedChildren = toVNode(arguments[2])
  }
  if (arguments.length > 3) { 
    resolvedChildren = children.map(child => toVNode(child))
  }
  const key = props.key;
  ['key', '__self', '__source'].forEach(key => { 
    delete props[key]

  })
  props.children = resolvedChildren

  return {
    $$typeof: REACT_ELEMENT,
    props,
    type,
    key,
    ref: props.ref
  }
}
export function createRef() { 
  return {
    current: null
  }
}

export function forwardRef(render) { 
  return {
    $$typeof: REACT_FORWARD_REF,
    render
  }
}
const React = {
  createElement,
  Component,
  createRef,
  forwardRef
}
 export default React