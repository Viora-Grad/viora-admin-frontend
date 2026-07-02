import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GetApplicationsRequest } from './dtos/get-applications-request.dto';
import { GetApplicationsResponse } from './dtos/get-applications-response.dto';

@Injectable({ providedIn: 'root' })
export class ApplicationsApi {
	private readonly _http = inject(HttpClient);
	private readonly _baseUrl = environment.apiBaseUrl;

	public getApplications(request: GetApplicationsRequest): Observable<GetApplicationsResponse> {
		const params = new HttpParams()
			.set('id', request.id ?? '')
			.set('ownerId', request.ownerId ?? '')
			.set('status', request.status ?? '')
			.set('referralSource', request.referralSource ?? '')
			.set('page', request.page)
			.set('pageSize', request.pageSize);

		return this._http.get<GetApplicationsResponse>(`${this._baseUrl}/Applications`, { params });
	}
}
