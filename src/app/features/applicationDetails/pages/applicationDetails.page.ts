import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SplitterModule } from 'primeng/splitter';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ApplicationDetailStore } from '../store/applicationDetails.store';
import { ApplicationDetailService } from '../services/applicationDetails.service';
import { ApplicationDocument } from '../apis/dtos/get-applicationDetails-response.dto';
import { ApplicationDetailApi } from '../apis/applicationDetails.api';

const MOBILE_BREAKPOINT = 1024;

@Component({
	selector: 'app-application-detail',
	imports: [
		ButtonModule,
		BadgeModule,
		TabsModule,
		SkeletonModule,
		ConfirmDialogModule,
		ToastModule,
		SplitterModule,
		ScrollPanelModule,
		DatePipe,
	],
	providers: [ConfirmationService, MessageService],
	templateUrl: './applicationDetails.page.html',
	styleUrl: './applicationDetails.page.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '(window:resize)': 'onResize()',},
})
export class ApplicationDetailPage implements OnInit, OnDestroy {
	private readonly _route = inject(ActivatedRoute);
	private readonly _service = inject(ApplicationDetailService);
	private readonly _confirmationService = inject(ConfirmationService);
	private readonly _messageService = inject(MessageService);
	private readonly _api = inject(ApplicationDetailApi);

	protected readonly store = inject(ApplicationDetailStore);

	public readonly activeDocTab = signal(0);
	public readonly activeDocUrl = signal<string | null>(null);

	// responsive splitter state
	public readonly isMobile = signal(this._checkIsMobile());

	public readonly docTabs = [
		{ label: 'Article of Association', key: 'articleOfAssociation' },
		{ label: 'Commercial Registration', key: 'commercialRegistration' },
		{ label: 'Registered Address Proof', key: 'registeredAddressProof' },
		{ label: 'Tax Card', key: 'taxCard' },
	];

	public onResize(): void {
        this.isMobile.set(ApplicationDetailPage._checkIsMobile());
    }

	private static _checkIsMobile(): boolean {
		return typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT;
	}

	private _checkIsMobile(): boolean {
		return ApplicationDetailPage._checkIsMobile();
	}

	public splitterLayout(): 'horizontal' | 'vertical' {
		return this.isMobile() ? 'vertical' : 'horizontal';
	}

	public splitterSizes(): number[] {
		return this.isMobile() ? [50, 50] : [40, 60];
	}

	public splitterHeight(): string {
		return this.isMobile() ? 'auto' : 'calc(100vh - 11rem)';
	}

	public ngOnInit(): void {
		const id = this._route.snapshot.paramMap.get('id')!;
		this._service.loadApplication(id).subscribe({
			error: () => this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load application' }),
		});
	}

	public ngOnDestroy(): void {
		this.store.reset();
	}

	public onTabChange(index: number): void {
		this.activeDocTab.set(index);
		const doc = this.getActiveDoc();
		if (!doc) return;

		this._api.getLegalPaperFile(doc?.id).subscribe({
			next: (file) => {
				const src = `data:${file.contentType};base64,${file.content}`;
				this.activeDocUrl.set(src);
			},
		});
	}

	public getActiveDoc(): ApplicationDocument | null {
		// console.log(this.store.application());
		
		const app = this.store.application();
		if (!app) return null;
		const keys = ['articleOfAssociation', 'commercialRegistration', 'registeredAddressProof', 'taxCard'] as const;
		return app[keys[this.activeDocTab()]];
	}

	public onApprove(): void {
		this._confirmationService.confirm({
			message: 'Are you sure you want to approve this application?',
			header: 'Approve Application',
			icon: 'pi pi-check-circle',
			acceptLabel: 'Approve',
			rejectLabel: 'Cancel',
			acceptButtonStyleClass: 'p-button-success',
			accept: () => {
				const id = this._route.snapshot.paramMap.get('id')!;
				this._service.approve(id).subscribe({
					error: (err) => {
						const apiError = err as { error?: { title?: string; status: number; detail?: string; } } ;
						console.error('Failed to approve application', apiError?.error?.detail);
						this._messageService.add({ severity: 'error', summary: 'Error', detail: apiError?.error?.detail ?? 'Failed to approve application' });
					}
				});
			},
		});
	}

	public onReject(): void {
		this._confirmationService.confirm({
			message: 'Are you sure you want to reject this application? This action cannot be undone.',
			header: 'Reject Application',
			icon: 'pi pi-times-circle',
			acceptLabel: 'Reject',
			rejectLabel: 'Cancel',
			acceptButtonStyleClass: 'p-button-danger',
			accept: () => {
				const id = this._route.snapshot.paramMap.get('id')!;
				this._service.deny(id).subscribe({
					error: (err) => {
						const apiError = err as { error?: { detail?: string; title?: string } } | undefined;
						console.log('Failed to reject application', apiError?.error?.detail);
						console.log('Failed to reject application', apiError?.error?.title);
						this._messageService.add({ severity: 'error', summary: 'Error', detail: apiError?.error?.detail ?? 'Failed to reject application' });
					}
				});
			},
		});
	}

	public getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'secondary' {
		switch (status?.toLowerCase()) {
			case 'accepted': return 'success';
			case 'pending': return 'warn';
			case 'rejected': return 'danger';
			default: return 'secondary';
		}
	}

	public getDocStatusLabel(status: number): string {
		switch (status) {
			case 1: return 'Submitted';
			case 2: return 'Approved';
			case 3: return 'Rejected';
			default: return 'Unknown';
		}
	}
}