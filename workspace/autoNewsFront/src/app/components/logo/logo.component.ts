import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent implements OnInit {

  time: string | undefined;
  temperature: string | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.updateTimeAndTemperature();
    setInterval(() => {
      this.updateTimeAndTemperature();
    }, 60000); // Actualizar la hora y temperatura cada minuto
  }

  updateTimeAndTemperature() {
    // Obtener la hora actual
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Argentina/Buenos_Aires',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false, // Formato de 24 horas
    };

    this.time = date.toLocaleTimeString('es-AR', options);

    // Obtener la temperatura
    this.http.get('https://api.openweathermap.org/data/2.5/weather?q=Buenos+Aires,ar&appid=d281603ae0f5244376ddda2e3565a896')
      .subscribe((response: any) => {
        this.temperature = (response.main.temp - 273.15).toFixed(1) + '°C'; // Convertir de Kelvin a Celsius
      });
  }
}

