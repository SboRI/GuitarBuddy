// @flow

const rotateArray = function (count: number) {
  var unshift = Array.prototype.unshift
  var splice = Array.prototype.splice

  return function<T> (array: T[]): T[] {
    let _array = [...array]
    var len = _array.length >>> 0
    count >>= 0

    unshift.apply(_array, splice.call(_array, count % len, len))
    return _array
  }
}

export default rotateArray
