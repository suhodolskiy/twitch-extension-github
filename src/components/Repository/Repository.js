import { h } from 'hyperapp'
import './repository.scss'

import { abbrNum } from '../../libs/utils'
import IconStar from '../Icons/IconStar'
import IconFork from '../Icons/IconFork'

export default (repo) => (
  <li>
    <a
      rel="noopener noreferrer"
      className="repo-card"
      href={repo.url}
      target="_blank"
    >
      <div className="repo-card__name">
        {repo.owner && repo.owner.login}
        <b>/{repo.name}</b>
      </div>
      <p className="repo-card__desc">{repo.description}</p>
      <div>
        {repo.primaryLanguage && (
          <span className="repo-card__meta">
            <span
              className="repo-card__color"
              style={{ background: repo.primaryLanguage.color }}
            />
            {repo.primaryLanguage.name}
          </span>
        )}

        {repo.stargazers && (
          <span className="repo-card__meta">
            <IconStar />
            {abbrNum(repo.stargazers.totalCount)}
          </span>
        )}
        <span className="repo-card__meta">
          <IconFork />
          {abbrNum(repo.forkCount)}
        </span>
      </div>
    </a>
  </li>
)
