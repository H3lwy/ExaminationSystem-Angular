import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable()
export class ExamTimerService {
  private timerSubject = new BehaviorSubject<number>(0);
  timer$ = this.timerSubject.asObservable();
  private intervalId?: number;

  startTimer(initialTime: number): void {
    this.timerSubject.next(initialTime);
    this.intervalId = window.setInterval(() => {
      const currentTime = this.timerSubject.value;
      if (currentTime > 0) {
        this.timerSubject.next(currentTime - 1);
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getFormattedTime(): Observable<string> {
    return this.timer$.pipe(
      map((seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m
          .toString()
          .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      })
    );
  }
}
