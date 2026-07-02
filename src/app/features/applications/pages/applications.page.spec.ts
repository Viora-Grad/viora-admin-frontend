import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { of } from 'rxjs';
import { ApplicationsPage } from './applications.page';
import { ApplicationsService } from '../services/applications.service';
import { ApplicationsStore } from '../store/applications.store';
import { Application } from '../../../core/models/applications.model';

const mockDoc = {
	id: 'doc-1',
	name: 'Doc',
	media: { id: 'm-1', contentType: 'application/pdf', fileName: 'doc.pdf', createdAt: '' },
	actionBy: { adminId: 'admin-1', name: 'Admin' },
	status: 1,
	submittedOnUtc: '',
	expiryDateUtc: '',
};

const mockApplications: Application[] = [
	{
		id: '1',
		ownerId: 'owner-1',
		ownerName: 'Tony Stark',
		name: 'Stark Industries',
		about: 'Technology',
		letter: 'Letter',
		serviceDescription: 'AI',
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
		commercialRegistration: mockDoc,
		registeredAddressProof: mockDoc,
		taxCard: mockDoc,
	},
	{
		id: '2',
		ownerId: 'owner-2',
		ownerName: 'Bruce Wayne',
		name: 'Wayne Enterprises',
		about: 'Manufacturing',
		letter: 'Letter',
		serviceDescription: 'Security',
		servicesProvided: ['Security'],
		submittedOnUtc: '2026-06-25T10:00:00Z',
		status: 'Accepted',
		referralSource: 'Google',
		rejectedById: null,
		rejectedByName: null,
		expiryDateUtc: '2026-12-25T10:00:00Z',
		billingEmail: 'billing@wayne.com',
		supportEmail: 'support@wayne.com',
		articleOfAssociation: mockDoc,
		commercialRegistration: mockDoc,
		registeredAddressProof: mockDoc,
		taxCard: mockDoc,
	},
];

describe('ApplicationsPage', () => {
	let component: ApplicationsPage;
	let fixture: ComponentFixture<ApplicationsPage>;
	let store: InstanceType<typeof ApplicationsStore>;
	let router: Router;
	let mockService: {
		loadApplications: ReturnType<typeof vi.fn>;
		goToPage: ReturnType<typeof vi.fn>;
		changePageSize: ReturnType<typeof vi.fn>;
	};

	beforeEach(async () => {
		mockService = {
			loadApplications: vi.fn().mockReturnValue(of(void 0)),
			goToPage: vi.fn().mockReturnValue(of(void 0)),
			changePageSize: vi.fn().mockReturnValue(of(void 0)),
		};

		await TestBed.configureTestingModule({
			imports: [ApplicationsPage],
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				provideRouter([]),
				{ provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
				{ provide: ApplicationsService, useValue: mockService },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ApplicationsPage);
		component = fixture.componentInstance;
		store = TestBed.inject(ApplicationsStore);
		router = TestBed.inject(Router);

		store.setApplications(mockApplications, 1, 20, 2, 1, false, false);

		fixture.detectChanges();
		await fixture.whenStable();
	});

	afterEach(() => {
		store.setApplications([], 1, 20, 0, 0, false, false);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call loadApplications on init', () => {
		expect(mockService.loadApplications).toHaveBeenCalledOnce();
	});

	it('should initialize applications and filteredApplications from store', () => {
		expect(component.applications).toHaveLength(2);
		expect(component.filteredApplications).toHaveLength(2);
	});

	describe('getStatusSeverity()', () => {
		it('should return success for Accepted', () => expect(component.getStatusSeverity('Accepted')).toBe('success'));
		it('should return warn for Pending', () => expect(component.getStatusSeverity('Pending')).toBe('warn'));
		it('should return danger for Rejected', () => expect(component.getStatusSeverity('Rejected')).toBe('danger'));
		it('should return secondary for unknown', () => expect(component.getStatusSeverity('Unknown')).toBe('secondary'));
		it('should be case insensitive', () => expect(component.getStatusSeverity('ACCEPTED')).toBe('success'));
	});

	describe('applyFilters()', () => {
		it('should filter by organization name', () => {
			component.filterName = 'stark';
			component.applyFilters();
			expect(component.filteredApplications).toHaveLength(1);
			expect(component.filteredApplications[0].name).toBe('Stark Industries');
		});

		it('should filter by status', () => {
			component.filterStatus = 'Accepted';
			component.applyFilters();
			expect(component.filteredApplications).toHaveLength(1);
			expect(component.filteredApplications[0].status).toBe('Accepted');
		});

		it('should filter by service', () => {
			component.filterService = 'cloud';
			component.applyFilters();
			expect(component.filteredApplications).toHaveLength(1);
			expect(component.filteredApplications[0].servicesProvided).toContain('Cloud');
		});

		it('should apply all filters together', () => {
			component.filterName = 'stark';
			component.filterStatus = 'Pending';
			component.filterService = 'AI';
			component.applyFilters();
			expect(component.filteredApplications).toHaveLength(1);
			expect(component.filteredApplications[0].name).toBe('Stark Industries');
		});

		it('should return empty when no match', () => {
			component.filterName = 'NonExistent';
			component.applyFilters();
			expect(component.filteredApplications).toHaveLength(0);
		});

		it('should return all when no filters applied', () => {
			component.filterName = '';
			component.filterStatus = null;
			component.filterService = '';
			component.applyFilters();
			expect(component.filteredApplications).toHaveLength(2);
		});

		it('should be case insensitive for name filter', () => {
			component.filterName = 'WAYNE';
			component.applyFilters();
			expect(component.filteredApplications).toHaveLength(1);
			expect(component.filteredApplications[0].name).toBe('Wayne Enterprises');
		});

		it('should be case insensitive for service filter', () => {
			component.filterService = 'SECURITY';
			component.applyFilters();
			expect(component.filteredApplications).toHaveLength(1);
			expect(component.filteredApplications[0].name).toBe('Wayne Enterprises');
		});

		it('should restore all items after clearing filters', () => {
			component.filterName = 'Stark';
			component.applyFilters();
			expect(component.filteredApplications).toHaveLength(1);

			component.filterName = '';
			component.filterStatus = null;
			component.filterService = '';
			component.applyFilters();
			expect(component.filteredApplications).toHaveLength(2);
		});
	});

	describe('onPageChange()', () => {
		it('should call goToPage with page + 1', () => {
			component.onPageChange({ page: 1, rows: 20 });
			expect(mockService.goToPage).toHaveBeenCalledWith(2);
		});

		it('should call goToPage with 1 for first page', () => {
			component.onPageChange({ page: 0, rows: 20 });
			expect(mockService.goToPage).toHaveBeenCalledWith(1);
		});
	});

	describe('onRowClick()', () => {
		it('should navigate to /applications/:id', () => {
			const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
			component.onRowClick('1');
			expect(navigateSpy).toHaveBeenCalledWith(['/applications', '1']);
		});
	});

	describe('template rendering', () => {
		it('should show applications in table', () => {
			const rows = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLTableRowElement>('tbody tr');
			expect(rows.length).toBe(2);
		});

		it('should show Stark Industries in first row', () => {
			const rows = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLTableRowElement>('tbody tr');
			expect(rows[0].textContent).toContain('Stark Industries');
		});

		it('should show empty message when store is empty', () => {
			store.setApplications([], 1, 20, 0, 0, false, false);
			component.applications = [];
			component.filteredApplications = [];
			fixture.detectChanges();

			const empty = (fixture.nativeElement as HTMLElement).querySelector<HTMLSpanElement>('td span');
			expect(empty?.textContent?.trim()).toBe('No applications found.');
		});
	});
});