export const REACT_TEXT = Symbol('react_text')
export const REACT_ELEMENT = Symbol('react.element')
export const REACT_FORWARD_REF = Symbol('react.forward_ref')
export function toVNode(node) {
  return typeof node === 'string' || typeof node === 'number' ? {
    type: REACT_TEXT,
    props: { text: node }
  } : node
}