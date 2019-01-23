import { h, app } from 'hyperapp'

import InputBase from '../InputBase/InputBase'
import IconGithub from '../Icons/IconGithub'
import { toggleTheme } from '../../utils/utils'
import twitchApi from '../../api/twitch'

import '../../stylesheets/main.scss'
import './config.scss'

app(
  {
    theme: 'light',
    loading: false,
    login: null,
    error: null,
  },
  {
    initTwitch: () => (state, actions) => {
      if (twitchApi.twitch) {
        twitchApi.twitch.onAuthorized(() => {
          const configBroadcaster = twitchApi.getConfigurationSegment()
          if (configBroadcaster && configBroadcaster.login) {
            actions.setLogin(configBroadcaster.login)
          }
        })

        twitchApi.twitch.onContext((context) => {
          if (context && context.theme) actions.setTheme(context.theme)
        })

        twitchApi.twitch.onError((error) => actions.setError(error))
      }
    },
    handleSubmitForm: (event) => (state) => {
      event.preventDefault()
      twitchApi.setConfigurationSegment({ login: state.login })
    },
    setLoading: (state = true) => ({ loading: state }),
    setLogin: (login) => ({ login }),
    setTheme: (theme) => (state) => toggleTheme(theme, state.theme),
    setError: (error) => ({ error }),
  },
  (state, actions) => (
    <div className="app" oncreate={actions.initTwitch}>
      <div className="config">
        <IconGithub />
        <div className="config__form">
          <form className="form" onsubmit={actions.handleSubmitForm}>
            <InputBase
              onChange={actions.setLogin}
              value={state.login}
              label="Github username"
            />
            <div className="form__footer">
              <button type="submit" className="btn btn--block btn--primary">
                Save
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
