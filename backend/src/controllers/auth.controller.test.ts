import {describe,it,expect,beforeAll,afterAll} from 'vitest'
import request from 'supertest'
import {app} from '../server'
import prisma from '../prisma'

describe('Auth controller',()=>{
    let testUserId:number

    beforeAll(async()=>{
        await prisma.cartItem.deleteMany({
            where:{cart:{user:{email:'test@gmail.com'}}}
        })
        await prisma.cart.deleteMany({
            where:{user:{email:'test@gmail.com'}}
        })
        await prisma.orderItem.deleteMany({
            where:{order:{user:{email:'test@gmail.com'}}}
        })
        await prisma.order.deleteMany({
            where:{user:{email:'test@gmail.com'}}
        })
        await prisma.review.deleteMany({
            where:{user:{email:'test@gmail.com'}}
        })
        await prisma.favorite.deleteMany({
            where:{user:{email:'test@gmail.com'}}
        })
        await prisma.user.deleteMany({
            where:{email:'test@gmail.com'}
        })
    })

    afterAll(async()=>{
        await prisma.$disconnect()
    })

    describe('POST /api/auth/register',()=>{
        it('should register a new user',async()=>{
            const res=await request(app)
                .post('/api/auth/register')
                .send({
                    email:'test@gmail.com',
                    password:'12345Qwe!',
                    name:'Test User'
                })
            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('message')
            expect(res.body.user).toHaveProperty('id')
            expect(res.body.user.email).toBe('test@gmail.com')
            expect(res.body.user.name).toBe('Test User')

            testUserId=res.body.user.id
        })

        it('should return 400 if email already exists',async()=>{
            const res=await request(app)
                .post('/api/auth/register')
                .send({
                    email:'test@gmail.com',
                    password:'12345Qwe!',
                    name:'Test User'
                })
            expect(res.status).toBe(400)
            expect(res.body.error).toContain('пользователь с таким же email уже существует')
        })
        // it('should return 400 if email is missing',async()=>{
        //     const res=await request(app)
        //         .post('/api/auth/register')
        //         .send({
        //             password:'12345Qwe!',
        //             name:"Test User"
        //         })
        //     expect(res.status).toBe(400)
        // })
    })
})