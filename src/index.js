// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
import React from './react';
import ReactDOM from './react-dom'

// const root = ReactDOM.createRoot(document.getElementById('root'));
console.log(<div key="key1" aProp="属性">hellow</div>)
// 函数组件
function MyFunctionComponent() { 
  return <div key="key1" aProp="属性" style={{color: 'red'}}>hellow</div>
}
// 类组件
class MyClassComponent extends React.Component { 
  constructor(props) {
    super(props)
    this.state = {
      count: '0'
    }
   }
  render() { 
    return <div style={{ color: 'red', border: '1px solid black', backgroundColor: 'pink', width: '200px', textAlign: 'center' }}
      onClick={() => { 
      // debugger
      console.log('onClick________________-_______', this.state.count)
      
        const newState = `${+this.state.count+1}`
        this.setState({
          count: newState + ''
        })
      console.log(newState)
      
    }}>{ this.state.count}</div>
  }
}
ReactDOM.render(<MyClassComponent xxx="as" />, document.getElementById('root'))
// console.log(createElement('div', {
  // aProp: '属性',
  // children: 'hellow'
// }, 'key1'))
// debugger
// root.render(createElement('div', {
//   aProp: '属性',
//   children: 'hellow'
// }, 'key1'));


