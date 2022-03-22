import { toggleTheme } from '../../libs/utils'

import twitchApi, { ITwitchConfigType, ITwitchTheme } from '../../libs/twitch'
import githubApi from '../../libs/github'

import '../../stylesheets/main.scss'
import '../../stylesheets/components/repository.scss'
import './panel.scss'

import { renderState, renderProfile } from './render'

interface IState {
  theme?: ITwitchTheme
  type: ITwitchConfigType
}

const state: IState = {
  theme: ITwitchTheme.Light,
  type: ITwitchConfigType.Personal,
}

const setTheme = (theme: ITwitchTheme = ITwitchTheme.Light) => {
  state.theme = toggleTheme<ITwitchTheme>(theme, state.theme)
}

const init = () => {
  renderState('Loading ...')

  twitchApi.client?.onAuthorized(async () => {
    const config = twitchApi.getConfigurationSegment()
    const type = config?.type || ITwitchConfigType.Personal

    if (config?.login) {
      try {
        const profile =
          type === ITwitchConfigType.Personal
            ? await githubApi.getUser(config.login)
            : await githubApi.getOrganization(config.login)

        if (profile?.login) {
          renderProfile(profile, type)
        }
      } catch (err) {
        renderState(`Failed to load github profile. ${err}`)
        throw err
      }
    }
  })

  twitchApi.client?.onContext((context) =>
    setTheme(context?.theme as ITwitchTheme)
  )

  twitchApi.client?.onError(renderState)
}

window.addEventListener('load', init)
