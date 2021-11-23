module.exports = (config) => ({
  name: "ping",
  description: "Ping the bot",
  execute(e) {
    e.send(config.message || "Pong!")
  },
})
