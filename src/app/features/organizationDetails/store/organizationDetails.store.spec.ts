import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { OrganizationDetailStore } from './organizationDetails.store';
import { GetOrganizationDetailResponse } from '../api/dtos/get-organizationDetails-response.dto';

const mockOrg: GetOrganizationDetailResponse = {
	id: 'org-1',
	name: 'Nexus Labs',
	about: 'AI research company',
	country: 'Germany',
	countryCode: 'DE',
	servicesProvided: ['AI', 'ML'],
	serviceDescription: 'Advanced AI solutions',
	contactEmail: 'contact@nexus.io',
	joinedOnUtc: '2024-01-01T00:00:00.000Z',
	branches: [
		{
			id: 'branch-1',
			imageId: null,
			address: 'Berlin, Germany',
			openedSinceUtc: '2024-01-01T00:00:00.000Z',
		},
	],
};

describe('OrganizationDetailStore', () => {
	let store: InstanceType<typeof OrganizationDetailStore>;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		store = TestBed.inject(OrganizationDetailStore);
	});

	it('should initialize with empty state', () => {
		expect(store.organization()).toBeNull();
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

	it('should set organization and stop loading on setOrganization()', () => {
		store.setLoading();
		store.setOrganization(mockOrg);

		expect(store.organization()).toEqual(mockOrg);
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
		store.setOrganization(mockOrg);
		store.setSubmitting(true);
		store.reset();

		expect(store.organization()).toBeNull();
		expect(store.isLoading()).toBe(false);
		expect(store.isSubmitting()).toBe(false);
		expect(store.error()).toBeNull();
	});
});
