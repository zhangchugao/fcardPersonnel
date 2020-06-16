

import request from '../utils/axios';
// console.log(request)
function setparam(data){
    var parmass1 = new URLSearchParams()
    for (var i in data) {
        parmass1.append(i, data[i]);
    }
    // console.log(parmass1)
    return parmass1
}



export function WorkReportGetCardRecordList(param) { //考勤打卡报表
    return request({
        url: '/WebAPI/PersonalReport/GetCardRecordList',
        method: 'post',
        data:setparam(param)
    })
}
export function WorkReportGetOvertimeRecordList(param) { //考勤加班报表
    return request({
        url: '/WebAPI/PersonalReport/GetOvertimeRecordList',
        method: 'post',
        data:setparam(param)
    })
}
export function WorkReportGetLeaveRecordList(param) { //考勤请假报表
    return request({
        url: '/WebAPI/PersonalReport/GetLeaveRecordList',
        method: 'post',
        data:setparam(param)
    })
}
export function WorkReportGetWorkEditRecordList(param) { //考勤调班报表
    return request({
        url: '/WebAPI/PersonalReport/GetWorkEditRecordList',
        method: 'post',
        data:setparam(param)
    })
}
export function WorkReportGetWorkEgressionRecordList(param) { //考勤出差登记报表
    return request({
        url: '/WebAPI/PersonalReport/GetWorkEgressionRecordList',
        method: 'post',
        data:setparam(param)
    })
}
export function WorkReportGetChangeRecordList(param) { //考勤调休记录报表
    return request({
        url: '/WebAPI/PersonalReport/GetChangeRecordList',
        method: 'post',
        data:setparam(param)
    })
}
export function WorkReportGetMonthReportList(param) { //考勤月报表
    return request({
        url: '/WebAPI/PersonalReport/GetMonthReportList',
        method: 'post',
        data:setparam(param)
    })
}
export function WorkReportGetWorkTimeGroupList(param) { //考勤班次
    return request({
        url: '/WebAPI/PersonalReport/GetWorkTimeGroupList',
        method: 'post',
        data:setparam(param)
    })
}



export function VisitorReportGetVisitorList(param) { //访客记录
    return request({
        url: '/WebAPI/VisitorReport/GetVisitorList',
        method: 'post',
        data:setparam(param)
    })
}