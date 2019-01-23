import { h, app } from 'hyperapp'
import '../../stylesheets/main.scss'
import './panel.scss'

import Repository from '../Repository/Repository'
import IconGithub from '../Icons/IconGithub'

import abbrNum from '../../utils/abbr-num'
import githubApi from '../../api/github'

app(
  {
    user: null,
    theme: 'light',
    loading: false,
    error: null,
  },
  {
    initTwitch: () => (state, actions) => {
      const twitch = window.Twitch ? window.Twitch.ext : null
      if (twitch) {
        twitch.onAuthorized(() => {
          // twitch.configuration.set(
          //   'broadcaster',
          //   '0.0.2',
          //   JSON.stringify({ login: 'suhodolskiy' })
          // )

          let config = twitch.configuration.broadcaster
            ? twitch.configuration.broadcaster.content
            : null

          try {
            config = JSON.parse(config)
          } catch (error) {
            config = null
          }

          if (config && config.login) {
            actions.loadGithubUser(config.login)
          }
        })

        twitch.onContext((context) => {
          if (context && context.theme) actions.setTheme(context.theme)
        })

        twitch.onError((error) => actions.setError(error))
      }
    },
    loadGithubUser: (login) => async (state, actions) => {
      try {
        actions.setLoading()
        const user = await githubApi.getUser(login)
        if (user && user.repositoryOwner) {
          actions.setGithubUser(user.repositoryOwner)
        }
      } catch (error) {
        actions.setError(error)
      } finally {
        actions.setLoading(false)
      }
    },
    setLoading: (state = true) => ({ loading: state }),
    setGithubUser: (user) => ({ user }),
    setTheme: (theme) => ({ theme }),
    setError: (error) => ({ error }),
  },
  (state, actions) => (
    <div className={`app theme-${state.theme}`} oncreate={actions.initTwitch}>
      <header className="header">
        <a
          href={state.user && state.user.url}
          className="header__avatar"
          rel="noopener noreferrer"
          target="_blank"
        >
          {state.user && state.user.avatarUrl && (
            <img src={state.user && state.user.avatarUrl} alt="User avatar" />
          )}
        </a>
        <div className="header__info">
          <a href={state.user && state.user.url}>
            {state.user && state.user.name}
          </a>
          <div className="header__username">
            {state.user && state.user.login}
          </div>
        </div>
        <a href={state.user && state.user.url}>
          <IconGithub />
        </a>
      </header>
      <nav className="headline">
        <a
          href={
            state.user &&
            `https://github.com/${state.user.login}?tab=repositories`
          }
          className="headline__item"
          rel="noopener noreferrer"
          target="_blank"
        >
          {state.user ? abbrNum(state.user.repositories.totalCount) : 0}
          <span>Repositories</span>
        </a>
        <a
          href={
            state.user && `https://github.com/${state.user.login}?tab=stars`
          }
          className="headline__item"
          rel="noopener noreferrer"
          target="_blank"
        >
          {state.user ? abbrNum(state.user.starredRepositories.totalCount) : 0}
          <span>Stars</span>
        </a>
        <a
          href={
            state.user && `https://github.com/${state.user.login}?tab=followers`
          }
          className="headline__item"
          rel="noopener noreferrer"
          target="_blank"
        >
          {state.user ? abbrNum(state.user.followers.totalCount) : 0}
          <span>Followers</span>
        </a>
        <a
          href={
            state.user && `https://github.com/${state.user.login}?tab=following`
          }
          className="headline__item"
          rel="noopener noreferrer"
          target="_blank"
        >
          {state.user ? abbrNum(state.user.following.totalCount) : 0}
          <span>Following</span>
        </a>
      </nav>
      <div className="app__content">
        {state.error}
        {state.loading && 'Loading ...'}
        {state.user && state.user.pinnedRepositories && (
          <div className="pinned-repos">
            <h2>Pinned repositories</h2>
            <ol>
              {state.user.pinnedRepositories.edges.map(({ node }) => (
                <Repository {...node} key={node.id} />
              ))}
            </ol>
          </div>
        )}
      </div>
      <footer className="footer">
        <a
          className="btn btn--block btn--primary"
          href={state.user && state.user.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          Follow
        </a>
      </footer>
    </div>
  ),
  document.getElementById('root')
)
