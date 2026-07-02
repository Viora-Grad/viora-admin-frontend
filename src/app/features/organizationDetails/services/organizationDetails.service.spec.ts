import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { OrganizationDetailService } from './organizationDetails.service';
import { OrganizationDetailApi } from '../api/organizationDetails.api';
import { OrganizationDetailStore } from '../store/organizationDetails.store';
import { GetOrganizationDetailResponse } from '../api/dtos/get-organizationDetails-response.dto';

const mockOrg: GetOrganizationDetailResponse = {
	id: 'org-1',
	name: 'Nexus Labs',
	about: 'AI research',
	country: 'Germany',
	countryCode: 'DE',
	servicesProvided: ['AI'],
	serviceDescription: 'AI solutions',
	contactEmail: 'contact@nexus.io',
	joinedOnUtc: '2024-01-01T00:00:00.000Z',
	branches: [],
};

describe('OrganizationDetailService', () => {
	let service: OrganizationDetailService;
	let store: InstanceType<typeof OrganizationDetailStore>;
	let router: Router;
	let mockApi: {
		getOrganization: ReturnType<typeof vi.fn>;
		suspendOrganization: ReturnType<typeof vi.fn>;
	};

	beforeEach(() => {
		mockApi = {
			getOrganization: vi.fn().mockReturnValue(of(mockOrg)),
			suspendOrganization: vi.fn().mockReturnValue(of(void 0)),
		};

		TestBed.configureTestingModule({
			providers: [
				provideRouter([]),
				{ provide: OrganizationDetailApi, useValue: mockApi },
			],
		});

		service = TestBed.inject(OrganizationDetailService);
		store = TestBed.inject(OrganizationDetailStore);
		router = TestBed.inject(Router);
	});

	describe('loadOrganization()', () => {
		it('should call setLoading then setOrganization on success', () => {
			const setLoadingSpy = vi.spyOn(store, 'setLoading');
			const setOrgSpy = vi.spyOn(store, 'setOrganization');

			service.loadOrganization('org-1').subscribe();

			expect(setLoadingSpy).toHaveBeenCalled();
			expect(setOrgSpy).toHaveBeenCalledWith(mockOrg);
		});

		it('should call setError on API failure', () => {
			mockApi.getOrganization.mockReturnValue(throwError(() => ({ message: 'Not found' })));
			const setErrorSpy = vi.spyOn(store, 'setError');

			service.loadOrganization('org-1').subscribe({ error: () => null });

			expect(setErrorSpy).toHaveBeenCalledWith('Not found');
		});

		it('should return Observable<void>', () => {
			let emitted: unknown = 'not-set';
			service.loadOrganization('org-1').subscribe((v) => (emitted = v));
			expect(emitted).toBeUndefined();
		});
	});

	describe('suspend()', () => {
		it('should call setSubmitting(true) then navigate to /organizations on success', () => {
			const setSubmittingSpy = vi.spyOn(store, 'setSubmitting');
			const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

			service.suspend('org-1', { reason: 'Violation', notes: '' }).subscribe();

			expect(setSubmittingSpy).toHaveBeenCalledWith(true);
			expect(setSubmittingSpy).toHaveBeenCalledWith(false);
			expect(navigateSpy).toHaveBeenCalledWith(['/organizations']);
		});

		it('should call setError on suspend failure', () => {
			mockApi.suspendOrganization.mockReturnValue(throwError(() => ({ message: 'Suspend failed' })));
			const setErrorSpy = vi.spyOn(store, 'setError');

			service.suspend('org-1', { reason: 'Violation', notes: '' }).subscribe({ error: () => null });

			expect(setErrorSpy).toHaveBeenCalledWith('Suspend failed');
		});

		it('should pass correct request body to API', () => {
			const request = { reason: 'Policy breach', notes: 'Third warning' };
			service.suspend('org-1', request).subscribe();
			expect(mockApi.suspendOrganization).toHaveBeenCalledWith('org-1', request);
		});
	});
});
