import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	imports: [NgOptimizedImage, RouterLink],
	templateUrl: './landing.component.html',
})
export class LandingComponent {}
