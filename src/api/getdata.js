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



export function ClientLogin(param) { //登录
    return request({
        url: '/WebAPI/PersonalReportLogin/ClientLogin',
        method: 'post',
        data:setparam(param)
    })
}

export function ClientLogout(param) {//登录
    return request({
        url: '/WebAPI/PersonalReportLogin/ClientLogout',
        method: 'post',
        data:setparam(param)
    })
}

export function Information(param) {//获取用户信息
    return request({
        url: '/WebAPI/PersonalReportDetail/Information',
        method: 'post',
        data:setparam(param)
    })
}

export function SetInformation(param) {//设置用户信息
    return request({
        url: '/WebAPI/PersonalReportDetail/SetInformation',
        method: 'post',
        data:setparam(param)
    })
}


export function RecentAccessRecord(param) {//获取操作员列表
    return request({
        url: '/WebAPI/PersonalReport/RecentAccessRecord',
        method: 'post',
        data:setparam(param)
    })
}

export function GetOSSConfig(param) { // 获取阿里oos配置信息
    return request({
        url: '/WebAPI/PersonalReportLogin/GetOSSConfig', 
        method: 'post',
        data:setparam(param)
    })
}

export function SetUploadImage(param) { // 关联人员图片
    return request({
        url: '/WebAPI/PersonalReportDetail/SetUploadImage', 
        method: 'post',
        data:setparam(param)
    })
}

export function AliyunFaceDetection(parma) { // 检测照片时候有人脸并且大小是否符合要求
    const a = setparam(parma)
    return request({
      url: '/WebAPI/PersonalReportDetail/FaceDetection',
      method: 'post',
      data: a
    })
  }
  
  export function FaceDetectionNum(parma) { // 检测照片时候有人脸
    const a = setparam(parma)
    return request({
      url: '/WebAPI/PersonalReportDetail/FaceDetectionNum',
      method: 'post',
      data: a
    })
  }

export function EnterAccessRecord(param) {//进门记录
    return request({
        url: '/WebAPI/PersonalReport/EnterAccessRecord',
        method: 'post',
        data:setparam(param)
    })
}
export function OutAccessRecord(param) {//出门记录
    return request({
        url: '/WebAPI/PersonalReport/OutAccessRecord',
        method: 'post',
        data:setparam(param)
    })
}
export function AlarmRecord(param) {//报警记录
    return request({
        url: '/WebAPI/PersonalReport/AlarmRecord',
        method: 'post',
        data:setparam(param)
    })
}
export function ConferencePeopleRecord(param) {//参会迟到记录
    return request({
        url: '/WebAPI/PersonalReport/ConferencePeopleRecord',//参会迟到记录
        method: 'post',
        data:setparam(param)
    })
}
export function ConferencePeopleAbsenceRecord(param) {//参会缺席记录
    return request({
        url: '/WebAPI/PersonalReport/ConferencePeopleAbsenceRecord', //参会缺席记录
        method: 'post',
        data:setparam(param)
    })
}
export function ConferencePeopleLateRecord(param) {//参会迟到
    return request({
        url: '/WebAPI/PersonalReport/ConferencePeopleLateRecord', //参会迟到
        method: 'post',
        data:setparam(param)
    })
}
export function ConferencePeopleLeaveRecord(param) {//参会请假记录
    return request({
        url: '/WebAPI/PersonalReport/ConferencePeopleLeaveRecord', //参会请假记录
        method: 'post',
        data:setparam(param)
    })
}

export function POSReservationRecord(param) {//订餐记录
    return request({
        url: '/WebAPI/PersonalReport/POSReservationRecord', //订餐记录
        method: 'post',
        data:setparam(param)
    })
}


export function RecentPOSTransactionRecord(param) {//最近消费记录
    return request({
        url: '/WebAPI/PersonalReport/RecentPOSTransactionRecord',//最近消费记录
        method: 'post',
        data:setparam(param)
    })
}


export function POSTransactionRecord(param) {//消费记录
    return request({
        url: '/WebAPI/PersonalReport/POSTransactionRecord', //消费记录
        method: 'post',
        data:setparam(param)
    })
}


export function POSTransactionRechargeRecord(param) {//充值记录
    return request({
        url: '/WebAPI/PersonalReport/POSTransactionRechargeRecord', //充值记录
        method: 'post',
        data:setparam(param)
    })
}

export function POSUserDestroyCardRecord(param) {//销户记录
    return request({
        url: '/WebAPI/PersonalReport/POSUserDestroyCardRecord', //销户记录
        method: 'post',
        data:setparam(param)
    })
}
export function WithdrawalPOSUserChangeCardRecord(param) {//取款记录
    return request({
        url: '/WebAPI/PersonalReport/WithdrawalPOSUserChangeCardRecord', //取款记录
        method: 'post',
        data:setparam(param)
    })
}

export function POSUserChangeCardRecord(param) {//换卡记录
    return request({
        url: '/WebAPI/PersonalReport/POSUserChangeCardRecord', //换卡记录
        method: 'post',
        data:setparam(param)
    })
}

export function RecentWaterTransactionRecord(param) {//最近水控消费记录
    return request({
        url: '/WebAPI/PersonalReport/RecentWaterTransactionRecord', //最近水控消费记录
        method: 'post',
        data:setparam(param)
    })
}

export function WaterTransactionRecord(param) {//水控消费记录
    return request({
        url: '/WebAPI/PersonalReport/WaterTransactionRecord', //水控消费记录
        method: 'post',
        data:setparam(param)
    })
}

export function PeosonalPosGetAllPeople(param) {//获取订餐人员
    return request({
        url: '/WebAPI/PeosonalPos/GetAllPeople', 
        method: 'post',
        data:setparam(param)
    })
}

export function PeosonalPosGetPOSMealTime(param) {//获取订餐时段
    return request({
        url: '/WebAPI/PeosonalPos/GetPOSMealTime', 
        method: 'post',
        data:setparam(param)
    })
}

export function PeosonalPosGetFixedFeeRule(param) {//获取订餐餐段
    return request({
        url: '/WebAPI/PeosonalPos/GetFixedFeeRule', 
        method: 'post',
        data:setparam(param)
    })
}

export function PeosonalPosReservationInsert(param) {//提交订餐
    return request({
        url: '/WebAPI/PeosonalPos/ReservationInsert', 
        method: 'post',
        data:setparam(param)
    })
}