export function Logger(module) {
  this.module = module
}

Logger.prototype.log = function (line) {
  console.log("[" + this.currentTimeStr() + "][" + this.module + "]" + line);
}


Logger.prototype.currentTimeStr = function () {
  let now = new Date(Date.now());
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hour = now.getHours();
  let min = now.getMinutes();
  let sec = now.getSeconds();
  let ms = now.getMilliseconds();
  return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec + ":" + ms;
}
