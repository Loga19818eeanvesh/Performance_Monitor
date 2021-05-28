const os = require('os');
const io = require('socket.io-client');
let socket = io('http://localhost:2828');



socket.on('connect',()=>{

    // we need a way to identify this machine to whomever concerned
    //object containing network interfaces that have been assigned a network address.
    const nI = os.networkInterfaces();
    
    let macA;
    // loop through all the nI for this machine and find a non-internal one
    for(let key in nI){

        // FOR TESTING PURPOSES!!!
        macA = Math.floor(Math.random() * 3) + 1;
        break;
        // FOR TESTING PURPOSES!!!
        //since connecting locally always getting mac address as '00:00:00:00:00:00' so using a random number as identifier for testing purpose.

        if(!nI[key][0].internal){
            if(nI[key][0].mac === '00:00:00:00:00:00'){
                macA = Math.random().toString(36).substr(2,15);
            }else{
                macA = nI[key][0].mac;
            }
            break;
        }
    }

    // client auth with single key value
    socket.emit('clientAuth','5t78yuhgirekjaht32i3')

    performanceData().then((allPerformanceData)=>{
        allPerformanceData.macA = macA
        socket.emit('initPerfData',allPerformanceData)
    });

    // start sending over data on interval
    let perfDataInterval = setInterval(()=>{
        performanceData().then((allPerformanceData)=>{
            // console.log(allPerformanceData)
            allPerformanceData.macA = macA;
            socket.emit('perfData',allPerformanceData);
        })
    },1000);
    
    socket.on('disconnect',()=>{
        clearInterval(perfDataInterval);
    })

})



function performanceData(){
    return new Promise(async (resolve, reject)=>{

        //array of objects containing information about each logical CPU core.
        const cpus = os.cpus();

        //amount of free system memory in bytes as an integer.
        const freeMem = os.freemem();
        
        //total amount of system memory in bytes as an integer.
        const totalMem = os.totalmem();

        //used memory.
        const usedMem = totalMem - freeMem;
        const memUseage = Math.floor(usedMem/totalMem*100)/100;

        // operating system name
        const osType = os.type() == 'Darwin' ? 'Mac' : os.type();

        // system uptime from last bootup in number of seconds
        const upTime = os.uptime();

        
        // CPU info Type
        const cpuModel = cpus[0].model;

        // Number of logical Cores(Threads)
        const numCores = cpus.length;

        // Clock Speed
        const cpuSpeed = cpus[0].speed;

        //load on cpu
        const cpuLoad = await getCpuLoad();

        const isActive = true;
        resolve({freeMem,totalMem,usedMem,memUseage,osType,upTime,cpuModel,numCores,cpuSpeed,cpuLoad,isActive});
    })
}

function cpuAverage(){
    const cpus = os.cpus();
    
    let idleMs = 0;
    let totalMs = 0;

    // loop through each core
    cpus.forEach((aCore)=>{
        // loop through each property of the current core
        for(type in aCore.times){
            totalMs += aCore.times[type];
        }
        idleMs += aCore.times.idle;
    });
    return {
        idle: idleMs / cpus.length,
        total: totalMs / cpus.length
    }
}

function getCpuLoad(){
    return new Promise((resolve, reject)=>{
        const start = cpuAverage();
        setTimeout(()=>{
            const end = cpuAverage();
            const idleDifference = end.idle - start.idle;
            const totalDifference = end.total - start.total;
            
            // calc the % of used cpu
            const percentageCpu = 100 - Math.floor(100 * idleDifference / totalDifference);
            resolve(percentageCpu);
        },100)
    })
}