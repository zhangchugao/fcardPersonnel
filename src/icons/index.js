/*
 * @Author: your name
 * @Date: 2020-06-06 13:50:35
 * @LastEditTime: 2020-06-06 14:24:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \FCARD一卡通WAPWeb\src\icons\index.js
 */ 
import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue' // svg组件

// register globally
Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)