import { Schema,Types,model } from 'mongoose';


interface Cards{
    title:String,
    labels:Object,
    date:String,
    desc:String,
    tasks:String,

}

interface boards{
    cards:[]
}
interface User{
    name:String,
    email:String,
    password:String,
    boards:[]
}



const userSchema = new Schema({
    name:String,
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    boards:[
        {}
    ],
    image:String

})

const boardSchema = new Schema({
    title:String,
    cards:[{

    }]
})

const cardSchema = new Schema({
    title:String,
    labels:{
        type:{}
    },
    date:Date,
    desc:{type:String},
    tasks:[
        {}
    ]
})


export const User = model('user',userSchema);
export const Board = model('boards',boardSchema);
export const Cards = model('cards',cardSchema);

