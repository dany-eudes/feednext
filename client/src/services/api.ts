import axios, { AxiosResponse } from 'axios'
import { API_URL } from '../../config/constants'

axios.defaults.baseURL = API_URL

export const signIn = (
	signInPayload: { username?: string; email?: string; rememberMe: boolean; password: string }
): Promise<AxiosResponse> => axios.post('/v1/auth/signin', signInPayload, { withCredentials: true })

export const signUp = (
	signUpPayload: { fullName: string; username: string; email: string; password: string }
): Promise<AxiosResponse> => axios.post('/v1/auth/signup', signUpPayload)

export const checkAccessToken = (accessToken: string): Promise<AxiosResponse>  => axios.get('v1/auth/check-token',
{
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const updateUser = (username: string, accessToken: string, payload: {
	fullName?: string,
	email?: string,
	biography?: string,
	oldPassword?: string,
	password?: string
}): Promise<AxiosResponse> => axios.patch(`v1/user/${username}`, payload, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const uploadProfilePicture = (file: any, accessToken: string):
	Promise<AxiosResponse> => axios.put('v1/user/pp', file, {
		headers: {
			'Authorization': `Bearer ${accessToken}`,
		}
	})

export const fetchUserByUsername = (username: string): Promise<AxiosResponse> => axios.get(`/v1/user/${username}`)

export const fetchUserVotes = (
	username: string,
	voteType: 'up' | 'down',
	skip: number
): Promise<AxiosResponse> => axios.get(
	`/v1/user/${username}/votes`, {
		params: {
			voteType,
			limit: 10,
			skip
		}
	}
)

export const refreshToken = (): Promise<AxiosResponse> => axios.get('/v1/auth/refresh-token', { withCredentials: true })

export const fetchAllFeeds = (
	skip: number,
	username?: string,
	categoryIds?: string,
	sortBy?: 'hot' | 'top'
): Promise<AxiosResponse> => axios.get(
	'/v1/title/all', {
		params: {
			...username && { author: username },
			...categoryIds && { categoryIds },
			...sortBy && { sortBy },
			skip
		}
	}
)

export const searchTitle = (searchValue: string): Promise<AxiosResponse> => axios.get(`/v1/title/search?searchValue=${searchValue}`)

export const fetchTitle = (titleSlug: string, type: 'id' | 'slug'): Promise<AxiosResponse> => axios.get(`/v1/title/${titleSlug}`, {
	params: {
		type
	}
})

export const fetchAllCategories = (): Promise<AxiosResponse> => axios.get('/v1/category/all')

export const fetchTrendingCategories = (): Promise<AxiosResponse> => axios.get('/v1/category/trending-categories')

export const fetchEntryByEntryId = (entryId: string): Promise<AxiosResponse> => axios.get(`v1/entry/${entryId}`)

export const fetchFeaturedEntryByTitleId = (
	titleId: string
): Promise<AxiosResponse> => axios.get(`/v1/entry/by-title/${titleId}/featured`)

export const fetchEntriesByTitleId = (
	titleId: string,
	skip: number
): Promise<AxiosResponse> => axios.get(`/v1/entry/by-title/${titleId}/all?limit=7&skip=${skip}`)

export const fetchAllEntriesByAuthor = (
	username: string,
	skip: number
): Promise<AxiosResponse> => axios.get(`/v1/entry/by-author/${username}/all?limit=10&skip=${skip}`)

export const createTitle = (
	createTitlePayload: { name: string; categoryId: string; description?: string },
	accessToken: string
): Promise<AxiosResponse> => axios.post('/v1/title/create-title', createTitlePayload, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const rateTitle = (
	rateValue: number,
	titleId: string,
	accessToken: string
): Promise<AxiosResponse> => axios.patch(`/v1/title/${titleId}/rate`, { rateValue }, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const deleteTitle = (
	accessToken: string,
	categoryId: string
): Promise<AxiosResponse> => axios.delete(`/v1/title/${categoryId}`, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const updateTitle = (
	accessToken: string,
	titleId: string,
	payload: {
		name: string,
		categoryId: string
	}
): Promise<AxiosResponse> => axios.patch(`/v1/title/${titleId}`, payload, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const getUserRateOfTitle = (
	titleId: string,
	accessToken: string
): Promise<AxiosResponse> => axios.get(`/v1/title/${titleId}/rate-of-user`, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const getAverageTitleRate = (
	titleId: string,
): Promise<AxiosResponse> => axios.get(`/v1/title/${titleId}/average-rate`)

export const createEntry = (
	createEntryPayload: { text: string; titleId: string },
	accessToken: string
): Promise<AxiosResponse> => axios.post('/v1/entry/create-entry', createEntryPayload, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const updateEntry = (
	entryId: string,
	text: string,
	accessToken: string
): Promise<AxiosResponse> => axios.patch(`/v1/entry/${entryId}`, { text }, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const voteEntry = (
	entryId: string,
	voteTo: string,
	accessToken: string
): Promise<AxiosResponse> => axios.patch(`/v1/entry/${voteTo}-vote/${entryId}`, {}, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const undoEntryVote = (
	entryId: string,
	accessToken: string,
	isUpVoted: boolean
): Promise<AxiosResponse> => axios.patch(`/v1/entry/undo-vote/${entryId}?isUpVoted=${isUpVoted}`, {}, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const deleteEntry = (
	entryId: string,
	accessToken: string
): Promise<AxiosResponse> => axios.delete(`/v1/entry/${entryId}`, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})