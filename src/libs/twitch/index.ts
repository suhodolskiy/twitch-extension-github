export enum ITwitchConfigType {
  Organization = 1,
  Personal = 2,
}

export enum ITwitchTheme {
  Light = 'light',
  Dark = 'Dark',
}

export interface ITwitchConfig {
  type?: ITwitchConfigType
  login?: string
}

class TwitchApi {
  get client() {
    return window.Twitch ? window.Twitch.ext : null
  }

  /**
   * Get Extension Configuration Segment
   * https://dev.twitch.tv/docs/extensions/reference/#get-extension-configuration-segment
   * @param segment
   * @returns {*|null}
   */
  getConfigurationSegment(): ITwitchConfig | undefined {
    const config = this.client?.configuration.broadcaster?.content

    if (!config) return

    try {
      return JSON.parse(config)
    } catch (error) {
      return undefined
    }
  }

  setConfigurationSegment(config: any) {
    if (config) {
      this.client?.configuration.set('broadcaster', '', JSON.stringify(config))
    }
  }
}

export default new TwitchApi()
