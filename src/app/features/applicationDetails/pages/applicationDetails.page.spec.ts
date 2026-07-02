import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { of } from 'rxjs';
import { ApplicationDetailPage } from './applicationDetails.page';
import { ApplicationDetailService } from '../services/applicationDetails.service';
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
	commercialRegistration: { ...mockDoc, id: 'doc-2', name: 'Commercial Registration', media: { ...mockDoc.media, id: 'media-2' } },
	registeredAddressProof: { ...mockDoc, id: 'doc-3', name: 'Registered Address Proof', media: { ...mockDoc.media, id: 'media-3' } },
	taxCard: { ...mockDoc, id: 'doc-4', name: 'Tax Card', media: { ...mockDoc.media, id: 'media-4' } },
};

describe('ApplicationDetailPage', () => {
	let component: ApplicationDetailPage;
	let fixture: ComponentFixture<ApplicationDetailPage>;
	let store: InstanceType<typeof ApplicationDetailStore>;
	let mockService: {
		loadApplication: ReturnType<typeof vi.fn>;
		approve: ReturnType<typeof vi.fn>;
		deny: ReturnType<typeof vi.fn>;
	};
	let mockApi: { getLegalPaperFile: ReturnType<typeof vi.fn> };

	beforeEach(async () => {
		mockService = {
			loadApplication: vi.fn().mockReturnValue(of(void 0)),
			approve: vi.fn().mockReturnValue(of(void 0)),
			deny: vi.fn().mockReturnValue(of(void 0)),
		};

		mockApi = {
			getLegalPaperFile: vi.fn().mockReturnValue(
				of({ content: 'base64content', contentType: 'application/pdf', fileName: 'doc.pdf' }),
			),
		};

		await TestBed.configureTestingModule({
			imports: [ApplicationDetailPage],
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				provideRouter([]),
				{ provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'app-1' } } } },
				{ provide: ApplicationDetailService, useValue: mockService },
				{ provide: ApplicationDetailApi, useValue: mockApi },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ApplicationDetailPage);
		component = fixture.componentInstance;
		store = TestBed.inject(ApplicationDetailStore);

		fixture.detectChanges();
		await fixture.whenStable();
	});

	afterEach(() => store.reset());

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call loadApplication with the route id on init', () => {
		expect(mockService.loadApplication).toHaveBeenCalledWith('app-1');
	});

	it('should call store.reset() on destroy', () => {
		const resetSpy = vi.spyOn(store, 'reset');
		component.ngOnDestroy();
		expect(resetSpy).toHaveBeenCalled();
	});

	describe('getStatusSeverity()', () => {
		it('should return success for Accepted', () => expect(component.getStatusSeverity('Accepted')).toBe('success'));
		it('should return warn for Pending', () => expect(component.getStatusSeverity('Pending')).toBe('warn'));
		it('should return danger for Rejected', () => expect(component.getStatusSeverity('Rejected')).toBe('danger'));
		it('should return secondary for unknown', () => expect(component.getStatusSeverity('Unknown')).toBe('secondary'));
		it('should be case insensitive', () => expect(component.getStatusSeverity('ACCEPTED')).toBe('success'));
	});

	describe('getDocStatusLabel()', () => {
		it('should return Submitted for status 1', () => expect(component.getDocStatusLabel(1)).toBe('Submitted'));
		it('should return Approved for status 2', () => expect(component.getDocStatusLabel(2)).toBe('Approved'));
		it('should return Rejected for status 3', () => expect(component.getDocStatusLabel(3)).toBe('Rejected'));
		it('should return Unknown for unknown status', () => expect(component.getDocStatusLabel(99)).toBe('Unknown'));
	});

	describe('getActiveDoc()', () => {
		it('should return null when no application is loaded', () => {
			expect(component.getActiveDoc()).toBeNull();
		});

		it('should return articleOfAssociation for tab index 0', () => {
			store.setApplication(mockApp);
			component.activeDocTab.set(0);
			expect(component.getActiveDoc()?.name).toBe('Article of Association');
		});

		it('should return commercialRegistration for tab index 1', () => {
			store.setApplication(mockApp);
			component.activeDocTab.set(1);
			expect(component.getActiveDoc()?.name).toBe('Commercial Registration');
		});

		it('should return registeredAddressProof for tab index 2', () => {
			store.setApplication(mockApp);
			component.activeDocTab.set(2);
			expect(component.getActiveDoc()?.name).toBe('Registered Address Proof');
		});

		it('should return taxCard for tab index 3', () => {
			store.setApplication(mockApp);
			component.activeDocTab.set(3);
			expect(component.getActiveDoc()?.name).toBe('Tax Card');
		});
	});

	describe('onTabChange()', () => {
		it('should update activeDocTab and fetch the document file', () => {
			store.setApplication(mockApp);
			component.onTabChange(1);

			expect(component.activeDocTab()).toBe(1);
			expect(mockApi.getLegalPaperFile).toHaveBeenCalledWith('doc-2');
			expect(component.activeDocUrl()).toBe('data:application/pdf;base64,base64content');
		});

		it('should not call getLegalPaperFile if no application is loaded', () => {
			component.onTabChange(0);
			expect(mockApi.getLegalPaperFile).not.toHaveBeenCalled();
		});
	});

	describe('responsive splitter', () => {
		it('should use horizontal layout on desktop', () => {
			component.isMobile.set(false);
			expect(component.splitterLayout()).toBe('horizontal');
			expect(component.splitterSizes()).toEqual([40, 60]);
			expect(component.splitterHeight()).toBe('calc(100vh - 11rem)');
		});

		it('should use vertical layout on mobile', () => {
			component.isMobile.set(true);
			expect(component.splitterLayout()).toBe('vertical');
			expect(component.splitterSizes()).toEqual([50, 50]);
			expect(component.splitterHeight()).toBe('auto');
		});

		it('should update isMobile on window resize', () => {
			Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
			component.onResize();
			expect(component.isMobile()).toBe(true);

			Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });
			component.onResize();
			expect(component.isMobile()).toBe(false);
		});
	});

	describe('template rendering', () => {
		it('should show skeleton while loading', () => {
			store.setLoading();
			fixture.detectChanges();
			const el = fixture.nativeElement as HTMLElement;
			expect(el.querySelector('p-skeleton')).not.toBeNull();
		});

		it('should render app name when loaded', () => {
			store.setApplication(mockApp);
			fixture.detectChanges();
			const el = fixture.nativeElement as HTMLElement;
			expect(el.textContent).toContain('Stark Industries');
		});

		it('should render service tags', () => {
			store.setApplication(mockApp);
			fixture.detectChanges();
			const tags = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLSpanElement>('span.rounded');
			const texts = Array.from(tags).map((t) => t.textContent?.trim());
			expect(texts).toContain('AI');
			expect(texts).toContain('Cloud');
		});

		it('should render owner name initial', () => {
			store.setApplication(mockApp);
			fixture.detectChanges();
			const el = fixture.nativeElement as HTMLElement;
			expect(el.textContent).toContain('T');
		});

		it('should show cover letter when present', () => {
			store.setApplication(mockApp);
			fixture.detectChanges();
			const el = fixture.nativeElement as HTMLElement;
			expect(el.textContent).toContain('We are excited to apply.');
		});
	});
});