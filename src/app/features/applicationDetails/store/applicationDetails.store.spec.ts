import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ApplicationDetailStore } from './applicationDetails.store';
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
	about: 'Technology company',
	letter: 'We are excited to apply.',
	serviceDescription: 'AI Solutions',
	servicesProvided: ['AI', 'Cloud'],
	submittedOnUtc: '2026-06-25T10:00:00Z',
	status: 'Pending',
	referralSource: 'LinkedIn',
	rejectedById: null,
	rejectedByName: null,
	expiryDateUtc: '2026-12-25T10:00:00Z',
	billingEmail: 'billing@stark.com',
	supportEmail: 'support@stark.com',
	articleOfAssociation: mockDoc,
	commercialRegistration: { ...mockDoc, id: 'doc-2', name: 'Commercial Registration' },
	registeredAddressProof: { ...mockDoc, id: 'doc-3', name: 'Registered Address Proof' },
	taxCard: { ...mockDoc, id: 'doc-4', name: 'Tax Card' },
};

describe('ApplicationDetailStore', () => {
	let store: InstanceType<typeof ApplicationDetailStore>;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		store = TestBed.inject(ApplicationDetailStore);
	});

	it('should initialize with empty state', () => {
		expect(store.application()).toBeNull();
		expect(store.isLoading()).toBe(false);
		expect(store.isSubmitting()).toBe(false);
		expect(store.error()).toBeNull();
	});

	it('should set isLoading and clear error on setLoading()', () => {
		store.setError('old error');
		store.setLoading();
		expect(store.isLoading()).toBe(true);
		expect(store.error()).toBeNull();
	});

	it('should set isSubmitting on setSubmitting()', () => {
		store.setSubmitting(true);
		expect(store.isSubmitting()).toBe(true);

		store.setSubmitting(false);
		expect(store.isSubmitting()).toBe(false);
	});

	it('should set application and stop loading on setApplication()', () => {
		store.setLoading();
		store.setApplication(mockApp);

		expect(store.application()).toEqual(mockApp);
		expect(store.isLoading()).toBe(false);
		expect(store.error()).toBeNull();
	});

	it('should set error and stop loading and submitting on setError()', () => {
		store.setLoading();
		store.setSubmitting(true);
		store.setError('Something went wrong');

		expect(store.error()).toBe('Something went wrong');
		expect(store.isLoading()).toBe(false);
		expect(store.isSubmitting()).toBe(false);
	});

	it('should reset to initial state on reset()', () => {
		store.setApplication(mockApp);
		store.setSubmitting(true);
		store.reset();

		expect(store.application()).toBeNull();
		expect(store.isLoading()).toBe(false);
		expect(store.isSubmitting()).toBe(false);
		expect(store.error()).toBeNull();
	});
});
