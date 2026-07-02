import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Application } from '../../../core/models/applications.model';

interface ApplicationsState {
	items: Application[];
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	isLoading: boolean;
	error: string | null;
}

const initialState: ApplicationsState = {
	items: [],
	page: 1,
	pageSize: 20,
	totalCount: 0,
	totalPages: 0,
	hasNextPage: false,
	hasPreviousPage: false,
	isLoading: false,
	error: null,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ApplicationsStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),

	withComputed((state) => ({
		isEmpty: computed(() => !state.isLoading() && state.items().length === 0),
	})),

	withMethods((store) => ({
		setLoading(): void {
			patchState(store, { isLoading: true, error: null });
		},

		setError(error: string): void {
			patchState(store, { error, isLoading: false });
		},

		setApplications(
			items: Application[],
			page: number,
			pageSize: number,
			totalCount: number,
			totalPages: number,
			hasNextPage: boolean,
			hasPreviousPage: boolean,
		): void {
			patchState(store, {
				items,
				page,
				pageSize,
				totalCount,
				totalPages,
				hasNextPage,
				hasPreviousPage,
				isLoading: false,
				error: null,
			});
		},

		setPage(page: number): void {
			patchState(store, { page });
		},

		setPageSize(pageSize: number): void {
			patchState(store, { pageSize });
		},
	})),
);
