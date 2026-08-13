import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma=new PrismaClient()

const users=[
    {name:"Alexey",email:'alexey@mail.com'},
    {name:"Maksim",email:'maksim@mail.com'},
    {name:"Artem",email:'artem@mail.com'},
    {name:"Sem",email:'sem@mail.com'},
    {name:"Jon",email:'jon@mail.com'},
    {name:"Martin",email:'martin@mail.com'},
    {name:"Li",email:'li@mail.com'},
    {name:"Glenn",email:'glenn@mail.com'},
    {name:"Name",email:'name@mail.com'},
    {name:"Vendy",email:'vendy@mail.com'},
]

const createUsers=async()=>{
    for(const user of users){
        const hashedPassword=await bcrypt.hash('123456',10)
        await prisma.user.create({
            data:{
                name:user.name,
                email:user.email,
                password:hashedPassword,
                role:'user'
            }
        })
        console.log(`created ${user.name}`)
    }
    console.log('10 users created')
}

createUsers()
    .catch(console.error)
    .finally(()=>prisma.$disconnect())