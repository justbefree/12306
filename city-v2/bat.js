let request = require('request');
let fs = require('fs');
let citys = require('./city.json');
let groups = {};
for (var i=0;i<26;i++) {
  const char = 65;
  let letter = String.fromCharCode(char + i);
  groups[letter] = [];
}

endLessRequest(citys,[]);

function endLessRequest(citys,args,data,undone){
  data = data || [];
  undone = undone || [];
  if(citys.length>0){
    let item = citys[0];
    let newitem = '';
    let xurl = 'http://restapi.amap.com/v3/config/district?key=d36cb4c94238ee7c3acf8506473275d6&keywords='+item.area_name+'&subdistrict=0&showbiz=false&extensions=';
    request.get(encodeURI(xurl),function(err,res,body){
      let response
      try {
        response = JSON.parse(body);
      } catch (e) {
        console.log(e);
      }
      // let response = JSON.parse(body);
      if(response && !!response.districts[0]){
        console.log('开始处理 :'+response.districts[0].name);
        // item.center = response.districts[0].center
        newitem = item.area_name.replace('市', '') + '|' + item.area_pinyin_full.toLowerCase() + '|' + item.area_pinyin_short.toLowerCase() + '|' + response.districts[0].center.replace(',', '_') + '|' + item.area_id + '|' + item.area_mapping_elong_code
        // newitem.center = response.districts[0].center
        // newitem.cityName = item.area_name.replace('市', '');
        // newitem.cityID = item.area_id;
        // newitem.cityCode = item.area_mapping_elong_code;
        // let letter = item.area_pinyin_full.substring(0, 1).toUpperCase();
        // newitem.group = letter;
        // groups[letter].push(newitem);
        data.push(newitem);
      }else{
        console.log('这个数据目前没法处理',item);
        item.center = "";
        // newitem.center = "";
        // newitem.cityName = item.area_name;
        // newitem.cityID = item.area_id;
        // newitem.group = item.area_pinyin_full.substring(0, 1).toUpperCase();
        // data.push( newitem );
        undone.push(item);
      }
      citys.shift();
      endLessRequest( citys , args , data , undone );
    });
  }else{
    // for (var attr in groups) {
    //   console.log(groups[attr]);
    //   data = data.concat(groups[attr])
    //   // console.log(data);
    // }
    fs.writeFile('./result/success.citys.js', JSON.stringify(data), (err) => {
      if (err) throw err;
      console.log('解析完的数据已经保存到success.citys.js');
    });
    fs.writeFile('./result/undone.citys.js', JSON.stringify(undone), (err) => {
      if (err) throw err;
      console.log('尚未解析的数据保存到undone.citys.js');
    })
    console.log('------------------------------------------------------------');
    console.log('数据处理完毕');
    console.log('------------------------------------------------------------');
  }
}

