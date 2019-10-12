class userDataUtil{
    constructor(){
        this.userData=null
    }
    get(){
        var userData= JSON.parse(localStorage.getItem("loginUser"));
        if(userData){
            userData.isJkUser=userData.accountType===4; //判断是否是监控客户
            userData.isTopUser=userData.cuserId === userData.userId //判断是否是总账号
        }
        this.userData=userData
        return userData
    }
}
export default new userDataUtil();