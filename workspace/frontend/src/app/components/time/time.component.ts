import { Component, OnInit } from '@angular/core';

import axios from 'axios';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  public currentDateTime: string = '';
  public currentWeather: string = '';

  ngOnInit() {
    // Actualiza la hora y el clima cada segundo
    setInterval(() => {
      this.updateTimeAndWeather();
    }, 1000);

    // Llama a la función para establecer la hora y el clima iniciales
    this.updateTimeAndWeather();
  }

  async updateTimeAndWeather() {
    // Obtén la hora actual en la zona horaria de Buenos Aires
    const buenosAiresTime = DateTime.now().setZone('America/Argentina/Buenos_Aires');

    // Formatea la hora en el formato deseado
    this.currentDateTime = buenosAiresTime.toFormat('HH:mm:ss');

    // Realiza una solicitud a la API de OpenWeatherMap para obtener datos de clima
    const apiKey = '2a84209535debce47af53e740a442258';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=Buenos%20Aires&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(weatherUrl);
      const temperature = response.data.main.temp;
      this.currentWeather = `${temperature}°C`;
    } catch (error) {
      console.error('Error al obtener los datos del clima:', error);
      this.currentWeather = 'No disponible';
    }
  }
}
