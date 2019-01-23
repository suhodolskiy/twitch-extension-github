class TwitchApi {
  get twitch() {
    return window.Twitch ? window.Twitch.ext : null
  }

  /**
   * Get Extension Configuration Segment
   * https://dev.twitch.tv/docs/extensions/reference/#get-extension-configuration-segment
   * @param segment
   * @returns {*|null}
   */
  getConfigurationSegment(segment = 'broadcaster') {
    if (segment && this.twitch) {
      let config = this.twitch.configuration[segment]
        ? this.twitch.configuration[segment].content
        : null

      try {
        config = JSON.parse(config)
      } catch (error) {
        config = null
      }

      return config
    }
  }

  setConfigurationSegment(config, segment = 'broadcaster') {
    if (config && segment && this.twitch) {
      this.twitch.configuration.set(segment, '', JSON.stringify(config))
    }
  }
}

export default new TwitchApi()
