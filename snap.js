const Discord = require("discord.js")
const Enmap = require("enmap")
const PluginEvent = require("./plugin-event")

class Snap {
  constructor(config) {
    this.config = config
    this.client = new Discord.Client()

    this._startup()
  }

  run() {
    if (!this.config.token) throw new Error("Snap requires a token as config.")
    this.client.login(this.config.token)
  }

  _startup() {
    this.client.once("ready", () => {
      this.client.db = new Enmap()
      this._setupPlugins()
      console.log(`${this.client.user.tag} is up and running!`)
    })

    this.client.on("message", msg => this._onMessage(msg))
  }

  _onMessage(message) {
    if (message.author.bot) return
    if (!message.content.startsWith(this.config.prefix)) return

    const [args, pluginName] = this._parseMessage(message)

    const plugin = this._getPlugin(pluginName)
    if (!plugin) return

    if (plugin.requiresArgs && !!args.length)
      throw new Error(`'${plugin.name}' requires arguments.`)
    if (plugin.requiresGuild && message.channel.type === "dm")
      throw new Error(`'${plugin.name}' on runs in servers.`)
    if (plugin.permissions) {
      const authorPerms = message.channel.permissionsFor(message.author)
      if (!authorPerms || !authorPerms.has(plugin.permissions)) return
    }

    plugin.execute(
      this._createPluginEvent({ plugin, args, message, client: this.client })
    )
  }

  _parseMessage(message) {
    const args = message.content
      .slice(this.config.prefix.length)
      .trim()
      .split(/ +/)
    const pluginName = args.shift().toLowerCase()
    return [args, pluginName]
  }

  _getPlugin(pluginName) {
    return (
      this.client.plugins.get(pluginName) ||
      this.client.plugins.find(
        plugin => plugin.aliases && plugin.aliases.includes(pluginName)
      )
    )
  }

  _setupPlugins() {
    this.client.plugins = new Discord.Collection()
    for (let plugin of this.config.plugins) {
      Snap.validatePlugin(plugin)
      this.client.plugins.set(plugin.name, plugin)
    }
  }

  _createPluginEvent({ plugin, args, message, client }) {
    return new PluginEvent({ plugin, args, message, client, snap: this })
  }

  static validatePlugin(plugin) {
    if (
      !Snap.validate([
        !!plugin,
        typeof plugin === "object",
        !!plugin.name,
        !!plugin.execute,
      ])
    )
      throw new Error(
        "Plugins must be objects with the 'name' and 'execute' properties."
      )
  }

  static validate(conditions) {
    return !conditions.includes(false)
  }
}

Snap.Discord = Discord
Snap.Enmap = Enmap
module.exports = Snap
