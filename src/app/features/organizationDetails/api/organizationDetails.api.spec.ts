import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OrganizationDetailApi } from './organizationDetails.api';
import { GetOrganizationDetailResponse } from './dtos/get-organizationDetails-response.dto';
import { SuspendOrganizationRequest } from './dtos/suspend-organization-request.dto';

const mockOrg: GetOrganizationDetailResponse = {
	id: 'org-1',
	name: 'Nexus Labs',
	about: 'AI research company',
	country: 'Germany',
	countryCode: 'DE',
	servicesProvided: ['AI'],
	serviceDescription: 'AI solutions',
	contactEmail: 'contact@nexus.io',
	joinedOnUtc: '2024-01-01T00:00:00.000Z',
	branches: [],
};

const mockSuspendRequest: SuspendOrganizationRequest = {
	reason: 'Policy violation',
	notes: 'Repeated offense',
};

describe('OrganizationDetailApi', () => {
	let api: OrganizationDetailApi;
	let httpTesting: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});
		api = TestBed.inject(OrganizationDetailApi);
		httpTesting = TestBed.inject(HttpTestingController);
	});

	afterEach(() => httpTesting.verify());

	it('should call GET /Organizations/:id', () => {
		api.getOrganization('org-1').subscribe((res) => {
			expect(res).toEqual(mockOrg);
		});

		const req = httpTesting.expectOne((r) => r.url.includes('/Organizations/org-1'));
		expect(req.request.method).toBe('GET');
		req.flush(mockOrg);
	});

	it('should call PUT /Organizations/:id/suspend with correct body', () => {
		api.suspendOrganization('org-1', mockSuspendRequest).subscribe();

		const req = httpTesting.expectOne((r) => r.url.includes('/Organizations/org-1/suspend'));
		expect(req.request.method).toBe('PUT');
		expect(req.request.body).toEqual(mockSuspendRequest);
		req.flush(null);
	});
});
