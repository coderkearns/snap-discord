const Snap = require("../snap")

const client = new Snap({
    token: process.env.TOKEN,
    prefix: "!",
    plugins: [
        require("./plugins/ping")({ message: "No U" }),
    ]
})

client.run()