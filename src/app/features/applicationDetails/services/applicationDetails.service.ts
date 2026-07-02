import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ApplicationDetailApi } from '../apis/applicationDetails.api';
import { ApplicationDetailStore } from '../store/applicationDetails.store';

@Injectable({ providedIn: 'root' })
export class ApplicationDetailService {
	private readonly _api = inject(ApplicationDetailApi);
	private readonly _store = inject(ApplicationDetailStore);
	private readonly _router = inject(Router);

	

	public loadApplication(id: string): Observable<void> {
		this._store.setLoading();
		return this._api.getApplication(id).pipe(
			tap((application) => this._store.setApplication(application)),
			tap({ error: (err: { message?: string }) => this._store.setError(err?.message ?? 'Failed to load application') }),
			map(() => void 0),
		);
	}

	public approve(id: string): Observable<void> {
		this._store.setSubmitting(true);
		return this._api.approveApplication(id).pipe(
			tap(() => {
				this._store.setSubmitting(false);
				void this._router.navigate(['/applications']);
			}),
			tap({ error: (err: { message?: string }) => this._store.setError(err?.message ?? 'Failed to approve') }),
			map(() => void 0),
		);
	}

	public deny(id: string): Observable<void> {
		this._store.setSubmitting(true);
		return this._api.denyApplication(id).pipe(
			tap(() => {
				this._store.setSubmitting(false);
				void this._router.navigate(['/applications']);
			}),
			tap({ error: (err: { message?: string }) => this._store.setError(err?.message ?? 'Failed to deny') }),
			map(() => void 0),
		);
	}
}
