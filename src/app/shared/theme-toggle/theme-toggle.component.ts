import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent {

  @Input() isDarkMode: boolean;

  toggleTheme() {
    
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');

    if (this.isDarkMode) {
      localStorage.setItem("theme", 'dark');
    } else {
      localStorage.setItem("theme", 'light');
    }
  }

  ngOnit() {
  }

}
