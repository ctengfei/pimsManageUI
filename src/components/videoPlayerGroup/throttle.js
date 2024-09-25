export const throttle = function (fn, delay) {
  let timer = null
  return function () {
    
    var ctx = this
    clearTimeout(timer)
    timer = setTimeout(function() {
      fn.apply(ctx)
    }, delay)
  }
}