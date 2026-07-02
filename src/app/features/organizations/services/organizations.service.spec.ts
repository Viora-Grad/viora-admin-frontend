import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { OrganizationsService } from './organizations.service';
import { OrganizationsApi } from '../apis/organizations.api';
import { OrganizationsStore } from '../store/organizations.store';
import { GetOrganizationsResponse } from '../apis/dtos/get-organizations-response.dto';

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

describe('OrganizationsService', () => {
	let service: OrganizationsService;
	let store: InstanceType<typeof OrganizationsStore>;
	let mockApi: { getOrganizations: ReturnType<typeof vi.fn> };

	beforeEach(() => {
		mockApi = { getOrganizations: vi.fn().mockReturnValue(of(mockResponse)) };

		TestBed.configureTestingModule({
			providers: [{ provide: OrganizationsApi, useValue: mockApi }],
		});

		service = TestBed.inject(OrganizationsService);
		store = TestBed.inject(OrganizationsStore);
	});

	it('should call setLoading then setOrganizations on success', () => {
		const setLoadingSpy = vi.spyOn(store, 'setLoading');
		const setOrgsSpy = vi.spyOn(store, 'setOrganizations');

		service.loadOrganizations().subscribe();

		expect(setLoadingSpy).toHaveBeenCalled();
		expect(setOrgsSpy).toHaveBeenCalledWith(
			mockResponse.items, 1, 20, 1, 1, false, false,
		);
	});

	it('should set error on API failure', () => {
		mockApi.getOrganizations.mockReturnValue(throwError(() => ({ message: 'Server error' })));
		const setErrorSpy = vi.spyOn(store, 'setError');

		service.loadOrganizations().subscribe({ error: () => null });

		expect(setErrorSpy).toHaveBeenCalledWith('Server error');
	});

	it('should return Observable<void> — not the response shape', () => {
		let emittedValue: unknown = 'not-set';
		service.loadOrganizations().subscribe((v) => (emittedValue = v));
		expect(emittedValue).toBeUndefined();
	});

	it('goToPage should update store page and reload', () => {
		const setPageSpy = vi.spyOn(store, 'setPage');

		service.goToPage(3).subscribe();

		expect(setPageSpy).toHaveBeenCalledWith(3);
		expect(mockApi.getOrganizations).toHaveBeenCalledWith(
			expect.objectContaining({ page: 3 }),
		);
	});

	it('changePageSize should reset to page 1 and reload', () => {
		const setPageSizeSpy = vi.spyOn(store, 'setPageSize');

		service.changePageSize(10).subscribe();

		expect(setPageSizeSpy).toHaveBeenCalledWith(10);
		expect(mockApi.getOrganizations).toHaveBeenCalledWith(
			expect.objectContaining({ page: 1, pageSize: 10 }),
		);
	});

	it('should use store page and pageSize as defaults when no filters passed', () => {
		store.setPage(2);
		store.setPageSize(5);

		service.loadOrganizations().subscribe();

		expect(mockApi.getOrganizations).toHaveBeenCalledWith(
			expect.objectContaining({ page: 2, pageSize: 5 }),
		);
	});
});
