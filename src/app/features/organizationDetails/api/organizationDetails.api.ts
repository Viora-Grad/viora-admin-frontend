import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GetOrganizationDetailResponse } from './dtos/get-organizationDetails-response.dto';
import { SuspendOrganizationRequest } from './dtos/suspend-organization-request.dto';

@Injectable({ providedIn: 'root' })
export class OrganizationDetailApi {
	private readonly _http = inject(HttpClient);
	private readonly _baseUrl = environment.apiBaseUrl;

	public getOrganization(id: string): Observable<GetOrganizationDetailResponse> {
		return this._http.get<GetOrganizationDetailResponse>(`${this._baseUrl}/Organizations/${id}`);
	}

	public suspendOrganization(id: string, request: SuspendOrganizationRequest): Observable<void> {
		return this._http.put<void>(`${this._baseUrl}/Organizations/${id}/suspend`, request);
	}
}
