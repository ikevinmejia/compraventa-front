import { Component } from '@angular/core';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Toolbar } from '../../../../shared/components/toolbar/toolbar';
import { StatsWidget } from '../../components/stats-widget/stats-widget';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
  imports: [Toolbar, Navbar, StatsWidget],
})
export class DashboardLayout {}
