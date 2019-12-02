let request = require('request');
let url = 'https://kyfw.12306.cn/otn/resources/js/framework/station_name.js';
let fs = require('fs');
// 热门城市
let hotCitys = ['北京', '上海', '天津', '成都', '广州', '杭州', '济南', '南京', '石家庄', '太原', '西安', '郑州', '青岛', '苏州', '深圳'];
const isExists = (arr, item) => {
  let index = arr.indexOf(item);
  return index > -1 && arr[index] === item;
}
request.get(url, function(err,res,body){
  eval(body);
  let stationArray = station_names.split('@');
  let AllStations = []
  let AllStationsString = ''
  let AllStationsArray = '';
  let ServerSideData = []
  for (let i = 0; i < stationArray.length; i++) {
    if (stationArray[i] !== '') {
      let item = stationArray[i].split('|');
      item[1] = item[1].replace(/\s/g,"");
      AllStations.push({
        simply: item[0],
        name: item[1],
        code: item[2],
        pinyin: item[3],
        spinyin: item[4],
        index: item[5]
      });
      ServerSideData.push({
        station_code: item[2],
        station_name: item[1],
        station_pinyin: item[3],
        station_simply_pinyin: item[4],
        station_number: item[5]
      });
      if (item[5] == 0) {
        if (isExists(hotCitys, item[1])) {
          AllStationsArray += "['" + item[1] + "|" + item[3] + "|" + item[4] + "|" + item[0] + "|" + item[2] + "|" + item[5] + "|@";
        } else {
          AllStationsArray += "['" + item[1] + "|" + item[3] + "|" + item[4] + "|" + item[0] + "|" + item[2] + "|" + item[5];
        }
        AllStationsString += "{simply: '"+item[0]+"', name: '"+item[1]+"', code: '"+item[2]+"', pinyin: '"+item[4]+"', spinyin: '"+item[5]+"', index: '"+item[5]+"'}";
      } else {
        if (isExists(hotCitys, item[1])) {
          AllStationsArray += "', '" + item[1] + "|" + item[3] + "|" + item[4] + "|" + item[0] + "|" + item[2] + "|" + item[5] + "|@";
        } else {
          AllStationsArray += "', '" + item[1] + "|" + item[3] + "|" + item[4] + "|" + item[0] + "|" + item[2] + "|" + item[5];
        }
        AllStationsString += ", "+"{simply: '"+item[0]+"', name: '"+item[1]+"', code: '"+item[2]+"', pinyin: '"+item[4]+"', spinyin: '"+item[5]+"', index: '"+item[5]+"'}";
      }
    }
  }
  AllStationsString = '[' + AllStationsString + ']';
  AllStationsArray += "']";
  fs.writeFile('./data/train_stations.js', JSON.stringify(AllStations), (err) => {
    if (err) throw err;
    console.log('解析完的数据已经保存到/data/train_stations.js文件里面');
  });
  fs.writeFile('./data/server_side_train_stations.js', JSON.stringify(ServerSideData), (err) => {
    if (err) throw err;
    console.log('为后台提供的城市数据');
  })
  let webfrontend = 'let c = ' + AllStationsArray + `

const b = (c) => {
  let cityList = []
  let hotList = []
  c.forEach(e => {
    e = e.split('|')
    if (e.indexOf('@') > -1) hotList.push(e)
    cityList.push(e)
  })
  return {cityList, hotList}
}
module.exports = b(c)
`;
  fs.writeFile('./data/citydata.js', webfrontend, (err) => {
    if (err) throw err;
    console.log('解析完的数据已经保存到');
  })
  fs.writeFile('./data/train_stations_2.js', AllStationsString, (err) => {
    if (err) throw err;
    console.log('解析完的数据已经保存到/data/train_stations_2.js文件里面');
  })
})