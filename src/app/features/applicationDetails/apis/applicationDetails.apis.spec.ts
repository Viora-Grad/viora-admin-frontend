
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApplicationDetailApi } from './applicationDetails.api';
import { GetApplicationDetailResponse } from './dtos/get-applicationDetails-response.dto';

const mockDoc = {
	id: 'doc-1',
	name: 'Article of Association',
	media: { id: 'media-1', contentType: 'application/pdf', fileName: 'aoa.pdf', createdAt: '' },
	status: 1,
	submittedOnUtc: '2026-06-25T10:00:00Z',
};

const mockApp: GetApplicationDetailResponse = {
	id: 'app-1',
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
	commercialRegistration: { ...mockDoc, id: 'doc-2' },
	registeredAddressProof: { ...mockDoc, id: 'doc-3' },
	taxCard: { ...mockDoc, id: 'doc-4' },
};

describe('ApplicationDetailApi', () => {
	let api: ApplicationDetailApi;
	let httpTesting: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()],
		});
		api = TestBed.inject(ApplicationDetailApi);
		httpTesting = TestBed.inject(HttpTestingController);
	});

	afterEach(() => httpTesting.verify());

	it('should call GET /Applications/:id', () => {
		api.getApplication('app-1').subscribe((res) => {
			expect(res).toEqual(mockApp);
		});

		const req = httpTesting.expectOne((r) => r.url.includes('/Applications/app-1'));
		expect(req.request.method).toBe('GET');
		req.flush(mockApp);
	});

	it('should call POST /Applications/:id/approve and return text', () => {
		api.approveApplication('app-1').subscribe((res) => {
			expect(res).toBe('app-1');
		});

		const req = httpTesting.expectOne((r) => r.url.includes('/Applications/app-1/approve'));
		expect(req.request.method).toBe('POST');
		expect(req.request.body).toBeNull();
		req.flush('app-1');
	});

	it('should call DELETE /Applications/:id/deny', () => {
		api.denyApplication('app-1').subscribe();

		const req = httpTesting.expectOne((r) => r.url.includes('/Applications/app-1/deny'));
		expect(req.request.method).toBe('DELETE');
		req.flush(null);
	});

	it('should call GET /LegalPapers/:id/file', () => {
		const mockFile = { content: 'base64content', contentType: 'application/pdf', fileName: 'doc.pdf' };

		api.getLegalPaperFile('media-1').subscribe((res) => {
			expect(res).toEqual(mockFile);
		});

		const req = httpTesting.expectOne((r) => r.url.includes('/LegalPapers/media-1/file'));
		expect(req.request.method).toBe('GET');
		req.flush(mockFile);
	});
});