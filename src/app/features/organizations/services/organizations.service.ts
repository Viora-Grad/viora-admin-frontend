import { inject, Injectable } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { OrganizationsApi } from '../apis/organizations.api';
import { GetOrganizationsRequest } from '../apis/dtos/get-organizations-request.dto';
import { OrganizationsStore } from '../store/organizations.store';


@Injectable({ providedIn: 'root' })
export class OrganizationsService {
	private readonly _organizationsApi = inject(OrganizationsApi);
	private readonly _organizationsStore = inject(OrganizationsStore);

	public loadOrganizations(filters?: Partial<GetOrganizationsRequest>): Observable<void> {
		const store = this._organizationsStore;

		const request: GetOrganizationsRequest = {
			id: filters?.id ?? '',
			country: filters?.country ?? '',
			name: filters?.name ?? '',
			serviceType: filters?.serviceType ?? '',
			minimumRating: filters?.minimumRating ?? 0,
			sortBy: filters?.sortBy ?? 0,
			page: filters?.page ?? store.page(),
			pageSize: filters?.pageSize ?? store.pageSize(),
		};

		store.setLoading();

		return this._organizationsApi.getOrganizations(request).pipe(
			tap((response) => {
				store.setOrganizations(
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
			tap({ error: (err: { message?: string }) => store.setError(err?.message ?? 'Failed to load organizations') }),
			map(() => void 0),
		);
	}

	public goToPage(page: number): Observable<void> {
		this._organizationsStore.setPage(page);
		return this.loadOrganizations({ page });
	}

	public changePageSize(pageSize: number): Observable<void> {
		this._organizationsStore.setPageSize(pageSize);
		return this.loadOrganizations({ pageSize, page: 1 });
	}
}
