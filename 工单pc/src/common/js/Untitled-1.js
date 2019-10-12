// {
//     year2018:[
//        m12:{
//            d28:[
//                 {groupName: "20181229",groupId:5}
//            ],
//        }
//     ]
// }

// [
//     {
//          parentId:201812,groupName: "20181229",groupId:5
//     },
//     {
//           parentId:2018,id:201812, groupName: "201812",
//     },
//     {
//         parentId:-1,id:2018,groupName: "2018",
//     }
// ]




var data=[
    {groupName: "20180829",groupId:5},
    {groupName: "20181229",groupId:4},
    {groupName: "20181228",groupId:1},
    {groupName: "20181128",groupId:1},
]

function toTreeData(data){
    var result=[];
    var resultKeys={};
    data.map(item=>{
        var yearKey=item.groupName.substring(0,4);
        var monthKey=item.groupName.substring(0,6);
        var daykey=item.groupName;
    
        if(!resultKeys[yearKey]){
            result.push({
                id:yearKey,
                parentId:-1,
                title:yearKey+"年"
            });
            // resultKeys[yearKey]=true
        }
        if(!resultKeys[monthKey]){
            result.push({
                id:monthKey,
                parentId:yearKey,
                title:monthKey+"月"
            });
            // resultKeys[monthKey]=true
        }
        result.push({
            id:daykey,
            parentId:monthKey,
            title:daykey+"日"
        })   
    });
    return result
};