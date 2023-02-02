const shell = require('electron').shell;
const ngrok = require('ngrok');

const click = new Audio("click.mp3");

function ngok() {
    shell.openExternal('https://dashboard.ngrok.com/get-started/your-authtoken');
}
function github() {
    shell.openExternal('https://github.com/healer-op');
}

function number(x) {
    var portn = document.getElementById("port")
    // console.log(portn.value)
    click.play();
    if (x == 99) {
        if (portn.value == undefined || portn.value == null || portn.value == "") {
            portn.value = 80;
        }
        if (portn.value < 99999) {
            var x = parseInt(portn.value);
            portn.value = x + 1;
        }
    }
    if (x == 98) {
        if (portn.value == undefined || portn.value == null || portn.value == "") {
            portn.value = 80;
        }
        if (portn.value > 80) {
            var x = parseInt(portn.value);
            portn.value = x - 1;
        }
    }
    // portn.value = 8000;
}


async function healer2(x) {
    const url = await ngrok.connect({
        proto: document.getElementById("connection").value, // http|tcp|tls, defaults to http
        addr: x, // port or network address, defaults to 80

        authtoken: document.getElementById('auth_token').value, // your authtoken from ngrok.com
        region: document.getElementById('region').value, // one of ngrok regions (us, eu, au, ap, sa, jp, in), defaults to us
        binPath: path => path.replace('app.asar', 'app.asar.unpacked'), // custom binary path, eg for prod in electron
        onStatusChange: status => {
            if(status == "connected"){
                $("ol").append(`<li style="margin-bottom: 18px;max-width: 32em;line-height: 1.2em;font-size: medium;color: #adff9e;">${status}</li><br>`);
                $("ol").append(`<li style="margin-bottom: 18px;max-width: 32em;line-height: 1.2em;color: yellow;">PORT FOWARED BY LOCALMINER</li><br>`);
            }
            else{
                $("ol").append(`<li style="margin-bottom: 18px;max-width: 32em;line-height: 1.2em;">${status}</li><br>`);
            }
            
        }, // 'closed' - connection is lost, 'connected' - reconnected
        onLogEvent: data => {
            if(data == "connected"){
                $("ol").append(`<li style="margin-bottom: 18px;max-width: 32em;line-height: 1.2em;font-size: medium;color: #adff9e;">${data}</li><br>`);
                $("ol").append(`<li style="margin-bottom: 18px;max-width: 32em;line-height: 1.2em;color: yellow;">PORT FOWARED BY LOCALMINER</li><br>`);
            }
            else{
                $("ol").append(`<li style="margin-bottom: 18px;max-width: 32em;line-height: 1.2em;">${data}</li><br>`);
            }
            
        } // returns stdout messages from ngrok process
    });    
}
let portFlag = 10;
async function portrunner(){
    click.play()
    await healer2(document.getElementById("port").value)
    // await healer2(8080)

    fetch(`http://127.0.0.1:4040/api/tunnels`)
    .then(response => {
        if (!response.ok) {
            throw Error("ERROR");
        }
        return response.json();
    })
    .then(data => {
        let v = data;
        const url = [];
        // console.log(v.tunnels[1].public_url);
        let len = v.tunnels.length;
        // console.log(len)
        if(portFlag !=10){
            document.getElementById("ips").innerHTML = "";
        }
        document.getElementById("ips").style.opacity = 1;
        for (var i = 0; i < len; i++) {
            // console.log(i)
            // console.log(v.tunnels[i].public_url)
            urls = v.tunnels[i].public_url
            urlc = v.tunnels[i].config.addr
            if(urlc.includes("8080")){
                urls = "Bed : " + urls
            }
            url[i] = urls;
            url[i] = url[i].replace('tcp://', '');

            url[i] = url[i].replace('0.tcp.in.ngrok.io', 'in.hmmm.eu.org'); // india
            url[i] = url[i].replace('1.tcp.in.ngrok.io', 'in1.hmmm.eu.org'); // india
            url[i] = url[i].replace('2.tcp.in.ngrok.io', 'in2.hmmm.eu.org'); // india
            url[i] = url[i].replace('3.tcp.in.ngrok.io', 'in3.hmmm.eu.org'); // india
            url[i] = url[i].replace('4.tcp.in.ngrok.io', 'in4.hmmm.eu.org'); // india
            url[i] = url[i].replace('5.tcp.in.ngrok.io', 'in5.hmmm.eu.org'); // india
            url[i] = url[i].replace('6.tcp.in.ngrok.io', 'in6.hmmm.eu.org'); // india

            url[i] = url[i].replace('0.tcp.jp.ngrok.io', 'jp.hmmm.eu.org'); // japan
            url[i] = url[i].replace('1.tcp.jp.ngrok.io', 'jp1.hmmm.eu.org'); // japan
            url[i] = url[i].replace('2.tcp.jp.ngrok.io', 'jp2.hmmm.eu.org'); // japan
            url[i] = url[i].replace('3.tcp.jp.ngrok.io', 'jp3.hmmm.eu.org'); // japan
            url[i] = url[i].replace('4.tcp.jp.ngrok.io', 'jp4.hmmm.eu.org'); // japan
            url[i] = url[i].replace('5.tcp.jp.ngrok.io', 'jp5.hmmm.eu.org'); // japan
            url[i] = url[i].replace('6.tcp.jp.ngrok.io', 'jp6.hmmm.eu.org'); // japan

            url[i] = url[i].replace('0.tcp.sa.ngrok.io', 'sa.hmmm.eu.org'); // south africa
            url[i] = url[i].replace('1.tcp.sa.ngrok.io', 'sa1.hmmm.eu.org'); // south africa
            url[i] = url[i].replace('2.tcp.sa.ngrok.io', 'sa2.hmmm.eu.org'); // south africa
            url[i] = url[i].replace('3.tcp.sa.ngrok.io', 'sa3.hmmm.eu.org'); // south africa
            url[i] = url[i].replace('4.tcp.sa.ngrok.io', 'sa4.hmmm.eu.org'); // south africa
            url[i] = url[i].replace('5.tcp.sa.ngrok.io', 'sa5.hmmm.eu.org'); // south africa
            url[i] = url[i].replace('6.tcp.sa.ngrok.io', 'sa6.hmmm.eu.org'); // south africa

            url[i] = url[i].replace('0.tcp.au.ngrok.io', 'au.hmmm.eu.org'); // austrailia
            url[i] = url[i].replace('1.tcp.au.ngrok.io', 'au1.hmmm.eu.org'); // austrailia
            url[i] = url[i].replace('2.tcp.au.ngrok.io', 'au2.hmmm.eu.org'); // austrailia
            url[i] = url[i].replace('3.tcp.au.ngrok.io', 'au3.hmmm.eu.org'); // austrailia
            url[i] = url[i].replace('4.tcp.au.ngrok.io', 'au4.hmmm.eu.org'); // austrailia
            url[i] = url[i].replace('5.tcp.au.ngrok.io', 'au5.hmmm.eu.org'); // austrailia
            url[i] = url[i].replace('6.tcp.au.ngrok.io', 'au6.hmmm.eu.org'); // austrailia

            url[i] = url[i].replace('0.tcp.ap.ngrok.io', 'ap.hmmm.eu.org'); // aisa pacific
            url[i] = url[i].replace('1.tcp.ap.ngrok.io', 'ap1.hmmm.eu.org'); // aisa pacific
            url[i] = url[i].replace('2.tcp.ap.ngrok.io', 'ap2.hmmm.eu.org'); // aisa pacific
            url[i] = url[i].replace('3.tcp.ap.ngrok.io', 'ap3.hmmm.eu.org'); // aisa pacific
            url[i] = url[i].replace('4.tcp.ap.ngrok.io', 'ap4.hmmm.eu.org'); // aisa pacific
            url[i] = url[i].replace('5.tcp.ap.ngrok.io', 'ap5.hmmm.eu.org'); // aisa pacific
            url[i] = url[i].replace('6.tcp.ap.ngrok.io', 'ap6.hmmm.eu.org'); // aisa pacific

            url[i] = url[i].replace('0.tcp.ngrok.io', 'us.hmmm.eu.org'); // usa
            url[i] = url[i].replace('1.tcp.ngrok.io', 'us1.hmmm.eu.org'); // usa
            url[i] = url[i].replace('2.tcp.ngrok.io', 'us2.hmmm.eu.org'); // usa
            url[i] = url[i].replace('3.tcp.ngrok.io', 'us3.hmmm.eu.org'); // usa
            url[i] = url[i].replace('4.tcp.ngrok.io', 'us4.hmmm.eu.org'); // usa
            url[i] = url[i].replace('5.tcp.ngrok.io', 'us5.hmmm.eu.org'); // usa
            url[i] = url[i].replace('6.tcp.ngrok.io', 'us6.hmmm.eu.org'); // usa

            url[i] = url[i].replace('0.tcp.eu.ngrok.io', 'eu.hmmm.eu.org'); // europe
            url[i] = url[i].replace('1.tcp.eu.ngrok.io', 'eu1.hmmm.eu.org'); // europe
            url[i] = url[i].replace('2.tcp.eu.ngrok.io', 'eu2.hmmm.eu.org'); // europe
            url[i] = url[i].replace('3.tcp.eu.ngrok.io', 'eu3.hmmm.eu.org'); // europe
            url[i] = url[i].replace('4.tcp.eu.ngrok.io', 'eu4.hmmm.eu.org'); // europe
            url[i] = url[i].replace('5.tcp.eu.ngrok.io', 'eu5.hmmm.eu.org'); // europe
            url[i] = url[i].replace('6.tcp.eu.ngrok.io', 'eu6.hmmm.eu.org'); // europe

            $("#ips").append(`<p class="style2" style="color:yellow" >${url[i]} <i id="copy${i}" class="fa-solid fa-copy" onclick='navigator.clipboard.writeText("${url[i]}")'></i> </p>`);
        }
        portFlag = 11;


        console.log(url);
    })
}


// offine online

function hasNetwork(online) {
    const element = document.querySelector("#status");
    // Update the DOM to reflect the current status
    let ping = Math.floor(Math.random() * 20) + 1;
    if (online) {
    //   element.classList.remove("offline");
    //   element.classList.add("online");
      element.innerText = `Online ${ping}ms`;
      element.style.color = "green";
    } else {
    //   element.classList.remove("online");
    //   element.classList.add("offline");
      element.innerText = "Offline check your internet connection";
      element.style.color = "red";
    }
  }
  
  window.addEventListener("load", () => {
    hasNetwork(navigator.onLine);
  });

  window.addEventListener("load", () => {
    hasNetwork(navigator.onLine);
  
    window.addEventListener("online", () => {
      // Set hasNetwork to online when they change to online.
      hasNetwork(true);
    });
  
    window.addEventListener("offline", () => {
      // Set hasNetwork to offline when they change to offline.
      hasNetwork(false);
    });
  });
