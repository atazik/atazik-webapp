import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { FirebaseApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { customPreset } from './core/constants/themes.constant';
import { provideAnimations } from '@angular/platform-browser/animations';
import { getFunctions, provideFunctions } from '@angular/fire/functions';

let app: FirebaseApp | undefined;
const region = 'europe-west9'; // Paris

export const appConfig: ApplicationConfig = {
	providers: [
		// Angular imports
		provideBrowserGlobalErrorListeners(),
		provideAnimations(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),

		// Firebase imports
		provideFirebaseApp(() => {
			if (!app) {
				app = initializeApp(environment.firebase);
			}
			return app;
		}),
		provideAuth(() => getAuth()),
		provideFirestore(() => getFirestore()),
		provideFunctions(() => getFunctions(app, region)),

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
	],
};
