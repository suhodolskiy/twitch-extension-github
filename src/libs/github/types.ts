export interface IGithubRepository {
  id: string
  url: string
  owner: {
    login: string
  }
  name: string
  description: string
  stargazers: {
    totalCount: number
  }
  primaryLanguage: {
    color: string
    name: string
  }
  forkCount: number
}

export interface IGithubUserResponse {
  name: string
  login: string
  url: string
  avatarUrl: string
  repositories: {
    totalCount: number
  }
  starredRepositories: {
    totalCount: number
  }
  followers: {
    totalCount: number
  }
  following: {
    totalCount: number
  }
  itemShowcase: {
    items: {
      nodes: IGithubRepository[]
    }
  }
}

export interface IGithubOrganizationResponse {
  name: string
  login: string
  url: string
  avatarUrl: string
  description: string
  repositories: {
    totalCount: number
  }
  websiteUrl: string
  membersWithRole: {
    totalCount: number
  }
  pinnedItems: {
    nodes: IGithubRepository[]
  }
}

export interface IRepository {
  name: string
  url: string
  description?: string
  language?: {
    color: string
    name: string
  }
  count: {
    stars?: number
    forks?: number
  }
}

export interface IProfile {
  name: string
  url: string
  avatar?: string
  login: string
  description?: string
  repositories: IRepository[]
  totalCount: {
    repositories?: number
    members?: number
    starred?: number
    followers?: number
    following?: number
  }
}
