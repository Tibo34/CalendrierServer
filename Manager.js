const jwt = require('jsonwebtoken')
const secret='thisismysecret'


/**
 * class eventList qui stocke les evenements
 */
class EventsList{    

    constructor() {
        this.listEvents=[]
        this.id=1
    }

    /**
     * permet de récupérer tous les evenements d'une liste
     */
    getAllEvents(){
        return this.listEvents
    }

    /**
     * recupere un evenement à partir de son id
     * @param {identifiant} id 
     */
    getEvent(id){
        let event=this.listEvents.find(e=>e.id===parseInt(id))
        return event
    }


    addEvent(title,date){
        let event=new EventCalendar(this.id++,title,date)
        let size=this.listEvents.length
        this.listEvents.push(event)
        return {res:size<this.listEvents.length,event}        
    }

    deleteEvent(id){
        let i=0
        while(this.listEvents[i].id!==id){
            i++
        }
        this.listEvents.splice(i,1)
        return i<this.listEvents.length

    }

}


class EventCalendar{
    constructor(id,title,date) {
        this.id = id
        this.title = title
        this.date = date
    }
}


class Users{

    constructor() {
        this.listUser=[]
        this.id=1
    }

    addUser(name,firstname,email,password){
        let userExist=this.listUser.find(u=>{
            return u.name===name&&u.firstName==firstname
        })
        if(userExist){
            return false
        }
        let user=new User(this.id++,name,firstname,email,password)
        this.listUser.push(user)
        return true
    }

    getUser(token){
        let jwtDecode=jwt.verify(token,secret)
        let user=this.listUser.find(user=>user.email===jwtDecode.email)
        return user;
    }

}


class User{

    constructor(id,name,firstname,email,password){
        this.name=name
        this.firstName=firstname
        this.email=email
        this.password=password
        this.id=id
        this.eventList=new EventsList()
    }

    getEvent(id){
        let event=this.eventList.getEvent(id)
        return event
    }

    getAllEvents(){
        return this.eventList
    }

    addEvent(titre,date){
        let e=this.eventList.addEvent(titre,date)
        return e
    }

    deleteEvent(id){
        let answer=this.eventList.deleteEvent(id)
        return answer
    }
}


module.exports = {
    EventsList : EventsList,
    Users : Users,
    User:User,
    EventCalendar:EventCalendar
}




