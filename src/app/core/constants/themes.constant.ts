import { Preset } from '@primeuix/themes/types';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

export const customPreset: Preset = definePreset(Aura, {
	semantic: {
		primary: {
			50: '{amber.50}',
			100: '{amber.100}',
			200: '{amber.200}',
			300: '{amber.300}',
			400: '{amber.400}',
			500: '{amber.500}',
			600: '{amber.600}',
			700: '{amber.700}',
			800: '{amber.800}',
			900: '{amber.900}',
			950: '{amber.950}',
		},
	},
});
