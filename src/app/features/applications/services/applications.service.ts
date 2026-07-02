import { inject, Injectable } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { ApplicationsApi } from '../apis/applications.api';
import { GetApplicationsRequest } from '../apis/dtos/get-applications-request.dto';
import { ApplicationsStore } from '../store/applications.store';


@Injectable({ providedIn: 'root' })
export class ApplicationsService {
	private readonly _applicationsApi = inject(ApplicationsApi);
	private readonly _applicationsStore = inject(ApplicationsStore);

	public loadApplications(filters?: Partial<GetApplicationsRequest>): Observable<void> {
		const store = this._applicationsStore;

		const request: GetApplicationsRequest = {
			id: filters?.id ?? '',
			ownerId: filters?.ownerId ?? '',
			status: filters?.status ?? '',
			referralSource: filters?.referralSource ?? '',
			page: filters?.page ?? store.page(),
			pageSize: filters?.pageSize ?? store.pageSize(),
		};

		store.setLoading();

		return this._applicationsApi.getApplications(request).pipe(
			tap((response) => {
				store.setApplications(
					response.items,
					Number(response.page),
					Number(response.pageSize),
					Number(response.totalCount),
					Number(response.totalPages),
					response.hasNextPage,
					response.hasPreviousPage,
				);
			}),
			// map to void so components don't depend on response shape
			tap({ error: (err: { message?: string }) => store.setError(err?.message ?? 'Failed to load applications') }),
			map(() => void 0),
		);
	}

	public goToPage(page: number): Observable<void> {
		this._applicationsStore.setPage(page);
		return this.loadApplications({ page });
	}

	public changePageSize(pageSize: number): Observable<void> {
		this._applicationsStore.setPageSize(pageSize);
		return this.loadApplications({ pageSize, page: 1 });
	}
}
