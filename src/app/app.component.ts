import { Component } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'test';
    public time: string = '00:00:00';
    public start_btn: boolean = false;
    public wait_btn: boolean = false;
    public stop_btn$: Subject<any> = new Subject();
    public lastClick: number = 0;

    constructor() {

    }

    ngOnInit(): void {
    }

    timer(): void {
        const subscription = interval(1000).subscribe(() => {
            let ss = Number(this.time.split(':')[2]);
            let mm = Number(this.time.split(':')[1]);
            let hh = Number(this.time.split(':')[0]);
            ss++;
            if (ss >= 60) mm++, ss = 0;
            if (mm >= 60) hh++, mm = 0;
            this.time = this.getFullcount(hh) + ':' + this.getFullcount(mm) + ':' + this.getFullcount(ss);
        })
        this.stop_btn$.subscribe(elem => {
            if (elem) subscription.unsubscribe();
        })
    }

    getFullcount(count: number): string {
        return count < 10 ? '0' + count : String(count);
    }

    start_time(): void {
        this.timer();
        this.stop_btn$.next(false);
    }

    stop_time(): void {
        this.stop_btn$.next(true);
        this.time = '00:00:00';
        this.wait_btn = false;
    }

    wait_time(): void {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - this.lastClick;
        this.lastClick = currentTime;
        if (timeDiff < 300) {
            this.stop_btn$.next(this.wait_btn = !this.wait_btn);
            if (!this.wait_btn) this.timer();
        }
    }

    reset_time(): void {
        this.stop_time();
        this.timer();
    }

}
