import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ApplicationsStore } from '../store/applications.store';
import { ApplicationsService } from '../services/applications.service';
import { Application } from '../../../core/models/applications.model';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { Router } from '@angular/router';

@Component({
	selector: 'app-applications',
	imports: [BadgeModule, TableModule, BreadcrumbModule, SelectModule, InputTextModule, ButtonModule, FormsModule, CommonModule, SkeletonModule],
	templateUrl: './applications.page.html',
	styleUrl: './applications.page.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsPage implements OnInit {
	private readonly _applicationsService = inject(ApplicationsService);
	protected readonly store = inject(ApplicationsStore);
	private readonly _router = inject(Router);

	public items: MenuItem[] = [{ label: 'Applications', routerLink: '/applications' }];
	public home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

	public filteredApplications: Application[] = [];
	public applications: Application[] = [];

	// filter state
	public filterName = '';
	public filterService = '';
	public filterStatus: string | null = null;

	public statusOptions = [
		{ label: 'Accepted' },
		{ label: 'Pending' },
		{ label: 'Rejected' },
	];

	public ngOnInit(): void {
		this._applicationsService.loadApplications().subscribe();
	}

	public constructor() {
		effect(() => {
			const items = this.store.items();
			this.applications = [...items];
			this.filteredApplications = [...items];
		});
	}

	public onPageChange(event: { page: number; rows: number }): void {
		this._applicationsService.goToPage(event.page + 1).subscribe();
	}

	public applyFilters(): void {
		this.filteredApplications = this.applications.filter(app => {
			const matchesName =
				!this.filterName ||
				app.name.toLowerCase().includes(this.filterName.toLowerCase());

			const matchesStatus =
				!this.filterStatus || app.status === this.filterStatus;

			const matchesService =
				!this.filterService ||
				app.servicesProvided.some(service => service.toLowerCase().includes(this.filterService.toLowerCase())
				);

			return matchesName && matchesStatus && matchesService;
		});
	}

	// public applyFilters(): void {
	// 	this._applicationsService.loadApplications({
	// 		page: 1,
	// 		status: this.filterStatus ?? '',
	// 		referralSource: this.filterService,
	// 	}).subscribe();
	// }

	// public clearFilters(): void {
	// 	this.filterName     = '';
	// 	this.filterService = '';
	// 	this.filterStatus   = null;
	// 	this._applicationsService.loadApplications({ page: 1 }).subscribe();
	// }

	public getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'secondary' {
		switch (status.toLowerCase()) {
			case 'accepted': return 'success';
			case 'pending': return 'warn';
			case 'rejected': return 'danger';
			default: return 'secondary';
		}
	}

	public onRowClick(id: string): void {
		void this._router.navigate(['/applications', id]);
	}

}
