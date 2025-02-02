const express = require('express')
const { PrismaClient } = require('@prisma/client')

const app = express();

app.use(express.json());
const prisma = new PrismaClient();


app.get(("/users"), async (request, response) => {
    const user = await prisma.users.findMany();
    response.status(200).json(user)
})

app.post(("/users"), async (request, response) => {
    const { name, email, password } = request.body;
    const user = await prisma.users.create({
        data: {
            email,
            password,
            name
        }
    });
    response.status(201).json(user);
})

app.put(("/users/:id"), async (request, response) => {
    const { name, email, password } = request.body;
    const { id } = request.params;
    const user = await prisma.users.findFirst({
        where: { id }
    })

    if(user){
        const user = await prisma.users.update({
            data: {
                name,
                email,
                password
            },
            where: { id }
        })
        response.status(200).json(user)

    }else {
        response.status(404).json("User not found")
    }
})

app.delete(("/users/:id"), async (request, response) => {
    const { id } = request.params;
    const user = await prisma.users.findFirst({
        where: { id }
    })

    if(user) {
        await prisma.users.delete({
            where: { id }
        })
        response.status(204).send()

    }else {
        response.status(404).json("Usuário não encontrado")
    }
})

app.listen(3000, () => {
    console.log("Running server")
})