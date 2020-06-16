import request from '../utils/axios';
// console.log(request)
function setparam(data){
    var parmass1 = new URLSearchParams()
    for (var i in data) {
        parmass1.append(i, data[i]);
    }
    return parmass1
}



export function PersonalDoorGetDoorList(param) { //考勤打卡报表
    return request({
        url: '/WebAPI/PersonalDoor/GetDoorList',
        method: 'post',
        data:setparam(param)
    })
}

export function PersonalDoorGetDoorRecord(param) { //考勤打卡报表
    return request({
        url: '/WebAPI/PersonalDoor/GetDoorRecord',
        method: 'post',
        data:setparam(param)
    })
}

export function PersonalDoorAsyncOpenDoor(param) { //考勤打卡报表
    return request({
        url: '/WebAPI/PersonalDoorAsync/OpenDoor',
        method: 'post',
        data:setparam(param)
    })
}

export function PersonalVisitorGetAccessGroup(param) { //考勤打卡报表
    return request({
        url: '/WebAPI/PersonalVisitor/GetAccessGroup',
        method: 'post',
        data:setparam(param)
    })
}
export function PersonalVisitorAddVisitor(param) { //考勤打卡报表
    return request({
        url: '/WebAPI/PersonalVisitor/AddVisitor',
        method: 'post',
        data:setparam(param)
    })
}
export function PersonalVisitorGetDoorValidType(param) { //考勤打卡报表
    return request({
        url: '/WebAPI/PersonalVisitor/GetDoorValidType',
        method: 'post',
        data:setparam(param)
    })
}
export function PersonalVisitorGetVisitorList(param) { //考勤打卡报表
    return request({
        url: '/WebAPI/PersonalVisitor/GetVisitorList',
        method: 'post',
        data:setparam(param)
    })
}


export function PersonalVisitorComplete(param) { //考勤打卡报表
    return request({
        url: '/WebAPI/PersonalVisitor/Complete',
        method: 'post',
        data:setparam(param)
    })
}

