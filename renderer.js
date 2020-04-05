const {
    execFile,
    spawn
} = require('child_process');

const Vue = require('vue/dist/vue');


const vue = new Vue({
    el: "#app",
    data: {
        autostart:false,
        isRunning:false,        
        adresses: [],
        spawn: null,
        logs:[],
    },
    methods: {
        list() {
            const child = execFile('go-dispatch-proxy.exe', ['-list'], (error, stdout, stderr) => {
                if (error) {
                    throw error;
                }

                const regex = /^\[.\] ([^,]*), IPv.:(.*)/gm;
                const str = stdout;
                let m;
                let adresses = [...this.adresses];

                for (adress of adresses){
                    adress.exists = false;
                }

                while ((m = regex.exec(str)) !== null) {
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                    
                    const name = m[1];
                    const ip = m[2];

                    const item = adresses.find(e => e.name==name);

                    if (item === undefined){
                        adresses.push({                        
                            isOn: true,
                            name: name,
                            ip: ip,
                            ratio: 1,
                            exists:true,
                            isLoading: false
                        });
                    } else {
                        item.ip = ip;
                        item.exists = true;
                    }
                }
                console.log(adresses);
                this.adresses = adresses;
            });

        },
        run() {

            this.save();
            this.isRunning = true;

            let args = [];
            for (adress of this.adresses) {
                if (adress.isOn) {
                    args.push(adress.ip + "@" + adress.ratio);
                }
            }

            this.spawn = spawn('go-dispatch-proxy.exe', args);

            this.spawn.stdout.on('data', (data) => {
                //console.log(`stdout: ${data}`);
                this.log("info",data);
            });

            this.spawn.stderr.on('data', (data) => {
                //console.error(`stderr: ${data}`);
                this.log("error",data);
            });

            this.spawn.on('close', (code) => {
                //console.log(`child process exited with code ${code}`);
                if (this.isRunning){
                    this.list();
                    this.log("error","Proxy closed, try to run it again ...");                    
                    this.run();
                }
            });

        },
        stop(){
            this.spawn.stdin.pause();
            this.spawn.kill();
            this.spawn = null;
            this.isRunning = false;
            this.log("info","Proxy stopped");                    
        },
        log(type,message){
            this.logs.push({type:type,message:message});                    
            this.$refs.logs.scrollTop = this.$refs.logs.scrollHeight;

            const regex = /^\[DEBUG][^>]*> ([0-9.]*):[0-9]*/gm;
            let m;

            while ((m = regex.exec(message)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                
                const ip = m[1];
                //console.log("IP DETECTED "+ip);

                const item = this.adresses.find(i => ip == i.ip);
                //console.log(item);

                for(adress of this.adresses){
                    adress.isLoading = false;    
                }
                
                if (item != undefined){
                    item.isLoading = true;
                    setTimeout(()=>{
                        item.isLoading = false;
                        this.$forceUpdate();
                    },100);
                }
            }
        },
        save(){
            localStorage.setItem("adresses",JSON.stringify(this.adresses));
            localStorage.setItem("autostart",JSON.stringify(this.autostart));
        },
        load(){
            if (localStorage.adresses !== undefined){
                this.adresses = JSON.parse(localStorage.adresses);
            }
            if (localStorage.autostart !== undefined){
                this.autostart = JSON.parse(localStorage.autostart);
            }
        }
    },
    mounted() {
        this.load();
        this.list();
        if (this.autostart) this.run();
    }
});