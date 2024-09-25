<!--
 * @version:                
 * @Author: yang
 * @explain: 系统日志时间组件
 * @Date: 2020-12-31 11:02:04
 * @LastEditTime: 2020-12-31 11:02:04
 * @LastEditors: yang
-->
<script>
import { DatePicker, DatePickerOptions } from 'element-ui'
import { calendarShortcuts } from '@/utils/shortcuts'
export default {
  name: 'DateRangePicker',
  mixins: [DatePicker],
  props: {
    type: {
      type: String,
      default: 'daterange'
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    defaultTime: {
      type: Array,
      default: _ => ['00:00:00', '23:59:59']
    },
    pickerOptions: {
      type: DatePickerOptions,
      default: _ => {
        return { shortcuts: calendarShortcuts }
      }
    },
    size: {
      type: String,
      default: 'small'
    },
    rangeSeparator: {
      type: String,
      default: ':'
    },
    startPlaceholder: {
      type: String,
      default: '开始日期'
    },
    endPlaceholder: {
      type: String,
      default: '结束日期'
    }
  }
}
</script>
