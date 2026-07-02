import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { ApplicationsService } from './applications.service';
import { ApplicationsApi } from '../apis/applications.api';
import { ApplicationsStore } from '../store/applications.store';
import { GetApplicationsResponse } from '../apis/dtos/get-applications-response.dto';

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

describe('ApplicationsService', () => {
	let service: ApplicationsService;
	let store: InstanceType<typeof ApplicationsStore>;
	let mockApi: { getApplications: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		mockApi = { getApplications: vi.fn().mockReturnValue(of(mockResponse)) };

		TestBed.configureTestingModule({
			providers: [{ provide: ApplicationsApi, useValue: mockApi }],
		});

		service = TestBed.inject(ApplicationsService);
		store = TestBed.inject(ApplicationsStore);
	});

	it('should call setLoading then setApplications on success', () => {
		const setLoadingSpy = vi.spyOn(store, 'setLoading');
		const setAppsSpy = vi.spyOn(store, 'setApplications');

		service.loadApplications().subscribe();

		expect(setLoadingSpy).toHaveBeenCalled();
		expect(setAppsSpy).toHaveBeenCalledWith(
			mockResponse.items, 1, 20, 1, 1, false, false,
		);
	});

	it('should set error on API failure', () => {
		mockApi.getApplications.mockReturnValue(throwError(() => ({ message: 'Server error' })));
		const setErrorSpy = vi.spyOn(store, 'setError');

		service.loadApplications().subscribe({ error: () => null });

		expect(setErrorSpy).toHaveBeenCalledWith('Server error');
	});

	it('should return Observable<void>', () => {
		let emitted: unknown = 'not-set';
		service.loadApplications().subscribe((v) => (emitted = v));
		expect(emitted).toBeUndefined();
	});

	it('should use store page and pageSize as defaults when no filters passed', () => {
		store.setPage(2);
		store.setPageSize(10);

		service.loadApplications().subscribe();

		expect(mockApi.getApplications).toHaveBeenCalledWith(
			expect.objectContaining({ page: 2, pageSize: 10 }),
		);
	});

	it('goToPage should update store page and reload with correct page', () => {
		const setPageSpy = vi.spyOn(store, 'setPage');

		service.goToPage(3).subscribe();

		expect(setPageSpy).toHaveBeenCalledWith(3);
		expect(mockApi.getApplications).toHaveBeenCalledWith(
			expect.objectContaining({ page: 3 }),
		);
	});

	it('changePageSize should reset to page 1 and reload', () => {
		const setPageSizeSpy = vi.spyOn(store, 'setPageSize');

		service.changePageSize(10).subscribe();

		expect(setPageSizeSpy).toHaveBeenCalledWith(10);
		expect(mockApi.getApplications).toHaveBeenCalledWith(
			expect.objectContaining({ page: 1, pageSize: 10 }),
		);
	});

	it('should pass filters to the API request', () => {
		service.loadApplications({ status: 'Pending', referralSource: 'LinkedIn' }).subscribe();

		expect(mockApi.getApplications).toHaveBeenCalledWith(
			expect.objectContaining({ status: 'Pending', referralSource: 'LinkedIn' }),
		);
	});
});
