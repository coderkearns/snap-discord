class PluginEvent {
  constructor({ client, message, args, plugin, snap }) {
    this.snap = snap
    this.client = client
    this.message = message
    this.args = args
    this.plugin = plugin
    this.db = client.db
  }

  send(...args) {
    this.message.channel.send(...args)
  }

  debug(...args) {
    console.log(...args)
  }

  error(msg) {
    this.send("There was an error in that plugin...")
    this.debug(`ERROR: ${this.plugin.name} - ${msg}`)
  }
}

module.exports = PluginEvent
