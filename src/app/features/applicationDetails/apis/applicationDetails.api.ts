import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GetApplicationDetailResponse, LegalPaperFileResponse } from './dtos/get-applicationDetails-response.dto';

@Injectable({ providedIn: 'root' })
export class ApplicationDetailApi {
	private readonly _http = inject(HttpClient);
	private readonly _baseUrl = environment.apiBaseUrl;

	public getApplication(id: string): Observable<GetApplicationDetailResponse> {
		return this._http.get<GetApplicationDetailResponse>(`${this._baseUrl}/Applications/${id}`);
	}

	public approveApplication(id: string): Observable<string> {
		return this._http.post(`${this._baseUrl}/Applications/${id}/approve`, null, { responseType: 'text' });
	}

	public denyApplication(id: string): Observable<void> {
		return this._http.delete<void>(`${this._baseUrl}/Applications/${id}/deny`);
	}
	public getLegalPaperFile(id: string): Observable<LegalPaperFileResponse> {
	return this._http.get<LegalPaperFileResponse>(`${this._baseUrl}/LegalPapers/${id}/file`);
}
}
