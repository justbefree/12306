let request = require('request');
let fs = require('fs');
let citys = require('./m.elong.citys.js');
let xurl = 'http://restapi.amap.com/v3/config/district?key=d36cb4c94238ee7c3acf8506473275d6&keywords=三亚&subdistrict=0&showbiz=false&extensions=';

endLessRequest(citys,[]);

function endLessRequest(citys,args,data,undone){
  data = data || [];
  undone = undone || [];
  if(citys.length>0){
    item = citys[0];
    let xurl = 'http://restapi.amap.com/v3/config/district?key=d36cb4c94238ee7c3acf8506473275d6&keywords='+item.cityName+'&subdistrict=0&showbiz=false&extensions=';
    request.get(encodeURI(xurl),function(err,res,body){
      let response = JSON.parse(body);
      if(!!response.districts[0]){
        console.log('开始处理 :'+response.districts[0].name);
        item.center = response.districts[0].center
        data.push(item);
      }else{
        console.log('这个数据目前没法处理',item);
        item.center = "";
        data.push( item );
        undone.push(item);
      }
      citys.shift();
      endLessRequest( citys , args , data , undone );
    });
  }else{
    fs.writeFile('./elong/success.elong.citys.js', JSON.stringify(data), (err) => {
      if (err) throw err;
      console.log('解析完的数据已经保存到success.elong.citys.js');
    });
    fs.writeFile('./elong/undone.elong.citys.js', JSON.stringify(undone), (err) => {
      if (err) throw err;
      console.log('尚未解析的数据保存到undone.elong.citys.js');
    })
    console.log('------------------------------------------------------------');
    console.log('数据处理完毕');
    console.log('------------------------------------------------------------');
  }
}

