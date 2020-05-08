let request = require('request');
let fs = require('fs');
let citys = require('./data/server_side_train_stations.json');

endLessRequest(citys,[]);

function endLessRequest(citys,args,data,undone){
  data = data || [];
  undone = undone || [];
  if(citys.length>0){
    let item = citys[0];
    let newitem = '';
    // let xurl = 'http://restapi.amap.com/v3/config/district?key=d36cb4c94238ee7c3acf8506473275d6&keywords='+item.station_name+'&subdistrict=0&showbiz=false&extensions=';
    let xurl = 'http://restapi.amap.com/v3/place/text?key=d36cb4c94238ee7c3acf8506473275d6&keywords=' + item.station_name + '&types=火车站&city=&children=1&offset=20&page=1&extensions=all';
    request.get(encodeURI(xurl),function(err,res,body){
      let response
      try {
        response = JSON.parse(body);
      } catch (e) {
        console.log(e);
      }
      if (response.pois && response.pois[0] && response.pois[0].cityname) {
        item['city_name'] = response.pois[0].cityname
        console.log(`${item.station_name}车站所在的城市是：${response.pois[0].cityname}`);
        data.push(item)
      } else if (response.suggestion && response.suggestion.cities && response.suggestion.cities[0] && response.suggestion.cities[0].name) {
        item['city_name'] = response.suggestion.cities[0].name
        console.log(`${item.station_name}车站所在的城市是：${response.suggestion.cities[0].name}`);
        data.push(item)
      } else {
        console.log(`没有找到${item.station_name}所在的城市`);
        undone.push(item)
      }
      citys.shift();
      endLessRequest( citys , args , data , undone );
    });
  }else{
    fs.writeFile('./data/success.citys.js', JSON.stringify(data), (err) => {
      if (err) throw err;
      console.log('解析完的数据已经保存到success.citys.js');
    });
    fs.writeFile('./data/undone.citys.js', JSON.stringify(undone), (err) => {
      if (err) throw err;
      console.log('尚未解析的数据保存到undone.citys.js');
    })
    console.log('------------------------------------------------------------');
    console.log('数据处理完毕');
    console.log('------------------------------------------------------------');
  }
}

