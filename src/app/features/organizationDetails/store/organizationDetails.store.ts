import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { GetOrganizationDetailResponse } from '../api/dtos/get-organizationDetails-response.dto';

interface OrganizationDetailState {
	organization: GetOrganizationDetailResponse | null;
	isLoading: boolean;
	isSubmitting: boolean;
	error: string | null;
}

const initialState: OrganizationDetailState = {
	organization: null,
	isLoading: false,
	isSubmitting: false,
	error: null,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const OrganizationDetailStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),

	withMethods((store) => ({
		setLoading(): void {
			patchState(store, { isLoading: true, error: null });
		},
		setSubmitting(isSubmitting: boolean): void {
			patchState(store, { isSubmitting });
		},
		setOrganization(organization: GetOrganizationDetailResponse): void {
			patchState(store, { organization, isLoading: false, error: null });
		},
		setError(error: string): void {
			patchState(store, { error, isLoading: false, isSubmitting: false });
		},
		reset(): void {
			patchState(store, initialState);
		},
	})),
);
