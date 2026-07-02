import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GetOrganizationsRequest } from './dtos/get-organizations-request.dto';
import { GetOrganizationsResponse } from './dtos/get-organizations-response.dto';

@Injectable({ providedIn: 'root' })
export class OrganizationsApi {
	private readonly _http = inject(HttpClient);
	private readonly _baseUrl = environment.apiBaseUrl;

	public getOrganizations(request: GetOrganizationsRequest): Observable<GetOrganizationsResponse> {
		const params = new HttpParams()
			.set('id', request.id ?? '')
			.set('country', request.country ?? '')
			.set('name', request.name ?? '')
			.set('serviceType', request.serviceType ?? '')
			.set('minimumRating', request.minimumRating ?? '')
			.set('sortBy', request.sortBy ?? '')
			.set('page', request.page)
			.set('pageSize', request.pageSize);

		return this._http.get<GetOrganizationsResponse>(`${this._baseUrl}/Organizations`, { params });
	}
}
