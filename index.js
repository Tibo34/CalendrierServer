
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const passport=require('passport')
const passportJWT=require('passport-jwt')
const secret='thisismysecret'
const JwtStrategy =passportJWT.Strategy;
const ExtractJwt =passportJWT.ExtractJwt;
const bodyParser = require('body-parser')
const urlEncodedParser = bodyParser.urlencoded({ extended: false })
var cors = require('cors')
var session = require('express-session')
const manager = require('./Manager')


var cookieParser = require('cookie-parser')
app.options('*', cors())
app.use(cookieParser())
let optionSession={
    name: 'session-calendar',
    secret:'thisismysecret',
    cookie: {
        secure:false,
        httpOnly:false
    },
    User:{}
}
app.use(session(optionSession))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
})


var Users=manager.Users
var users= new Users()

var opts = {
    secretOrKey : secret,
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken()
}

const jwtStrategy=new JwtStrategy(opts,function(payLoad,next){
    const user=users.find(user=>user.mail===payLoad.user)
    console.log(payLoad.user)
    if(user){
        next(null,user)
    }
    else{
        next(null,false)
    }
})

passport.use(jwtStrategy)


/**
 * récupérer un evenement à partir de son id
 */
app.post('/getEvent',(req,res)=>{
    let user=users.getUser(req.body.jwt)
    let event=user.getEvent(req.body.id)
    res.send(event)
})

/**
 * recupérer la liste des evenements d'un utilisateur
 */
app.post('/getEventsList',urlEncodedParser,(req,res)=>{
    let token=req.body.jwt;
    let user=users.getUser(token)   
    let events=user.getAllEvents()
    res.send(events)
})

/**
 * ajoute un evenement 
 */
app.post('/addEvent',urlEncodedParser,(req,res)=>{
    let token=req.body.jwt;
    let user=users.getUser(token)
    let titre=req.body.titre
    let date=req.body.date
    let answer=user.addEvent(titre,date)
    res.send(answer)
})

app.post('/deleteEvent',(req,res)=>{
    let user=users.getUser(req.body.jwt)
    let id=parseInt(req.body.id)
    let answer=user.deleteEvent(id)
    res.send(answer)
})



/**
 * créer un compte
 * 
 */
app.post('/createCompte',urlEncodedParser,(req,res)=>{  
    let nom=req.body.nom
    let prenom=req.body.prenom
    let email=req.body.email
    let pwd=req.body.password
    let answer=users.addUser(nom,prenom,email,pwd)    
    res.send(answer)
})

/**
 * authentification
 */
app.post('/login', urlEncodedParser, (req,res)=>{
    let token=req.body.token;
    let customer=users.getUser(token);
    if(customer==undefined){
        res.status(401).json({error:"Login ou mot de passe invalide"})
    }
    else{
    let infos=jwt.verify(token,secret);
    let verif=identification(customer,infos);
        if(!verif){
            res.status(401).json({error:"Login ou mot de passe invalide"});
        }
    
        req.session.name='session-calendar';
        req.session.user=customer;
        req.session.jwt=token;
        req.session.cookie.jwt=token
        res.cookie('jwt',token)
        res.send(req.session)   
    } 
})
  

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
  })


function identification(user,info){
    if(user.email===info.email&&user.password===info.password){
        return true;
    }
    else{
        return false;
    }
    
 }


 