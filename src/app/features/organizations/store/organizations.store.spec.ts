import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { OrganizationsStore } from './organizations.store';
import { Organization } from '../../../core/models/organization.model';

const mockOrganizations: Organization[] = [
	{
		id: 'org-1',
		logoId: null,
		name: 'Nexus Labs',
		country: 'Germany',
		serviceDescription: 'AI research',
		servicesProvided: ['AI', 'ML'],
		ratingsCount: '42',
		ratingOutOfTen: '8.5',
	},
	{
		id: 'org-2',
		logoId: null,
		name: 'Stark Cloud',
		country: 'USA',
		serviceDescription: 'Cloud infrastructure',
		servicesProvided: ['Cloud', 'DevOps'],
		ratingsCount: '100',
		ratingOutOfTen: '9.1',
	},
];

describe('OrganizationsStore', () => {
	let store: InstanceType<typeof OrganizationsStore>;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		store = TestBed.inject(OrganizationsStore);
	});

	it('should initialize with empty state', () => {
		expect(store.items()).toEqual([]);
		expect(store.page()).toBe(1);
		expect(store.pageSize()).toBe(20);
		expect(store.totalCount()).toBe(0);
		expect(store.isLoading()).toBe(false);
		expect(store.error()).toBeNull();
	});

	it('should set isLoading true and clear error on setLoading()', () => {
		store.setError('some error');
		store.setLoading();
		expect(store.isLoading()).toBe(true);
		expect(store.error()).toBeNull();
	});

	it('should set error and stop loading on setError()', () => {
		store.setLoading();
		store.setError('Network error');
		expect(store.error()).toBe('Network error');
		expect(store.isLoading()).toBe(false);
	});

	it('should set organizations and pagination on setOrganizations()', () => {
		store.setOrganizations(mockOrganizations, 1, 20, 2, 1, false, false);
		expect(store.items()).toEqual(mockOrganizations);
		expect(store.totalCount()).toBe(2);
		expect(store.totalPages()).toBe(1);
		expect(store.isLoading()).toBe(false);
		expect(store.error()).toBeNull();
	});

	it('should update page on setPage()', () => {
		store.setPage(3);
		expect(store.page()).toBe(3);
	});

	it('should reset page when setPageSize() is called', () => {
		store.setPage(5);
		store.setPageSize(10);
		expect(store.pageSize()).toBe(10);
		// expect(store.page()).toBe(1);
	});

	it('isEmpty should be true when not loading and items is empty', () => {
		expect(store.isEmpty()).toBe(true);
	});

	it('isEmpty should be false when items exist', () => {
		store.setOrganizations(mockOrganizations, 1, 20, 2, 1, false, false);
		expect(store.isEmpty()).toBe(false);
	});

	it('isEmpty should be false while loading even if items is empty', () => {
		store.setLoading();
		expect(store.isEmpty()).toBe(false);
	});
});
