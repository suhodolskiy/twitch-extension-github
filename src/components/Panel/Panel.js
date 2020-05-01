import { h, app } from 'hyperapp'
import { toggleTheme, isPersonalType, abbrNum } from '../../libs/utils'

import Repository from '../Repository/Repository'
import IconGithub from '../Icons/IconGithub'

import twitchApi from '../../api/twitch'
import githubApi from '../../api/github'
import * as constants from '../../libs/constants'

import '../../stylesheets/main.scss'
import './panel.scss'

app(
  {
    type: constants.GITHUB_PROFILE_TYPE_PERSONAL,
    theme: 'light',
    loading: false,
    profile: null,
    error: null,
  },
  {
    initTwitch: () => (state, actions) => {
      if (twitchApi.twitch) {
        twitchApi.twitch.onAuthorized(() => {
          const configBroadcaster = twitchApi.getConfigurationSegment()
          if (configBroadcaster) {
            if (configBroadcaster.type !== state.type)
              actions.setType(configBroadcaster.type)
            if (configBroadcaster.login)
              actions.loadGithubProfile(configBroadcaster.login)
          }
        })

        twitchApi.twitch.onContext((context) => {
          if (context && context.theme) actions.setTheme(context.theme)
        })

        twitchApi.twitch.onError((error) => actions.setError(error))
      }
    },
    loadGithubProfile: (login) => async (state, actions) => {
      try {
        actions.setLoading()
        const profile = await githubApi[
          isPersonalType(state.type) ? 'getUser' : 'getOrganization'
        ](login)

        if (profile) {
          actions.setGithubProfile(
            profile[
              isPersonalType(state.type) ? 'repositoryOwner' : 'organization'
            ]
          )
        }
      } catch (error) {
        actions.setError(error)
      } finally {
        actions.setLoading(false)
      }
    },
    setLoading: (state = true) => ({ loading: state }),
    setGithubProfile: (profile) => ({ profile }),
    setTheme: (theme) => (state) => toggleTheme(theme, state.theme),
    setType: (type) => ({ type }),
    setError: (error) => ({ error }),
  },
  (state, actions) => (
    <div className="app" oncreate={actions.initTwitch}>
      <header className="header">
        <a
          href={state.profile && state.profile.url}
          className="header__link-container"
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="header__avatar">
            {state.profile && state.profile.avatarUrl && (
              <img
                src={state.profile && state.profile.avatarUrl}
                alt="User avatar"
              />
            )}
          </div>

          <div className="header__info">
            <span>{state.profile && state.profile.name}</span>
            {state.profile && (
              <div className="header__username">
                {isPersonalType(state.type)
                  ? state.profile.login
                  : state.profile.description}
              </div>
            )}
          </div>
          <IconGithub />
        </a>
      </header>
      <nav className="headline">
        <a
          href={
            state.profile &&
            `https://github.com/${state.profile.login}?tab=repositories`
          }
          className="headline__item"
          rel="noopener noreferrer"
          target="_blank"
        >
          {state.profile ? abbrNum(state.profile.repositories.totalCount) : 0}
          <span>Repositories</span>
        </a>

        {!isPersonalType(state.type) && (
          <a
            href={
              state.profile &&
              `https://github.com/orgs/${state.profile.login}/people`
            }
            className="headline__item"
            rel="noopener noreferrer"
            target="_blank"
          >
            {state.profile
              ? abbrNum(state.profile.membersWithRole.totalCount)
              : 0}
            <span>People</span>
          </a>
        )}

        {isPersonalType(state.type) && (
          <a
            href={
              state.profile &&
              `https://github.com/${state.profile.login}?tab=stars`
            }
            className="headline__item"
            rel="noopener noreferrer"
            target="_blank"
          >
            {state.profile
              ? abbrNum(state.profile.starredRepositories.totalCount)
              : 0}
            <span>Stars</span>
          </a>
        )}

        {isPersonalType(state.type) && (
          <a
            href={
              state.profile &&
              `https://github.com/${state.profile.login}?tab=followers`
            }
            className="headline__item"
            rel="noopener noreferrer"
            target="_blank"
          >
            {state.profile ? abbrNum(state.profile.followers.totalCount) : 0}
            <span>Followers</span>
          </a>
        )}

        {isPersonalType(state.type) && (
          <a
            href={
              state.profile &&
              `https://github.com/${state.profile.login}?tab=following`
            }
            className="headline__item"
            rel="noopener noreferrer"
            target="_blank"
          >
            {state.profile ? abbrNum(state.profile.following.totalCount) : 0}
            <span>Following</span>
          </a>
        )}
      </nav>
      <div className="app__content">
        {state.error}
        {state.loading && 'Loading ...'}
        {state.profile && state.profile.pinnedItems && (
          <div className="pinned-repos">
            <h2>Pinned repositories</h2>
            <ol>
              {state.profile.pinnedItems.nodes.map((node) => (
                <Repository {...node} key={node.id} />
              ))}
            </ol>
          </div>
        )}
      </div>
      <footer className="footer">
        <a
          className="btn btn--block btn--primary"
          href={state.profile && state.profile.url}
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
