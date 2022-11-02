import { IProfile, IRepository } from '../../libs/github/types'
import { ITwitchConfigType } from '../../libs/twitch'
import { abbrNum } from '../../libs/utils'

interface IHeadlineItem {
  count: string
  text: string
  link: string
}

export const getHeadlineHtml = (item: IHeadlineItem): string =>
  `<a href="${
    item.link
  }" class="headline__item" rel="noopener noreferrer" target="_blank">${
    abbrNum(item.count) || 0
  }<span>${item.text}</span></a>`

const getRepositoryHtml = (repo: IRepository, profile: IProfile): string => {
  const languageHtml = repo.language
    ? `<span class="repo-card__meta">
        <span
          class="repo-card__color"
          style="background: ${repo.language.color}"
        >
        </span>${repo.language.name}
    </span>`
    : ''

  return `
    <li>
      <a
        rel="noopener noreferrer"
        class="repo-card"
        href="${repo.url}"
        target="_blank"
      >
        <div class="repo-card__name">
          ${profile.login}<b>/${repo.name}</b>
        </div>
        <p class="repo-card__desc">${repo.description ?? ''}</p>
        <div>
          ${languageHtml}

          <span class="repo-card__meta">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              version="1.1"
            >
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(-97.000000, -49.000000)" fill="currentColor">
                  <g transform="translate(97.000000, 47.000000)">
                    <polygon points="10 5.6 6.5 5.1 5 2 3.5 5.1 0 5.6 2.6 7.9 1.9 11.3 5 9.6 8.1 11.3 7.4 7.9" />
                  </g>
                </g>
              </g>
            </svg>${abbrNum(repo.count.stars)}
          </span>
          <span class="repo-card__meta">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="10"
              viewBox="0 0 8 10"
              version="1.1"
            >
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g
                  transform="translate(-152.000000, -49.000000)"
                  fill="currentColor"
                  fill-rule="nonzero"
                >
                  <g transform="translate(152.000000, 47.000000)">
                    <path d="M5.7 2C5.1 2 4.5 2.4 4.3 3.1 4.2 3.7 4.4 4.3 5 4.7L5 5.6 3.6 7 2.1 5.6 2.1 4.7C2.7 4.3 3 3.7 2.8 3.1 2.6 2.4 2.1 2 1.4 2 0.8 2 0.2 2.4 0 3.1 -0.1 3.7 0.2 4.3 0.7 4.7L0.7 5.9 2.9 8.1 2.9 9.3C2.3 9.7 2 10.3 2.2 10.9 2.4 11.6 2.9 12 3.6 12 4.2 12 4.8 11.6 4.9 10.9 5.1 10.3 4.8 9.7 4.3 9.3L4.3 8.1 6.4 5.9 6.4 4.7C7 4.3 7.3 3.7 7.1 3.1 6.9 2.4 6.4 2 5.7 2ZM1.4 4.3C1 4.3 0.6 3.9 0.6 3.4 0.6 3 1 2.6 1.4 2.6 1.9 2.6 2.3 3 2.3 3.4 2.3 3.9 1.9 4.3 1.4 4.3ZM3.6 11.4C3.1 11.4 2.7 11 2.7 10.6 2.7 10.1 3.1 9.7 3.6 9.7 4 9.7 4.4 10.1 4.4 10.6 4.4 11 4 11.4 3.6 11.4ZM5.7 4.3C5.2 4.3 4.9 3.9 4.9 3.4 4.9 3 5.2 2.6 5.7 2.6 6.2 2.6 6.6 3 6.6 3.4 6.6 3.9 6.2 4.3 5.7 4.3Z" />
                  </g>
                </g>
              </g>
            </svg>${abbrNum(repo.count.forks)}
          </span>
        </div>
      </a>
    </li>
  `
}

export const renderProfile = (profile: IProfile, type: number) => {
  const isOrganization = type === ITwitchConfigType.Organization

  const headlineItems: IHeadlineItem[] = []

  if (isOrganization) {
    headlineItems.push(
      {
        count: abbrNum(profile.totalCount.repositories),
        text: 'Repositories',
        link: `https://github.com/orgs/${profile.login}/repositories`,
      },
      {
        count: abbrNum(profile.totalCount.members),
        text: 'People',
        link: `https://github.com/orgs/${profile.login}/people`,
      }
    )

    const title = document.getElementById('title')
    if (title) title.innerText = 'Pinned repositories'
  } else {
    headlineItems.push(
      {
        count: abbrNum(profile.totalCount.repositories),
        text: 'Repositories',
        link: `https://github.com/${profile.login}?tab=repositories`,
      },
      {
        count: abbrNum(profile.totalCount.starred),
        text: 'Stars',
        link: `https://github.com/${profile.login}?tab=stars`,
      },
      {
        count: abbrNum(profile.totalCount.followers),
        text: 'Followers',
        link: `https://github.com/${profile.login}?tab=followers`,
      },
      {
        count: abbrNum(profile.totalCount.following),
        text: 'Following',
        link: `https://github.com/${profile.login}?tab=following`,
      }
    )
  }

  const headlineNode = document.getElementById('headline')
  if (headlineNode && !headlineNode.childElementCount) {
    for (const item of headlineItems) {
      headlineNode.innerHTML += getHeadlineHtml(item)
    }
  }

  if (profile.avatar) {
    const avatar = document.getElementById('avatar')
    if (avatar)
      avatar.innerHTML = `<img src="${profile.avatar}" alt="${profile.name}" />`
  }

  const name = document.getElementById('name')
  if (name) name.innerText = profile.name

  const username = document.getElementById('username')
  if (username) username.innerText = profile.description || profile.login

  const profileLinks = document.querySelectorAll('a.profile-link')
  profileLinks.forEach((link) => link.setAttribute('href', profile.url))

  if (profile.repositories.length) {
    let repositoriesHtml = ''
    for (const repository of profile.repositories) {
      repositoriesHtml += getRepositoryHtml(repository, profile)
    }

    const contentNode = document.getElementById('content')
    const title = isOrganization ? 'Pinned repositories' : 'Repositories'

    if (contentNode) {
      contentNode.innerHTML = `<div class="pinned-repos"><h2 id="title">${title}</h2><ol>${repositoriesHtml}</ol></div>`
    }
  } else {
    renderState('')
  }
}

export const renderState = (state: any) => {
  const contentNode = document.getElementById('content')
  if (contentNode) contentNode.innerHTML = state
}
