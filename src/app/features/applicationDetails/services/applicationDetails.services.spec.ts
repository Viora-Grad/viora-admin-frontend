import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { ApplicationDetailService } from './applicationDetails.service';
import { ApplicationDetailApi } from '../apis/applicationDetails.api';
import { ApplicationDetailStore } from '../store/applicationDetails.store';
import { GetApplicationDetailResponse } from '../apis/dtos/get-applicationDetails-response.dto';

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

describe('ApplicationDetailService', () => {
	let service: ApplicationDetailService;
	let store: InstanceType<typeof ApplicationDetailStore>;
	let router: Router;
	let mockApi: {
		getApplication: ReturnType<typeof vi.fn>;
		approveApplication: ReturnType<typeof vi.fn>;
		denyApplication: ReturnType<typeof vi.fn>;
	};

	beforeEach(() => {
		mockApi = {
			getApplication: vi.fn().mockReturnValue(of(mockApp)),
			approveApplication: vi.fn().mockReturnValue(of('app-1')),
			denyApplication: vi.fn().mockReturnValue(of(void 0)),
		};

		TestBed.configureTestingModule({
			providers: [
				provideRouter([]),
				{ provide: ApplicationDetailApi, useValue: mockApi },
			],
		});

		service = TestBed.inject(ApplicationDetailService);
		store = TestBed.inject(ApplicationDetailStore);
		router = TestBed.inject(Router);
	});

	describe('loadApplication()', () => {
		it('should call setLoading then setApplication on success', () => {
			const setLoadingSpy = vi.spyOn(store, 'setLoading');
			const setAppSpy = vi.spyOn(store, 'setApplication');

			service.loadApplication('app-1').subscribe();

			expect(setLoadingSpy).toHaveBeenCalled();
			expect(setAppSpy).toHaveBeenCalledWith(mockApp);
		});

		it('should call setError on API failure', () => {
			mockApi.getApplication.mockReturnValue(throwError(() => ({ message: 'Not found' })));
			const setErrorSpy = vi.spyOn(store, 'setError');

			service.loadApplication('app-1').subscribe({ error: () => null });

			expect(setErrorSpy).toHaveBeenCalledWith('Not found');
		});

		it('should return Observable<void>', () => {
			let emitted: unknown = 'not-set';
			service.loadApplication('app-1').subscribe((v) => (emitted = v));
			expect(emitted).toBeUndefined();
		});
	});

	describe('approve()', () => {
		it('should call setSubmitting(true) then navigate to /applications on success', () => {
			const setSubmittingSpy = vi.spyOn(store, 'setSubmitting');
			const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

			service.approve('app-1').subscribe();

			expect(setSubmittingSpy).toHaveBeenCalledWith(true);
			expect(setSubmittingSpy).toHaveBeenCalledWith(false);
			expect(navigateSpy).toHaveBeenCalledWith(['/applications']);
		});

		it('should call setError on approve failure', () => {
			mockApi.approveApplication.mockReturnValue(throwError(() => ({ message: 'Approve failed' })));
			const setErrorSpy = vi.spyOn(store, 'setError');

			service.approve('app-1').subscribe({ error: () => null });

			expect(setErrorSpy).toHaveBeenCalledWith('Approve failed');
		});
	});

	describe('deny()', () => {
		it('should call setSubmitting(true) then navigate to /applications on success', () => {
			const setSubmittingSpy = vi.spyOn(store, 'setSubmitting');
			const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

			service.deny('app-1').subscribe();

			expect(setSubmittingSpy).toHaveBeenCalledWith(true);
			expect(setSubmittingSpy).toHaveBeenCalledWith(false);
			expect(navigateSpy).toHaveBeenCalledWith(['/applications']);
		});

		it('should call setError on deny failure', () => {
			mockApi.denyApplication.mockReturnValue(throwError(() => ({ message: 'Deny failed' })));
			const setErrorSpy = vi.spyOn(store, 'setError');

			service.deny('app-1').subscribe({ error: () => null });

			expect(setErrorSpy).toHaveBeenCalledWith('Deny failed');
		});
	});
});
