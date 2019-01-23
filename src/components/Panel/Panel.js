import { h, app } from 'hyperapp'
import { toggleTheme, abbrNum } from '../../utils/utils'
import Repository from '../Repository/Repository'
import IconGithub from '../Icons/IconGithub'
import twitchApi from '../../api/twitch'
import githubApi from '../../api/github'

import '../../stylesheets/main.scss'
import './panel.scss'

app(
  {
    theme: 'light',
    loading: false,
    error: null,
    user: null,
  },
  {
    initTwitch: () => (state, actions) => {
      if (twitchApi.twitch) {
        twitchApi.twitch.onAuthorized(() => {
          const configBroadcaster = twitchApi.getConfigurationSegment()
          if (configBroadcaster && configBroadcaster.login) {
            actions.loadGithubUser(configBroadcaster.login)
          }
        })

        twitchApi.twitch.onContext((context) => {
          if (context && context.theme) actions.setTheme(context.theme)
        })

        twitchApi.twitch.onError((error) => actions.setError(error))
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
    setTheme: (theme) => (state) => toggleTheme(theme, state.theme),
    setError: (error) => ({ error }),
  },
  (state, actions) => (
    <div className="app" oncreate={actions.initTwitch}>
      <header className="header">
        <a
          href={state.user && state.user.url}
          className="header__link-container"
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="header__avatar">
            {state.user && state.user.avatarUrl && (
              <img src={state.user && state.user.avatarUrl} alt="User avatar" />
            )}
          </div>

          <div className="header__info">
            <a href={state.user && state.user.url}>
              {state.user && state.user.name}
            </a>
            <div className="header__username">
              {state.user && state.user.login}
            </div>
          </div>
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
