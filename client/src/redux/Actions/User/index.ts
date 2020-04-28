import { Dispatch } from 'redux'
import {
	SIGN_IN,
	SIGN_OUT,
	UserPayload,
	SignInAction,
	SignOutAction,
	VoteEntryAction,
	VOTE_ENTRY,
	UndoEntryVoteAction,
	UNDO_ENTRY_VOTE,
	UpdateUserAction,
	UPDATE_USER,
	UpdateUserPayload
} from './types'

export const StartUserActions = {
	signIn: (userPayload: UserPayload) => {
		return (dispatch: Dispatch<SignInAction>): void => {
			dispatch({
				type: SIGN_IN,
				user: userPayload
			})
		}
	},
	signOut: () => {
		return (dispatch: Dispatch<SignOutAction>): void => {
			dispatch({
				type: SIGN_OUT,
			})
		}
	},
	updateUser: (payload: UpdateUserPayload) => {
		return (dispatch: Dispatch<UpdateUserAction>): void => {
			dispatch({
				type: UPDATE_USER,
				payload
			})
		}
	},
	voteEntry: (entryId: string, voteTo: 'up' | 'down') => {
		return (dispatch: Dispatch<VoteEntryAction>): void => {
			dispatch({
				type: VOTE_ENTRY,
				entryId,
				voteTo
			})
		}
	},
	undoVoteEntry: (entryId: string, from: 'up' | 'down') => {
		return (dispatch: Dispatch<UndoEntryVoteAction>): void => {
			dispatch({
				type: UNDO_ENTRY_VOTE,
				from,
				entryId,
			})
		}
	}
}