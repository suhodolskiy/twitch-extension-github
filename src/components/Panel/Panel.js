import { h, app } from 'hyperapp'
import { getUserProfile } from '../../utils/github'

import './Panel.css'

const state = {
  user: null,
  count: 0,
}

const RepositoryItem = (...repo) => <li>{JSON.stringify(repo)}</li>

const view = (state, actions) => (
  <div>
    <button onclick={() => actions.getUserInfo()}>{state.message}</button>
    <ul>
      {state.user
        ? state.user.pinnedRepositories.edges.map((repo) => (
            <RepositoryItem {...repo} />
          ))
        : null}
    </ul>
  </div>
)

const actions = {
  getUserInfo: () => async (state, actions) => {
    const user = await getUserProfile()
    console.log(user.repositoryOwner)
    actions.setUserInfo(user.repositoryOwner)
  },
  setUserInfo: (user) => () => ({ user }),
}

app(state, actions, view, document.getElementById('root'))
