import { h, app } from 'hyperapp'

import InputBase from '../InputBase/InputBase'
import SelectBase from '../SelectBase/SelectBase'
import IconGithub from '../Icons/IconGithub'
import { toggleTheme } from '../../libs/utils'
import twitchApi from '../../api/twitch'

import * as constants from '../../libs/constants'

import '../../stylesheets/main.scss'
import './config.scss'

app(
  {
    type: constants.GITHUB_PROFILE_TYPE_PERSONAL,
    theme: 'light',
    login: null,
    saved: false,
    error: null,
  },
  {
    initTwitch: () => (state, actions) => {
      if (twitchApi.twitch) {
        twitchApi.twitch.onAuthorized(() => {
          const configBroadcaster = twitchApi.getConfigurationSegment()
          if (configBroadcaster) {
            if (configBroadcaster.login)
              actions.setLogin(configBroadcaster.login)
            if (configBroadcaster.type) actions.setType(configBroadcaster.type)
          }
        })

        twitchApi.twitch.onContext((context) => {
          if (context && context.theme) actions.setTheme(context.theme)
        })

        twitchApi.twitch.onError((error) => actions.setError(error))
      }
    },
    handleSubmitForm: (event) => (state, actions) => {
      event.preventDefault()
      twitchApi.setConfigurationSegment({
        login: state.login,
        type: state.type,
      })
      actions.setSaved()
    },
    setSaved: (saved = true) => (state, actions) => {
      if (saved !== state.saved) {
        if (saved) setTimeout(() => actions.setSaved(!saved), 2000)
        return { saved }
      }
    },
    setLogin: (login) => ({ login }),
    setType: (type) => ({ type: Number(type) }),
    setTheme: (theme) => (state) => toggleTheme(theme, state.theme),
    setError: (error) => ({ error }),
  },
  (state, actions) => (
    <div className="app" oncreate={actions.initTwitch}>
      <div className="config">
        <IconGithub />
        <div className="config__form">
          <form className="form" onsubmit={actions.handleSubmitForm}>
            <SelectBase
              options={[
                {
                  value: constants.GITHUB_PROFILE_TYPE_PERSONAL,
                  label: 'Personal',
                },
                {
                  value: constants.GITHUB_PROFILE_TYPE_COMPANY,
                  label: 'Company',
                },
              ]}
              onChange={actions.setType}
              value={state.type}
              label="Profile type"
            />
            <InputBase
              placeholder="Please type github login"
              onChange={actions.setLogin}
              label="Github login"
              value={state.login}
            />
            <div className="form__footer">
              <button
                type="submit"
                className="btn btn--block btn--primary"
                disabled={state.saved || !state.login}
              >
                {state.saved ? 'Saved!' : 'Save'}
              </button>
            </div>
          </form>
        </div>
        <div className="config__footer">
          <a
            className="config__link-twitch"
            href="https://www.twitch.tv/suhodolskiy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Powered by <span>@suhodolskiy</span>
          </a>
          <a
            className="config__link-repo"
            href="https://github.com/suhodolskiy/twitch-extension-github"
            rel="noopener noreferrer"
            target="_blank"
          >
            github.com/suhodolskiy/twitch-extension-github
          </a>
        </div>
      </div>
    </div>
  ),
  document.getElementById('root')
)
