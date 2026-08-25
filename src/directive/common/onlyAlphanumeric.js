/**
* v-only-alphanumeric el-input 只能输入数字和字母
*/
export default {
  mounted(el, binding, vnode) {
    el.addEventListener('input', function (e) {
      const filteredValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
      if (filteredValue !== e.target.value) {
        e.target.value = filteredValue
      }
    })
  }
}