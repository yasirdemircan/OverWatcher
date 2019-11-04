const puppeteer = require('puppeteer');
const fs = require('fs');
var nodemailer = require('nodemailer');
var cron = require('node-cron');
//Function for checking news
var oldnews; 

cron.schedule('00 00 * * *', () => {
  //send4Cron();
});

async function checkNews(param1) {
    const browser = await puppeteer.launch({
        //headless: false
        args: ['--no-sandbox']
    });

    const haberpage = await browser.newPage();
    await haberpage.goto("https://www.istanbul.edu.tr/tr/haberler/1", {
        timeout: 30000
    });
    const context = browser.defaultBrowserContext();
    // URL An array of permissions
    context.overridePermissions("https://www.istanbul.edu.tr/tr/haberler/1", ["geolocation", "notifications"]);
    await haberpage.waitForSelector("[xref='newsdetail']", {
        timeout: 30000
    });
    oldnews = fs.readFileSync('oldnews.txt', 'utf8');
    var haber = await haberpage.evaluate((oldnews) => {
        const list = document.querySelectorAll("[xref='newsdetail']");
        if (list[0].innerText.replace(/[^a-z0-9]/gi, '') == oldnews) {

            return 0

        } else {

            return list[0].innerText
        }

    },oldnews);
    
    //console.log(fs.readFileSync('oldnews.txt', 'utf8'));
    if (haber == 0) {
        console.log("No new news");
        await browser.close();
    } else {
        var newoldnews = haber.replace(/[^a-z0-9]/gi, '');
        console.log("New posts found sending emails");
        //console.log(newoldnews+"!!!fromnewold")
        fs.writeFile('oldnews.txt',newoldnews, function (err) {
  if (err) throw err;
  console.log('Old news got updated!!');
    sendMail("Haber",haber)

});
          
       
    }

await browser.close();
}
async function checkNotices(param1) {
    const browser = await puppeteer.launch({
        //headless: false
        args: ['--no-sandbox']
    });

    const duyurupage = await browser.newPage();
    await duyurupage.goto("https://www.istanbul.edu.tr/tr/duyurular/1", {
        timeout: 30000
    });
    const context = browser.defaultBrowserContext();
    // URL An array of permissions
    context.overridePermissions("https://www.istanbul.edu.tr/tr/duyurular/1", ["geolocation", "notifications"]);
    await duyurupage.waitForSelector("[xref='noticedetail']", {
        timeout: 30000
    });
    oldnotices = fs.readFileSync('oldnotices.txt', 'utf8');
    var duyuru = await duyurupage.evaluate((oldnotices) => {
        const list = document.querySelectorAll("[xref='noticedetail']");
        if (list[0].innerText.replace(/[^a-z0-9]/gi, '') == oldnotices) {

            return 0

        } else {

            return list[0].innerText
        }

    },oldnotices);
    
    //console.log(fs.readFileSync('oldnews.txt', 'utf8'));
    if (duyuru == 0) {
        console.log("No new notices");
        await browser.close();
    } else {
        var newoldnotices = duyuru.replace(/[^a-z0-9]/gi, '');
        console.log("New posts found sending emails");
        //console.log(newoldnews+"!!!fromnewold")
        fs.writeFile('oldnotices.txt',newoldnotices, function (err) {
  if (err) throw err;
  console.log('Old notices got updated!!');
    sendMail("Duyuru",duyuru);

});
          
       
    }

await browser.close();
}


function sendMail(type,content) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sosyalmedyahaberduyuru@gmail.com',
            pass: 'sosyalmedya520.'
        }
    });

    var mailOptions = {
        from: 'sosyalmedyahaberduyuru@gmail.com',
        to: 'yasirdemircan@gmail.com,kandemirseda@gmail.com,yunusemreokmen@gmail.com',
        subject: 'Yeni '+type+' !',
        text: content +" başlıklı "+ type.toLowerCase()+ " istanbul.edu.tr'ye eklendi"
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
function send4Cron() {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sosyalmedyahaberduyuru@gmail.com',
            pass: 'sosyalmedya520.'
        }
    });

    var mailOptions = {
        from: 'sosyalmedyahaberduyuru@gmail.com',
        to: 'yasirdemircan@gmail.com',
        subject: 'Wake up!',
        text:"It's 00:00"
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

setInterval(function(){
  checkNews().then(function(){checkNotices();});    
},30000);







