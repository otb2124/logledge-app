import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // <--- Crucial for providing DOCUMENT context in Node
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);