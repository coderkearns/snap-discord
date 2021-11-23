module.exports = function(config={}) {
    return {
        name: "ping",
        description: "Ping the bot",
        execute(e) {
          e.send(config.message || "Pong!")
        },
      }
}