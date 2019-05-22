/**
 * 
 * @param {时间戳} timeStamp 
 * @param {blooena} isData 
 */
export const getDate = (timeStamp, isData) => {
    var d = new Date(timeStamp);
    var date = new Date();
    date.setTime(d.getTime());
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if (isData) {
        return y + '-' + m + '-' + d;
    } else {
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    }
}



export function sortarr(arr){
    for(let i=0;i<arr.length-1;i++){
        for(let j=0;j<arr.length-1-i;j++){
            /**
             * 比较第j位和j+1的sort值
             * 如果j位的sort值比j+1位的sort值大，那么他们的位置发生交换
             * 如果j位的sort值比j+1位的sort值小，那么位置不变
             */
            if(arr[j].sort > arr[j+1].sort){
                var temp=arr[j];
                arr[j]=arr[j+1];
                arr[j+1]=temp;
            }
        }
    }
    return arr;
}
