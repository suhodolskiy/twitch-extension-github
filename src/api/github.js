const request = (query) =>
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

/**
 * Load github personal/company profile
 * @param login
 * @returns {*}
 */
export default {
  getUser(login) {
    return request(
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
			      pinnedRepositories(first: 6) {
			        edges {
			          node {
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
			}`
    )
  },
  getOrganization(login) {
    return request(
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
			    pinnedRepositories(first: 6) {
			      edges {
			        node {
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
    )
  },
}
