import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface Room {
  name: string;
  price: number;
  image: string;
  id: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
})
export class AppComponent implements OnInit {
  currentYear = new Date().getFullYear();
  selectedRoomType: string | null = null;
  currentLang = 'es';

  checkinDate: string | null = null;
  checkoutDate: string | null = null;
  dateError = false;

  rooms: Room[] = [
    {
      id: 'FIRST_DATE',
      name: 'Habitación First Date',
      price: 95,
      image: 'images/first-date.png',
    },
    {
      name: 'Suite Match',
      id: 'MATCH',
      price: 130,
      image: 'images/match-suite.png',
    },
    {
      name: 'Suite Infinity',
      id: 'INFINITY',
      price: 190,
      image: 'images/infinity-suite.png',
    },
  ];

  bookingResult: string | null = null;
  contactResult: string | null = null;

  lang: 'es' | 'en' = 'es';

  constructor(private translate: TranslateService) {
    // Idiomas disponibles
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');

    // 1) preferencia guardada
    const saved = localStorage.getItem('lang') as 'es' | 'en' | null;

    // 2) o idioma del navegador (si empieza por 'en')
    const browser = (this.translate.getBrowserLang() || 'es').toLowerCase();
    const initial: 'es' | 'en' =
      saved ?? (browser.startsWith('en') ? 'en' : 'es');

    this.setLang(initial);
  }

  ngOnInit() {
    const saved = localStorage.getItem('lang') || 'es';
    this.currentLang = saved;
    this.translate.use(saved);
  }

  setLang(lang: 'es' | 'en') {
    this.lang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }

  onSubmitBooking(form: any) {
    if (form.valid) {
      const {
        checkin,
        checkout,
        roomType,
        guests,
        firstName,
        lastName,
        phone,
        email,
      } = form.value;

      this.bookingResult =
        `¡Reserva confirmada! ${firstName} ${lastName}, hemos recibido tu solicitud para "${roomType}" ` +
        `del ${checkin} al ${checkout} para ${guests} persona(s). ` +
        `Te contactaremos en ${phone} / ${email}.`;

      console.log('Datos de reserva:', form.value);
      form.resetForm();
      this.selectedRoomType = null;
    }
  }
  onSubmitContact(form: any) {
    if (form.invalid) {
      Object.values(form.controls).forEach((c: any) => c.markAsTouched());
      return;
    }
    if (form.valid) {
      this.contactResult =
        'Hemos recibido tu mensaje. Nos pondremos en contacto contigo lo antes posible. (Simulación)';
      console.log('Datos de contacto:', form.value);
      form.reset();
    }
  }

  selectRoom(roomName: string) {
    this.selectedRoomType = roomName;

    // Scroll suave a la sección de reservas
    setTimeout(() => {
      document
        .getElementById('reservas')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }

  openDatePicker(input: HTMLInputElement) {
    // Chrome/Edge/Safari modernos
    const anyInput = input as any;
    if (typeof anyInput.showPicker === 'function') {
      anyInput.showPicker();
    } else {
      input.focus();
    }
  }

  validateDates() {
    this.dateError = false;
    if (!this.checkinDate || !this.checkoutDate) return;

    const start = new Date(this.checkinDate);
    const end = new Date(this.checkoutDate);
    this.dateError = end < start;
  }

  changeLang(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
