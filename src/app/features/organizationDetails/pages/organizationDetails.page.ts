import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { OrganizationDetailService } from '../services/organizationDetails.service';
import { OrganizationDetailStore } from '../store/organizationDetails.store';
import { SelectModule } from 'primeng/select';
import { SplitterModule } from 'primeng/splitter';
import { ScrollPanelModule } from 'primeng/scrollpanel';

interface ReasonOption {
	label: string;
	value: string;
}

const MOBILE_BREAKPOINT = 1024;

@Component({
	selector: 'app-organization-detail',
	imports: [
		ButtonModule,
		BadgeModule,
		SkeletonModule,
		DialogModule,
		TextareaModule,
		InputTextModule,
		ToastModule,
		FormsModule,
		DatePipe,
		SelectModule,
		SplitterModule,
		ScrollPanelModule,
	],
	providers: [MessageService],
	templateUrl: './organizationDetails.page.html',
	styleUrl: './organizationDetails.page.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '(window:resize)': 'onResize()' },
})
export class OrganizationDetailsPage implements OnInit, OnDestroy {
	private readonly _route = inject(ActivatedRoute);
	private readonly _service = inject(OrganizationDetailService);
	private readonly _messageService = inject(MessageService);

	protected readonly store = inject(OrganizationDetailStore);

	public readonly showSuspendDialog = signal(false);
	public readonly suspendReason = signal('');
	public readonly suspendNotes = signal('');
	public readonly isMobile = signal(OrganizationDetailsPage._checkIsMobile());

	public readonly reasons: ReasonOption[] = [
		{ label: 'Policy Violation', value: 'PolicyViolation' },
		{ label: 'Expired License', value: 'ExpiredLicense' },
		{ label: 'Other', value: 'Other' },
	];

	private static _checkIsMobile(): boolean {
		return typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT;
	}

	public onResize(): void {
		this.isMobile.set(OrganizationDetailsPage._checkIsMobile());
	}

	public splitterLayout(): 'horizontal' | 'vertical' {
		return this.isMobile() ? 'vertical' : 'horizontal';
	}

	public splitterSizes(): number[] {
		return this.isMobile() ? [50, 50] : [50, 50];
	}

	public splitterHeight(): string {
		return this.isMobile() ? 'auto' : 'calc(100vh - 11rem)';
	}

	public ngOnInit(): void {
		const id = this._route.snapshot.paramMap.get('id')!;
		this._service.loadOrganization(id).subscribe({
			error: () => this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load organization' }),
		});
	}

	public ngOnDestroy(): void {
		this.store.reset();
	}

	public onSuspendConfirm(): void {
		const id = this._route.snapshot.paramMap.get('id')!;
		this._service.suspend(id, {
			reason: this.suspendReason(),
			notes: this.suspendNotes(),
		}).subscribe({
			next: () => {
				this.showSuspendDialog.set(false);
				this._messageService.add({ severity: 'success', summary: 'Suspended', detail: 'Organization has been suspended' });
			},
			error: () => this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to suspend organization' }),
		});
	}
}