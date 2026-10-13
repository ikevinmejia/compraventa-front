import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Toolbar } from '../../../../shared/components/toolbar/toolbar';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
  imports: [Toolbar, Navbar, RouterModule],
})
export class DashboardLayout {}
