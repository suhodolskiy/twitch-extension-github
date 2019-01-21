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

export const getUserProfile = () =>
  request(
    `{
	  repositoryOwner(login: "mweststrate") {
	    ... on User {
	      name
	      login
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
	            name
	            description
	            primaryLanguage {
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
