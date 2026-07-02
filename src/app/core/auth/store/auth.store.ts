import { computed } from '@angular/core';
import {
	patchState,
	signalStore,
	withComputed,
	withHooks,
	withMethods,
	withState,
} from '@ngrx/signals';
import { User } from '../../models/user.model';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const REMEMBER_ME_KEY = 'remember_me';

interface AuthState {
	currentUser: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isLoading: boolean;
	error: string | null;
	initialized: boolean;
}

const initialState: AuthState = {
	currentUser: null,
	accessToken: null,
	refreshToken: null,
	isLoading: false,
	error: null,
	initialized: false,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AuthStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),

	withComputed((state) => ({
		isAuthenticated: computed(() => !!state.accessToken() && !!state.refreshToken() ), //&& !!state.currentUser()
	})),

	withMethods((store) => {
		let _useLocalStorage = true;

		function _getStorage(rememberMe?: boolean): Storage {
			return rememberMe === false ? sessionStorage : localStorage;
		}

		return {
			setAuthDetails(
				user: User,
				accessToken: string,
				refreshToken: string,
				rememberMe = true,
			): void {
				_useLocalStorage = rememberMe;
				const storage = _getStorage(rememberMe);
				storage.setItem(ACCESS_TOKEN_KEY, accessToken);
				storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
				localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe));
				patchState(store, {
					currentUser: user,
					accessToken,
					refreshToken,
					error: null,
					isLoading: false,
				});
			},
			updateTokens(accessToken: string, refreshToken: string): void {
				const storage = _getStorage(_useLocalStorage);
				storage.setItem(ACCESS_TOKEN_KEY, accessToken);
				storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
				patchState(store, { accessToken, refreshToken });
			},
			setCurrentUser(user: User): void {
				patchState(store, { currentUser: user });
			},
			setLoading(): void {
				patchState(store, { isLoading: true, error: null });
			},
			setError(error: string): void {
				patchState(store, { error, isLoading: false });
			},
			clearError(): void {
				patchState(store, { error: null });
			},
			logout(): void {
				localStorage.removeItem(ACCESS_TOKEN_KEY);
				localStorage.removeItem(REFRESH_TOKEN_KEY);
				sessionStorage.removeItem(ACCESS_TOKEN_KEY);
				sessionStorage.removeItem(REFRESH_TOKEN_KEY);
				localStorage.removeItem(REMEMBER_ME_KEY);
				patchState(store, initialState);
			},
		};
	}),

	withHooks({
		onInit(store) {
			const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) !== 'false';
			const storage = rememberMe ? localStorage : sessionStorage;
			const accessToken = storage.getItem(ACCESS_TOKEN_KEY);
			const refreshToken = storage.getItem(REFRESH_TOKEN_KEY);
			if (accessToken && refreshToken) {
				patchState(store, { accessToken, refreshToken });
			}
			patchState(store, { initialized: true });
		},
	}),
);
