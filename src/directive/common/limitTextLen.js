/**
* v-limit-text-len="200" 文本内容限制长度
*/

export default {
  mounted(el, binding) {
    el.addEventListener('input', () => {
      const value = el.children[0]?.value || el.children[0]?.children[0]?.value;
      if(value){
        let len = 0,
          j = 0,
          result = "";
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 127 || value.charCodeAt(i) == 94) {
            len += 2;
            j++;
          } else {
            len++;
            j++;
          }
          if (len > Number(binding.value)) {
            result = value.substring(0, j - 1);
            if(el.children[0].value){
              el.children[0].value = result;
            }else{
              el.children[0].children[0].value = result;
            }
            break;
          }
        }
      }
    })
  }
}