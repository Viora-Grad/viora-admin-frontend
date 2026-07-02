import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApplicationsApi } from './applications.api';
import { GetApplicationsRequest } from './dtos/get-applications-request.dto';
import { GetApplicationsResponse } from './dtos/get-applications-response.dto';

const mockDoc = {
	id: 'doc-1',
	name: 'Doc',
	media: { id: 'm-1', contentType: 'application/pdf', fileName: 'doc.pdf', createdAt: '' },
	actionBy: { adminId: 'admin-1', name: 'Admin' },
	status: 1,
	submittedOnUtc: '',
	expiryDateUtc: '',
};

const mockResponse: GetApplicationsResponse = {
	items: [
		{
			id: '1',
			ownerId: 'owner-1',
			ownerName: 'Tony Stark',
			name: 'Stark Industries',
			about: 'Technology',
			letter: 'Letter',
			serviceDescription: 'AI',
			servicesProvided: ['AI'],
			submittedOnUtc: '2026-06-25T10:00:00Z',
			status: 'Pending',
			referralSource: 'LinkedIn',
			rejectedById: null,
			rejectedByName: null,
			expiryDateUtc: '2026-12-25T10:00:00Z',
			billingEmail: 'billing@stark.com',
			supportEmail: 'support@stark.com',
			articleOfAssociation: mockDoc,
			commercialRegistration: mockDoc,
			registeredAddressProof: mockDoc,
			taxCard: mockDoc,
		},
	],
	page: 1,
	pageSize: 20,
	totalCount: 1,
	count: 1,
	totalPages: 1,
	hasNextPage: false,
	hasPreviousPage: false,
	nextPage: null,
	previousPage: null,
};

const mockRequest: GetApplicationsRequest = {
	id: '',
	ownerId: '',
	status: '',
	referralSource: '',
	page: 1,
	pageSize: 20,
};

describe('ApplicationsApi', () => {
	let api: ApplicationsApi;
	let httpTesting: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});
		api = TestBed.inject(ApplicationsApi);
		httpTesting = TestBed.inject(HttpTestingController);
	});

	afterEach(() => httpTesting.verify());

	it('should call GET /Applications with correct params', () => {
		api.getApplications(mockRequest).subscribe((res) => {
			expect(res).toEqual(mockResponse);
		});

		const req = httpTesting.expectOne((r) =>
			r.url.includes('/Applications') &&
			r.params.get('page') === '1' &&
			r.params.get('pageSize') === '20',
		);

		expect(req.request.method).toBe('GET');
		req.flush(mockResponse);
	});

	it('should pass status and referralSource filter params', () => {
		api.getApplications({ ...mockRequest, status: 'Pending', referralSource: 'LinkedIn' }).subscribe();

		const req = httpTesting.expectOne((r) => r.url.includes('/Applications'));
		expect(req.request.params.get('status')).toBe('Pending');
		expect(req.request.params.get('referralSource')).toBe('LinkedIn');
		req.flush(mockResponse);
	});

	it('should pass ownerId filter param', () => {
		api.getApplications({ ...mockRequest, ownerId: 'owner-1' }).subscribe();

		const req = httpTesting.expectOne((r) => r.url.includes('/Applications'));
		expect(req.request.params.get('ownerId')).toBe('owner-1');
		req.flush(mockResponse);
	});
});
