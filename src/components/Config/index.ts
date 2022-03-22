import { asyncTimeout, toggleTheme } from '../../libs/utils'
import twitchApi, { ITwitchConfigType, ITwitchTheme } from '../../libs/twitch'

import '../../stylesheets/main.scss'
import '../../stylesheets/components/input-base.scss'
import '../../stylesheets/components/select-base.scss'
import './config.scss'

interface IState {
  theme?: ITwitchTheme
  form: {
    type: ITwitchConfigType
    login: string
  }
}

const state: IState = {
  theme: ITwitchTheme.Light,
  form: {
    type: ITwitchConfigType.Personal,
    login: '',
  },
}

const setTheme = (theme: ITwitchTheme = ITwitchTheme.Light) => {
  state.theme = toggleTheme<ITwitchTheme>(theme, state.theme)
}

const initForm = () => {
  const form = document.querySelector('form')
  const button = document.querySelector('button')

  const typeField = <HTMLSelectElement>document.getElementById('type-field')
  const loginField = <HTMLInputElement>document.getElementById('login-field')

  if (state.form.type) typeField.value = state.form.type + ''
  if (state.form.login) loginField.value = state.form.login

  typeField.addEventListener('change', () => {
    const value = typeField.options[typeField.selectedIndex]?.value
    if (value) state.form.type = +value
  })

  loginField.addEventListener('input', (event: Event) => {
    state.form.login = (event.target as HTMLInputElement).value

    button?.toggleAttribute('disabled', state.form.login.length <= 2)
  })

  form?.addEventListener('submit', async (event: Event) => {
    event.preventDefault()

    twitchApi.setConfigurationSegment({
      login: state.form.login,
      type: state.form.type,
    })

    if (button) {
      button.innerText = 'Saved!'
      await asyncTimeout(2000)
      button.innerText = 'Save'
    }
  })
}

const init = () => {
  twitchApi.client?.onAuthorized(async () => {
    const config = twitchApi.getConfigurationSegment()

    if (config?.login) state.form.login = config.login
    if (config?.type) state.form.type = config.type

    initForm()
  })

  twitchApi.client?.onContext((context) =>
    setTheme(context?.theme as ITwitchTheme)
  )
}

window.addEventListener('load', init)
