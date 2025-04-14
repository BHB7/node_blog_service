const app = require('./src/app')
const { port } = require('./src/utils/getConfig')

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})

