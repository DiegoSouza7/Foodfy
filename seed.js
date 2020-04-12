const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/users')
const File = require('./src/app/models/File')
const Chef = require('./src/app/models/chefs')
const Receita = require('./src/app/models/recipes')
const RecipeFiles = require('./src/app/models/recipeFiles')

let usersIds = []
let usersIdAdm = []
let totalUsers = 2
let totalUserAdm = 1
let chefsId = []
let totalChefs = 5
let recipesId = []
let totalRecipes = 10


async function createUsers() {
    const users = []
    const password = await hash('123', 8)

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            reset_token: '',
            reset_token_expires: '',
            is_admin: false
        })
    }

    const usersPromise = users.map(user => User.create(user))

    usersIds = await Promise.all(usersPromise)
}

async function createUserAdm() {
    const users = []
    const password = await hash('123', 8)

    while (users.length < totalUserAdm) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            reset_token: '',
            reset_token_expires: '',
            is_admin: true
        })
    }

    const usersPromise = users.map(user => User.create(user))

     usersIdAdm = await Promise.all(usersPromise)
}

async function createChefs() {
    usersIds = [
        ...usersIds,
        ...usersIdAdm
    ]
    const chefs = []
    
    while(chefs.length < totalChefs) {
        let file = []

        file.push({
            name: faker.image.image(),
            path: `https://source.unsplash.com/collection/2013520/640x480`,
        })
        
        file = await File.create(file[0])
        chefs.push({
            name: faker.name.firstName(),
            user_id: usersIds[Math.floor(Math.random() * 3)],
            file_id: file
        })
    }
    const chefsPromise = chefs.map(chef => Chef.create(chef))
    
    chefsId = await Promise.all(chefsPromise)
}

async function createRecipes() {
    const recipes = []
    let recipesFilesId = []
    
    while(recipes.length < totalRecipes) {
        recipes.push({
            chef_id: chefsId[Math.floor(Math.random() * totalChefs)],
            title: faker.name.title(),
            ingredients: [faker.name.title()],
            preparation: [faker.name.title()],
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 10))
        })
    }

    const recipesPromise = recipes.map(recipe => Receita.create(recipe))
    recipesId = await Promise.all(recipesPromise)
    
    for(receita of recipesId) {
        const recipeFiles = []
        const files = []
        let filesId = []

        while(files.length < 3) {
            files.push({
                name: faker.image.image(),
                path: `https://source.unsplash.com/collection/2013520/640x480`,
            })
        }

        const filesPromice = files.map(file => File.create(file))

        filesId = await Promise.all(filesPromice)

        filesId.map(id => {
            recipeFiles.push({
                recipe_id: receita,
                file_id: id
            })
        })

        const recipeFilesPromise = recipeFiles.map(recipeFile => RecipeFiles.create(recipeFile))
        recipesFilesId = await Promise.all(recipeFilesPromise)
    }


}

async function init() {
    await createUsers()
    await createUserAdm()
    await createChefs()
    await createRecipes()
}

init()