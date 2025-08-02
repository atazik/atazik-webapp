import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { customPreset } from './core/themes';

export const appConfig: ApplicationConfig = {
	providers: [
		// Firebase imports
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideAuth(() => getAuth()),
		provideFirestore(() => getFirestore()),

		// PrimeNg imports
		provideAnimationsAsync(),
		providePrimeNG({
			translation: {
				accept: 'Accepter',
				reject: 'Rejeter',
				passwordPrompt: 'Entrez votre mot de passe',
				cancel: 'Annuler',
				choose: 'Choisir',
				upload: 'Télécharger',
				emptyMessage: 'Aucun résultat trouvé',
				emptyFilterMessage: 'Aucun résultat trouvé',
				emptySelectionMessage: 'Aucune sélection',
				emptySearchMessage: 'Aucun résultat trouvé',
			},
			ripple: true,
			theme: {
				preset: customPreset,
				options: {
					darkModeSelector: true,
				},
			},
		}),

		// Angular imports
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
	],
};
