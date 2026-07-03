import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, OnInit, } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthApi } from './core/auth/apis/auth.api';
import { AuthStore } from './core/auth/store/auth.store';
import { Splitter } from "primeng/splitter";
import { Breadcrumb } from "primeng/breadcrumb";
import { MenuItem } from 'primeng/api';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { ApplicationDetailStore } from './features/applicationDetails/store/applicationDetails.store';
import { OrganizationDetailStore } from './features/organizationDetails/store/organizationDetails.store';
import { NgOptimizedImage } from '@angular/common';



@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Splitter, Breadcrumb, RouterLink, RouterLinkActive, NgOptimizedImage],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
	private readonly _authStore = inject(AuthStore);
	private readonly _authApi = inject(AuthApi);
	private readonly _router = inject(Router)
	public readonly storeApplication = inject(ApplicationDetailStore);
	public readonly storeOrganization = inject(OrganizationDetailStore)
	private readonly _cdr = inject(ChangeDetectorRef);
	
	public readonly authStore = inject(AuthStore);
	protected currentUser = this.authStore?.currentUser;


	public navItems = [
		{ label: 'Applications', icon: 'description', route: '/applications' },
		{ label: 'Organizations', icon: 'business', route: '/organizations' },
	];

	public items: MenuItem[] | undefined;
	public home: MenuItem | undefined;

	private updateBreadcrumb() {
		const url = this._router.url;

		if (url.startsWith('/applications/') && this.storeApplication.application()) {
			this.items = [{ label: 'Applications', routerLink: '/applications',}, { label: this.storeApplication.application()?.name }];
			this._cdr.markForCheck();
		}
		else if (url.startsWith('/organizations/') && this.storeOrganization.organization()) {
			this.items = [{ label: 'Organizations', routerLink: '/organizations',}, { label: this.storeOrganization.organization()?.name }];
			this._cdr.markForCheck();
		}
		else if (url.startsWith('/applications')) {
			this.items = [{ label: 'Applications', routerLink: '/applications', }];

		}
		else if (url.startsWith('/organizations')) {
			this.items = [{ label: 'Organizations', routerLink: '/organizations', }];
		}
		else {
			this.items = [];
		}
	}

	public ngOnInit() {
		this.home = { icon: 'pi pi-home', routerLink: '/applications',}

		this.updateBreadcrumb();

		this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.updateBreadcrumb());
	}

	public constructor() {
		effect(() => {
			this.storeApplication.application();
			this.storeOrganization.organization();
			this.updateBreadcrumb();
		});
		effect(() => {
			const authenticated = this._authStore.isAuthenticated();
			const currentUser = this._authStore.currentUser();
			if (authenticated && !currentUser) {
				this._authApi.getProfile().subscribe({
					next: (user) => this._authStore.setCurrentUser(user),
				});
			}
		});
	}
}