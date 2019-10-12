import worker from 'workerize-loader!./worker2.js'
// import getAddress from "./getAddress";
// let worker = workerize(`
//     export function testWorker(a){
//         console.log("这里会不会打印呢",a)
//         return "test返回的"+a
//     }
//     export function getAddress
// `)
// export default worker
console.log(worker,"wwww-------------")
let instance =new  worker()  
setTimeout(()=>{
    instance.expensive(1000).then( count => {
        console.log(`Ran ${count} loops`)
    })
},2000)
export default instance;