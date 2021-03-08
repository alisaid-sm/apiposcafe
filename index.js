const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const menuRouter = require('./src/routers/menu')
const historyRouter = require('./src/routers/history')
const categoryRouter = require('./src/routers/category')
const userRouter = require('./src/routers/user')
const { PORT } = require('./src/helpers/env')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())

app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')

app
    .use('/api/v1/menu', menuRouter)
    .use('/api/v1/history', historyRouter)
    .use('/api/v1/category', categoryRouter)
    .use('/api/v1/user', userRouter)
    .use(express.static('public'))

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})