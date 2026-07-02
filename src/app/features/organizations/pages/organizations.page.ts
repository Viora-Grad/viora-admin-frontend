import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { OrganizationsService } from '../services/organizations.service';
import { OrganizationsStore } from '../store/organizations.store';

@Component({
	selector: 'app-organizations',
	imports: [TableModule],
	templateUrl: './organizations.page.html',
	styleUrl: './organizations.page.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationsPage implements OnInit {
	private readonly _organizationsService = inject(OrganizationsService);
	private readonly _router = inject(Router);
	protected readonly store = inject(OrganizationsStore);

	public ngOnInit(): void {
		this._organizationsService.loadOrganizations().subscribe();
	}

	public onRowClick(id: string): void {
		void this._router.navigate(['/organizations', id]);
	}

	public onPageChange(event: { page: number; rows: number }): void {
		this._organizationsService.goToPage(event.page + 1).subscribe();
	}
}
