console.log("这里有没有导入呢")

export function expensive(time) {
    console.log("进入worker方法卡拉----")
    let start = Date.now(),
        count = 0
    while (Date.now() - start < time) count++
    return count
}