import copyText from './common/copyText'
import onlyAlphanumeric from './common/onlyAlphanumeric'
import numberInput from './common/numberInput'
import limitTextLen from './common/limitTextLen'


export default function directive(app){
  app.directive('copyText', copyText)
  app.directive('only-alphanumeric', onlyAlphanumeric)
  app.directive('numberInput', numberInput)
  app.directive('limit-text-len', limitTextLen)
}