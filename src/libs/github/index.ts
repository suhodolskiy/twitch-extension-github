import {
  IGithubOrganizationResponse,
  IGithubUserResponse,
  IProfile,
  IRepository,
} from './types'

const request = <T>(query: string): Promise<T> =>
  fetch('https://api.github.com/graphql', {
    method: 'post',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then((response) => response.json())
    .then((response) => response.data)

export default {
  async getUser(login: string, count = 6): Promise<IProfile | undefined> {
    const response = await request<{ repositoryOwner: IGithubUserResponse }>(
      `{
			  repositoryOwner(login: "${login}") {
			    ... on User {
			      name
			      login
			      url
			      avatarUrl
			      repositories {
			        totalCount
			      }
			      starredRepositories {
			        totalCount
			      }
			      followers {
			        totalCount
			      }
			      following {
			        totalCount
			      }
			      itemShowcase {
              items(first: ${count}) {
                nodes {
                  ... on PinnableItem {
                    ... on Repository {
                      id
                      url
                      owner {
                        login
                      }
                      name
                      description
                      stargazers {
                        totalCount
                      }
                      primaryLanguage {
                        color
                        name
                      }
                      forkCount
                    }
                  }
                }
              }
            }
			    }
			  }
			}`
    ).then((response) => response.repositoryOwner)

    if (!response?.login) return

    const repositories: IRepository[] = []

    for (const node of response.itemShowcase.items.nodes) {
      if (!node.id) continue
      repositories.push({
        name: node.name,
        url: node.url,
        description: node.description,
        owner: node.owner.login,
        language: node.primaryLanguage
          ? {
              color: node.primaryLanguage.color,
              name: node.primaryLanguage.name,
            }
          : undefined,
        count: {
          stars: node.stargazers.totalCount,
          forks: node.forkCount,
        },
      })
    }

    return {
      name: response.name,
      url: response.url,
      avatar: response.avatarUrl,
      login: response.login,
      repositories,
      totalCount: {
        starred: response.starredRepositories.totalCount,
        repositories: response.repositories.totalCount,
        followers: response.followers.totalCount,
        following: response.following.totalCount,
      },
    }
  },
  async getOrganization(
    login: string,
    count = 6
  ): Promise<IProfile | undefined> {
    const response = await request<{
      organization: IGithubOrganizationResponse
    }>(
      `{
			  organization(login: "${login}") {
			    name
			    login
			    url
			    avatarUrl
			    description
			    repositories {
			      totalCount
			    }
					websiteUrl
			    membersWithRole {
			      totalCount
			    }
			    pinnedItems(first: ${count}, types: REPOSITORY) {
			      nodes {
			        ... on Repository {
			          id
			          url
			          owner {
			            login
			          }
			          name
			          description
			          stargazers {
			            totalCount
			          }
			          primaryLanguage {
			            color
			            name
			          }
			          forkCount
			        }
			      }
			    }
			  }
			}`
    ).then((response) => response.organization)

    if (!response.login) return

    const repositories: IRepository[] = []

    for (const node of response.pinnedItems.nodes) {
      if (!node.id) continue
      repositories.push({
        name: node.name,
        url: node.url,
        description: node.description,
        owner: node.owner.login,
        language: node.primaryLanguage && {
          color: node.primaryLanguage.color,
          name: node.primaryLanguage.name,
        },
        count: {
          stars: node.stargazers.totalCount,
          forks: node.forkCount,
        },
      })
    }

    return {
      name: response.name,
      url: response.url,
      avatar: response.avatarUrl,
      description: response.description,
      login: response.login,
      repositories,
      totalCount: {
        members: response.membersWithRole.totalCount,
        repositories: response.repositories.totalCount,
      },
    }
  },
}
