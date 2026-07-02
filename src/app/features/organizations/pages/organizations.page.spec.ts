import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { OrganizationsPage } from './organizations.page';
import { OrganizationsService } from '../services/organizations.service';
import { OrganizationsStore } from '../store/organizations.store';
import { Organization } from '../../../core/models/organization.model';

const mockOrgs: Organization[] = [
  {
    id: 'org-1',
    logoId: null,
    name: 'Nexus Labs',
    country: 'Germany',
    serviceDescription: 'AI',
    servicesProvided: ['AI', 'ML'],
    ratingsCount: '42',
    ratingOutOfTen: '8.5',
  },
];

describe('OrganizationsPage', () => {
  let component: OrganizationsPage;
  let fixture: ComponentFixture<OrganizationsPage>;
  let mockService: { loadOrganizations: ReturnType<typeof vi.fn>; goToPage: ReturnType<typeof vi.fn> };
  let store: InstanceType<typeof OrganizationsStore>;
  let router: Router;

  beforeEach(async () => {
    mockService = {
      loadOrganizations: vi.fn().mockReturnValue(of(void 0)),
      goToPage: vi.fn().mockReturnValue(of(void 0)),
    };

    await TestBed.configureTestingModule({
      imports: [OrganizationsPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: OrganizationsService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationsPage);
    component = fixture.componentInstance;
    store = TestBed.inject(OrganizationsStore);
    router = TestBed.inject(Router);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadOrganizations on init', () => {
    expect(mockService.loadOrganizations).toHaveBeenCalledOnce();
  });

  it('should navigate to organization detail on row click', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.onRowClick('org-1');
    expect(navigateSpy).toHaveBeenCalledWith(['/organizations', 'org-1']);
  });

  it('should call goToPage with page+1 on page change (PrimeNG is 0-indexed)', () => {
    component.onPageChange({ page: 1, rows: 20 });
    expect(mockService.goToPage).toHaveBeenCalledWith(2);
  });

  it('should show organizations from store in the table', () => {
    store.setOrganizations(mockOrgs, 1, 20, 1, 1, false, false);
    fixture.detectChanges();

    const rows = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLTableRowElement>('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Nexus Labs');
  });

  it('should show empty message when store is empty', () => {
    // store starts empty
    fixture.detectChanges();
    const empty = (fixture.nativeElement as HTMLElement).querySelector('td span');
    expect(empty?.textContent?.trim()).toBe('No organizations found.');
  });
});