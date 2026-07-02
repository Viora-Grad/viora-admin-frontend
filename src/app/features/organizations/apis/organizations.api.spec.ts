import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OrganizationsApi } from './organizations.api';
import { GetOrganizationsRequest } from './dtos/get-organizations-request.dto';
import { GetOrganizationsResponse } from './dtos/get-organizations-response.dto';

const mockRequest: GetOrganizationsRequest = {
	id: '',
	country: '',
	name: '',
	serviceType: '',
	minimumRating: 0,
	sortBy: 0,
	page: 1,
	pageSize: 20,
};

const mockResponse: GetOrganizationsResponse = {
	items: [
		{
			id: 'org-1',
			logoId: null,
			name: 'Nexus Labs',
			country: 'Germany',
			serviceDescription: 'AI research',
			servicesProvided: ['AI'],
			ratingsCount: '10',
			ratingOutOfTen: '9',
		},
	],
	page: 1,
	pageSize: 20,
	totalCount: 1,
	count: 1,
	totalPages: 1,
	hasNextPage: false,
	hasPreviousPage: false,
	nextPage: 0,
	previousPage: 0,
};

describe('OrganizationsApi', () => {
	let api: OrganizationsApi;
	let httpTesting: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});
		api = TestBed.inject(OrganizationsApi);
		httpTesting = TestBed.inject(HttpTestingController);
	});

	afterEach(() => httpTesting.verify());

	it('should call GET /Organizations with correct params', () => {
		api.getOrganizations(mockRequest).subscribe((res) => {
			expect(res).toEqual(mockResponse);
		});

		const req = httpTesting.expectOne((r) =>
			r.url.includes('/Organizations') &&
			r.params.get('page') === '1' &&
			r.params.get('pageSize') === '20',
		);

		expect(req.request.method).toBe('GET');
		req.flush(mockResponse);
	});

	it('should pass filter params correctly', () => {
		api.getOrganizations({ ...mockRequest, name: 'Nexus', country: 'Germany' }).subscribe();

		const req = httpTesting.expectOne((r) =>
			r.url.includes('/Organizations') && r.params.get('name') === 'Nexus',
		);
		expect(req.request.params.get('country')).toBe('Germany');
		req.flush(mockResponse);
	});
});
