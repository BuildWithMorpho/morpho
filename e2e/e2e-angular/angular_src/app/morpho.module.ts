// This is a hand-written module, to match the exact names/paths of the
// components we are using from Morpho output. Ideally this would be generated
// by Morpho, and/or Angular 14 "standalone components" would be generated.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { components } from './morpho-component-list';

@NgModule({
  declarations: [...components],
  imports: [CommonModule],
  exports: [...components],
})
export class MorphoModule {}
