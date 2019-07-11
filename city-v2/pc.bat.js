let request = require('request');
let fs = require('fs');
let citys = require('./city.json');

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
      if(response && !!response.districts[0]){
        console.log('开始处理 :'+response.districts[0].name);
        item.center = response.districts[0].center
        newitem = item.area_name + '|' + item.area_pinyin_full + '|' + item.area_pinyin_short + '|' + item.area_id;
        data.push(newitem);
      }else{
        console.log('这个数据目前没法处理',item);
        item.center = "";
        newitem = item.area_name + '|' + item.area_pinyin_full + '|' + item.area_pinyin_short + '|' + item.area_id;
        data.push( newitem );
        undone.push(item);
      }
      citys.shift();
      endLessRequest( citys , args , data , undone );
    });
  }else{
    fs.writeFile('./pc/success.citys.js', JSON.stringify(data), (err) => {
      if (err) throw err;
      console.log('解析完的数据已经保存到success.citys.js');
    });
    fs.writeFile('./pc/undone.citys.js', JSON.stringify(undone), (err) => {
      if (err) throw err;
      console.log('尚未解析的数据保存到undone.citys.js');
    })
    console.log('------------------------------------------------------------');
    console.log('数据处理完毕');
    console.log('------------------------------------------------------------');
  }
}

