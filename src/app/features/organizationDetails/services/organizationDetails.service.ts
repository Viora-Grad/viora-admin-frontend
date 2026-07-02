import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { OrganizationDetailStore } from '../store/organizationDetails.store';
import { OrganizationDetailApi } from '../api/organizationDetails.api';
import { SuspendOrganizationRequest } from '../api/dtos/suspend-organization-request.dto';

@Injectable({ providedIn: 'root' })
export class OrganizationDetailService {
	private readonly _api = inject(OrganizationDetailApi);
	private readonly _store = inject(OrganizationDetailStore);
	private readonly _router = inject(Router);

	public loadOrganization(id: string): Observable<void> {
		this._store.setLoading();
		return this._api.getOrganization(id).pipe(
			tap((organization) => this._store.setOrganization(organization)),
			tap({ error: (err: { message?: string }) => this._store.setError(err?.message ?? 'Failed to load organization') }),
			map(() => void 0),
		);
	}

	public suspend(id: string, request: SuspendOrganizationRequest): Observable<void> {
		this._store.setSubmitting(true);
		return this._api.suspendOrganization(id, request).pipe(
			tap(() => {
				this._store.setSubmitting(false);
				void this._router.navigate(['/organizations']).catch(() => {console.log();
				});
			}),
			tap({ error: (err: { message?: string }) => this._store.setError(err?.message ?? 'Failed to suspend organization') }),
			map(() => void 0),
		);
	}
}
