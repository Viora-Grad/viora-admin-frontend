import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { of } from 'rxjs';
import { OrganizationDetailsPage } from './organizationDetails.page';
import { OrganizationDetailService } from '../services/organizationDetails.service';
import { OrganizationDetailStore } from '../store/organizationDetails.store';
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

describe('OrganizationDetailsPage', () => {
	let component: OrganizationDetailsPage;
	let fixture: ComponentFixture<OrganizationDetailsPage>;
	let store: InstanceType<typeof OrganizationDetailStore>;
	let mockService: {
		loadOrganization: ReturnType<typeof vi.fn>;
		suspend: ReturnType<typeof vi.fn>;
	};

	beforeEach(async () => {
		mockService = {
			loadOrganization: vi.fn().mockReturnValue(of(void 0)),
			suspend: vi.fn().mockReturnValue(of(void 0)),
		};

		await TestBed.configureTestingModule({
			imports: [OrganizationDetailsPage],
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				provideRouter([]),
				{
					provide: ActivatedRoute,
					useValue: { snapshot: { paramMap: { get: () => 'org-1' } } },
				},
				{ provide: OrganizationDetailService, useValue: mockService },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(OrganizationDetailsPage);
		component = fixture.componentInstance;
		store = TestBed.inject(OrganizationDetailStore);

		fixture.detectChanges();
		await fixture.whenStable();
	});

	afterEach(() => {
		store.reset();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call loadOrganization with the route id on init', () => {
		expect(mockService.loadOrganization).toHaveBeenCalledWith('org-1');
	});

	it('should call store.reset() on destroy', () => {
		const resetSpy = vi.spyOn(store, 'reset');
		component.ngOnDestroy();
		expect(resetSpy).toHaveBeenCalled();
	});

	describe('suspend dialog', () => {
		it('should initialize with dialog closed', () => {
			expect(component.showSuspendDialog()).toBe(false);
		});

		it('should open suspend dialog on showSuspendDialog.set(true)', () => {
			component.showSuspendDialog.set(true);
			expect(component.showSuspendDialog()).toBe(true);
		});

		it('should initialize suspendReason and suspendNotes as empty', () => {
			expect(component.suspendReason()).toBe('');
			expect(component.suspendNotes()).toBe('');
		});

		it('should call service.suspend with correct id and request on confirm', () => {
			component.suspendReason.set('Policy violation');
			component.suspendNotes.set('Third warning');
			component.showSuspendDialog.set(true);

			component.onSuspendConfirm();

			expect(mockService.suspend).toHaveBeenCalledWith('org-1', {
				reason: 'Policy violation',
				notes: 'Third warning',
			});
		});

		it('should close dialog after successful suspension', () => {
			component.showSuspendDialog.set(true);
			component.suspendReason.set('Violation');

			component.onSuspendConfirm();

			expect(component.showSuspendDialog()).toBe(false);
		});
	});

	describe('template rendering', () => {
		it('should show skeleton while loading', () => {
			store.setLoading();
			fixture.detectChanges();

			const skeleton = fixture.nativeElement as HTMLElement;
			expect(skeleton.querySelector('p-skeleton')).not.toBeNull();
		});

		it('should render org name when organization is loaded', () => {
			store.setOrganization(mockOrg);
			fixture.detectChanges();

			const el = fixture.nativeElement as HTMLElement;
			expect(el.textContent).toContain('Nexus Labs');
		});

		it('should render country and countryCode', () => {
			store.setOrganization(mockOrg);
			fixture.detectChanges();

			const el = fixture.nativeElement as HTMLElement;
			expect(el.textContent).toContain('Germany');
			expect(el.textContent).toContain('DE');
		});

		it('should render service tags', () => {
			store.setOrganization(mockOrg);
			fixture.detectChanges();

			const tags = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLSpanElement>('span.rounded');
			const tagTexts = Array.from(tags).map((t) => t.textContent?.trim());
			expect(tagTexts).toContain('AI');
			expect(tagTexts).toContain('ML');
		});

		it('should render branch address', () => {
			store.setOrganization(mockOrg);
			fixture.detectChanges();

			const el = fixture.nativeElement as HTMLElement;
			expect(el.textContent).toContain('Berlin, Germany');
		});

		it('should show "No branches registered." when branches is empty', () => {
			store.setOrganization({ ...mockOrg, branches: [] });
			fixture.detectChanges();

			const el = fixture.nativeElement as HTMLElement;
			expect(el.textContent).toContain('No branches registered.');
		});
	});
});