const config = require('../configs/email');
// const db = require('../models');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

const moment = require('moment');
const User = require('../models/user');
const Auction = require('../models/auction');

class test {
    sendTest() {
        console.log("test email");
    }
}

class emailSenderComponent {
    // transport
    // private transport: nodemailer.Transport;
    constructor() {
        console.log("0");
        nodemailer.createTestAccount( (err, account) => {
            console.log("1");
            this.transporter = nodemailer.createTransport({
                host: "mail.postale.io",
                port: 465,
                secure: true,
                auth: {
                    user: config.email_sender,
                    pass: config.email_sender_password
                }
                // tls: {
                //     rejectUnauthorized: false
                // }
            });
            const startScheduleMtd = this.startSchedule.bind(this);
            console.log("2");
            this.transporter.verify(function(error, success) {
                console.log("3");
                if (error) {
                     console.log(error);
                } else {
                    console.log("4");
                    // this.startSchedule();
                    startScheduleMtd();
                    console.log('Server is ready to take our messages');
                }
            });
            console.log("5");
        });
    }

        
    
    // scheduler
    async startSchedule(options, callback) {
        console.log("starting scheduler");
        const timeNow = new Date;
        console.log(timeNow);
        var tasks = await Auction.find({ endDate: { $gt: timeNow }});
        // tasks = tasks.map(a => a.endDate);
        // console.log(tasks);
        console.log(`tasks length is ${tasks.length}`);
        tasks.forEach( async (task) => {
            console.log(task.buyer.id);
            const j = schedule.scheduleJob(timeNow, () => (this.sendNotificationToWinner(task)) );
            
            //cron job
            // if (Object.keys(task.buyer).length == 0) {
            if (task.buyer.id) {
                var buyer = await User.findById(task.buyer.id);
                console.log(`sending email to winner ${buyer.email}`);
            } else {
                var author = await User.findById(task.author);
                console.log(`no winner for offer ${author.email}`);
            }
            // var date = new Date(2012, 11, 21, 5, 30, 0);

            // var j = schedule.scheduleJob(date, function(){
            //     console.log('The world is going to end today.');
            // });
        })
    }
    // usePasswordHashToMakeToken = ({
    //     password: passwordHash,
    //     _id: userId,
    //     createdAt
    // }) => {
    //     // highlight-start
    //     const secret = passwordHash + "-" + createdAt
    //     const token = jwt.sign({ userId }, secret, {
    //         expiresIn: 3600 // 1 hour
    //     })
    //     // highlight-end
    //     return token;
    // }

    // async sendPasswordResetEmail (req, res)  {

    //     let resetPassEmailForm = {
    //         from: config.email_sender, // sender address
    //         to: options.user.email, // list of receivers
    //         subject: 'Solicitare resetare parola✔', // Subject line
    //         text: 'Pentru resetarea parolei vă rugăm să urmați linkul:', // plain text body
    //         html: 'http://localhost:' + config.process.ENV.PORT + '/resetpassword/:' + options.token // html body
    //     };


    //     const { email } = req.params
    //     let user
    //     try {
    //         user = await User.findOne({ email }).exec()
    //     } catch (err) {
    //         res.status(404).json("No user with that email")
    //     }
    //     const token = usePasswordHashToMakeToken(user)
    //     const url = getPasswordResetURL(user, token)
    //     const emailTemplate = resetPasswordTemplate(user, url)
    //     const sendEmail = () => {
    //       transporter.sendMail(emailTemplate, (err, info) => {
    //         if (err) {
    //           res.status(500).json("Error sending email")
    //         }
    //         console.log(`** Email sent **`, info.response)
    //       })
    //     }
    //     sendEmail()
    //   }

    // sendReset(options, callback) {
    //     let resetPassEmailForm = {
    //         from: config.email_sender, // sender address
    //         to: options.user.email, // list of receivers
    //         subject: 'Solicitare resetare parola✔', // Subject line
    //         text: 'Pentru resetarea parolei vă rugăm să urmați linkul:', // plain text body
    //         html: "http://${config.process.ENV.VUE_APP_HOST}:" + process.env.PORT + '/resetpassword/:' + options.token // html body
    //     };
        
    //     this.sendEmail(resetPassEmailForm,(error,info)=>{
    //         if (error){
    //             return callback(error);
    //         }
    //         return callback(null, info);
    //     });   
    // }
    /**
     * 
     * @param {Object} options an object with options
     * @returns {Promise}
     */
    sendResetPromise(options) {
        return new Promise((resolve,reject)=>{
            // let resetPassEmailForm = {
            //     from: '"RDclone 👻" <foo@example.com>', // sender address
            //     to: options.user.email, // list of receivers
            //     subject: 'Password reset request✔', // Subject line
            //     text: 'Click here to reset password', // plain text body
            //     html: 'http://localhost:' + config.process.ENV.PORT + '/resetpassword/:' + options.token // html body
            // };

            let html = `<div style="line-height: 1;">Stimate furnizor,</div>
            <p style="line-height: 1;"><br></p>
            <div style="line-height: 1;">Pentru resetarea parolei vă rugăm să accesați <a href="http://${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}/resetare-parola/${options.token}" rel="noopener noreferrer" target="_blank">acest link</a>.</div><br>
            <div style="line-height: 1;">Dacă nu ați cerut dvs resetarea parolei vă rugăm să ignorați acest e-mail.</div>
            <p><br></p>
            <p style="line-height: 1;">Toate bune,</p>
            <p style="line-height: 1;"><br></p>
            <p style="line-height: 1;">Nord Energy Broker</p>
            <p style="line-height: 1;"><br></p>`
            let resetPassEmailForm = {
                from: config.email_sender, // sender address
                to: options.user.email, // list of receivers
                subject: "Nord Energy Broker - Solicitare de resetare a parolei",
                // text: "Stimată doamnă, Stimate domnule,\n\nVă anunțăm că am publicat o nouă cerere de ofertă pe platorma noastră. Puteți analiza cererea urmărind acest link." + options.auction.id + ".\nOferta va fi deschisă până la " + options.auction.end_date + " ora " + options.auction.end_time + ".\nSistemul va alege automat cea mai bună ofertă pentru consumator. Furnizorul declarat câștigător va primi un e-mail automat de confirmare, împreună cu procedura aferentă semnării contractului.\n\nToate cele bune,", // plain text body
                html: html // html body
            };
            
            this.exemplePromise(resetPassEmailForm)
                .then((info)=>{
                    return resolve(info);
                })
                .catch((err)=>{
                    return reject(err)
                });
        });
    }

    resetConfirm(options) {
        return new Promise((resolve,reject)=>{
            // let resetPassEmailForm = {
            //     from: '"RDclone 👻" <foo@example.com>', // sender address
            //     to: options.user.email, // list of receivers
            //     subject: 'Password reset request✔', // Subject line
            //     text: 'Click here to reset password', // plain text body
            //     html: 'http://localhost:' + config.process.ENV.PORT + '/resetpassword/:' + options.token // html body
            // };

            let html = `<div style="line-height: 1;">Stimate furnizor,</div>
            <p style="line-height: 1;"><br></p>
            <div style="line-height: 1;">Vă anunțăm că parola a fost schimbată cu succes.</div><br>
            <div style="line-height: 1;">Dacă nu dvs ați resetat parola vă rugăm să ne contactați în cel mai scurt timp.</div>
            <p><br></p>
            <p style="line-height: 1;">Toate bune,</p>
            <p style="line-height: 1;"><br></p>
            <p style="line-height: 1;">Nord Energy Broker</p>
            <p style="line-height: 1;"><br></p>`
            let passwordUpdateEmailForm = {
                from: config.email_sender, // sender address
                to: options.user.email, // list of receivers
                subject: "Nord Energy Broker - Parolă schimbată cu succes.",
                // text: "Stimată doamnă, Stimate domnule,\n\nVă anunțăm că am publicat o nouă cerere de ofertă pe platorma noastră. Puteți analiza cererea urmărind acest link." + options.auction.id + ".\nOferta va fi deschisă până la " + options.auction.end_date + " ora " + options.auction.end_time + ".\nSistemul va alege automat cea mai bună ofertă pentru consumator. Furnizorul declarat câștigător va primi un e-mail automat de confirmare, împreună cu procedura aferentă semnării contractului.\n\nToate cele bune,", // plain text body
                html: html // html body
            };
            
            this.exemplePromise(passwordUpdateEmailForm)
                .then((info)=>{
                    return resolve(info);
                })
                .catch((err)=>{
                    return reject(err)
                });
        });
    }

    // resetConfirm(options, callback) {
    //     let html = `<div style="line-height: 1;">Stimate furnizor,</div>
    //     <p style="line-height: 1;"><br></p>
    //     <div style="line-height: 1;">Vă anunțăm că parola a fost schimbată cu succes.</div><br>
    //     <div style="line-height: 1;">Dacă nu dvs ați resetat parola vă rugăm să ne contactați în cel mai scurt timp.</div>
    //     <p><br></p>
    //     <p style="line-height: 1;">Toate bune,</p>
    //     <p style="line-height: 1;"><br></p>
    //     <p style="line-height: 1;">Nord Energy Broker</p>
    //     <p style="line-height: 1;"><br></p>`
    //     let passwordUpdateEmailForm = {
    //         from: config.email_sender, // sender address
    //         to: options.user.email, // list of receivers
    //         subject: "Parolă schimbată cu succes.",
    //         // text: "Stimată doamnă, Stimate domnule,\n\nVă anunțăm că am publicat o nouă cerere de ofertă pe platorma noastră. Puteți analiza cererea urmărind acest link." + options.auction.id + ".\nOferta va fi deschisă până la " + options.auction.end_date + " ora " + options.auction.end_time + ".\nSistemul va alege automat cea mai bună ofertă pentru consumator. Furnizorul declarat câștigător va primi un e-mail automat de confirmare, împreună cu procedura aferentă semnării contractului.\n\nToate cele bune,", // plain text body
    //         html: html // html body
    //     };
            
    //         this.sendEmail(passwordUpdateEmailForm,(error,info)=>{
    //             if (error){
    //                 return callback(error);
    //             }
    //             return callback(null, info);
    //         })
    //     }
    // sendEmail(template, callback){
    //     this.transporter.sendMail(template, (error, info) => {
    //         if (error) {
    //             return callback(error)
    //         }
    //         console.log('Message sent: %s', info.messageId);
    //         return callback(null, info);
    //     });
    // }
    // exemplePromise(template){
    //     return new Promise((resolve,reject)=>{
    //         this.transporter.sendMail(template, (error, info) => {
    //             if (error) {
    //                 return reject(error)
    //             }
    //             console.log('Message sent: %s', info.messageId);
    //             return resolve(info);
    //         });
    //     });        
    // }
    async sendOfferStartNotice(offer, callback) {
        console.log("email");
        console.log(offer.tip);
        var furnizori = [];
        // furnizori = await User.find({
        //     role: "user",
        //     furnizorEE: true
        // });
        if (offer.tip === "Energie electrica") {
            furnizori = await User.find({
                role: "user",
                furnizorEE: true
            });
        } else if (offer.tip === "Gaze naturale") {
            furnizori = await User.find({
                role: "user",
                furnizorGN: true
            });
        }
        // const furnizori_GN = ''
        // console.log(options);
        // return new Promise((resolve,reject)=>{
        //     const furnizori_EE = User.find({});
        //     (furnizori_EE) => {
        //         if (error) {
        //             return reject(error)
        //         }
        //         console.log(furnizori_EE);
        //         return resolve(info);
        //     };
        // });   

        // extract emails
        furnizori = furnizori.map(a => a.email);
        furnizori = furnizori.toString();
        console.log(furnizori);
        const formatedEndDate = new moment(offer.endDate).format("DD.MM.YYYY HH:mm");
        console.log(offer.endDate);
        console.log(formatedEndDate);

        if (furnizori.length > 0) {
            let html = `<div style="line-height: 1;">Stimate furnizor,</div>
            <p style="line-height: 1;"><br></p>
            <div style="line-height: 1;">Vă anunțăm publicarea unei noi cereri de ofertă.</div>
            <div style="line-height: 1;">Cererea detaliată poate fi accesată <a href="http://localhost:3000/oferte/${offer.id}" rel="noopener noreferrer" target="_blank">aici</a>.</div>
            <div style="line-height: 1;">Vă invităm să studiați cererea și, în funcție de interes, să ofertați până la data de: ${formatedEndDate}.</div>
            <div style="line-height: 1;">La momentul închiderii, sistemul va alege în mod automat cel mai bun preț. În cazul în care oferta dvs. este selectată veți primi un e-mail de confirmare.</div>
            <p><br></p>
            <p style="line-height: 1;">Toate bune,</p>
            <p style="line-height: 1;"><br></p>
            <p style="line-height: 1;">Nord Energy Broker</p>
            <p style="line-height: 1;"><br></p>`
            let offerStartsNoticeTemplate = {
                    from: config.email_sender, // sender address
                    bcc: furnizori, // list of receivers
                    subject: `Nord Energy Broker - Cerere ofertă - ${offer.consum} MW/lună`, // Subject line
                    // text: "Stimată doamnă, Stimate domnule,\n\nVă anunțăm că am publicat o nouă cerere de ofertă pe platorma noastră. Puteți analiza cererea urmărind acest link." + options.auction.id + ".\nOferta va fi deschisă până la " + options.auction.end_date + " ora " + options.auction.end_time + ".\nSistemul va alege automat cea mai bună ofertă pentru consumator. Furnizorul declarat câștigător va primi un e-mail automat de confirmare, împreună cu procedura aferentă semnării contractului.\n\nToate cele bune,", // plain text body
                    html: html // html body
                };
            
                this.transporter.sendMail(offerStartsNoticeTemplate, (error, info) => {
                    console.log("Notificare oferta trimisa catre " + furnizori)
                    if (error) {
                        console.log(error);
                        return callback(error)
                    }
                    // console.log("merge");
                    console.log('Message sent: %s', info.messageId);
                    return callback(null, info);
                });
        } else {

        }
    }

    async sendExtendedAuctionNotice (offer, callback) {
        console.log("email prelungire");
        // console.log(offer.tip);
        var furnizori = [];
        if (offer.tip === "Energie electrica") {
            furnizori = await User.find({
                role: "user",
                furnizorEE: true
            });
        } else if (offer.tip === "Gaze naturale") {
            furnizori = await User.find({
                role: "user",
                furnizorGN: true
            });
        }
        // extract emails
        furnizori = furnizori.map(a => a.email);
        furnizori = furnizori.toString();
        console.log(furnizori);
        const formatedEndDate = new moment(offer.endDate).format("DD.MM.YYYY HH:mm");
        console.log(offer.endDate);
        console.log(formatedEndDate);

        if (furnizori.length > 0) {
            let html = `<div style="line-height: 1;">Stimate furnizor,</div>
            <p style="line-height: 1;"><br></p>
            <div style="line-height: 1;">Vă anunțăm că termenul de depunere a ofertelor pentru licitația cu numărul <strong><a href="http://localhost:3000/oferte/${offer._id}" rel="noopener noreferrer" target="_blank">${offer.id}</a></strong> a fost prelungit până la data de <strong>${formatedEndDate}</strong>.</div>
            <div style="line-height: 1;">La momentul închiderii, sistemul va alege în mod automat cel mai bun preț. În cazul în care oferta dvs. este selectată veți primi un e-mail de confirmare.</div>
            <p><br></p>
            <p style="line-height: 1;">Toate bune,</p>
            <p style="line-height: 1;"><br></p>
            <p style="line-height: 1;">Nord Energy Broker</p>
            <p style="line-height: 1;"><br></p>`
            let offerStartsNoticeTemplate = {
                    from: config.email_sender, // sender address
                    bcc: furnizori, // list of receivers
                    subject: `Nord Energy Broker - Prelungire ofertă (#${offer._id}) - ${offer.consum} MW/lună`, // Subject line
                    // text: "Stimată doamnă, Stimate domnule,\n\nVă anunțăm că am publicat o nouă cerere de ofertă pe platorma noastră. Puteți analiza cererea urmărind acest link." + options.auction.id + ".\nOferta va fi deschisă până la " + options.auction.end_date + " ora " + options.auction.end_time + ".\nSistemul va alege automat cea mai bună ofertă pentru consumator. Furnizorul declarat câștigător va primi un e-mail automat de confirmare, împreună cu procedura aferentă semnării contractului.\n\nToate cele bune,", // plain text body
                    html: html // html body
                };
            
                this.transporter.sendMail(offerStartsNoticeTemplate, (error, info) => {
                    console.log("Notificare oferta trimisa catre " + furnizori)
                    if (error) {
                        console.log(error);
                        return callback(error)
                    }
                    // console.log("merge");
                    console.log('Message sent: %s', info.messageId);
                    return callback(null, info);
                });
        } else {

        }
    }

    async sendOfferAuctionEdited(offer, callback) {
        console.log("email auction edited");
        // console.log(offer.tip);
        var furnizori = [];
        // furnizori = await User.find({
        //     role: "user",
        //     furnizorEE: true
        // });
        if (offer.tip === "Energie electrica") {
            furnizori = await User.find({
                role: "user",
                furnizorEE: true
            });
        } else if (offer.tip === "Gaze naturale") {
            furnizori = await User.find({
                role: "user",
                furnizorGN: true
            });
        }
        // const furnizori_GN = ''
        // console.log(options);
        // return new Promise((resolve,reject)=>{
        //     const furnizori_EE = User.find({});
        //     (furnizori_EE) => {
        //         if (error) {
        //             return reject(error)
        //         }
        //         console.log(furnizori_EE);
        //         return resolve(info);
        //     };
        // });   

        // extract emails
        furnizori = furnizori.map(a => a.email);
        furnizori = furnizori.toString();
        console.log(furnizori);
        const formatedEndDate = new moment(offer.endDate).format("DD.MM.YYYY HH:mm");
        console.log(offer.endDate);
        console.log(formatedEndDate);

        if (furnizori.length > 0) {
            let html = `<div style="line-height: 1;">Stimate furnizor,</div>
            <p style="line-height: 1;"><br></p>
            <div style="line-height: 1;">Vă anunțăm că informațiile privind oferta nr. ${offer.id} au suferit modificări.</div>
            <div style="line-height: 1;">Acestea pot fi accesate <a href="http://192.168.1.152:8080/oferte/${offer.id}" rel="noopener noreferrer" target="_blank">aici</a>.</div>
            <div style="line-height: 1;">Vă invităm să studiați cererea și, în funcție de interes, să ofertați până la data de: ${formatedEndDate}.</div>
            <div style="line-height: 1;">La momentul închiderii, sistemul va alege în mod automat cel mai bun preț. În cazul în care oferta dvs. este selectată veți primi un e-mail de confirmare.</div>
            <p><br></p>
            <p style="line-height: 1;">Toate bune,</p>
            <p style="line-height: 1;"><br></p>
            <p style="line-height: 1;">Nord Energy Broker</p>
            <p style="line-height: 1;"><br></p>`
            let offerStartsNoticeTemplate = {
                    from: config.email_sender, // sender address
                    bcc: furnizori, // list of receivers
                    subject: `Nord Energy Broker - Licitație actualizată - ${offer.consum} MW/lună`, // Subject line
                    // text: "Stimată doamnă, Stimate domnule,\n\nVă anunțăm că am publicat o nouă cerere de ofertă pe platorma noastră. Puteți analiza cererea urmărind acest link." + options.auction.id + ".\nOferta va fi deschisă până la " + options.auction.end_date + " ora " + options.auction.end_time + ".\nSistemul va alege automat cea mai bună ofertă pentru consumator. Furnizorul declarat câștigător va primi un e-mail automat de confirmare, împreună cu procedura aferentă semnării contractului.\n\nToate cele bune,", // plain text body
                    html: html // html body
                };
            
                this.transporter.sendMail(offerStartsNoticeTemplate, (error, info) => {
                    console.log("Notificare oferta modificata trimisa catre " + furnizori)
                    if (error) {
                        console.log(error);
                        return callback(error)
                    }
                    // console.log("merge");
                    console.log('Message sent: %s', info.messageId);
                    return callback(null, info);
                });
        } else {

        }
    }

    async sendNotificationToWinner(offer, callback) {
        console.log("email to winner");
        

        if (offer.buyer) {
            let html = `<div style="line-height: 1;">Stimate furnizor,</div>
            <p style="line-height: 1;"><br></p>
            <div style="line-height: 1;">Vă anunțăm că oferta dvs. depusă în cadrul cererii cu Nr.<a href="http://localhost:3000/oferte/${offer.id}" rel="noopener noreferrer" target="_blank">${offer.id}</a> cu prețul de ${offer.bestPrice} a fost desemnată câștigătoare.</div>
            <div style="line-height: 1;">În următoarele zile vă vom contacta pentru finalizarea de semnare a contractului cu consumatorul.</div>
            <div style="line-height: 1;">În cazul în care considerați că s-a strecurat vreo greșală vă rugăm să ne contactați telefonic în cel mai scurt timp.</div>
            <p><br></p>
            <p style="line-height: 1;">Toate bune,</p>
            <p style="line-height: 1;"><br></p>
            <p style="line-height: 1;">Nord Energy Broker</p>
            <p style="line-height: 1;"><br></p>`
            let winnerTemplate = {
                    from: config.email_sender, // sender address
                    to: offer.buyer, // list of receivers
                    subject: `Nord Energy Broker - Ofertă atribuită`, // Subject line
                    // text: "Stimată doamnă, Stimate domnule,\n\nVă anunțăm că am publicat o nouă cerere de ofertă pe platorma noastră. Puteți analiza cererea urmărind acest link." + options.auction.id + ".\nOferta va fi deschisă până la " + options.auction.end_date + " ora " + options.auction.end_time + ".\nSistemul va alege automat cea mai bună ofertă pentru consumator. Furnizorul declarat câștigător va primi un e-mail automat de confirmare, împreună cu procedura aferentă semnării contractului.\n\nToate cele bune,", // plain text body
                    html: html // html body
                };
            
                this.transporter.sendMail(winnerTemplate, (error, info) => {
                    console.log("invitatie trimisa catre " + offer.buyer)
                    if (error) {
                        console.log(error);
                        return callback(error)
                    }
                    // console.log("merge");
                    console.log('Message sent: %s', info.messageId);
                    return callback(null, info);
                });
        } else {
            var author = await User.findById(task.author);
            let html = `<div style="line-height: 1;">Stimate furnizor,</div>
            <p style="line-height: 1;"><br></p>
            <div style="line-height: 1;">Vă anunțăm că oferta dvs. depusă în cadrul cererii cu Nr.<a href="http://localhost:3000/oferte/${offer.id}" rel="noopener noreferrer" target="_blank">${offer.id}</a> cu prețul de ${offer.bestPrice} a fost desemnată câștigătoare.</div>
            <div style="line-height: 1;">În următoarele zile vă vom contacta pentru finalizarea de semnare a contractului cu consumatorul.</div>
            <div style="line-height: 1;">În cazul în care considerați că s-a strecurat vreo greșală vă rugăm să ne contactați telefonic în cel mai scurt timp.</div>
            <p><br></p>
            <p style="line-height: 1;">Toate bune,</p>
            <p style="line-height: 1;"><br></p>
            <p style="line-height: 1;">Nord Energy Broker</p>
            <p style="line-height: 1;"><br></p>`
            let adminNotificationTemplate = {
                    from: config.email_sender, // sender address
                    to: author.sendMail, // list of receivers
                    subject: `Nord Energy Broker - Ofertă atribuită`, // Subject line
                    // text: "Stimată doamnă, Stimate domnule,\n\nVă anunțăm că am publicat o nouă cerere de ofertă pe platorma noastră. Puteți analiza cererea urmărind acest link." + options.auction.id + ".\nOferta va fi deschisă până la " + options.auction.end_date + " ora " + options.auction.end_time + ".\nSistemul va alege automat cea mai bună ofertă pentru consumator. Furnizorul declarat câștigător va primi un e-mail automat de confirmare, împreună cu procedura aferentă semnării contractului.\n\nToate cele bune,", // plain text body
                    html: html // html body
                };
            
                this.transporter.sendMail(adminNotificationTemplate, (error, info) => {
                    console.log("Informare trimisa catre " + author.email)
                    if (error) {
                        console.log(error);
                        return callback(error)
                    }
                    // console.log("merge");
                    console.log('Message sent: %s', info.messageId);
                    return callback(null, info);
                });
        }
    }

    sendInvitation (user, callback) {
        let html = `<div style="line-height: 1;">Stimate furnizor,</div>
        <p style="line-height: 1;"><br></p>
        <div style="line-height: 1;">Avem plăcerea să vă invităm pe platforma noastră de ofertare.</div>
        <div style="line-height: 1;"><a href="http://localhost"></a><a href="http://localhost:3000/inregistrare/" rel="noopener noreferrer" target="_blank">Aici</a> aveți linkul catre formularul de &icirc;nregistrare.</div>
        <p><br></p>
        <p style="line-height: 1;">Vă mulțumim!</p>
        <p style="line-height: 1;">O zi frumoasă,</p>
        <p style="line-height: 1;"><br></p>
        <p style="line-height: 1;">Nord Energy Broker</p>
        <p style="line-height: 1;"><br></p>`

        let sentInvitationTemplate = {
            from: config.email_sender, // sender address
            to: user, // list of receivers
            subject: "Invitație platformă ofertare✔", // Subject line
            // text: "Stimate furnizor,\n\nVa invitam pe platforma noastra. Atasat aveti linkul catre formularul de inregistrare.",
            html: html // html body
        };
        this.transporter.sendMail(sentInvitationTemplate, (error, info) => {
            console.log("invitatie trimisa catre " + user)
            if (error) {
                console.log(error);
                return callback(error)
            }
            // console.log("merge");
            console.log('Message sent: %s', info.messageId);
            return callback(null, info);
        });
    }

    sendConfirmation (user, callback) {
        let html = `<p style="line-height: 1;">Stimate furnizor,</p>
        <p style="line-height: 1;"><br></p>
        <p style="line-height: 1;">Vă mulțumim pentru interesul acordat. Contul a fost &icirc;nregistrat cu succes.</p>
        <p style="line-height: 1;">După verificarea datelor vă vom transmite contractul de colaborare. Pentru eventuale &icirc;ntrebări sau nelămuriri vă rugăm să ne contactați telefonic sau prin e-mail.</p>
        <p style="line-height: 1;"><br></p>
        <p style="line-height: 1;">Toate bune!</p>`;
        // console.log("http://localhost:" + process.env.PORT + "/inregistrare");
        let sendConfirmationTemplate = {
            from: config.email_sender, // sender address
            to: user, // list of receivers
            subject: "Confirmare înregistrare cont nou", // Subject line
            // text: "Stimate furnizor,\n\nVă mulțumim pentru interesul acordat. Contul a fost înregistrat cu succes.\nDupă verificarea datelor vă vom transmite contractul de colaborare.\nDacă aveți întrebări vă rugăm să ne contactați telefonic sau prin e-mail.\n\nToate bune!"
            html: html // html body
        };
        this.transporter.sendMail(sendConfirmationTemplate, (error, info) => {
            if (error) {
                console.log(error);
                return callback(error)
            }
            console.log('E-mail de confirmare a inregistrarii trimis catre %s', info.messageId);
            return callback(null, info);
        });
    }

    sendActivation (user, callback) {
        let html = `<p style="line-height: 1;">Stimate furnizor,</p>
        <p style="line-height: 1;"><br></p>
        <p style="line-height: 1;">Contul dvs. a fost activat.</p>
        <p style="line-height: 1;">Din acest moment puteti participa la ofertare.</p>
        <p style="line-height: 1;"><br></p>
        <p style="line-height: 1;">Toate bune!</p>`;
        // console.log("http://localhost:" + process.env.PORT + "/inregistrare");
        let sendActivationTemplate = {
            from: config.email_sender, // sender address
            to: user, // list of receivers
            subject: "Confirmare activare cont", // Subject line
            // text: "Stimate furnizor,\n\nVă mulțumim pentru interesul acordat. Contul a fost activat.\nDupă verificarea datelor vă vom transmite contractul de colaborare.\nDacă aveți întrebări vă rugăm să ne contactați telefonic sau prin e-mail.\n\nToate bune!"
            html: html // html body
        };
        this.transporter.sendMail(sendActivationTemplate, (error, info) => {
            if (error) {
                console.log(error);
                return callback(error)
            }
            console.log('E-mail de confirmare a activarii contului trimis catre %s', info.messageId);
            return callback(null, info);
        });
    }

    async sendMessage(details, callback) {
        console.log("email");
        console.log(details.recipients.join(", "));
        

        if (details.recipients.length > 0) {
            let sendMessageTemplate = {
                    from: config.email_sender, // sender address
                    bcc: details.recipients.join(", "), // list of receivers
                    subject: details.title, // Subject line
                    // text: "Stimată doamnă, Stimate domnule,\n\nVă anunțăm că am publicat o nouă cerere de ofertă pe platorma noastră. Puteți analiza cererea urmărind acest link." + options.auction.id + ".\nOferta va fi deschisă până la " + options.auction.end_date + " ora " + options.auction.end_time + ".\nSistemul va alege automat cea mai bună ofertă pentru consumator. Furnizorul declarat câștigător va primi un e-mail automat de confirmare, împreună cu procedura aferentă semnării contractului.\n\nToate cele bune,", // plain text body
                    html: details.text.text // html body
                };
            // console.log(sendMessageTemplate);
            // this.sendEmail(sendMessageTemplate,(error,info)=>{
            //     if (error){
            //         return callback(error);
            //     }
            //     return callback(null, info);
            // })
            this.transporter.sendMail(sendMessageTemplate, (error, info) => {
                if (error) {
                    console.log(error);
                    return callback(error)
                }
                console.log('E-mail de informare trimis catre %s', info.messageId);
                return callback(null, info);
            });
        } else {

        }
    }
}

// function EmailSenderComponent(){
//     nodemailer.createTestAccount( (err, account) => {
//         EmailSenderComponent.transporter = nodemailer.createTransport({
//             host: "gmail.com",
//             port: 587,
//             secure: "",
//             auth: {
//                 user: account.user,
//                 pass: account.pass
//             }
//         });
//     });
// };

// EmailSenderComponent.prototype.sendReset = (options, callback) => {
//     let resetPassEmailForm = {
//         from: '"RDclone 👻" <foo@example.com>', // sender address
//         to: options.user.email, // list of receivers
//         subject: 'Password reset request✔', // Subject line
//         text: 'Click here to reset password', // plain text body
//         html: 'http://localhost:' + config.process.ENV.PORT + '/resetpassword/:' + options.token // html body
//     };
    
//     EmailSenderComponent.transporter.sendMail(resetPassEmailForm, (error, info) => {
//         if (error) {
//             return callback(error)
//         }
//         console.log('Message sent: %s', info.messageId);
//         return callback(null, info);
//     });
// };

// EmailSenderComponent.prototype.resetConfirm = (options, callback) => {
//     let resetPassEmailForm = {
//         from: '"RDclone 👻" <foo@example.com>', // sender address
//         to: options.user.email, // list of receivers
//         subject: 'Password reset request✔', // Subject line
//         text: 'Click here to reset password', // plain text body
//         html: 'http://localhost:' + config.process.ENV.PORT + '/resetpassword/:' + options.token // html body
//     };
    
//     EmailSenderComponent.transporter.sendMail(resetPassEmailForm, (error, info) => {
//         if (error) {
//             return callback(error)
//         }
//         console.log('Message sent: %s', info.messageId);
//         return callback(null, info);
//     });
// };

module.exports = new emailSenderComponent();
// module.exports = test;

//{
//  user:'test'
//  token: 123456789
//}

//{
//  token: 123456789
//  user:'test'
//}

// EmailSenderComponent.resetPassEmailForm = (options) =>({
//     from: '"RDclone 👻" <foo@example.com>', // sender address
//     to: options.user.email, // list of receivers
//     subject: options.subject, // Subject line
//     text: 'Click here to reset password', // plain text body
//     html: 'http://localhost:' + config.process.ENV.PORT + '/resetpassword/:' + options.token // html body
// });

// EmailSenderComponent.passwordUpdateEmailForm = (user)=>({
//     from: '"RDclone 👻" <foo@example.com>', // sender address
//     to: user.email, // list of receivers
//     subject: 'Password update confirmation ✔', // Subject line
//     text: 'Hello ' + user.username + '. Your password has been successfuly updated', // plain text body
//     html: '<b>Hello world?</b>' // html body
// })

// EmailSenderComponent.sendReset = (req, res) => { transporter.sendMail(req.options, (error, info) => {
//     if (error) {
//         return res.status(500).json({
//             message: err.message
//         });
//     }
//     console.log('Message sent: %s', info.messageId);

// });
// }