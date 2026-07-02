import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { GetApplicationDetailResponse } from '../apis/dtos/get-applicationDetails-response.dto';

interface ApplicationDetailState {
	application: GetApplicationDetailResponse | null;
	isLoading: boolean;
	isSubmitting: boolean;
	error: string | null;
}

const initialState: ApplicationDetailState = {
	application: null,
	isLoading: false,
	isSubmitting: false,
	error: null,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ApplicationDetailStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),

	withMethods((store) => ({
		setLoading(): void {
			patchState(store, { isLoading: true, error: null });
		},
		setSubmitting(isSubmitting: boolean): void {
			patchState(store, { isSubmitting });
		},
		setApplication(application: GetApplicationDetailResponse): void {
			patchState(store, { application, isLoading: false, error: null });
		},
		setError(error: string): void {
			patchState(store, { error, isLoading: false, isSubmitting: false });
		},
		reset(): void {
			patchState(store, initialState);
		},
	})),
);
