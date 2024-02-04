const http = require("http");
const fs   = require("fs");
var requests =require("requests");
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", (orgVal.main.temp-273).toFixed(2));
    temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min - 273).toFixed(2));
    temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max-273).toFixed(2));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
};

const homeFile = fs.readFileSync("index.html","utf-8");

const server = http.createServer((req,res)=>{
    if(req.url=="/"){
      requests(
        "https://api.openweathermap.org/data/2.5/weather?lat=30.7333&lon=76.7794&appid=913f399db35c7f2582e7c783a79e7ea1"
      )
       .on("data",(chunk) =>{
        const objdata =JSON.parse(chunk);
        const arrData =[objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData.map(val => replaceVal(homeFile,val)).join("");   
        res.write(realTimeData);
        
    })

       .on("end",(err)=>{
        if(err) return console.log("connections closed due to errors",err);
        res.end();
       });
    }
});

server.listen(8000,"127.0.0.1");
