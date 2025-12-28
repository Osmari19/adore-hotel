import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Room {
  name: string;
  description: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AppComponent {
  currentYear = new Date().getFullYear();
  selectedRoomType: string | null = null;

  checkinDate: string | null = null;
  checkoutDate: string | null = null;
  dateError = false;

  rooms: Room[] = [
    {
      name: 'Habitación First Date',
      description:
        'Perfecta para vuestro primer encuentro en persona: ambiente íntimo, iluminación cálida y detalles acogedores.',
      price: 95,
      image: 'images/first-date.png',
    },
    {
      name: 'Suite Match',
      description:
        'Más espacio, zona de estar y decoración pensada para que la conversación fluya sin prisas.',
      price: 130,
      image: 'images/match-suite.png',
    },
    {
      name: 'Suite Infinity',
      description:
        'Nuestra experiencia más exclusiva: amenities premium, check-out flexible y máxima privacidad.',
      price: 190,
      image: 'images/infinity-suite.png',
    },
  ];

  bookingResult: string | null = null;
  contactResult: string | null = null;

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
}
