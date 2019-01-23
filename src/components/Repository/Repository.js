import { h } from 'hyperapp'
import './repository.scss'

import abbrNum from '../../utils/abbr-num'
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
        {repo.owner.login}
        <b>/{repo.name}</b>
      </div>
      <p>{repo.description}</p>
      <div>
        <a className="repo-card__meta" href="">
          <span
            className="repo-card__color"
            style={{ background: repo.primaryLanguage.color }}
          />
          {repo.primaryLanguage.name}
        </a>
        <a className="repo-card__meta" href="">
          <IconStar />
          {abbrNum(repo.stargazers.totalCount)}
        </a>
        <a className="repo-card__meta" href="">
          <IconFork />
          {abbrNum(repo.forkCount)}
        </a>
      </div>
    </a>
  </li>
)
