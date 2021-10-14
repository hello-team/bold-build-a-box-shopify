import ReactDOM from "react-dom"
import React from "react"
import Collection from './Bold-Box/Components/Collection'
const rootEl = document.getElementById("bold-box-kit")
console.log('hello')
rootEl && ReactDOM.render(<Collection />, rootEl)