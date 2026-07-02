import { effect, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiModeService {
	private static readonly _storageKey = 'viora-dark-mode';

	public readonly darkMode = signal(this._loadDarkMode());

	private _initialized = false;

	public constructor() {
		this._applyDarkMode(this.darkMode());

		effect(() => {
			const isDark = this.darkMode();
			if (!this._initialized) {
				this._initialized = true;
				return;
			}
			this._handleDarkModeTransition(isDark);
			localStorage.setItem(UiModeService._storageKey, JSON.stringify(isDark));
		});
	}

	public toggleDarkMode(): void {
		this.darkMode.update((v) => !v);
	}

	public isDarkMode() {
		return this.darkMode();
	}

	private _handleDarkModeTransition(isDark: boolean): void {
		if (document.startViewTransition) {
			const transition = document.startViewTransition(() => {
				this._applyDarkMode(isDark);
			});
			transition.ready.catch(() => {
				void 0;
				/* empty */
			});
		} else {
			this._applyDarkMode(isDark);
		}
	}

	private _applyDarkMode(isDark: boolean): void {
		document.documentElement.classList.toggle('p-dark', isDark);
	}

	private _loadDarkMode(): boolean {
		const stored = localStorage.getItem(UiModeService._storageKey);
		if (stored !== null) {
			return JSON.parse(stored) === true;
		}
		const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		localStorage.setItem(UiModeService._storageKey, JSON.stringify(isDark));
		return isDark;
	}
}